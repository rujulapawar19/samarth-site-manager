
-- Update staff/management roles to monthly wage_type
UPDATE workers SET wage_type = 'monthly', amount_due = wage_rate
WHERE role IN (
  'Architect', 'Civil Engineer', 'Structural Engineer', 'Surveyor',
  'Project Manager', 'Planning Coordinator', 'Site Engineer',
  'Supervisor', 'Safety Officer', 'Quality Inspector', 'Finishing Supervisor'
);

-- Ensure labor roles stay as daily
UPDATE workers SET wage_type = 'daily'
WHERE role IN (
  'Mason', 'Steel Fixer', 'Excavation Worker', 'Machine Operator',
  'Concrete Worker', 'Carpenter', 'Crane Operator', 'Helper',
  'Electrician', 'Plumber', 'Painter', 'Tile Worker', 'Interior Worker'
);
