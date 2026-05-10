-- Add audit columns to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS verified_by_name TEXT;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add audit columns to booklet_submissions
ALTER TABLE public.booklet_submissions ADD COLUMN IF NOT EXISTS verified_by_name TEXT;
ALTER TABLE public.booklet_submissions ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
