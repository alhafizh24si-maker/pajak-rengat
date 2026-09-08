-- ==============================================================================
-- SKRIP PERBAIKAN STRUKTUR TABEL & INTEGRASI REALTIME SUPABASE
-- KPP PRATAMA RENGAT — HELPDESK & WHATSAPP OMNICHANNEL
-- ==============================================================================
-- Jalankan skrip ini di:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Proyek: kpp-rengat
-- 3. Klik menu "SQL Editor" (ikon >_ di sidebar kiri)
-- 4. Klik "New query", salin dan tempel semua kode di bawah ini, lalu klik "Run"
-- ==============================================================================

-- 1. UPDATE TABEL CHAT_SESSIONS
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS wp_name TEXT DEFAULT NULL;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'web';
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS primary_category TEXT DEFAULT 'Lainnya';
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS matched_count INTEGER DEFAULT 0;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS unmatched_count INTEGER DEFAULT 0;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

-- Perbarui Constraint Status & Channel agar mendukung 'whatsapp' dan 'escalated'
ALTER TABLE public.chat_sessions DROP CONSTRAINT IF EXISTS chat_sessions_channel_check;
ALTER TABLE public.chat_sessions ADD CONSTRAINT chat_sessions_channel_check 
    CHECK (channel IN ('web', 'whatsapp', 'web_widget'));

ALTER TABLE public.chat_sessions DROP CONSTRAINT IF EXISTS chat_sessions_status_check;
ALTER TABLE public.chat_sessions ADD CONSTRAINT chat_sessions_status_check 
    CHECK (status IN ('active', 'escalated', 'resolved', 'unmatched'));

CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_channel ON public.chat_sessions(channel);


-- 2. UPDATE TABEL CHAT_MESSAGES
-- Lepaskan view yang bergantung pada kolom session_id terlebih dahulu
DROP VIEW IF EXISTS public.chat_metrics_daily CASCADE;

-- Lepaskan foreign key lama jika ada constraint UUID
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_session_id_fkey;

-- Ubah tipe kolom session_id dari UUID menjadi TEXT agar menerima nomor WhatsApp & ID Sesi Web
ALTER TABLE public.chat_messages ALTER COLUMN session_id TYPE TEXT USING session_id::text;

-- Tambahkan kolom-kolom baru jika belum ada
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS message_status TEXT DEFAULT 'received';
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS is_template_used BOOLEAN DEFAULT FALSE;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT NULL;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

-- PENTING: Dukungan role 'admin' untuk balasan petugas
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_role_check;
ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_role_check 
    CHECK (role IN ('user', 'bot', 'admin', 'system'));

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON public.chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);


-- 3. AKTIFKAN REPLIKASI REALTIME SUPABASE
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


-- 4. ATUR KEBIJAKAN ROW LEVEL SECURITY (RLS) AGAR BISA DIAKSES DASHBOARD
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow all insert chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow all update chat_sessions" ON public.chat_sessions;

CREATE POLICY "Allow all read chat_sessions" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Allow all insert chat_sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update chat_sessions" ON public.chat_sessions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow all insert chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow all update chat_messages" ON public.chat_messages;

CREATE POLICY "Allow all read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow all insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update chat_messages" ON public.chat_messages FOR UPDATE USING (true);


-- 5. RE-CREATE VIEW CHAT_METRICS_DAILY
CREATE OR REPLACE VIEW public.chat_metrics_daily AS
SELECT
    DATE(cs.started_at) AS metric_date,
    COALESCE(cs.primary_category, 'Lainnya') AS category,
    COUNT(DISTINCT cs.session_id) AS total_chats,
    COUNT(DISTINCT CASE WHEN cs.status = 'resolved' THEN cs.session_id END) AS resolved_chats,
    COALESCE(AVG(cs.first_response_ms) / 1000.0, 0) AS avg_first_response_seconds,
    COALESCE(AVG(cs.resolution_time_ms) / 1000.0, 0) AS avg_resolution_seconds,
    COALESCE(AVG(cs.csat_rating), 0) AS avg_csat,
    COALESCE(SUM(CASE WHEN cm.is_template_used THEN 1 ELSE 0 END), 0) AS template_usage_count
FROM public.chat_sessions cs
LEFT JOIN public.chat_messages cm ON cm.session_id = cs.session_id
GROUP BY DATE(cs.started_at), COALESCE(cs.primary_category, 'Lainnya');

