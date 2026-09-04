# Mesin WhatsApp Bot & Relay Helpdesk KPP Pratama Rengat

Layanan backend Node.js mandiri yang berfungsi sebagai **Mesin WhatsApp Bot Otomatis** sekaligus **Jembatan Dua Arah (Omnichannel Relay)** antara pengguna WhatsApp Wajib Pajak dan Dashboard Petugas Admin berbasis Supabase.

---

## 🎯 Cara Kerja Arsitektur

```
[ Wajib Pajak (WhatsApp) ] 
       ↕ (whatsapp-web.js)
[ whatsapp-engine (Node.js) ]
       ↕ (Supabase Realtime WebSockets)
[ Database Supabase ]
       ↕ (React Vite Dashboard)
[ Petugas KPP (Admin Dasbor) ]
```

1. **Pesan Masuk (WA -> Web)**:
   - Wajib Pajak mengirim chat WA ke nomor bot KPP.
   - Node.js menangkap pesan, menyimpan ke tabel `chat_sessions` & `chat_messages` di Supabase (`channel: whatsapp`, `role: user`).
   - Sinyal Supabase Realtime otomatis memunculkan bubble chat baru di Dasbor Petugas tanpa refresh.
   - Jika pengguna bertanya topik standar (1-5), bot membalas secara otomatis.
   - Jika pengguna memilih menu *6 (Hubungi Petugas)*, status sesi otomatis berubah menjadi `escalated` dan bot berhenti membalas agar percakapan ditangani penuh oleh Petugas.

2. **Balasan Petugas (Web -> WA)**:
   - Petugas mengetik balasan di Dasbor React dan menekan tombol "Kirim".
   - Balasan tersimpan ke tabel `chat_messages` dengan `role: admin`.
   - Node.js mendengarkan perubahan realtime Supabase, mendeteksi balasan untuk sesi WhatsApp, dan menembakkannya langsung ke nomor WhatsApp Wajib Pajak via `client.sendMessage()`.
   - Status pesan diperbarui menjadi `sent_to_wa`.

---

## 🛠️ Persyaratan Sistem

- **Node.js**: Versi 18 atau lebih baru.
- **NPM**: Versi 9 atau lebih baru.
- **Akun WhatsApp**: Nomor WhatsApp resmi KPP Pratama Rengat yang akan dijadikan bot.
- **Supabase**: Proyek Supabase aktif dengan skema dari file `supabase_schema.sql`.

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Masuk ke Folder Mesin
```bash
cd c:\pajak-rengat\whatsapp-engine
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Konfigurasi Lingkungan (.env)
Pastikan file `.env` sudah terisi dengan kredensial Supabase Anda:
```env
SUPABASE_URL=https://bwgiqpxahfivahqqhrdu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BOT_NAME="Asisten Virtual KPP Pratama Rengat"
AUTO_REPLY_ENABLED=true
```
*(Catatan: Sebaiknya gunakan **Service Role Key** dari Dashboard Supabase -> Project Settings -> API agar backend memiliki hak akses menyeluruh melewati batasan RLS).*

### 4. Jalankan Mesin WhatsApp
```bash
npm start
```

### 5. Pindai QR Code
Terminal akan memunculkan QR Code ASCII.
1. Buka aplikasi WhatsApp di HP Admin/KPP.
2. Buka menu **Perangkat Tertaut (Linked Devices)** > **Tautkan Perangkat (Link a Device)**.
3. Arahkan kamera HP ke QR Code pada layar terminal.
4. Begitu terhubung, sesi akan tersimpan di folder `.wwebjs_auth/` sehingga tidak perlu scan ulang setiap kali restart.

---

## 🌐 Panduan Deployment di VPS (Linux / Ubuntu 24.04 / Debian)

Untuk menjalankan mesin 24 jam non-stop di VPS atau server lokal:

### 1. Instalasi Dependensi Chromium di Linux
Puppeteer membutuhkan beberapa pustaka sistem grafis di Linux:
```bash
sudo apt-get update
sudo apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
  libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
  libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
  libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
  libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev
```

### 2. Instalasi PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Menjalankan dengan PM2
```bash
cd /path/to/pajak-rengat/whatsapp-engine
npm install
pm2 start src/bot.js --name "kpp-wa-bot"
pm2 save
pm2 startup
```

### 4. Melihat Log & QR Code di VPS
```bash
pm2 logs kpp-wa-bot
```
Pindai QR code yang tampil di log PM2.

---

## 📋 Struktur Menu Bot WhatsApp

| Input | Aksi Bot |
|---|---|
| `1` | Menampilkan sub-menu Billing PPh Tanah & UMKM |
| `1A` | Format permohonan billing PPh Tanah (PHTB) |
| `1B` | Format permohonan billing PPh Final UMKM 0.5% |
| `1C` | Panduan penanganan Bukti Bayar (BPN) hilang |
| `2` | Panduan pelaporan SPT Masa PPN (PKP) |
| `3` | Informasi Surat Keterangan Bebas (SKB) |
| `4` | Syarat & format pengubahan Email & Nomor HP |
| `5` | Solusi kendala Coretax & Pendaftaran NPWP |
| `6` atau `petugas` | **Eskalasi ke Petugas** (Bot berhenti auto-reply untuk nomor ini) |
