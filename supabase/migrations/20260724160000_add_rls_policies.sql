-- Enable row-level security and owner-based policies for the wedding invitation app.
-- Public selects remain available for invitation pages, while authenticated users can manage their own wedding data.

BEGIN;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Allow owner manage profiles'
  ) THEN
    CREATE POLICY "Allow owner manage profiles" ON public.profiles
      FOR ALL
      TO authenticated
      USING (id = auth.uid()::text)
      WITH CHECK (id = auth.uid()::text);
  END IF;
END$$;

ALTER TABLE public.wedding_profiles ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wedding_profiles'
      AND policyname = 'Allow public select wedding profiles'
  ) THEN
    CREATE POLICY "Allow public select wedding profiles" ON public.wedding_profiles
      FOR SELECT
      USING (true);
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wedding_profiles'
      AND policyname = 'Allow authenticated insert wedding profiles'
  ) THEN
    CREATE POLICY "Allow authenticated insert wedding profiles" ON public.wedding_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid()::text);
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wedding_profiles'
      AND policyname = 'Allow authenticated update wedding profiles'
  ) THEN
    CREATE POLICY "Allow authenticated update wedding profiles" ON public.wedding_profiles
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid()::text)
      WITH CHECK (user_id = auth.uid()::text);
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wedding_profiles'
      AND policyname = 'Allow authenticated delete wedding profiles'
  ) THEN
    CREATE POLICY "Allow authenticated delete wedding profiles" ON public.wedding_profiles
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid()::text);
  END IF;
END$$;

ALTER TABLE public.guest_invitations ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'guest_invitations'
      AND policyname = 'Allow public select guest invitations'
  ) THEN
    CREATE POLICY "Allow public select guest invitations" ON public.guest_invitations
      FOR SELECT
      USING (true);
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'guest_invitations'
      AND policyname = 'Allow authenticated manage guest invitations'
  ) THEN
    CREATE POLICY "Allow authenticated manage guest invitations" ON public.guest_invitations
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = guest_invitations.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = guest_invitations.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      );
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'guest_invitations'
      AND policyname = 'Allow anonymous RSVP update'
  ) THEN
    CREATE POLICY "Allow anonymous RSVP update" ON public.guest_invitations
      FOR UPDATE
      TO anon
      USING (true)
      WITH CHECK (rsvp_status IN ('attending','not_attending'));
  END IF;
END$$;

ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'photo_gallery'
      AND policyname = 'Allow public select photo gallery'
  ) THEN
    CREATE POLICY "Allow public select photo gallery" ON public.photo_gallery
      FOR SELECT
      USING (true);
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'photo_gallery'
      AND policyname = 'Allow authenticated manage photo gallery'
  ) THEN
    CREATE POLICY "Allow authenticated manage photo gallery" ON public.photo_gallery
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = photo_gallery.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = photo_gallery.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      );
  END IF;
END$$;

ALTER TABLE public.wedding_gifts ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wedding_gifts'
      AND policyname = 'Allow public select wedding gifts'
  ) THEN
    CREATE POLICY "Allow public select wedding gifts" ON public.wedding_gifts
      FOR SELECT
      USING (true);
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wedding_gifts'
      AND policyname = 'Allow authenticated manage wedding gifts'
  ) THEN
    CREATE POLICY "Allow authenticated manage wedding gifts" ON public.wedding_gifts
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = wedding_gifts.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = wedding_gifts.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      );
  END IF;
END$$;

ALTER TABLE public.event_locations ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'event_locations'
      AND policyname = 'Allow public select event locations'
  ) THEN
    CREATE POLICY "Allow public select event locations" ON public.event_locations
      FOR SELECT
      USING (true);
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'event_locations'
      AND policyname = 'Allow authenticated manage event locations'
  ) THEN
    CREATE POLICY "Allow authenticated manage event locations" ON public.event_locations
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = event_locations.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.wedding_profiles wp
          WHERE wp.id = event_locations.wedding_id
            AND wp.user_id = auth.uid()::text
        )
      );
  END IF;
END$$;

COMMIT;
