-- Add wedding management tables and enums for the invitation app.
-- This migration is designed for a single default wedding profile backed by Supabase.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typname = 'invitation_status'
  ) THEN
    CREATE TYPE public.invitation_status AS ENUM (
      'sent',
      'opened',
      'not_opened'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typname = 'rsvp_status'
  ) THEN
    CREATE TYPE public.rsvp_status AS ENUM (
      'pending',
      'attending',
      'not_attending'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.wedding_profiles (
  id text PRIMARY KEY,
  user_id text REFERENCES public.profiles(id) ON DELETE SET NULL,
  bride_name text NOT NULL,
  groom_name text NOT NULL,
  bride_parent_names text,
  groom_parent_names text,
  wedding_date_time timestamptz NOT NULL,
  theme text NOT NULL DEFAULT 'luxury',
  template text NOT NULL DEFAULT 'classic',
  background_image_url text,
  primary_color text,
  secondary_color text,
  accent_color text,
  heading_font text,
  body_font text,
  show_countdown boolean NOT NULL DEFAULT true,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  telegram_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  welcome_popup jsonb NOT NULL DEFAULT '{}'::jsonb,
  animations jsonb NOT NULL DEFAULT '{}'::jsonb,
  event_title text,
  event_address text,
  event_map_url text,
  gift_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_profiles TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.event_locations (
  id text PRIMARY KEY,
  wedding_id text NOT NULL REFERENCES public.wedding_profiles(id) ON DELETE CASCADE,
  event_title text,
  address text,
  google_map_url text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_locations TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.guest_invitations (
  id text PRIMARY KEY,
  wedding_id text NOT NULL REFERENCES public.wedding_profiles(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  invitation_token text NOT NULL UNIQUE,
  invitation_status public.invitation_status NOT NULL DEFAULT 'not_opened',
  rsvp_status public.rsvp_status NOT NULL DEFAULT 'pending',
  blessing_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_invitations TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.photo_gallery (
  id text PRIMARY KEY,
  wedding_id text NOT NULL REFERENCES public.wedding_profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_gallery TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.wedding_gifts (
  id text PRIMARY KEY,
  wedding_id text NOT NULL UNIQUE REFERENCES public.wedding_profiles(id) ON DELETE CASCADE,
  khqr_image_url text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_gifts TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_guest_invitations_wedding_id ON public.guest_invitations (wedding_id);
CREATE INDEX IF NOT EXISTS idx_photo_gallery_wedding_id ON public.photo_gallery (wedding_id);
CREATE INDEX IF NOT EXISTS idx_event_locations_wedding_id ON public.event_locations (wedding_id);
CREATE INDEX IF NOT EXISTS idx_wedding_gifts_wedding_id ON public.wedding_gifts (wedding_id);
