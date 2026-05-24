-- Supabase Schema for Nash's Portfolio

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  discord_id TEXT,
  discord_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tags TEXT[],
  live_url TEXT,
  source_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone."
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify projects."
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_from_admin BOOLEAN DEFAULT FALSE,
  conversation_id UUID NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations."
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ) OR
    auth.uid() = conversation_id
  );

CREATE POLICY "Users can insert messages to their own conversation."
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id OR
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 4. Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone."
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews."
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can delete reviews."
  ON reviews FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5. Visitors Table (For Edge Function)
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  ip_address TEXT,
  user_agent TEXT,
  visit_number INT NOT NULL,
  pages_visited JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view visitors."
  ON visitors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert visitors."
  ON visitors FOR INSERT
  WITH CHECK (true);

-- 6. Site Content Table (CMS)
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content is viewable by everyone."
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update site content."
  ON site_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. Visitor Counter
CREATE TABLE visitor_counter (
  id INT PRIMARY KEY CHECK (id = 1),
  total_count INT DEFAULT 0
);

ALTER TABLE visitor_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitor counter."
  ON visitor_counter FOR SELECT
  USING (true);

-- Initialize counter
INSERT INTO visitor_counter (id, total_count) VALUES (1, 0) ON CONFLICT DO NOTHING;

-- RPC to increment visitor count
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS integer AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE visitor_counter SET total_count = total_count + 1 WHERE id = 1 RETURNING total_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, discord_id, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'provider_id',
    CASE WHEN new.raw_user_meta_data->>'provider_id' = '1224469325939736617' THEN 'admin' ELSE 'user' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Initial CMS Data
INSERT INTO site_content (section_key, content) VALUES
('hero', '{"title": "MatNashPlays", "tagline": "Web Developer & Discord Bot Creator", "description": "I build high-tier, interactive digital experiences."}'),
('what_i_do', '{"services": [{"title": "Web Development", "desc": "Custom, animated portfolio websites"}, {"title": "Discord Bots", "desc": "Custom server moderation and utility bots"}]}'),
('server_info', '{"name": "Nash Server", "description": "Join my community!", "invite_link": "https://discord.gg/placeholder"}')
ON CONFLICT (section_key) DO NOTHING;
