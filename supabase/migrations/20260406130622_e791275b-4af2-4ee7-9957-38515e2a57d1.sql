
-- Create materials inventory table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  supplier TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pieces',
  rate NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Sufficient',
  site TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read/write materials (construction team app)
CREATE POLICY "Anyone can view materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Anyone can insert materials" ON public.materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update materials" ON public.materials FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete materials" ON public.materials FOR DELETE USING (true);

-- Create deliveries table to log delivery entries
CREATE TABLE public.deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier TEXT,
  site TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view deliveries" ON public.deliveries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert deliveries" ON public.deliveries FOR INSERT WITH CHECK (true);

-- Delivery items (multi-material per delivery)
CREATE TABLE public.delivery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES public.materials(id) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view delivery_items" ON public.delivery_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert delivery_items" ON public.delivery_items FOR INSERT WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON public.materials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial materials data
INSERT INTO public.materials (name, supplier, quantity, unit, rate, status, site) VALUES
  ('OPC Cement 53 Grade', 'Nashik Cement Agency', 450, 'bags', 380, 'Sufficient', 'site-a'),
  ('TMT Steel Bars 12mm', 'Godavari Steel Traders', 8, 'tonnes', 52000, 'Low', 'site-a'),
  ('River Sand', 'Sinnar Sand Suppliers', 12, 'brass', 3200, 'Sufficient', 'site-b'),
  ('Crushed Stone 20mm', 'Nashik Aggregates', 15, 'brass', 2800, 'Sufficient', 'site-a'),
  ('Red Clay Bricks', 'Igatpuri Brick Works', 8000, 'pieces', 8, 'Sufficient', 'site-b'),
  ('AAC Blocks 6"', 'Nashik Block Industries', 2500, 'pieces', 55, 'Sufficient', 'site-c'),
  ('Plywood 19mm', 'Nashik Timber Mart', 45, 'sheets', 1850, 'Sufficient', 'site-a'),
  ('Electrical Wire 2.5mm', 'Panchavati Electricals', 800, 'meters', 18, 'Sufficient', 'site-b'),
  ('PVC Pipes 4"', 'Nashik Pipe Centre', 120, 'pieces', 320, 'Sufficient', 'site-c'),
  ('White Cement', 'Nashik Cement Agency', 25, 'bags', 650, 'Critical', 'site-a'),
  ('Waterproofing Chemical', 'Dr. Fixit Nashik Dealer', 200, 'kg', 120, 'Low', 'site-b'),
  ('MS Binding Wire', 'Godavari Steel Traders', 150, 'kg', 72, 'Sufficient', 'site-a');
