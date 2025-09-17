-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage hospitals" ON public.hospitals;
DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can manage medical stores" ON public.medical_stores;

-- Create simplified policies that don't cause recursion
-- For profiles - only allow users to see their own profile
-- Admins will be handled through service role or separate admin queries

-- For public data (hospitals, doctors, medical stores) - allow all authenticated users to read
-- Admin write access will be handled through service role key in admin functions
CREATE POLICY "Authenticated users can view hospitals" ON public.hospitals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view doctors" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view medical stores" ON public.medical_stores FOR SELECT TO authenticated USING (true);

-- Allow service role to do everything (for admin operations)
CREATE POLICY "Service role full access hospitals" ON public.hospitals FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access doctors" ON public.doctors FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access medical stores" ON public.medical_stores FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access profiles" ON public.profiles FOR ALL TO service_role USING (true);
