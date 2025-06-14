
-- Drop the existing policy that only allows authenticated users
DROP POLICY IF EXISTS "Allow authenticated read access to business settings" ON public.business_settings;

-- Create a new policy that allows both anonymous and authenticated users to read
CREATE POLICY "Allow public read access to business settings"
ON public.business_settings
FOR SELECT
TO anon, authenticated
USING (true);
