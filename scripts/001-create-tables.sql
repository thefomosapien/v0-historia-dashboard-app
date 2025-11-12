-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weeks table - stores documentation for each week of a user's life
CREATE TABLE IF NOT EXISTS public.weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL, -- Week number since birth (1-indexed)
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  title TEXT,
  content TEXT,
  mood TEXT, -- happy, neutral, sad, excited, challenging, peaceful
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  is_documented BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_weeks_user_id ON public.weeks(user_id);
CREATE INDEX IF NOT EXISTS idx_weeks_user_week ON public.weeks(user_id, week_number);
CREATE INDEX IF NOT EXISTS idx_weeks_start_date ON public.weeks(start_date);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for weeks
CREATE POLICY "Users can view own weeks"
  ON public.weeks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weeks"
  ON public.weeks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weeks"
  ON public.weeks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weeks"
  ON public.weeks FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weeks_updated_at
  BEFORE UPDATE ON public.weeks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
