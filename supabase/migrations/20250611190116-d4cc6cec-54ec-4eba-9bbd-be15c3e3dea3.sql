
-- Add homepage_theme column to frontend_settings table
ALTER TABLE public.frontend_settings 
ADD COLUMN homepage_theme text DEFAULT 'classic';

-- Add a comment to document the column
COMMENT ON COLUMN public.frontend_settings.homepage_theme IS 'Selected homepage theme layout (classic, promotional, categories, minimal)';
