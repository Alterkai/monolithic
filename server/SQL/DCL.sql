-- =================================================================
-- BAGIAN 1: ROLE UNTUK MEMBER (PENGGUNA BIASA)
-- =================================================================

-- 1. Membuat role untuk member
CREATE ROLE member_role;

-- 2. Memberikan hak akses SELECT pada tabel yang perlu dibaca oleh member
-- Member bisa melihat data manga, chapter, gambar, genre, dan komentar.
GRANT SELECT ON manga, chapter, image, genre, manga_genre, manga_comments, chapter_comments, bookmark TO member_role;

-- Member hanya bisa melihat informasi publik dari user lain (bukan email/password)
GRANT SELECT (id, avatar, username, name, status, date_joined) ON users TO member_role;

-- 3. Memberikan hak akses untuk mengubah data profilnya sendiri
-- Member bisa mengubah avatar, email, dan password.
GRANT UPDATE (avatar, email, password) ON users TO member_role;

-- 4. Memberikan hak akses untuk membuat, mengubah, dan menghapus bookmark miliknya
GRANT INSERT, UPDATE, DELETE ON bookmark TO member_role;
-- Memberikan hak pakai pada sequence ID agar bisa membuat bookmark baru
GRANT USAGE ON SEQUENCE bookmark_id_seq TO member_role;

-- 5. Memberikan hak akses untuk membuat, mengubah, dan menghapus komentar miliknya
GRANT INSERT, UPDATE, DELETE ON manga_comments, chapter_comments TO member_role;
-- Memberikan hak pakai pada sequence ID agar bisa membuat komentar baru
GRANT USAGE ON SEQUENCE manga_comments_id_seq, chapter_comments_id_seq TO member_role;


-- =================================================================
-- BAGIAN 2: ROLE UNTUK STAF (ADMIN/PENGELOLA)
-- =================================================================

-- 1. Membuat role untuk staf
CREATE ROLE staff_role;

-- 2. Memberikan hak akses penuh (CRUD) ke semua tabel aplikasi
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO staff_role;

-- 3. Memberikan hak pakai (USAGE) pada semua sequence
-- Ini diperlukan agar staf bisa membuat data baru di semua tabel.
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO staff_role;

-- 4. Memberikan hak pakai pada tipe data kustom (ENUM) jika ada
-- Contoh: jika Anda membuat ENUM 'task_status'
-- GRANT USAGE ON TYPE task_status TO staff_role;


-- =================================================================
-- CARA MENGGUNAKAN ROLE
-- =================================================================
/*

-- Untuk menetapkan seorang user menjadi member:
GRANT member_role TO nama_user_postgresql;

-- Untuk menetapkan seorang user menjadi staf:
GRANT staff_role TO nama_user_postgresql;

-- Contoh membuat user baru dan menetapkannya sebagai member:
CREATE USER budi WITH PASSWORD 'password_rahasia';
GRANT member_role TO budi;

*/