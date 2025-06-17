
-- First, let's check if there's already a role record for this user
-- If there is, we'll update it to admin, if not, we'll insert a new one

-- Insert or update the user role to admin for pswagerty@gmail.com
INSERT INTO public.user_roles (user_id, role, updated_at) 
VALUES ('df7ed65d-86b3-4416-b805-41eed954e120', 'admin', now())
ON CONFLICT (user_id, role) 
DO NOTHING;

-- If the user already has a different role, update it to admin
UPDATE public.user_roles 
SET role = 'admin', updated_at = now()
WHERE user_id = 'df7ed65d-86b3-4416-b805-41eed954e120' 
AND role != 'admin';

-- If no role exists at all, the first INSERT will handle it
-- This ensures you have admin privileges
