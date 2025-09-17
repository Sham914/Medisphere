-- Grant full admin permissions for all tables
-- This script ensures admins can perform all CRUD operations

-- Drop existing policies to recreate them with proper admin permissions
DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Admin full access to hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admin full access to doctors" ON doctors;
DROP POLICY IF EXISTS "Admin full access to medical_stores" ON medical_stores;
DROP POLICY IF EXISTS "Admin full access to blood_donors" ON blood_donors;
DROP POLICY IF EXISTS "Admin full access to blood_requests" ON blood_requests;
DROP POLICY IF EXISTS "Admin full access to medicine_reminders" ON medicine_reminders;

-- Create comprehensive admin policies for all tables
-- These policies allow service role to perform all operations

-- Profiles table
CREATE POLICY "Service role full access to profiles" ON profiles
FOR ALL USING (true) WITH CHECK (true);

-- Hospitals table  
CREATE POLICY "Service role full access to hospitals" ON hospitals
FOR ALL USING (true) WITH CHECK (true);

-- Doctors table
CREATE POLICY "Service role full access to doctors" ON doctors
FOR ALL USING (true) WITH CHECK (true);

-- Medical stores table
CREATE POLICY "Service role full access to medical_stores" ON medical_stores
FOR ALL USING (true) WITH CHECK (true);

-- Blood donors table
CREATE POLICY "Service role full access to blood_donors" ON blood_donors
FOR ALL USING (true) WITH CHECK (true);

-- Blood requests table
CREATE POLICY "Service role full access to blood_requests" ON blood_requests
FOR ALL USING (true) WITH CHECK (true);

-- Medicine reminders table
CREATE POLICY "Service role full access to medicine_reminders" ON medicine_reminders
FOR ALL USING (true) WITH CHECK (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_reminders ENABLE ROW LEVEL SECURITY;
