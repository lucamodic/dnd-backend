-- Add email + verification metadata to the public.user table.
ALTER TABLE public."user"
ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE public."user"
ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

ALTER TABLE public."user"
ADD COLUMN IF NOT EXISTS email_verification_token text;

ALTER TABLE public."user"
ADD COLUMN IF NOT EXISTS email_verification_expires_at timestamptz;

-- Backfill placeholder emails for existing rows to satisfy NOT NULL + UNIQUE.
UPDATE public."user"
SET email = concat('placeholder-', id, '@example.local')
WHERE email IS NULL;

ALTER TABLE public."user"
ALTER COLUMN email SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_email_key ON public."user" (email);
