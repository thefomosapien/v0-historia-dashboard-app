-- Add milestone_title field to weeks table
-- This will store the short title that appears inline in the grid
ALTER TABLE public.weeks 
  ADD COLUMN IF NOT EXISTS milestone_title TEXT;

-- Update existing milestone weeks to use their title as milestone_title
UPDATE public.weeks 
SET milestone_title = title 
WHERE is_milestone = TRUE AND title IS NOT NULL;
