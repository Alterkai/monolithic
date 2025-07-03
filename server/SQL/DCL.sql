-- 1. Membuat role untuk staf
CREATE ROLE staff_role;

-- 2. Memberikan hak akses penuh (CRUD) ke semua tabel aplikasi
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO staff_role;

-- 3. Memberikan hak pakai (USAGE) pada semua sequence
-- Ini diperlukan agar staf bisa membuat data baru di semua tabel.
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO staff_role;
GRANT SELECT 