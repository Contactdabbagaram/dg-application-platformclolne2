
-- 1. Enable Row Level Security (RLS) on the outlets table (if not already enabled)
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows updates to the outlets table by any authenticated user.
-- Adjust this policy to only allow admins if needed. For now, allow all authenticated users for troubleshooting.
CREATE POLICY "Allow all authenticated users to update outlets"
ON public.outlets
FOR UPDATE
TO authenticated
USING (true);

-- You may fine-tune this policy later to restrict updates by ownership or admin status.
