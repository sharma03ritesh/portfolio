-- ============================================================
-- Ritesh Sharma Portfolio — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- 1. PROFILE (single row)
create table if not exists profile (
  id uuid default gen_random_uuid() primary key,
  name text default 'Ritesh Sharma',
  title text default 'Web Developer',
  bio text[] default array[
    'I''m a Software Developer with 2 years of experience in building scalable web applications using Laravel, PHP, JavaScript, MySQL, and MongoDB.',
    'Passionate about problem-solving, I enjoy turning complex requirements into user-friendly digital solutions while continuously upgrading my skills.'
  ],
  email text default 'riteshsharma89508@gmail.com',
  phone text default '+91 89508-30269',
  birthday text default 'March 18, 2003',
  location text default 'Sector 18/492 Huda Kaithal, Haryana, India',
  avatar_url text,
  resume_url text,
  available boolean default true,
  updated_at timestamptz default now()
);

-- 2. SOCIALS
create table if not exists socials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  icon text not null,
  sort_order int default 0,
  icon_url text null,
  created_at timestamptz default now()
);

-- 3. SERVICES
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  icon text default 'Globe',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 4. SKILLS
create table if not exists skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  level int check (level >= 0 and level <= 100),
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 5. EDUCATION
create table if not exists education (
  id uuid default gen_random_uuid() primary key,
  institution text not null,
  duration text,
  detail text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 6. EXPERIENCE
create table if not exists experience (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  role text not null,
  duration text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 7. PROJECTS
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  project_url text,
  category text default 'Web App',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 8. SITE SETTINGS (key-value store for API keys / config)
create table if not exists site_settings (
  key text primary key,
  value text default '',
  label text default '',
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- Public can READ all tables; only authenticated users can WRITE
-- ============================================================

alter table profile enable row level security;
alter table socials enable row level security;
alter table services enable row level security;
alter table skills enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table site_settings enable row level security;

-- READ policies (anon + authenticated)
create policy "Public read profile" on profile for select using (true);
create policy "Public read socials" on socials for select using (true);
create policy "Public read services" on services for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read education" on education for select using (true);
create policy "Public read experience" on experience for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);

-- WRITE policies (authenticated only)
create policy "Auth write profile" on profile for all using (auth.role() = 'authenticated');
create policy "Auth write socials" on socials for all using (auth.role() = 'authenticated');
create policy "Auth write services" on services for all using (auth.role() = 'authenticated');
create policy "Auth write skills" on skills for all using (auth.role() = 'authenticated');
create policy "Auth write education" on education for all using (auth.role() = 'authenticated');
create policy "Auth write experience" on experience for all using (auth.role() = 'authenticated');
create policy "Auth write projects" on projects for all using (auth.role() = 'authenticated');
create policy "Auth write site_settings" on site_settings for all using (auth.role() = 'authenticated');

-- ============================================================
-- Seed Data
-- ============================================================
insert into profile (name, title, email, phone, birthday, location, available)
values ('Ritesh Sharma', 'Web Developer', 'riteshsharma89508@gmail.com', '+91 89508-30269', 'March 18, 2003', 'Sector 18/492 Huda Kaithal, Haryana, India', true)
on conflict do nothing;

insert into socials (name, url, icon, sort_order,icon_url) values
('LinkedIn', 'https://www.linkedin.com/in/ritesh-sharma-a22720281', 'LinkedIn', 0, ''),
('Twitter', 'https://x.com/Ritesh12121', 'Twitter', 1, ''),
('Instagram', 'https://www.instagram.com/ritesh.returns', 'Instagram', 2, '');

insert into services (title, description, icon, sort_order) values
('Web Development', 'High-quality development of sites at the professional level.', 'Globe', 0),
('Mobile Apps API', 'Professional API development of applications for iOS and Android.', 'Smartphone', 1);

insert into skills (name, level, sort_order) values
('PHP', 90, 0), ('Laravel', 90, 1), ('React Js', 70, 2), ('Node Js', 70, 3),
('JavaScript', 80, 4), ('WordPress', 50, 5), ('AWS', 60, 6), ('Python', 40, 7);

insert into education (institution, duration, detail, sort_order) values
('Swami Vivekananda Institute of Engineering and Technology', '2020 — 2025', 'CGPA: 8.29', 0),
('Government Sr. Sec. School, Shergarh(Kaithal)', '2018 — 2020', 'Percent: 78%', 1);

insert into experience (company, role, duration, description, sort_order) values
('smartData Enterprises Ltd.', 'Software Developer', '2023 — Present',
 'Developing and maintenance of web applications using PHP and Laravel. Collaborating to design and implement new features. Optimizing performance and integrating 3rd party services like Stripe, Google Maps, etc.', 0),
('Maruti Suzuki India Ltd.', 'Database Trainee', 'Aug 2023 — 15 Sep 2023',
 'Database trainee focusing on optimization and data management.', 1);

insert into projects (title, description, image_url, project_url, category, sort_order) values
('LinkedIn Post Generator', 'An AI-powered tool helps users quickly generate and customize engaging LinkedIn posts.', '/assets/images/LPG_logo.png', 'https://linkedin-post-generator-coral.vercel.app/', 'Web App', 0),
('Ambayo', 'A marketplace application with multiple roles, subscription models with Stripe/Crypto, and Ambayo Wallet integration.', '/assets/images/ambayo_logo.ico', 'https://ambayo.com/', 'Marketplace', 1);
