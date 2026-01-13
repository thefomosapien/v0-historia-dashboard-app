-- Create milestones table separate from weeks
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_birthday BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON public.milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_date ON public.milestones(milestone_date);
CREATE INDEX IF NOT EXISTS idx_milestones_user_date ON public.milestones(user_id, milestone_date);

-- Enable Row Level Security
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for milestones
CREATE POLICY "Users can view own milestones"
  ON public.milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON public.milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON public.milestones FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones"
  ON public.milestones FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Remove milestone-related columns from weeks table
ALTER TABLE public.weeks DROP COLUMN IF EXISTS is_milestone;
ALTER TABLE public.weeks DROP COLUMN IF EXISTS milestone_date;
