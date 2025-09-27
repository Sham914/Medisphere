-- Migration: Add 'name' column to blood_donors table if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='blood_donors' AND column_name='name'
    ) THEN
        ALTER TABLE public.blood_donors ADD COLUMN name TEXT;
    END IF;
END$$;
