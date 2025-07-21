// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Schema for Supabase:
/*
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Books table
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  pdf_url TEXT,
  genre TEXT,
  rating DECIMAL(2,1),
  pages INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User books (reading progress)
CREATE TABLE user_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) DEFAULT 0,
  current_page INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  reading_status TEXT DEFAULT 'not_started', -- not_started, reading, completed
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, book_id)
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Books policies (public read access)
CREATE POLICY "Anyone can view books" ON books
  FOR SELECT USING (true);

-- User books policies
CREATE POLICY "Users can view own book data" ON user_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own book data" ON user_books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own book data" ON user_books
  FOR UPDATE USING (auth.uid() = user_id);

-- Sample data insertion
INSERT INTO books (title, author, description, cover_url, pdf_url, genre, rating, pages) VALUES
('One Dark Window', 'Rachel Gillig', 'Elspeth needs a monster. The monster might be her...', 'one_dark_window_cover.jpg', 'one_dark_window.pdf', 'Fantasy', 4.5, 432),
('A Day of Fallen Night', 'Samantha Shannon', 'The stunning prequel to the New York Times bestselling The Priory of the Orange Tree...', 'day_of_fallen_night_cover.jpg', 'day_of_fallen_night.pdf', 'Fantasy', 4.2, 688),
('Book of Night', 'Holly Black', 'Charlie Hall has never found a lock she couldn\'t pick...', 'book_of_night_cover.jpg', 'book_of_night.pdf', 'Fantasy', 4.0, 352),
('The Wolf Den', 'Elodie Harper', 'Amara is a slave in Pompeii\'s infamous brothel...', 'wolf_den_cover.jpg', 'wolf_den.pdf', 'Historical Fiction', 4.8, 416);
*/