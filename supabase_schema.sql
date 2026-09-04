-- ==============================================================================
-- SKRIP UPDATE / MIGRATION DATABASE HELPDESK TERPADU KPP PRATAMA RENGAT
-- Skrip ini dirancang AMAN (Idempotent): bisa dijalankan pada database yang
-- sudah memiliki tabel (chat_sessions, chat_messages, templates, staff_members, dll)
-- tanpa menghapus data yang sudah ada dan tanpa error constraint / duplicate.
--
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. PASTIKAN EXTENSION AKTIF
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. UPDATE TABEL CHAT_SESSIONS (Sinkronisasi Kolom & Constraint)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    session_id TEXT PRIMARY KEY,
    started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Tambahkan kolom-kolom baru jika belum ada pada tabel chat_sessions yang sudah ada
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'web';
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS primary_category TEXT DEFAULT 'Lainnya';
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS matched_count INTEGER DEFAULT 0;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS unmatched_count INTEGER DEFAULT 0;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS first_response_ms INTEGER DEFAULT NULL;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS resolution_time_ms INTEGER DEFAULT NULL;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ DEFAULT NULL;

-- Perbarui Constraint Status & Channel agar mendukung 'web' dan 'whatsapp'
ALTER TABLE public.chat_sessions DROP CONSTRAINT IF EXISTS chat_sessions_channel_check;
ALTER TABLE public.chat_sessions ADD CONSTRAINT chat_sessions_channel_check 
    CHECK (channel IN ('web', 'whatsapp', 'web_widget'));

ALTER TABLE public.chat_sessions DROP CONSTRAINT IF EXISTS chat_sessions_status_check;
ALTER TABLE public.chat_sessions ADD CONSTRAINT chat_sessions_status_check 
    CHECK (status IN ('active', 'escalated', 'resolved', 'unmatched'));

-- Indeks kinerja
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_channel ON public.chat_sessions(channel);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_started_at ON public.chat_sessions(started_at DESC);


-- ==============================================================================
-- 3. UPDATE TABEL CHAT_MESSAGES (Sinkronisasi Kolom & Dukungan Role 'admin')
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL REFERENCES public.chat_sessions(session_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Tambahkan kolom-kolom baru jika belum ada
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS message_status TEXT DEFAULT 'received';
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS is_template_used BOOLEAN DEFAULT FALSE;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

-- PENTING: Perbarui Check Constraint Role agar 'admin' diizinkan!
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_role_check;
ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_role_check 
    CHECK (role IN ('user', 'bot', 'admin', 'system'));

-- Indeks kinerja chat
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON public.chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);


-- ==============================================================================
-- 4. UPDATE TABEL TEMPLATES (SOP Jawaban Admin)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.templates (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'P3';
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS use_count INTEGER DEFAULT 0;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());


-- ==============================================================================
-- 5. SINKRONISASI TABEL STAFF_MEMBERS & USERS_ROLE
-- ==============================================================================
-- Jika tabel staff_members sudah ada di database Anda
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'staff_members') THEN
        ALTER TABLE public.staff_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
        ALTER TABLE public.staff_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Tabel pembantu users_role (jika diperlukan untuk auth role)
CREATE TABLE IF NOT EXISTS public.users_role (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'petugas',
    nama TEXT,
    nip TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- RLS untuk tabel users_role
ALTER TABLE public.users_role ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read users_role" ON public.users_role;
CREATE POLICY "Allow read users_role"
    ON public.users_role FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow insert/update users_role" ON public.users_role;
CREATE POLICY "Allow insert/update users_role"
    ON public.users_role FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- TRIGGER OTOMATIS: Setiap kali ada akun baru di auth.users, otomatis masuk ke public.users_role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users_role (id, role, nama, nip)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'petugas'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'nip', '-')
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        role = EXCLUDED.role,
        nama = EXCLUDED.nama,
        nip = EXCLUDED.nip;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SINKRONISASI AKUN LAMA: Memasukkan akun yang sudah pernah mendaftar ke public.users_role
INSERT INTO public.users_role (id, role, nama, nip)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'role', 'petugas'),
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    COALESCE(raw_user_meta_data->>'nip', '-')
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 6. AKTIFKAN SUPABASE REALTIME (WebSockets Streaming)
-- ==============================================================================
-- Mengaktifkan Realtime replication pada tabel chat_sessions dan chat_messages
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'chat_sessions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    END IF;
END $$;


-- ==============================================================================
-- 7. PENGATURAN ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 7.1. Kebijakan chat_sessions
DROP POLICY IF EXISTS "Allow public read chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow public insert chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow public update chat_sessions" ON public.chat_sessions;

CREATE POLICY "Allow public read chat_sessions"
    ON public.chat_sessions FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert chat_sessions"
    ON public.chat_sessions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update chat_sessions"
    ON public.chat_sessions FOR UPDATE
    TO anon, authenticated
    USING (true);

-- 7.2. Kebijakan chat_messages
DROP POLICY IF EXISTS "Allow public read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public insert chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public update chat_messages" ON public.chat_messages;

CREATE POLICY "Allow public read chat_messages"
    ON public.chat_messages FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert chat_messages"
    ON public.chat_messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update chat_messages"
    ON public.chat_messages FOR UPDATE
    TO anon, authenticated
    USING (true);

-- 7.3. Kebijakan templates
DROP POLICY IF EXISTS "Allow public read templates" ON public.templates;
DROP POLICY IF EXISTS "Allow admin manage templates" ON public.templates;

CREATE POLICY "Allow public read templates"
    ON public.templates FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Allow admin manage templates"
    ON public.templates FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7.4. Kebijakan staff_members (jika ada)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'staff_members') THEN
        ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow authenticated read staff_members" ON public.staff_members;
        CREATE POLICY "Allow authenticated read staff_members"
            ON public.staff_members FOR SELECT
            TO anon, authenticated
            USING (true);
    END IF;
END $$;


-- ==============================================================================
-- 8. SEED DATA DEFAULT TEMPLATES SOP KPP PRATAMA RENGAT (Upsert Aman)
-- ==============================================================================
INSERT INTO public.templates (id, category, title, priority, keywords, content, is_favorite, is_active)
VALUES
    ('TPL-EFIN-01', 'EFIN', 'Prosedur Lupa EFIN Wajib Pajak Orang Pribadi', 'P1', ARRAY['efin', 'lupa', 'aktivasi', 'reset'], 
     'Yth. Wajib Pajak,\n\nUntuk permohonan reset / lupa EFIN Orang Pribadi, silakan kirimkan email ke kpp.rengat@pajak.go.id dengan melampirkan:\n1. Scan / Foto KTP asli\n2. Swafoto (selfie) memegang KTP asli\n3. Nomor NPWP & Nomor HP aktif.\n\nPetugas kami akan memproses pada jam kerja operasional (08.00 - 16.00 WIB).', TRUE, TRUE),
    
    ('TPL-BILL-01', 'e-Billing', 'Pembuatan Kode Billing PPh Final UMKM (0,5%)', 'P2', ARRAY['billing', 'umkm', 'pph final', '0.5'], 
     'Yth. Wajib Pajak,\n\nUntuk pembuatan kode billing PPh Final UMKM (0.5%), Anda dapat mengakses portal Coretax atau menginformasikan:\n- NPWP / NIK:\n- Masa / Bulan Pembayaran:\n- Jumlah Omzet Bruto per Bulan:\n\nPetugas kami siap membantu menerbitkan kode billing Anda.', TRUE, TRUE),
     
    ('TPL-SPT-01', 'SPT', 'Batas Waktu & Konfirmasi Pelaporan SPT Tahunan', 'P2', ARRAY['spt', 'lapor', 'denda', 'batas'], 
     'Yth. Wajib Pajak,\n\nBatas akhir pelaporan SPT Tahunan Orang Pribadi adalah 31 Maret, dan Badan adalah 30 April. Pelaporan dapat dilakukan secara online melalui djponline.pajak.go.id. Pastikan Anda telah mengantongi bukti penerimaan elektronik (BPE).', FALSE, TRUE),
     
    ('TPL-NPWP-01', 'NPWP', 'Pendaftaran NPWP Online (e-Registration)', 'P3', ARRAY['npwp', 'daftar', 'ereg', 'baru'], 
     'Yth. Wajib Pajak,\n\nPendaftaran NPWP baru dilakukan mandiri secara online melalui tautan ereg.pajak.go.id. Siapkan NIK & Kartu Keluarga (KK) yang sudah valid di Dukcapil. Layanan ini GRATIS tanpa dipungut biaya apapun.', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE 
SET content = EXCLUDED.content, 
    title = EXCLUDED.title, 
    category = EXCLUDED.category,
    priority = EXCLUDED.priority,
    updated_at = NOW();

-- ==============================================================================
-- SELESAI. Skrip berhasil diperbarui dan siap dijalankan tanpa error konfik.
-- ==============================================================================
