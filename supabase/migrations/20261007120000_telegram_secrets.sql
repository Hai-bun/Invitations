-- Telegram bot credentials used to live in wedding_profiles.telegram_config,
-- which anonymous visitors can read. Move them to a table only the wedding's
-- owner (and the server, via the service role) can read.
CREATE TABLE IF NOT EXISTS public.telegram_secrets (
  wedding_id text PRIMARY KEY REFERENCES public.wedding_profiles(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  bot_token text NOT NULL DEFAULT '',
  chat_id text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_secrets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.telegram_secrets FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_secrets TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'telegram_secrets'
      AND policyname = 'Owner manages telegram secrets'
  ) THEN
    CREATE POLICY "Owner manages telegram secrets" ON public.telegram_secrets
      FOR ALL TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.wedding_profiles wp
        WHERE wp.id = telegram_secrets.wedding_id AND wp.user_id = auth.uid()::text))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.wedding_profiles wp
        WHERE wp.id = telegram_secrets.wedding_id AND wp.user_id = auth.uid()::text));
  END IF;
END$$;

-- Carry over what was saved, then blank the publicly readable copy.
INSERT INTO public.telegram_secrets (wedding_id, enabled, bot_token, chat_id)
SELECT id,
       COALESCE((telegram_config->>'enabled')::boolean, false),
       COALESCE(telegram_config->>'botToken', ''),
       COALESCE(telegram_config->>'chatId', '')
FROM public.wedding_profiles
ON CONFLICT (wedding_id) DO NOTHING;

UPDATE public.wedding_profiles SET telegram_config = '{}'::jsonb;
