
-- This policy allows any authenticated user to read from the 'outlets' table.
-- This is necessary for the admin panel to fetch and display outlet details correctly.
CREATE POLICY "Allow authenticated users to read outlets"
ON public.outlets
FOR SELECT
TO authenticated
USING (true);
