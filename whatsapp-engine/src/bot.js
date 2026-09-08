import 'dotenv/config';
import fs from 'fs';
import path from 'path';
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

  // URL gambar presisi jika QR di terminal lonjong karena font Windows
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qr)}`;
  console.log('💡 TIPS: Jika QR di terminal lonjong atau sulit di-scan kamera HP:');
  console.log('👉 Buka file ini di browser Anda: file:///' + path.resolve('./scan-qr.html').replace(/\\/g, '/'));
  console.log('👉 Atau buka link gambar ini langsung:\n   ' + qrImageUrl + '\n');

  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Scan QR WhatsApp KPP Pratama Rengat</title>
  <style>
    body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 95vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f0f2f5; margin: 0; }
    .card { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); text-align: center; max-width: 420px; }
    h2 { color: #0b3954; margin-top: 0; margin-bottom: 8px; font-size: 20px; }
    p { color: #555; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
    img { width: 300px; height: 300px; border: 8px solid #fff; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.12); }
    .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
    .footer { font-size: 12px; color: #888; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">WhatsApp Business: +62 812-5000-213</div>
    <h2>Tautkan Perangkat WhatsApp</h2>
    <p>Buka WhatsApp Business di HP &gt; <b>Perangkat Tertaut</b> &gt; <b>Tautkan Perangkat</b>, lalu pindai kode di bawah ini:</p>
    <img src="${qrImageUrl}" alt="WhatsApp QR Code">
    <div class="footer">QR Code otomatis diperbarui setiap kali generate</div>
  </div>
</body>
</html>`;
    fs.writeFileSync(path.resolve('./scan-qr.html'), htmlContent);
  } catch (err) {
    // Abaikan jika error penulisan file
  }
});

client.on('authenticated', () => {
  console.log('✅ Otentikasi WhatsApp Berhasil!');
  try {
    if (fs.existsSync('./scan-qr.html')) fs.unlinkSync('./scan-qr.html');
  } catch (e) {}
});

client.on('auth_failure', (msg) => {
  console.error('❌ Gagal otentikasi WhatsApp:', msg);
});

let adminDispatcherChannel = null;

function setupAdminDispatcher() {
  if (adminDispatcherChannel) {
    return;
  }

  console.log('🎧 Memulai Real-time Listener balasan Admin dari Supabase...');

  adminDispatcherChannel = supabase
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
            const replyText = newMsg.text || newMsg.content;
            if (!replyText) {
              console.warn(`⚠️ Pesan kosong atau tidak memiliki field text/content untuk ${newMsg.session_id}`);
              return;
            }

            await client.sendMessage(recipientWaId, replyText);

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
}

client.on('ready', async () => {
  console.log('\n=============================================================');
  console.log('🚀 MESIN WHATSAPP BOT KPP PRATAMA RENGAT AKTIF & SIAP!');
  console.log('=============================================================\n');

  // ── 4. ALUR 2: SUPABASE -> WHATSAPP (RELAY BALASAN ADMIN) ──
  setupAdminDispatcher();
});

client.on('disconnected', (reason) => {
  console.warn('⚠️ WhatsApp client terputus:', reason);
  console.log('💡 Menghapus sesi lokal yang terputus agar bisa scan ulang dengan bersih...');
  try {
    if (fs.existsSync('./.wwebjs_auth')) {
      fs.rmSync('./.wwebjs_auth', { recursive: true, force: true });
    }
  } catch (e) {}
  console.log('👉 Silakan restart engine (npm start) untuk scan ulang QR code.');
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

  // Dapatkan nama Wajib Pajak dari kontak WhatsApp
  let wpName = 'Wajib Pajak';
  try {
    const contact = await msg.getContact();
    wpName = contact.pushname || contact.name || msg._data?.notifyName || 'Wajib Pajak';
  } catch (contactErr) {
    wpName = msg._data?.notifyName || 'Wajib Pajak';
  }

  console.log(`\n💬 Pesan masuk dari WP [${sessionId} - ${wpName}]: "${text}"`);

  try {
    // 1. Dapatkan atau buat sesi di Supabase
    let { data: session } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (!session) {
      console.log(`🆕 Membuat sesi baru untuk nomor WA: ${sessionId} (${wpName})`);
      const sessionPayload = {
        session_id: sessionId,
        channel: 'whatsapp',
        status: 'active',
        wp_name: wpName,
        primary_category: 'Konsultasi',
        message_count: 0,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let { data: newSession, error: sErr } = await supabase
        .from('chat_sessions')
        .insert(sessionPayload)
        .select()
        .maybeSingle();

      if (sErr) {
        if (sErr.message?.includes('wp_name')) {
          delete sessionPayload.wp_name;
          const retry = await supabase.from('chat_sessions').insert(sessionPayload).select().maybeSingle();
          newSession = retry.data;
        } else {
          console.error('❌ Gagal membuat sesi di Supabase:', sErr.message);
        }
      }
      session = newSession;
    } else if (wpName && wpName !== 'Wajib Pajak' && (!session.wp_name || session.wp_name === 'Wajib Pajak')) {
      await supabase
        .from('chat_sessions')
        .update({ wp_name: wpName, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId)
        .catch(() => {});
    }

    // 2. Simpan pesan Wajib Pajak ke chat_messages
    const userMsgPayload = {
      session_id: sessionId,
      role: 'user',
      text: text,
      content: text,
      message_status: 'received',
      created_at: new Date().toISOString(),
    };

    let { error: msgErr } = await supabase.from('chat_messages').insert(userMsgPayload);
    if (msgErr && msgErr.message?.includes('content')) {
      delete userMsgPayload.content;
      const retry = await supabase.from('chat_messages').insert(userMsgPayload);
      msgErr = retry.error;
    }
    if (msgErr) {
      console.error('❌ Gagal menyimpan pesan ke chat_messages:', msgErr.message);
    }

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
      const botMsgPayload = {
        session_id: sessionId,
        role: 'bot',
        text: answerResult.reply,
        content: answerResult.reply,
        category: answerResult.category || 'Konsultasi',
        priority: answerResult.priority || 'P3',
        message_status: 'sent_to_wa',
        created_at: new Date().toISOString(),
      };
      let { error: bErr } = await supabase.from('chat_messages').insert(botMsgPayload);
      if (bErr && bErr.message?.includes('content')) {
        delete botMsgPayload.content;
        await supabase.from('chat_messages').insert(botMsgPayload);
      }
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
        content: WA_MENU_GREETING,
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
      content: fallbackMsg,
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
client.initialize().catch((err) => {
  console.error('❌ Terjadi error saat inisialisasi WhatsApp client:', err.message);
  if (err.message.includes('Execution context was destroyed') || err.message.includes('Session closed')) {
    console.log('💡 Sesi WhatsApp sebelumnya terputus atau telah dikeluarkan dari HP.');
    console.log('💡 Menghapus sesi lama yang rusak...');
    try {
      if (fs.existsSync('./.wwebjs_auth')) {
        fs.rmSync('./.wwebjs_auth', { recursive: true, force: true });
      }
    } catch (e) {}
    console.log('👉 Silakan jalankan ulang "npm start" untuk scan QR baru.');
  }
});
