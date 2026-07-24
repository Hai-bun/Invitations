-- Enable row-level security and owner-based policies for the wedding invitation app.
-- Public selects remain available for invitation pages, while authenticated users can manage their own wedding data.

BEGIN;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow owner manage profiles" ON public.profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

ALTER TABLE public.wedding_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select wedding profiles" ON public.wedding_profiles
  FOR SELECT
  USING (true);
CREATE POLICY "Allow authenticated insert wedding profiles" ON public.wedding_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow authenticated update wedding profiles" ON public.wedding_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow authenticated delete wedding profiles" ON public.wedding_profiles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

ALTER TABLE public.guest_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select guest invitations" ON public.guest_invitations
  FOR SELECT
  USING (true);
CREATE POLICY "Allow authenticated manage guest invitations" ON public.guest_invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = guest_invitations.wedding_id
        AND wp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = guest_invitations.wedding_id
        AND wp.user_id = auth.uid()
    )
  );
CREATE POLICY "Allow anonymous RSVP update" ON public.guest_invitations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (rsvp_status IN ('attending','not_attending'));

ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select photo gallery" ON public.photo_gallery
  FOR SELECT
  USING (true);
CREATE POLICY "Allow authenticated manage photo gallery" ON public.photo_gallery
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = photo_gallery.wedding_id
        AND wp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = photo_gallery.wedding_id
        AND wp.user_id = auth.uid()
    )
  );

ALTER TABLE public.wedding_gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select wedding gifts" ON public.wedding_gifts
  FOR SELECT
  USING (true);
CREATE POLICY "Allow authenticated manage wedding gifts" ON public.wedding_gifts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = wedding_gifts.wedding_id
        AND wp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = wedding_gifts.wedding_id
        AND wp.user_id = auth.uid()
    )
  );

ALTER TABLE public.event_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select event locations" ON public.event_locations
  FOR SELECT
  USING (true);
CREATE POLICY "Allow authenticated manage event locations" ON public.event_locations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = event_locations.wedding_id
        AND wp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.wedding_profiles wp
      WHERE wp.id = event_locations.wedding_id
        AND wp.user_id = auth.uid()
    )
  );

COMMIT;
