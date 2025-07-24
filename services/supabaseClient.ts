// services/supabaseClient.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
// const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// export const supabase = createClient(supabaseUrl, supabaseKey);

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

-- Books table (enhanced for S3 integration)
CREATE TABLE books (
  id TEXT PRIMARY KEY, -- Using custom book IDs
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  genre TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  pages INTEGER,
  isbn TEXT,
  published_year INTEGER,
  language TEXT DEFAULT 'English',
  upload_status TEXT DEFAULT 'completed', -- pending, processing, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Book versions table (for original and AI-processed versions)
CREATE TABLE book_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  version_type TEXT NOT NULL, -- 'original', 'ai-enhanced', 'ai-simplified', etc.
  version_name TEXT NOT NULL, -- 'Original', 'AI Enhanced', 'Version 1', etc.
  pdf_url TEXT NOT NULL,
  is_ai_processed BOOLEAN DEFAULT false,
  processing_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  ai_model_version TEXT, -- Track which AI model was used
  processing_metadata JSONB, -- Store AI processing details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User books (reading progress) - updated for versions
CREATE TABLE user_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  current_version_id UUID REFERENCES book_versions(id),
  progress DECIMAL(5,2) DEFAULT 0,
  current_page INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  reading_status TEXT DEFAULT 'not_started', -- not_started, reading, completed
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, book_id)
);

-- AI Processing Queue
CREATE TABLE ai_processing_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  source_pdf_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  priority INTEGER DEFAULT 1,
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Book thumbnails/pages
CREATE TABLE book_thumbnails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  thumbnail_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(book_id, page_number)
);

-- Upload sessions (track upload progress)
CREATE TABLE upload_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, uploading, processing, completed, failed
  progress INTEGER DEFAULT 0,
  stage TEXT, -- picking, processing, uploading, ai-processing, complete
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_thumbnails ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Books policies (public read, authenticated write)
CREATE POLICY "Anyone can view published books" ON books FOR SELECT USING (upload_status = 'completed');
CREATE POLICY "Authenticated users can insert books" ON books FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own uploaded books" ON books FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM upload_sessions 
    WHERE upload_sessions.book_id = books.id 
    AND upload_sessions.user_id = auth.uid()
  )
);

-- Book versions policies
CREATE POLICY "Anyone can view book versions" ON book_versions FOR SELECT USING (
  EXISTS (SELECT 1 FROM books WHERE books.id = book_versions.book_id AND books.upload_status = 'completed')
);
CREATE POLICY "System can manage book versions" ON book_versions FOR ALL USING (true);

-- User books policies
CREATE POLICY "Users can view own book data" ON user_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own book data" ON user_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own book data" ON user_books FOR UPDATE USING (auth.uid() = user_id);

-- AI processing queue policies
CREATE POLICY "System can manage processing queue" ON ai_processing_queue FOR ALL USING (true);

-- Thumbnails policies
CREATE POLICY "Anyone can view thumbnails" ON book_thumbnails FOR SELECT USING (true);
CREATE POLICY "System can manage thumbnails" ON book_thumbnails FOR ALL USING (true);

-- Upload sessions policies
CREATE POLICY "Users can view own upload sessions" ON upload_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own upload sessions" ON upload_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own upload sessions" ON upload_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_books_upload_status ON books(upload_status);
CREATE INDEX idx_book_versions_book_id ON book_versions(book_id);
CREATE INDEX idx_book_versions_processing_status ON book_versions(processing_status);
CREATE INDEX idx_ai_processing_queue_status ON ai_processing_queue(status);
CREATE INDEX idx_ai_processing_queue_priority ON ai_processing_queue(priority DESC);
CREATE INDEX idx_user_books_user_id ON user_books(user_id);
CREATE INDEX idx_book_thumbnails_book_id ON book_thumbnails(book_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$ language 'plpgsql';

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_upload_sessions_updated_at BEFORE UPDATE ON upload_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
*/