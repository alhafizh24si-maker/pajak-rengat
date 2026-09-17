-- ==============================================================================
-- SUPABASE_CHAT_FIX.sql
-- Fix untuk Fitur Chat Admin <-> Pelanggan (Web & WhatsApp)
-- KPP Pratama Rengat -- Run di: Supabase Dashboard > SQL Editor > New Query
-- ==============================================================================


-- FIX 1: Hapus foreign key constraint dulu, lalu ubah template_id ke TEXT
-- Error: "foreign key constraint chat_messages_template_id_fkey cannot be implemented"
-- DETAIL: Key columns "template_id" and "id" are of incompatible types: text and uuid
DO $$
BEGIN
    -- Drop foreign key constraint jika ada
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_schema = 'public'
          AND table_name = 'chat_messages'
          AND constraint_name = 'chat_messages_template_id_fkey'
    ) THEN
        ALTER TABLE public.chat_messages
            DROP CONSTRAINT chat_messages_template_id_fkey;
        RAISE NOTICE 'FK constraint chat_messages_template_id_fkey dihapus';
    END IF;

    -- Drop constraint lain yang mungkin ada dengan nama berbeda
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu
            ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_schema = 'public'
          AND tc.table_name = 'chat_messages'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND ccu.column_name = 'template_id'
    ) THEN
        EXECUTE (
            SELECT 'ALTER TABLE public.chat_messages DROP CONSTRAINT ' || tc.constraint_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu
                ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_schema = 'public'
              AND tc.table_name = 'chat_messages'
              AND tc.constraint_type = 'FOREIGN KEY'
              AND ccu.column_name = 'template_id'
            LIMIT 1
        );
        RAISE NOTICE 'FK constraint lain pada template_id dihapus';
    END IF;

    -- Sekarang ubah tipe kolom template_id ke TEXT
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'chat_messages'
          AND column_name = 'template_id'
          AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.chat_messages
            ALTER COLUMN template_id TYPE TEXT USING template_id::text;
        RAISE NOTICE 'template_id berhasil dikonversi UUID -> TEXT';
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'chat_messages'
          AND column_name = 'template_id'
    ) THEN
        ALTER TABLE public.chat_messages ADD COLUMN template_id TEXT DEFAULT NULL;
        RAISE NOTICE 'Kolom template_id ditambahkan sebagai TEXT';
    ELSE
        RAISE NOTICE 'template_id sudah TEXT - tidak diubah';
    END IF;
END $$;


-- FIX 2: REPLICA IDENTITY FULL -- Wajib agar Realtime filter "role=eq.admin"
-- berfungsi di WhatsApp engine (bot.js setupAdminDispatcher)
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_sessions REPLICA IDENTITY FULL;


-- FIX 3: Pastikan Realtime replication aktif untuk kedua tabel
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'chat_sessions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
    END IF;
END $$;


-- FIX 4: Pastikan constraint role menerima 'admin'
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_role_check;
ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_role_check
    CHECK (role IN ('user', 'bot', 'admin', 'system'));


-- FIX 5: RLS policy yang mengizinkan semua operasi
DROP POLICY IF EXISTS "Allow all insert chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow all read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow all update chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public insert chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public update chat_messages" ON public.chat_messages;

CREATE POLICY "Allow all read chat_messages"
    ON public.chat_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow all insert chat_messages"
    ON public.chat_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update chat_messages"
    ON public.chat_messages FOR UPDATE TO anon, authenticated USING (true);


-- FIX 6: Perbaiki check constraint valid_message_status
-- Error: "new row for relation chat_messages violates check constraint valid_message_status"
-- Diperlukan agar status 'pending_to_wa' dan 'sent_to_wa' dapat disimpan saat admin membalas WA
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS valid_message_status;
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_message_status_check;
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_status_check;

ALTER TABLE public.chat_messages ADD CONSTRAINT valid_message_status
    CHECK (message_status IS NULL OR message_status IN ('received', 'sent', 'pending', 'pending_to_wa', 'sent_to_wa', 'delivered', 'read', 'failed'));


-- VERIFIKASI -- Lihat struktur kolom & constraint chat_messages
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'chat_messages'
ORDER BY ordinal_position;

