
ALTER TABLE public.outlets
ADD COLUMN petpooja_menu_api_url TEXT,
ADD COLUMN petpooja_save_order_api_url TEXT;

COMMENT ON COLUMN public.outlets.petpooja_menu_api_url IS 'Custom Petpooja Menu API URL for this outlet.';
COMMENT ON COLUMN public.outlets.petpooja_save_order_api_url IS 'Custom Petpooja Save Order API URL for this outlet.';
