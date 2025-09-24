-- Create tables and relations for Medisphere project

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  created_at timestamp with time zone DEFAULT now()
);

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  created_at timestamp with time zone DEFAULT now()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialty text,
  phone text,
  created_at timestamp with time zone DEFAULT now()
);

-- Medical Stores table
CREATE TABLE IF NOT EXISTS medical_stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  created_at timestamp with time zone DEFAULT now()
);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Medicine Reminders table
CREATE TABLE IF NOT EXISTS medicine_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  schedule text,
  created_at timestamp with time zone DEFAULT now()
);

-- Blood Donors table
CREATE TABLE IF NOT EXISTS blood_donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  blood_type text,
  last_donation_date date,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow logged-in users to select their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow logged-in users to insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow logged-in users to update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Similar RLS policies can be created for other tables as needed

-- Add more tables and policies as per project vision
