-- RESET AND RECREATE THE FULL DATABASE FOR MEDISPHERE
-- WARNING: This will drop all existing tables and data!

DROP TABLE IF EXISTS public.blood_requests CASCADE;
DROP TABLE IF EXISTS public.blood_donors CASCADE;
DROP TABLE IF EXISTS public.medicine_reminders CASCADE;
DROP TABLE IF EXISTS public.medical_stores CASCADE;
DROP TABLE IF EXISTS public.doctors CASCADE;
DROP TABLE IF EXISTS public.hospitals CASCADE;



CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  specialities TEXT[],
  emergency_services BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  phone TEXT,
  email TEXT,
  consultation_fee DECIMAL(10, 2),
  available_days TEXT[],
  available_hours TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medical_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  license_number TEXT,
  operating_hours TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medicine_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  reminder_times TIME[],
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blood_donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  age INTEGER NOT NULL,
  weight DECIMAL(5, 2),
  last_donation_date DATE,
  is_available BOOLEAN DEFAULT true,
  medical_conditions TEXT,
  emergency_contact TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units_needed INTEGER NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  hospital_name TEXT NOT NULL,
  hospital_address TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  additional_info TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;


-- Hospitals: Anyone can view
CREATE POLICY "Anyone can view hospitals" ON public.hospitals FOR SELECT USING (true);

-- Doctors: Anyone can view
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);

-- Medical Stores: Anyone can view
CREATE POLICY "Anyone can view medical stores" ON public.medical_stores FOR SELECT USING (true);

-- Medicine Reminders: Only user can access their own reminders
CREATE POLICY "Users can manage their own reminders" ON public.medicine_reminders FOR ALL USING (auth.uid() = user_id);

-- Blood Donors: Anyone can view available, only user can manage their own
CREATE POLICY "Anyone can view available blood donors" ON public.blood_donors FOR SELECT USING (is_available = true);
CREATE POLICY "Users can manage their own donor profile" ON public.blood_donors FOR ALL USING (auth.uid() = user_id);

-- Blood Requests: Anyone can view active, only user can manage their own
CREATE POLICY "Anyone can view active blood requests" ON public.blood_requests FOR SELECT USING (status = 'active');
CREATE POLICY "Users can manage their own blood requests" ON public.blood_requests FOR ALL USING (auth.uid() = requester_id);

-- 5. (Optional) Add triggers, seed data, etc. as needed
