
-- Reset all daily workers to Pending with realistic attendance data
UPDATE public.workers SET status = 'Pending', days_present = 6, amount_due = 6 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Ramesh Patil';
UPDATE public.workers SET status = 'Pending', days_present = 5, amount_due = 5 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Suresh Jadhav';
UPDATE public.workers SET status = 'Pending', days_present = 6, amount_due = 6 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Ganesh Shinde';
UPDATE public.workers SET status = 'Pending', days_present = 5, amount_due = 5 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Manoj Deshmukh';
UPDATE public.workers SET status = 'Pending', days_present = 6, amount_due = 6 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Prakash Wagh';
UPDATE public.workers SET status = 'Pending', days_present = 6, amount_due = 6 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Rajesh More';
UPDATE public.workers SET status = 'Pending', days_present = 5, amount_due = 5 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Anil Gaikwad';
UPDATE public.workers SET status = 'Pending', days_present = 6, amount_due = 6 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Santosh Gaikwad';
UPDATE public.workers SET status = 'Pending', days_present = 5, amount_due = 5 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Sachin Kale';
UPDATE public.workers SET status = 'Pending', days_present = 4, amount_due = 4 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Dinesh Pawar';
UPDATE public.workers SET status = 'Pending', days_present = 6, amount_due = 6 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Nitin Pawar';
UPDATE public.workers SET status = 'Pending', days_present = 5, amount_due = 5 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Vijay Bhosale';
UPDATE public.workers SET status = 'Pending', days_present = 6, amount_due = 6 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Ravi Gupta';
UPDATE public.workers SET status = 'Pending', days_present = 5, amount_due = 5 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Rakesh More';
UPDATE public.workers SET status = 'Pending', days_present = 5, amount_due = 5 * wage_rate, paid_at = NULL WHERE wage_type = 'daily' AND name = 'Ravi Surana';
