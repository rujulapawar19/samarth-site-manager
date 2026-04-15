
-- 1. Update site phases (one per phase)
UPDATE sites SET phase = 'Planning' WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE sites SET phase = 'Foundation' WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE sites SET phase = 'Structural' WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE sites SET phase = 'Finishing' WHERE id = 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5';

-- 2. Delete all existing workers
DELETE FROM attendance;
DELETE FROM workers;

-- 3. Insert Planning phase workers for Tower A
INSERT INTO workers (name, role, site_id, wage_type, wage_rate, days_present, amount_due, status) VALUES
('Rahul Deshmukh', 'Architect', '00000000-0000-0000-0000-000000000001', 'daily', 1200, 6, 7200, 'Pending'),
('Priya Sharma', 'Civil Engineer', '00000000-0000-0000-0000-000000000001', 'daily', 1100, 5, 5500, 'Pending'),
('Manoj Kulkarni', 'Structural Engineer', '00000000-0000-0000-0000-000000000001', 'daily', 1150, 6, 6900, 'Pending'),
('Amit Joshi', 'Surveyor', '00000000-0000-0000-0000-000000000001', 'daily', 800, 5, 4000, 'Pending'),
('Suresh Patil', 'Project Manager', '00000000-0000-0000-0000-000000000001', 'daily', 1500, 6, 9000, 'Pending'),
('Kiran Mahale', 'Planning Coordinator', '00000000-0000-0000-0000-000000000001', 'daily', 900, 5, 4500, 'Pending'),
('Deepak Rane', 'Site Engineer', '00000000-0000-0000-0000-000000000001', 'daily', 1000, 6, 6000, 'Pending'),
('Sanjay Mane', 'Architect', '00000000-0000-0000-0000-000000000001', 'daily', 1200, 5, 6000, 'Pending'),
('Vikram Desai', 'Civil Engineer', '00000000-0000-0000-0000-000000000001', 'daily', 1100, 6, 6600, 'Pending'),
('Arun Bhosale', 'Surveyor', '00000000-0000-0000-0000-000000000001', 'daily', 800, 5, 4000, 'Pending'),
('Nitin Wagh', 'Structural Engineer', '00000000-0000-0000-0000-000000000001', 'daily', 1150, 6, 6900, 'Pending');

-- 4. Insert Foundation phase workers for Tower B
INSERT INTO workers (name, role, site_id, wage_type, wage_rate, days_present, amount_due, status) VALUES
('Ramesh Patil', 'Site Engineer', '00000000-0000-0000-0000-000000000002', 'daily', 1000, 6, 6000, 'Pending'),
('Ganesh Shinde', 'Supervisor', '00000000-0000-0000-0000-000000000002', 'daily', 700, 6, 4200, 'Pending'),
('Suresh Jadhav', 'Mason', '00000000-0000-0000-0000-000000000002', 'daily', 650, 5, 3250, 'Pending'),
('Prakash Wagh', 'Steel Fixer', '00000000-0000-0000-0000-000000000002', 'daily', 600, 6, 3600, 'Pending'),
('Dinesh Pawar', 'Excavation Worker', '00000000-0000-0000-0000-000000000002', 'daily', 500, 5, 2500, 'Pending'),
('Rajesh More', 'Machine Operator', '00000000-0000-0000-0000-000000000002', 'daily', 750, 6, 4500, 'Pending'),
('Vijay Kulkarni', 'Safety Officer', '00000000-0000-0000-0000-000000000002', 'daily', 800, 5, 4000, 'Pending'),
('Sachin Kale', 'Concrete Worker', '00000000-0000-0000-0000-000000000002', 'daily', 550, 6, 3300, 'Pending'),
('Manoj Deshmukh', 'Mason', '00000000-0000-0000-0000-000000000002', 'daily', 650, 5, 3250, 'Pending'),
('Ravi Surana', 'Supervisor', '00000000-0000-0000-0000-000000000002', 'daily', 700, 6, 4200, 'Pending'),
('Ashok Gaikwad', 'Steel Fixer', '00000000-0000-0000-0000-000000000002', 'daily', 600, 5, 3000, 'Pending');

-- 5. Insert Structural phase workers for Commerce Park
INSERT INTO workers (name, role, site_id, wage_type, wage_rate, days_present, amount_due, status) VALUES
('Amol Joshi', 'Site Engineer', '00000000-0000-0000-0000-000000000003', 'daily', 1000, 6, 6000, 'Pending'),
('Santosh Gaikwad', 'Supervisor', '00000000-0000-0000-0000-000000000003', 'daily', 700, 5, 3500, 'Pending'),
('Nitin Pawar', 'Carpenter', '00000000-0000-0000-0000-000000000003', 'daily', 600, 6, 3600, 'Pending'),
('Anil Gaikwad', 'Concrete Worker', '00000000-0000-0000-0000-000000000003', 'daily', 550, 6, 3300, 'Pending'),
('Raju Thorat', 'Steel Fixer', '00000000-0000-0000-0000-000000000003', 'daily', 600, 5, 3000, 'Pending'),
('Mohan Jadhav', 'Crane Operator', '00000000-0000-0000-0000-000000000003', 'daily', 850, 6, 5100, 'Pending'),
('Bharat Salve', 'Quality Inspector', '00000000-0000-0000-0000-000000000003', 'daily', 900, 5, 4500, 'Pending'),
('Dilip Chavan', 'Helper', '00000000-0000-0000-0000-000000000003', 'daily', 450, 6, 2700, 'Pending'),
('Sunil Jagtap', 'Carpenter', '00000000-0000-0000-0000-000000000003', 'daily', 600, 5, 3000, 'Pending'),
('Pravin Nikam', 'Concrete Worker', '00000000-0000-0000-0000-000000000003', 'daily', 550, 6, 3300, 'Pending'),
('Hemant Dhole', 'Supervisor', '00000000-0000-0000-0000-000000000003', 'daily', 700, 6, 4200, 'Pending'),
('Kishor Bade', 'Helper', '00000000-0000-0000-0000-000000000003', 'daily', 450, 5, 2250, 'Pending');

-- 6. Insert Finishing phase workers for Tower C
INSERT INTO workers (name, role, site_id, wage_type, wage_rate, days_present, amount_due, status) VALUES
('Rakesh More', 'Site Engineer', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 1000, 6, 6000, 'Pending'),
('Mangesh Patil', 'Electrician', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 700, 5, 3500, 'Pending'),
('Balu Shinde', 'Plumber', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 650, 6, 3900, 'Pending'),
('Tanaji Pawar', 'Painter', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 550, 6, 3300, 'Pending'),
('Govind Mane', 'Tile Worker', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 600, 5, 3000, 'Pending'),
('Sagar Lokhande', 'Interior Worker', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 650, 6, 3900, 'Pending'),
('Vinod Kadam', 'Finishing Supervisor', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 800, 5, 4000, 'Pending'),
('Ajay Sonawane', 'Helper', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 450, 6, 2700, 'Pending'),
('Deepak Kshirsagar', 'Electrician', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 700, 6, 4200, 'Pending'),
('Tushar Gholap', 'Plumber', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 650, 5, 3250, 'Pending'),
('Pramod Dhage', 'Painter', 'aa6bf1f8-c31e-4ecb-9020-3c2ec1631dd5', 'daily', 550, 5, 2750, 'Pending');
