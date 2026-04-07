
-- ==========================================
-- SITES TABLE
-- ==========================================
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Nashik',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_budget NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sites" ON public.sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sites" ON public.sites FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sites" ON public.sites FOR DELETE USING (true);

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.sites (id, name, short_name, location, start_date, total_budget) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Samarth Residency — Tower A', 'Tower A', 'Nashik', '2026-01-15', 4500000),
  ('00000000-0000-0000-0000-000000000002', 'Samarth Residency — Tower B', 'Tower B', 'Nashik', '2026-02-01', 3800000),
  ('00000000-0000-0000-0000-000000000003', 'Samarth Commerce Park', 'Commerce Park', 'Nashik', '2025-11-10', 2800000);

-- ==========================================
-- WORKERS TABLE
-- ==========================================
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  wage_type TEXT NOT NULL DEFAULT 'daily' CHECK (wage_type IN ('daily', 'monthly')),
  wage_rate NUMERIC NOT NULL DEFAULT 0,
  days_present INTEGER NOT NULL DEFAULT 0,
  amount_due NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending')),
  phone TEXT,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view workers" ON public.workers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert workers" ON public.workers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update workers" ON public.workers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete workers" ON public.workers FOR DELETE USING (true);

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON public.workers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.workers (name, role, wage_type, wage_rate, days_present, amount_due, status, phone, site_id) VALUES
  ('Ramesh Patil', 'Mason', 'daily', 650, 6, 3900, 'Pending', '9876543210', '00000000-0000-0000-0000-000000000001'),
  ('Suresh Jadhav', 'Helper', 'daily', 500, 5, 2500, 'Pending', '9876543211', '00000000-0000-0000-0000-000000000001'),
  ('Ganesh Shinde', 'Carpenter', 'daily', 700, 6, 4200, 'Paid', '9876543212', '00000000-0000-0000-0000-000000000002'),
  ('Dinesh Pawar', 'Plumber', 'daily', 750, 4, 3000, 'Pending', '9876543213', '00000000-0000-0000-0000-000000000002'),
  ('Santosh Gaikwad', 'Electrician', 'daily', 800, 6, 4800, 'Paid', '9876543214', '00000000-0000-0000-0000-000000000003'),
  ('Manoj Deshmukh', 'Mason', 'daily', 650, 5, 3250, 'Pending', '9876543215', '00000000-0000-0000-0000-000000000001'),
  ('Rajesh More', 'Helper', 'daily', 500, 6, 3000, 'Pending', '9876543216', '00000000-0000-0000-0000-000000000002'),
  ('Anil Gaikwad', 'Painter', 'daily', 600, 5, 3000, 'Paid', '9876543217', '00000000-0000-0000-0000-000000000003'),
  ('Prakash Wagh', 'Mason', 'daily', 650, 6, 3900, 'Pending', '9876543218', '00000000-0000-0000-0000-000000000001'),
  ('Vijay Bhosale', 'Helper', 'daily', 500, 4, 2000, 'Pending', '9876543219', '00000000-0000-0000-0000-000000000001'),
  ('Sachin Kale', 'Carpenter', 'daily', 700, 5, 3500, 'Paid', '9876543220', '00000000-0000-0000-0000-000000000002'),
  ('Nitin Pawar', 'Welder', 'daily', 750, 6, 4500, 'Pending', '9876543221', '00000000-0000-0000-0000-000000000003'),
  ('Rahul Deshmukh', 'Site Engineer', 'monthly', 35000, 0, 35000, 'Paid', NULL, '00000000-0000-0000-0000-000000000001'),
  ('Vijay Kulkarni', 'Supervisor', 'monthly', 28000, 0, 28000, 'Paid', NULL, '00000000-0000-0000-0000-000000000002'),
  ('Priya Sharma', 'Accountant', 'monthly', 25000, 0, 25000, 'Paid', NULL, '00000000-0000-0000-0000-000000000001'),
  ('Amol Joshi', 'Site Engineer', 'monthly', 35000, 0, 35000, 'Pending', NULL, '00000000-0000-0000-0000-000000000003'),
  ('Sneha Patil', 'Store Keeper', 'monthly', 18000, 0, 18000, 'Paid', NULL, '00000000-0000-0000-0000-000000000002'),
  ('Kiran Mahale', 'Supervisor', 'monthly', 28000, 0, 28000, 'Pending', NULL, '00000000-0000-0000-0000-000000000001');

-- ==========================================
-- SUPPLIERS TABLE
-- ==========================================
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  material TEXT NOT NULL,
  contact TEXT NOT NULL,
  location TEXT DEFAULT 'Nashik',
  rating NUMERIC NOT NULL DEFAULT 0,
  total_business NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert suppliers" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update suppliers" ON public.suppliers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete suppliers" ON public.suppliers FOR DELETE USING (true);

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.suppliers (name, material, contact, location, rating, total_business) VALUES
  ('Nashik Cement Agency', 'Cement', '9823456710', 'Nashik', 4.5, 342000),
  ('Shree Steel Traders', 'TMT Steel', '9823456720', 'Nashik', 4.2, 578000),
  ('Patil Brick Suppliers', 'Bricks', '9823456730', 'Nashik', 4.0, 120000),
  ('Godavari Sand Suppliers', 'River Sand', '9823456740', 'Nashik', 3.8, 234000),
  ('Nashik Stone Crushers', 'Aggregates', '9823456750', 'Nashik', 4.3, 156000),
  ('Nashik Plywood Mart', 'Plywood', '9823456760', 'Nashik', 4.1, 87000),
  ('Kulkarni Electricals', 'Electrical', '9823456770', 'Nashik', 4.6, 65000),
  ('Nashik Pipe Center', 'Plumbing', '9823456780', 'Nashik', 3.9, 48000);

-- ==========================================
-- INVOICES TABLE
-- ==========================================
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Anyone can insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update invoices" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete invoices" ON public.invoices FOR DELETE USING (true);

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.invoices (supplier, description, amount, site_id, status, date) VALUES
  ('Nashik Cement Agency', '450 bags OPC Cement', 171000, '00000000-0000-0000-0000-000000000001', 'Paid', '2026-03-28'),
  ('Shree Steel Traders', '2200 kg TMT 12mm', 127600, '00000000-0000-0000-0000-000000000001', 'Pending', '2026-03-27'),
  ('Patil Brick Suppliers', '15000 Red Bricks', 120000, '00000000-0000-0000-0000-000000000002', 'Paid', '2026-03-25'),
  ('Godavari Sand Suppliers', '8 brass River Sand', 14400, '00000000-0000-0000-0000-000000000001', 'Pending', '2026-03-24'),
  ('Nashik Stone Crushers', '12 tonnes Aggregates', 14400, '00000000-0000-0000-0000-000000000003', 'Paid', '2026-03-22'),
  ('Nashik Cement Agency', '45 bags PPC Cement', 16200, '00000000-0000-0000-0000-000000000002', 'Pending', '2026-03-20'),
  ('Kulkarni Electricals', '500m Wire 2.5mm', 11000, '00000000-0000-0000-0000-000000000002', 'Paid', '2026-03-18'),
  ('Nashik Plywood Mart', '25 sheets 18mm Plywood', 36250, '00000000-0000-0000-0000-000000000001', 'Pending', '2026-03-15'),
  ('Shree Steel Traders', '800 kg TMT 8mm', 49600, '00000000-0000-0000-0000-000000000003', 'Paid', '2026-03-12'),
  ('Nashik Pipe Center', '15 PVC Pipes 4 inch', 5700, '00000000-0000-0000-0000-000000000003', 'Pending', '2026-03-10');

-- ==========================================
-- ATTENDANCE TABLE
-- ==========================================
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  present BOOLEAN NOT NULL DEFAULT false,
  check_in_time TEXT,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(worker_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Anyone can insert attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update attendance" ON public.attendance FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete attendance" ON public.attendance FOR DELETE USING (true);

-- ==========================================
-- ACTIVITIES TABLE
-- ==========================================
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'alert' CHECK (icon IN ('attendance', 'delivery', 'payment', 'alert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activities" ON public.activities FOR INSERT WITH CHECK (true);

INSERT INTO public.activities (text, icon, created_at) VALUES
  ('Ramesh Patil marked present at Tower A', 'attendance', now() - interval '10 minutes'),
  ('450 bags OPC Cement delivered to Tower A', 'delivery', now() - interval '2 hours'),
  ('₹1,20,000 paid to Patil Brick Suppliers', 'payment', now() - interval '5 hours'),
  ('Ganesh Shinde marked paid — ₹4,200', 'payment', now() - interval '1 day'),
  ('PPC Cement stock critical at Tower B', 'alert', now() - interval '1 day'),
  ('New delivery challan uploaded — River Sand', 'delivery', now() - interval '2 days');

-- Also update materials table to use site_id FK
-- Add site_id column to materials (keeping old site text for now)
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL;

-- Map existing site text values to site_id
UPDATE public.materials SET site_id = '00000000-0000-0000-0000-000000000001' WHERE site = 'site-a';
UPDATE public.materials SET site_id = '00000000-0000-0000-0000-000000000002' WHERE site = 'site-b';
UPDATE public.materials SET site_id = '00000000-0000-0000-0000-000000000003' WHERE site = 'site-c';

-- Also update deliveries table to use site_id FK
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL;
UPDATE public.deliveries SET site_id = 
  CASE site 
    WHEN 'site-a' THEN '00000000-0000-0000-0000-000000000001'::uuid
    WHEN 'site-b' THEN '00000000-0000-0000-0000-000000000002'::uuid
    WHEN 'site-c' THEN '00000000-0000-0000-0000-000000000003'::uuid
  END
WHERE site IS NOT NULL;
