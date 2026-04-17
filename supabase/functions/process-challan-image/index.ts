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

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return respond(false, { error: "AI gateway not configured" }, 500);
    }

    const prompt = `This is a construction material delivery challan. Extract: Supplier Name, Material Names with Quantity and Unit, Rate per unit, Total Amount, Date. Return ONLY valid JSON (no markdown, no code fences) in this exact shape: {"supplierName": string|null, "materials": [{"materialName": string, "quantity": number, "unit": string, "rate": number|null}], "totalAmount": number|null, "date": string|null}. If any field is not visible return null for that field.`;

    const dataUrl = `data:${mime_type || "image/jpeg"};base64,${image_base64}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, errText);
      if (aiRes.status === 429) {
        return respond(false, { error: "Rate limit reached. Please try again in a moment." }, 429);
      }
      if (aiRes.status === 402) {
        return respond(false, { error: "AI credits exhausted. Please add credits to continue." }, 402);
      }
      return respond(false, { error: "AI processing failed" });
    }

    const aiData = await aiRes.json();
    const rawText: string = aiData?.choices?.[0]?.message?.content || "";
    console.log("AI raw response:", rawText.slice(0, 500));

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", rawText);
      return respond(false, { error: "Could not parse challan data" });
    }

    let extracted;
    try {
      extracted = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON parse error:", e, jsonMatch[0]);
      return respond(false, { error: "Invalid JSON from AI" });
    }

    return respond(true, { data: extracted });
  } catch (error) {
    console.error("Error:", error);
    return respond(false, { error: "Failed to process image" });
  }
});
