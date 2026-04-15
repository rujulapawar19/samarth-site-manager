
-- Clear existing materials
DELETE FROM delivery_items;
DELETE FROM materials;

-- Tower A (Planning) - 12 materials
INSERT INTO materials (name, supplier, quantity, unit, rate, status, site_id, site) VALUES
('Architectural Design Documents', 'ArchiPlan Studio', 15, 'pieces', 5000, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Structural Drawings Set', 'ArchiPlan Studio', 8, 'pieces', 8000, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Survey Equipment Rental', 'GeoTech Surveys', 4, 'pieces', 12000, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Marking Chalk Powder', 'BuildMart', 25, 'bags', 150, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Measuring Tapes 50m', 'BuildMart', 10, 'pieces', 450, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Site Plan Prints A1', 'PrintCo', 50, 'pieces', 80, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Boundary Marking Pegs', 'BuildMart', 200, 'pieces', 25, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Safety Barricade Tape', 'SafetyFirst', 30, 'pieces', 120, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Level Instrument', 'GeoTech Surveys', 3, 'pieces', 15000, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Soil Testing Kit', 'LabEquip India', 5, 'pieces', 3500, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Plumb Bob Set', 'BuildMart', 8, 'pieces', 350, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A'),
('Tracing Paper Roll', 'PrintCo', 12, 'pieces', 250, 'Sufficient', '00000000-0000-0000-0000-000000000001', 'Tower A');

-- Tower B (Foundation) - 14 materials
INSERT INTO materials (name, supplier, quantity, unit, rate, status, site_id, site) VALUES
('OPC Cement 53 Grade', 'UltraTech', 250, 'bags', 380, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('River Sand', 'Nashik Sand Traders', 40, 'brass', 4500, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Crushed Stone 20mm', 'Nashik Aggregates', 35, 'brass', 3800, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('TMT Steel Bars 12mm', 'Tata Steel', 8, 'tonnes', 55000, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('TMT Steel Bars 16mm', 'Tata Steel', 5, 'tonnes', 56000, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Gravel 40mm', 'Nashik Aggregates', 20, 'brass', 3200, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Water Tanker Supply', 'AquaFlow', 500, 'pieces', 800, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Plywood Formwork 19mm', 'Wood Traders', 80, 'sheets', 1200, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('MS Binding Wire', 'Nashik Iron', 200, 'kg', 75, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Waterproofing Chemical', 'Dr. Fixit', 60, 'pieces', 950, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('PCC Concrete Mix', 'RMC Plant', 30, 'pieces', 5500, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Shuttering Oil', 'BuildMart', 40, 'pieces', 180, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Nails 4 inch', 'Nashik Iron', 50, 'kg', 90, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B'),
('Earth Filling Material', 'Nashik Sand Traders', 25, 'brass', 2800, 'Sufficient', '00000000-0000-0000-0000-000000000002', 'Tower B');

-- Commerce Park (Structural) - 14 materials
INSERT INTO materials (name, supplier, quantity, unit, rate, status, site_id, site) VALUES
('Ready Mix Concrete M25', 'RMC Plant', 120, 'pieces', 5800, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Red Clay Bricks', 'Nashik Bricks', 15000, 'pieces', 8, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('AAC Blocks 6 inch', 'Renacon', 5000, 'pieces', 55, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('TMT Steel Bars 20mm', 'Tata Steel', 12, 'tonnes', 58000, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('OPC Cement 43 Grade', 'ACC Cement', 400, 'bags', 350, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Shuttering Plywood', 'Wood Traders', 150, 'sheets', 1100, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('MS Binding Wire', 'Nashik Iron', 350, 'kg', 75, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Steel Column Plates', 'Nashik Iron', 40, 'pieces', 2200, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Scaffolding Pipes', 'BuildMart', 200, 'pieces', 450, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Concrete Spacers', 'BuildMart', 500, 'pieces', 12, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('River Sand', 'Nashik Sand Traders', 30, 'brass', 4500, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Crushed Stone 12mm', 'Nashik Aggregates', 25, 'brass', 3600, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Prop Support Jacks', 'BuildMart', 100, 'pieces', 350, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park'),
('Welding Electrodes', 'Nashik Iron', 80, 'kg', 180, 'Sufficient', '00000000-0000-0000-0000-000000000003', 'Commerce Park');

-- Tower C (Finishing) - 14 materials
INSERT INTO materials (name, supplier, quantity, unit, rate, status, site_id, site) VALUES
('Asian Paints Apex White', 'Asian Paints Dealer', 80, 'pieces', 950, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Wall Primer 20L', 'Asian Paints Dealer', 30, 'pieces', 650, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Vitrified Floor Tiles 2x2', 'Kajaria Tiles', 800, 'pieces', 45, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Bathroom Wall Tiles', 'Somany Ceramics', 600, 'pieces', 35, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('White Cement', 'Birla White', 100, 'bags', 420, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Electrical Wire 2.5mm', 'Havells', 500, 'meters', 18, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Electrical Wire 4mm', 'Havells', 300, 'meters', 28, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Modular Switches Board', 'Legrand', 60, 'pieces', 350, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('PVC Pipes 4 inch', 'Astral Pipes', 150, 'pieces', 280, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('CPVC Pipes 1 inch', 'Astral Pipes', 200, 'pieces', 180, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('CP Bathroom Fixtures', 'Jaquar', 25, 'pieces', 2800, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Putty Wall Care', 'Birla White', 50, 'bags', 750, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('Tile Adhesive', 'MYK Laticrete', 40, 'bags', 550, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C'),
('MCB Distribution Box', 'Havells', 15, 'pieces', 1800, 'Sufficient', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Tower C');
