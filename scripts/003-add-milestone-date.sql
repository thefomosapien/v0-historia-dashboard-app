-- Add milestone_date field to weeks table
ALTER TABLE public.weeks 
  ADD COLUMN IF NOT EXISTS milestone_date DATE;

-- Add comment explaining the field
COMMENT ON COLUMN public.weeks.milestone_date IS 'Specific date of milestone event (can be different from week start/end dates)';
