import 'dotenv/config';
import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { createClient } from '@supabase/supabase-js';
import { WA_MENU_GREETING, findAnswer } from './knowledge.js';

// ── 1. KONFIGURASI SUPABASE ──
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi di file .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 10 } },
});

console.log('🔗 Menghubungkan ke Supabase:', supabaseUrl);

// ── 2. INISIALISASI WHATSAPP CLIENT ──
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth',
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  },
});

// Helper format ID WhatsApp
function formatToWhatsAppId(rawPhone) {
  let cleaned = rawPhone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  if (!cleaned.endsWith('@c.us')) {
    cleaned = cleaned + '@c.us';
  }
  return cleaned;
}

function cleanSessionId(waId) {
  return waId.replace('@c.us', '');
}

// ── 3. EVENT HANDLERS WHATSAPP ──

// Tampilkan QR Code di terminal untuk scan pertama kali
client.on('qr', (qr) => {
  console.log('\n=============================================================');
  console.log('📲 SCAN QR CODE INI MENGGUNAKAN WHATSAPP KPP PRATAMA RENGAT:');
  console.log('=============================================================\n');
  qrcode.generate(qr, { small: true });
  console.log('\nBuka WhatsApp di HP > Perangkat Tertaut > Tautkan Perangkat\n');
});

client.on('authenticated', () => {
  console.log('✅ Otentikasi WhatsApp Berhasil!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Gagal otentikasi WhatsApp:', msg);
});

client.on('ready', async () => {
  console.log('\n=============================================================');
  console.log('🚀 MESIN WHATSAPP BOT KPP PRATAMA RENGAT AKTIF & SIAP!');
  console.log('=============================================================\n');

  // ── 4. ALUR 2: SUPABASE -> WHATSAPP (RELAY BALASAN ADMIN) ──
  console.log('🎧 Memulai Real-time Listener balasan Admin dari Supabase...');

  supabase
    .channel('wa-admin-dispatcher')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'role=eq.admin',
      },
      async (payload) => {
        const newMsg = payload.new;
        if (!newMsg || !newMsg.session_id) return;

        console.log(`\n📨 Balasan Admin diterima dari Dashboard untuk sesi: ${newMsg.session_id}`);

        try {
          // 1. Cek kanal sesi ini di chat_sessions
          const { data: session } = await supabase
            .from('chat_sessions')
            .select('channel')
            .eq('session_id', newMsg.session_id)
            .maybeSingle();

          // Hanya kirim jika kanal adalah WhatsApp
          if (session && session.channel === 'whatsapp') {
            const recipientWaId = formatToWhatsAppId(newMsg.session_id);
            console.log(`📤 Mengirim pesan ke nomor WA: ${recipientWaId}`);

            // Kirim via WhatsApp Web API
            await client.sendMessage(recipientWaId, newMsg.text);

            // Perbarui status pesan di Supabase
            await supabase
              .from('chat_messages')
              .update({ message_status: 'sent_to_wa' })
              .eq('id', newMsg.id);

            console.log(`✅ Pesan berhasil dikirim ke Wajib Pajak (${recipientWaId}) & status diperbarui.`);
          }
        } catch (err) {
          console.error(`❌ Gagal mengirim balasan ke WhatsApp (${newMsg.session_id}):`, err);
        }
      }
    )
    .subscribe((status) => {
      console.log(`📡 Status Realtime Supabase Dispatcher: ${status}`);
    });
});

// ── 5. ALUR 1: WHATSAPP -> SUPABASE (PESAN MASUK DARI WAJIB PAJAK) ──
client.on('message', async (msg) => {
  // Abaikan pesan dari grup WhatsApp, broadcast status, atau pesan dari bot sendiri
  if (msg.from.includes('@g.us') || msg.from === 'status@broadcast' || msg.fromMe) {
    return;
  }

  const rawSender = msg.from;
  const sessionId = cleanSessionId(rawSender);
  const text = msg.body?.trim();

  if (!text) return;

  console.log(`\n💬 Pesan masuk dari WP [${sessionId}]: "${text}"`);

  try {
    // 1. Dapatkan atau buat sesi di Supabase
    let { data: session } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (!session) {
      console.log(`🆕 Membuat sesi baru untuk nomor WA: ${sessionId}`);
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({
          session_id: sessionId,
          channel: 'whatsapp',
          status: 'active',
          primary_category: 'Konsultasi',
          message_count: 0,
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      session = newSession;
    }

    // 2. Simpan pesan Wajib Pajak ke chat_messages
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      text: text,
      message_status: 'received',
      created_at: new Date().toISOString(),
    });

    // Perbarui jumlah pesan di sesi
    await supabase
      .from('chat_sessions')
      .update({
        message_count: (session?.message_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);

    // 3. Logika Auto-Responder & Eskalasi Cerdas
    // Jika sesi saat ini berstatus 'escalated', jangan dibalas oleh bot (berikan ke petugas)
    if (session?.status === 'escalated') {
      console.log(`⏳ Sesi ${sessionId} sedang berstatus ESKALASI. Menunggu balasan manual Petugas.`);
      return;
    }

    // Cari jawaban di database pengetahuan
    const answerResult = findAnswer(text);

    if (answerResult) {
      if (answerResult.type === 'ESCALATION') {
        // Tandai status sesi sebagai 'escalated'
        await supabase
          .from('chat_sessions')
          .update({
            status: 'escalated',
            updated_at: new Date().toISOString(),
          })
          .eq('session_id', sessionId);

        console.log(`⚠️ Sesi ${sessionId} dieskalasi ke Petugas.`);
      }

      // Kirim balasan ke WA
      await client.sendMessage(rawSender, answerResult.reply);

      // Simpan balasan bot ke chat_messages
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'bot',
        text: answerResult.reply,
        category: answerResult.category || 'Konsultasi',
        priority: answerResult.priority || 'P3',
        message_status: 'sent_to_wa',
        created_at: new Date().toISOString(),
      });
      return;
    }

    // Jika kata kunci umum sapaan (halo, menu, bantuan, dll)
    const lower = text.toLowerCase();
    const isGreeting = ['halo', 'hai', 'pagi', 'siang', 'sore', 'malam', 'menu', 'bantuan', 'info'].some(
      (k) => lower === k || lower.startsWith(k)
    );

    if (isGreeting) {
      await client.sendMessage(rawSender, WA_MENU_GREETING);

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'bot',
        text: WA_MENU_GREETING,
        category: 'Menu',
        priority: 'P4',
        message_status: 'sent_to_wa',
        created_at: new Date().toISOString(),
      });
      return;
    }

    // Default Fallback jika pertanyaan tidak dikenali:
    const fallbackMsg = `Terima kasih telah menghubungi KPP Pratama Rengat.\n\nPertanyaan Anda belum dikenali oleh asisten otomatis kami.\n\n` + WA_MENU_GREETING;

    await client.sendMessage(rawSender, fallbackMsg);

    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'bot',
      text: fallbackMsg,
      category: 'Unmatched',
      priority: 'P4',
      message_status: 'sent_to_wa',
      created_at: new Date().toISOString(),
    });

  } catch (err) {
    console.error(`❌ Terjadi error saat memproses pesan dari ${sessionId}:`, err);
  }
});

// Jalankan klien WhatsApp
console.log('🚀 Memulai WhatsApp Engine...');
client.initialize();
