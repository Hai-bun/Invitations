-- Adds storage for the optional "Our Story" and "Wedding Day Schedule"
-- sections. Both are JSONB so the whole section config (enabled flag, title,
-- and schedule items) lives in a single column.
--
-- love_story:       { "enabled": bool, "title": text, "text": text }
-- wedding_schedule: { "enabled": bool, "title": text,
--                     "items": [ { "id", "time", "title", "description" } ] }

ALTER TABLE public.wedding_profiles
  ADD COLUMN IF NOT EXISTS love_story jsonb,
  ADD COLUMN IF NOT EXISTS wedding_schedule jsonb;
