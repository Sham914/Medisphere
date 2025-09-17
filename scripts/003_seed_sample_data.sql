-- Insert sample hospitals
INSERT INTO public.hospitals (name, address, phone, email, specialties, emergency_services, latitude, longitude, rating) VALUES
('City General Hospital', '123 Main St, Downtown', '+1-555-0101', 'info@citygeneral.com', ARRAY['Cardiology', 'Emergency', 'Surgery'], true, 40.7128, -74.0060, 4.5),
('Metro Medical Center', '456 Oak Ave, Midtown', '+1-555-0102', 'contact@metromedical.com', ARRAY['Pediatrics', 'Orthopedics', 'Neurology'], true, 40.7589, -73.9851, 4.2),
('Sunrise Healthcare', '789 Pine Rd, Uptown', '+1-555-0103', 'hello@sunrisehc.com', ARRAY['Dermatology', 'Gynecology', 'Internal Medicine'], false, 40.7831, -73.9712, 4.0),
('Valley View Hospital', '321 Elm St, Suburbs', '+1-555-0104', 'info@valleyview.com', ARRAY['Emergency', 'Surgery', 'Radiology'], true, 40.6892, -74.0445, 4.3);

-- Insert sample doctors
INSERT INTO public.doctors (hospital_id, name, specialization, qualification, experience_years, phone, email, consultation_fee, available_days, available_hours, rating) VALUES
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'Dr. Sarah Johnson', 'Cardiology', 'MD, FACC', 15, '+1-555-1001', 'sarah.johnson@citygeneral.com', 200.00, ARRAY['Monday', 'Wednesday', 'Friday'], '9:00 AM - 5:00 PM', 4.8),
((SELECT id FROM public.hospitals WHERE name = 'City General Hospital'), 'Dr. Michael Chen', 'Emergency Medicine', 'MD, FACEP', 12, '+1-555-1002', 'michael.chen@citygeneral.com', 150.00, ARRAY['Tuesday', 'Thursday', 'Saturday'], '24/7', 4.6),
((SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center'), 'Dr. Emily Rodriguez', 'Pediatrics', 'MD, FAAP', 8, '+1-555-1003', 'emily.rodriguez@metromedical.com', 120.00, ARRAY['Monday', 'Tuesday', 'Thursday'], '8:00 AM - 4:00 PM', 4.7),
((SELECT id FROM public.hospitals WHERE name = 'Sunrise Healthcare'), 'Dr. David Kim', 'Dermatology', 'MD, FAAD', 10, '+1-555-1004', 'david.kim@sunrisehc.com', 180.00, ARRAY['Wednesday', 'Friday'], '10:00 AM - 6:00 PM', 4.5);

-- Insert sample medical stores
INSERT INTO public.medical_stores (name, address, phone, email, license_number, operating_hours, latitude, longitude, rating) VALUES
('HealthPlus Pharmacy', '100 Broadway, Downtown', '+1-555-2001', 'info@healthplus.com', 'PH001234', '8:00 AM - 10:00 PM', 40.7074, -74.0113, 4.4),
('MediCare Drugstore', '250 Second Ave, Midtown', '+1-555-2002', 'contact@medicare-drugs.com', 'PH001235', '24/7', 40.7505, -73.9934, 4.1),
('Wellness Pharmacy', '500 Third St, Uptown', '+1-555-2003', 'hello@wellnessrx.com', 'PH001236', '9:00 AM - 9:00 PM', 40.7794, -73.9632, 4.3),
('Community Health Store', '75 Fourth Ave, Suburbs', '+1-555-2004', 'info@communityhealthstore.com', 'PH001237', '7:00 AM - 11:00 PM', 40.6829, -74.0323, 4.2);
