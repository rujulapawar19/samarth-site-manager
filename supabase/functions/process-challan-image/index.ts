const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function respond(ok: boolean, payload: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify({ ok, ...payload }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image_base64, mime_type } = await req.json();
    if (!image_base64) {
      return respond(false, { error: "No image provided" }, 400);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return respond(false, { error: "Gemini API key not configured" }, 500);
    }

    const prompt = `You are an OCR assistant for construction delivery challans (receipts) in India.
Extract the following fields from this challan image. Return ONLY valid JSON, no markdown.

{
  "supplier_name": "supplier/vendor name",
  "material_name": "main material delivered e.g. Cement, Sand, Steel",
  "quantity": "numeric quantity as a number",
  "unit": "unit like bags, tonnes, pieces, kg, brass, meters, sheets",
  "vehicle_number": "vehicle/truck number if visible",
  "date": "date in YYYY-MM-DD format",
  "total_amount": "total amount as a number, 0 if not found"
}

If a field is not found, use empty string for text fields and 0 for numbers.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mime_type || "image/jpeg",
                    data: image_base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Gemini error:", err);
      return respond(false, { error: "AI processing failed" });
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return respond(false, { error: "Could not parse challan data" });
    }

    const extracted = JSON.parse(jsonMatch[0]);
    return respond(true, { data: extracted });
  } catch (error) {
    console.error("Error:", error);
    return respond(false, { error: "Failed to process image" });
  }
});
