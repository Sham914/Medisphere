-- Seed data for Muvattupuzha city hospitals, doctors, and medical stores

-- Hospitals
INSERT INTO public.hospitals (name, address, phone, email, specialities, emergency_services, latitude, longitude, rating) VALUES
('Muvattupuzha General Hospital', 'Main Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-1234567', 'contact@muvattupuzhahospital.com', ARRAY['Cardiology', 'Emergency', 'Surgery', 'Pediatrics'], true, 9.9770, 76.5762, 4.4),
('St. Marys Hospital', 'Market Junction, Muvattupuzha, Ernakulam, Kerala', '+91-484-2345678', 'info@stmaryshospital.com', ARRAY['Gynecology', 'Orthopedics', 'Neurology'], true, 9.9785, 76.5775, 4.3),
('Holy Family Hospital', 'Kottayam Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-3456789', 'info@holyfamilyhospital.com', ARRAY['Dermatology', 'Internal Medicine', 'Radiology'], false, 9.9750, 76.5790, 4.1),
('Muvattupuzha Heart Care', 'Hospital Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-4567890', 'contact@mhcare.com', ARRAY['Cardiology'], true, 9.9765, 76.5750, 4.5),
('Sunrise Medical Center', 'Near Bus Stand, Muvattupuzha, Ernakulam, Kerala', '+91-484-5678901', 'info@sunrisemedical.com', ARRAY['Emergency', 'Surgery', 'Pediatrics'], true, 9.9790, 76.5780, 4.2),
('Muvattupuzha Womens Hospital', 'Church Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-6789012', 'contact@muvattupuzhawomens.com', ARRAY['Gynecology', 'Pediatrics'], false, 9.9740, 76.5740, 4.0),
('Green Valley Hospital', 'Green Valley, Muvattupuzha, Ernakulam, Kerala', '+91-484-7890123', 'info@greenvalleyhospital.com', ARRAY['Orthopedics', 'Neurology', 'Radiology'], true, 9.9730, 76.5730, 4.3),
('Muvattupuzha Community Hospital', 'Community Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-8901234', 'contact@muvattupuzhacommunity.com', ARRAY['Internal Medicine', 'Emergency'], true, 9.9720, 76.5720, 4.1);

-- Doctors
INSERT INTO public.doctors (hospital_id, name, specialization, qualification, experience_years, phone, email, consultation_fee, available_days, available_hours, rating) VALUES
((SELECT id FROM public.hospitals WHERE name = 'Muvattupuzha General Hospital'), 'Dr. Anil Kumar', 'Cardiology', 'MD, DM', 12, '+91-9847012345', 'anil.kumar@muvattupuzhahospital.com', 1500.00, ARRAY['Monday', 'Wednesday', 'Friday'], '9:00 AM - 5:00 PM', 4.7),
((SELECT id FROM public.hospitals WHERE name = 'Muvattupuzha General Hospital'), 'Dr. Sreeja Nair', 'Pediatrics', 'MD', 8, '+91-9847023456', 'sreeja.nair@muvattupuzhahospital.com', 1200.00, ARRAY['Tuesday', 'Thursday'], '10:00 AM - 4:00 PM', 4.5),
((SELECT id FROM public.hospitals WHERE name = 'St. Marys Hospital'), 'Dr. Rajesh Menon', 'Neurology', 'DM', 15, '+91-9847034567', 'rajesh.menon@stmaryshospital.com', 1800.00, ARRAY['Monday', 'Tuesday', 'Thursday'], '9:00 AM - 3:00 PM', 4.6),
((SELECT id FROM public.hospitals WHERE name = 'Holy Family Hospital'), 'Dr. Meera Thomas', 'Dermatology', 'MD', 10, '+91-9847045678', 'meera.thomas@holyfamilyhospital.com', 1300.00, ARRAY['Wednesday', 'Friday'], '11:00 AM - 6:00 PM', 4.4),
((SELECT id FROM public.hospitals WHERE name = 'Muvattupuzha Heart Care'), 'Dr. Vinod Pillai', 'Cardiology', 'MD, DM', 20, '+91-9847056789', 'vinod.pillai@mhcare.com', 2000.00, ARRAY['Monday', 'Wednesday', 'Friday'], '9:00 AM - 5:00 PM', 4.8),
((SELECT id FROM public.hospitals WHERE name = 'Sunrise Medical Center'), 'Dr. Anitha George', 'Surgery', 'MS', 12, '+91-9847067890', 'anitha.george@sunrisemedical.com', 1600.00, ARRAY['Tuesday', 'Thursday', 'Saturday'], '9:00 AM - 4:00 PM', 4.5),
((SELECT id FROM public.hospitals WHERE name = 'Muvattupuzha Womens Hospital'), 'Dr. Latha Joseph', 'Gynecology', 'MD', 14, '+91-9847078901', 'latha.joseph@muvattupuzhawomens.com', 1400.00, ARRAY['Monday', 'Wednesday'], '10:00 AM - 3:00 PM', 4.3),
((SELECT id FROM public.hospitals WHERE name = 'Green Valley Hospital'), 'Dr. Thomas Mathew', 'Orthopedics', 'MS', 18, '+91-9847089012', 'thomas.mathew@greenvalleyhospital.com', 1700.00, ARRAY['Tuesday', 'Thursday'], '9:00 AM - 5:00 PM', 4.6);

-- Medical Stores
INSERT INTO public.medical_stores (name, address, phone, email, license_number, operating_hours, latitude, longitude, rating) VALUES
('Muvattupuzha Pharmacy', 'Market Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-1234567', 'contact@muvattupuzhapharmacy.com', 'KL123456', '8:00 AM - 10:00 PM', 9.9775, 76.5765, 4.4),
('HealthCare Medicals', 'Main Street, Muvattupuzha, Ernakulam, Kerala', '+91-484-2345678', 'info@healthcaremedicals.com', 'KL123457', '24/7', 9.9780, 76.5770, 4.3),
('City Meds Pharmacy', 'Church Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-3456789', 'info@citymeds.com', 'KL123458', '9:00 AM - 9:00 PM', 9.9755, 76.5755, 4.2),
('Sunrise Pharmacy', 'Hospital Road, Muvattupuzha, Ernakulam, Kerala', '+91-484-4567890', 'contact@sunrisepharmacy.com', 'KL123459', '7:00 AM - 11:00 PM', 9.9760, 76.5740, 4.1);
