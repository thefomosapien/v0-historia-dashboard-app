-- Add new fields to weeks table
ALTER TABLE public.weeks 
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS chapter TEXT,
  ADD COLUMN IF NOT EXISTS is_milestone BOOLEAN DEFAULT FALSE;

-- Remove mood and energy_level columns (optional - only if you want to clean up old fields)
-- ALTER TABLE public.weeks DROP COLUMN IF EXISTS mood;
-- ALTER TABLE public.weeks DROP COLUMN IF EXISTS energy_level;
