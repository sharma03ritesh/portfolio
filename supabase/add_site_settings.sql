-- ============================================================
-- Migration: Add site_settings table for admin-managed API keys
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create the table
create table if not exists site_settings (
  key text primary key,
  value text default '',
  label text default '',
  updated_at timestamptz default now()
);

-- Enable RLS
alter table site_settings enable row level security;

-- Public can read (frontend needs Cloudinary / Web3Forms keys)
create policy "Public read site_settings"
  on site_settings for select using (true);

-- Only authenticated users can write
create policy "Auth write site_settings"
  on site_settings for all using (auth.role() = 'authenticated');

-- Seed with empty placeholders so the admin panel shows them
insert into site_settings (key, value, label) values
  ('cloudinary_cloud_name', '', 'Cloudinary Cloud Name'),
  ('cloudinary_upload_preset', '', 'Cloudinary Upload Preset'),
  ('web3forms_access_key', '', 'Web3Forms Access Key')
on conflict (key) do nothing;
