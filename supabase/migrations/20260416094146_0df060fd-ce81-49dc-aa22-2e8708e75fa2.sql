
-- 1. Add daily workers to Tower A (Planning phase — needs survey/site helpers)
INSERT INTO workers (name, role, wage_type, wage_rate, site_id, days_present, amount_due, status) VALUES
('Ravi Kamble', 'Helper', 'daily', 450, '00000000-0000-0000-0000-000000000001', 5, 2250, 'Pending'),
('Sanjay Gade', 'Helper', 'daily', 450, '00000000-0000-0000-0000-000000000001', 6, 2700, 'Pending'),
('Vikash Yadav', 'Helper', 'daily', 400, '00000000-0000-0000-0000-000000000001', 4, 1600, 'Pending');

-- 2. Fix monthly staff wage rates to realistic monthly salaries
UPDATE workers SET wage_rate = 55000, amount_due = 55000 WHERE role = 'Project Manager' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 45000, amount_due = 45000 WHERE role = 'Architect' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 42000, amount_due = 42000 WHERE role = 'Civil Engineer' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 40000, amount_due = 40000 WHERE role = 'Structural Engineer' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 35000, amount_due = 35000 WHERE role = 'Site Engineer' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 30000, amount_due = 30000 WHERE role = 'Supervisor' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 28000, amount_due = 28000 WHERE role = 'Safety Officer' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 32000, amount_due = 32000 WHERE role = 'Quality Inspector' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 25000, amount_due = 25000 WHERE role = 'Planning Coordinator' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 28000, amount_due = 28000 WHERE role = 'Finishing Supervisor' AND wage_type = 'monthly';
UPDATE workers SET wage_rate = 30000, amount_due = 30000 WHERE role = 'Surveyor' AND wage_type = 'monthly';

-- 3. Update material statuses — create realistic Low and Critical items

-- Tower A: Architectural docs low (already), add more
UPDATE materials SET status = 'Critical', quantity = 2 WHERE id = '50e773f3-48ff-4270-b753-20f7d893f354'; -- Arch Design Docs
UPDATE materials SET status = 'Low', quantity = 1 WHERE id = '1aa0bdec-abe8-46f1-841a-32703b891d24'; -- Soil Testing Kit
UPDATE materials SET status = 'Low', quantity = 2 WHERE id = 'bba83727-42fc-4701-93d0-1d44d9eb6bf1'; -- Measuring Tapes

-- Tower B: Cement and steel running low
UPDATE materials SET status = 'Critical', quantity = 18 WHERE id = '562d5e41-8fa8-439c-ae51-3cd0f915838e'; -- OPC Cement 53 Grade
UPDATE materials SET status = 'Low', quantity = 2 WHERE id = 'e5b1d5c8-e0ec-4ebb-a88b-5a59f25a2b30'; -- TMT Steel 12mm
UPDATE materials SET status = 'Low', quantity = 30 WHERE id = '9c950202-a297-4b15-84bb-64d61ccf5a71'; -- MS Binding Wire

-- Commerce Park: Steel running low
UPDATE materials SET status = 'Low', quantity = 3 WHERE id = '782ec2c8-12e7-4da5-8759-cccf0da01956'; -- TMT Steel Bars 20mm
UPDATE materials SET status = 'Critical', quantity = 15 WHERE id = '55ddc43f-1477-47c0-bb65-414ca1ed1ed6'; -- MS Binding Wire

-- Tower C: Tiles and wiring low
UPDATE materials SET status = 'Low', quantity = 50 WHERE id IN (SELECT id FROM materials WHERE name = 'Electrical Wire 2.5mm' AND site_id = 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5');
UPDATE materials SET status = 'Critical', quantity = 80 WHERE id IN (SELECT id FROM materials WHERE name = 'Vitrified Floor Tiles 2x2' AND site_id = 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5');
UPDATE materials SET status = 'Low', quantity = 5 WHERE id IN (SELECT id FROM materials WHERE name = 'Putty Wall Care' AND site_id = 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5');

-- 4. Delete old attendance and add realistic attendance for this week
DELETE FROM attendance;

-- Today (2026-04-16) — mark 20 workers present
INSERT INTO attendance (worker_id, date, present, check_in_time, site_id) VALUES
-- Tower B daily workers (7 present)
('7ae9fc38-0f59-4ed7-a4ad-ce3bdf129cd7', '2026-04-16', true, '08:15 AM', '00000000-0000-0000-0000-000000000002'),
('21b509a3-4430-4864-b358-84a3d2131d42', '2026-04-16', true, '08:05 AM', '00000000-0000-0000-0000-000000000002'),
('cfa91b44-95fd-47cb-9a99-5a235ae42e3a', '2026-04-16', true, '08:10 AM', '00000000-0000-0000-0000-000000000002'),
('c67800ca-e2b7-497a-929f-ac6ab93e5fa8', '2026-04-16', true, '08:20 AM', '00000000-0000-0000-0000-000000000002'),
('249162a7-af9c-45e6-b7f0-a6e103c9f0e8', '2026-04-16', true, '08:30 AM', '00000000-0000-0000-0000-000000000002'),
('8e39fb0f-e482-40dc-95f5-e06f9cd3021e', '2026-04-16', true, '08:25 AM', '00000000-0000-0000-0000-000000000002'),
('f190bbf5-12da-4250-9894-d8337e95f98d', '2026-04-16', true, '08:12 AM', '00000000-0000-0000-0000-000000000002'),
-- Commerce Park daily workers (6 present)
('fd86c679-cdc0-42b9-af95-04bb6b7f5412', '2026-04-16', true, '08:00 AM', '00000000-0000-0000-0000-000000000003'),
('27da12d5-bdd5-4a84-98c7-bbc78c0616c4', '2026-04-16', true, '08:08 AM', '00000000-0000-0000-0000-000000000003'),
('41ebd68e-4764-450c-adb3-ebc4d499a879', '2026-04-16', true, '08:15 AM', '00000000-0000-0000-0000-000000000003'),
('13ba158e-3431-4e17-b375-3371ea21297d', '2026-04-16', true, '08:22 AM', '00000000-0000-0000-0000-000000000003'),
('2dee3f9b-d9a2-47e5-86e5-65dd8f0baecc', '2026-04-16', true, '08:18 AM', '00000000-0000-0000-0000-000000000003'),
('b4e12c91-19f6-45dd-90ef-9eaf6ca030bc', '2026-04-16', true, '08:35 AM', '00000000-0000-0000-0000-000000000003'),
-- Tower C daily workers (7 present)
('120dae69-c307-4544-9ff0-6f01af2e8144', '2026-04-16', true, '07:55 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('0bcd656d-6f4e-437c-a270-818d35449516', '2026-04-16', true, '08:00 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('68b308f4-b7fe-43dd-b902-a2505698ac09', '2026-04-16', true, '08:10 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('086975a1-8efc-4cc4-a4f6-6b139307149a', '2026-04-16', true, '08:20 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('4e13b2b9-149d-4a6d-929d-00ec6c23fadc', '2026-04-16', true, '08:25 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('84b16352-2fe4-419b-ac49-a0300a5f6d9a', '2026-04-16', true, '08:30 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('8f5e82a2-fd91-4dbc-81d8-d207b79fd5c1', '2026-04-16', true, '08:32 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5');

-- Yesterday (2026-04-15) — 18 workers
INSERT INTO attendance (worker_id, date, present, check_in_time, site_id) VALUES
('7ae9fc38-0f59-4ed7-a4ad-ce3bdf129cd7', '2026-04-15', true, '08:10 AM', '00000000-0000-0000-0000-000000000002'),
('21b509a3-4430-4864-b358-84a3d2131d42', '2026-04-15', true, '08:00 AM', '00000000-0000-0000-0000-000000000002'),
('cfa91b44-95fd-47cb-9a99-5a235ae42e3a', '2026-04-15', true, '08:15 AM', '00000000-0000-0000-0000-000000000002'),
('c67800ca-e2b7-497a-929f-ac6ab93e5fa8', '2026-04-15', true, '08:20 AM', '00000000-0000-0000-0000-000000000002'),
('249162a7-af9c-45e6-b7f0-a6e103c9f0e8', '2026-04-15', true, '08:35 AM', '00000000-0000-0000-0000-000000000002'),
('8e39fb0f-e482-40dc-95f5-e06f9cd3021e', '2026-04-15', true, '08:25 AM', '00000000-0000-0000-0000-000000000002'),
('fd86c679-cdc0-42b9-af95-04bb6b7f5412', '2026-04-15', true, '08:05 AM', '00000000-0000-0000-0000-000000000003'),
('27da12d5-bdd5-4a84-98c7-bbc78c0616c4', '2026-04-15', true, '08:12 AM', '00000000-0000-0000-0000-000000000003'),
('41ebd68e-4764-450c-adb3-ebc4d499a879', '2026-04-15', true, '08:18 AM', '00000000-0000-0000-0000-000000000003'),
('13ba158e-3431-4e17-b375-3371ea21297d', '2026-04-15', true, '08:22 AM', '00000000-0000-0000-0000-000000000003'),
('2dee3f9b-d9a2-47e5-86e5-65dd8f0baecc', '2026-04-15', true, '08:28 AM', '00000000-0000-0000-0000-000000000003'),
('120dae69-c307-4544-9ff0-6f01af2e8144', '2026-04-15', true, '07:50 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('0bcd656d-6f4e-437c-a270-818d35449516', '2026-04-15', true, '08:00 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('68b308f4-b7fe-43dd-b902-a2505698ac09', '2026-04-15', true, '08:08 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('086975a1-8efc-4cc4-a4f6-6b139307149a', '2026-04-15', true, '08:15 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('4e13b2b9-149d-4a6d-929d-00ec6c23fadc', '2026-04-15', true, '08:20 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('84b16352-2fe4-419b-ac49-a0300a5f6d9a', '2026-04-15', true, '08:25 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('8f5e82a2-fd91-4dbc-81d8-d207b79fd5c1', '2026-04-15', true, '08:30 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5');

-- Monday (2026-04-14) — 16 workers
INSERT INTO attendance (worker_id, date, present, check_in_time, site_id) VALUES
('7ae9fc38-0f59-4ed7-a4ad-ce3bdf129cd7', '2026-04-14', true, '08:10 AM', '00000000-0000-0000-0000-000000000002'),
('cfa91b44-95fd-47cb-9a99-5a235ae42e3a', '2026-04-14', true, '08:15 AM', '00000000-0000-0000-0000-000000000002'),
('c67800ca-e2b7-497a-929f-ac6ab93e5fa8', '2026-04-14', true, '08:20 AM', '00000000-0000-0000-0000-000000000002'),
('249162a7-af9c-45e6-b7f0-a6e103c9f0e8', '2026-04-14', true, '08:35 AM', '00000000-0000-0000-0000-000000000002'),
('8e39fb0f-e482-40dc-95f5-e06f9cd3021e', '2026-04-14', true, '08:22 AM', '00000000-0000-0000-0000-000000000002'),
('f190bbf5-12da-4250-9894-d8337e95f98d', '2026-04-14', true, '08:18 AM', '00000000-0000-0000-0000-000000000002'),
('fd86c679-cdc0-42b9-af95-04bb6b7f5412', '2026-04-14', true, '08:05 AM', '00000000-0000-0000-0000-000000000003'),
('27da12d5-bdd5-4a84-98c7-bbc78c0616c4', '2026-04-14', true, '08:12 AM', '00000000-0000-0000-0000-000000000003'),
('41ebd68e-4764-450c-adb3-ebc4d499a879', '2026-04-14', true, '08:18 AM', '00000000-0000-0000-0000-000000000003'),
('b4e12c91-19f6-45dd-90ef-9eaf6ca030bc', '2026-04-14', true, '08:30 AM', '00000000-0000-0000-0000-000000000003'),
('120dae69-c307-4544-9ff0-6f01af2e8144', '2026-04-14', true, '07:55 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('0bcd656d-6f4e-437c-a270-818d35449516', '2026-04-14', true, '08:00 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('68b308f4-b7fe-43dd-b902-a2505698ac09', '2026-04-14', true, '08:10 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('086975a1-8efc-4cc4-a4f6-6b139307149a', '2026-04-14', true, '08:15 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('4e13b2b9-149d-4a6d-929d-00ec6c23fadc', '2026-04-14', true, '08:20 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5'),
('b715ccca-9c08-436c-9b0b-77ae22ab0555', '2026-04-14', true, '08:28 AM', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5');

-- 5. Add invoices for Tower C (Finishing phase — currently has zero)
INSERT INTO invoices (supplier, amount, date, status, site_id, description) VALUES
('Asian Paints Distributor', 85000, '2026-04-10', 'Paid', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', '80L Apex Emulsion + 30L Primer'),
('Kajaria Tiles Nashik', 125000, '2026-04-08', 'Paid', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', '600 Wall Tiles + 800 Floor Tiles'),
('Kulkarni Electricals', 42000, '2026-04-05', 'Pending', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', '500m Wire 2.5mm + 300m Wire 4mm + MCBs'),
('Nashik Pipe Center', 28000, '2026-04-03', 'Paid', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'CPVC Pipes + PVC Pipes + Fittings'),
('Hindustan Hardware', 18500, '2026-04-01', 'Pending', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'Modular switches + Distribution boxes'),
('Birla White Dealer', 15000, '2026-03-28', 'Paid', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', '50 bags White Cement + 40 bags Putty');

-- 6. Mark some workers as Paid to create realistic mix
UPDATE workers SET status = 'Paid', paid_at = '2026-04-12T18:00:00Z' WHERE id IN (
  'f190bbf5-12da-4250-9894-d8337e95f98d', -- Suresh Jadhav, Tower B
  'b2a6cd2a-b31a-44ca-85d0-300bcb4fb8aa', -- Sunil Jagtap, Commerce Park
  'ef26ffa7-cbca-4c23-bd06-0c0a565bfa89'  -- Kishor Bade, Commerce Park
);
