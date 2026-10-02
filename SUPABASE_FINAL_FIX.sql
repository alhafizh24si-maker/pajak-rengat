-- ==============================================================================
-- SUPABASE_FINAL_FIX.sql
-- Fix untuk Error Supabase di Web Chatbot KPP Pratama Rengat
-- Cara Pakai: Copy semua kode ini, lalu Run di Supabase > SQL Editor > New Query
-- ==============================================================================

-- 0. HAPUS VIEW YANG BERGANTUNG PADA KOLOM session_id
DROP VIEW IF EXISTS public.chat_metrics_daily CASCADE;

DO $$
BEGIN
    -- 1. HAPUS SEMUA KENDALA (CONSTRAINT) YANG BIKIN ERROR
    
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_schema = 'public' AND table_name = 'chat_messages' AND constraint_name = 'valid_category'
    ) THEN
        ALTER TABLE public.chat_messages DROP CONSTRAINT valid_category;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_schema = 'public' AND table_name = 'chat_messages' AND constraint_name = 'valid_message_status'
    ) THEN
        ALTER TABLE public.chat_messages DROP CONSTRAINT valid_message_status;
    END IF;

    -- 2. UBAH TIPE DATA session_id MENJADI TEXT
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_schema = 'public' AND table_name = 'chat_messages' AND constraint_name = 'chat_messages_session_id_fkey'
    ) THEN
        ALTER TABLE public.chat_messages DROP CONSTRAINT chat_messages_session_id_fkey;
    END IF;

    ALTER TABLE public.chat_sessions ALTER COLUMN session_id TYPE TEXT USING session_id::text;
    ALTER TABLE public.chat_messages ALTER COLUMN session_id TYPE TEXT USING session_id::text;

    -- 3. UBAH TIPE DATA template_id MENJADI TEXT
    -- Hapus FK untuk template_id terlebih dahulu jika ada
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_schema = 'public' AND table_name = 'chat_messages' AND constraint_name = 'chat_messages_template_id_fkey'
    ) THEN
        ALTER TABLE public.chat_messages DROP CONSTRAINT chat_messages_template_id_fkey;
    END IF;

    ALTER TABLE public.chat_messages ALTER COLUMN template_id TYPE TEXT USING template_id::text;

    -- 4. Pasang kembali Foreign Key untuk session_id saja
    ALTER TABLE public.chat_messages 
        ADD CONSTRAINT chat_messages_session_id_fkey 
        FOREIGN KEY (session_id) REFERENCES public.chat_sessions(session_id) ON DELETE CASCADE;
END $$;

-- 5. RECREATE VIEW SETELAH TIPE DATA BERUBAH
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

NOTIFY pgrst, 'reload schema';
