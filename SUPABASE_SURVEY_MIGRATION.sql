-- ==============================================================================
-- MIGRASI INDEKS KEPUASAN MASYARAKAT (IKM / CSAT) — KPP PRATAMA RENGAT
-- Standar Evaluasi Pelayanan Publik KemenPAN-RB / DJP
-- ==============================================================================

-- 1. Tambahkan kolom csat_rating, feedback, dan rated_at pada tabel chat_sessions
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS csat_rating NUMERIC DEFAULT NULL;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS feedback TEXT DEFAULT NULL;
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS rated_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Tambahkan check constraint untuk rentang nilai rating 1 sampai 5 (jika belum ada)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
          AND table_name = 'chat_sessions' 
          AND constraint_name = 'chat_sessions_csat_rating_check'
    ) THEN
        ALTER TABLE public.chat_sessions 
        ADD CONSTRAINT chat_sessions_csat_rating_check 
        CHECK (csat_rating IS NULL OR (csat_rating >= 1 AND csat_rating <= 5));
    END IF;
END $$;

-- 3. Indeks performa untuk analitik IKM
CREATE INDEX IF NOT EXISTS idx_chat_sessions_csat ON public.chat_sessions(csat_rating) WHERE csat_rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_sessions_rated_at ON public.chat_sessions(rated_at DESC) WHERE rated_at IS NOT NULL;

-- 4. Perbarui View Analitik Harian (Gunakan DROP VIEW terlebih dahulu agar urutan kolom baru aman dari error 42P16)
DROP VIEW IF EXISTS public.chat_metrics_daily CASCADE;

CREATE VIEW public.chat_metrics_daily AS
SELECT
    DATE(cs.started_at) AS metric_date,
    COALESCE(cs.primary_category, 'Lainnya') AS category,
    COUNT(DISTINCT cs.session_id) AS total_chats,
    COUNT(DISTINCT CASE WHEN cs.status = 'resolved' THEN cs.session_id END) AS resolved_chats,
    COALESCE(AVG(cs.first_response_ms) / 1000.0, 0) AS avg_first_response_seconds,
    COALESCE(AVG(cs.resolution_time_ms) / 1000.0, 0) AS avg_resolution_seconds,
    COALESCE(AVG(cs.csat_rating), 0) AS avg_csat,
    COALESCE(SUM(CASE WHEN cm.is_template_used THEN 1 ELSE 0 END), 0) AS template_usage_count,
    COUNT(DISTINCT CASE WHEN cs.csat_rating IS NOT NULL THEN cs.session_id END) AS total_surveys
FROM public.chat_sessions cs
LEFT JOIN public.chat_messages cm ON cm.session_id = cs.session_id
GROUP BY DATE(cs.started_at), COALESCE(cs.primary_category, 'Lainnya');

-- 5. Reload Schema PostgREST Supabase
NOTIFY pgrst, 'reload schema';
