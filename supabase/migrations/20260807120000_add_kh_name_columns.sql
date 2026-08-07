-- Add Khmer name columns for couple to wedding_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'wedding_profiles' AND column_name = 'groom_name_kh'
  ) THEN
    ALTER TABLE public.wedding_profiles ADD COLUMN groom_name_kh text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'wedding_profiles' AND column_name = 'bride_name_kh'
  ) THEN
    ALTER TABLE public.wedding_profiles ADD COLUMN bride_name_kh text;
  END IF;
END$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_profiles TO anon, authenticated;
