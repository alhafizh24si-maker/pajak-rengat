import Fuse from 'fuse.js';

// ─── KNOWLEDGE BASE ───
export const knowledgeBase = [
  {
    id: 'kb-menu-main',
    keywords: ['menu', 'pilihan', 'layanan', 'bantuan', 'opsi', 'start'],
    answer: `Selamat datang di layanan Chatbot KPP Pratama Rengat 👋

Silakan ketik angka menu atau pilih tombol di bawah ini:

1️⃣ Kode Billing PPh Tanah / UMKM
2️⃣ Pelaporan SPT Masa PPN (PKP)
3️⃣ Status & Pengambilan SKB
4️⃣ Update Email & Nomor HP
5️⃣ Kendala Coretax & Pendaftaran NPWP
6️⃣ Hubungi Petugas`,
    topic: 'MENU_UTAMA',
    category: 'Konsultasi',
    priority: 'P4',
  },
  {
    id: 'kb-menu-1',
    keywords: ['1', 'menu 1', 'pilihan 1'],
    answer: `📌 Layanan Kode Billing Pajak

Silakan ketik kode menu pilihan Anda:

• 1A : PPh Tanah / Jual Beli (PHTB)
• 1B : PPh Final UMKM (0,5%)
• 1C : Kehilangan Bukti Bayar / Cetak BPN`,
    topic: 'MENU_BILLING',
    category: 'e-Billing',
    priority: 'P3',
  },
  {
    id: 'kb-menu-1a',
    keywords: ['1a', 'phtb', 'billing pph tanah', 'jual beli tanah', 'kode billing pph', 'nominal billing', 'revisi billing'],
    answer: `📌 Permohonan Kode Billing PPh Tanah (PHTB)

Silakan salin, lengkapi, dan kirimkan format data berikut:

• Nama Wajib Pajak:
• NIK (tanpa tanda baca):
• NOP (tanpa tanda baca):
• Alamat Objek Pajak:
• Masa Pembayaran:
• Nominal PPh:

Catatan: Petugas kami akan segera memproses kode billing Anda setelah data dikirimkan.`,
    topic: 'BILLING_PHTB',
    category: 'e-Billing',
    priority: 'P2',
  },
  {
    id: 'kb-menu-1b',
    keywords: ['1b', 'billing umkm', 'pph umkm', 'buatin billing umkm', 'buat billing pph final'],
    answer: `📌 Permohonan Kode Billing PPh Final UMKM (0,5%)

Silakan salin dan lengkapi data di bawah ini:

• Nama Wajib Pajak:
• NPWP / NIK:
• Masa / Bulan Pajak:
• Nominal Omzet / PPh:

💡 Tips: Anda juga dapat membuat kode billing secara mandiri melalui portal Coretax.`,
    topic: 'BILLING_UMKM',
    category: 'e-Billing',
    priority: 'P3',
  },
  {
    id: 'kb-menu-1c',
    keywords: ['1c', 'hilang bukti bayar', 'bukti bayar pph tanah', 'bpn hilang', 'cetak bpn'],
    answer: `📌 Penanganan Bukti Bayar (BPN) Hilang

Jika Anda kehilangan Bukti Penerimaan Negara (BPN):

1. Cetak Mandiri: Login ke portal Coretax, lalu unduh dokumen di menu Riwayat Pembayaran.
2. Bantuan Petugas: Informasikan NIK/NPWP dan Tanggal Pembayaran kepada kami untuk dilakukan pelacakan.`,
    topic: 'BUKTI_BAYAR',
    category: 'e-Billing',
    priority: 'P3',
  },
  {
    id: 'kb-menu-2',
    keywords: ['2', 'menu 2', 'pilihan 2', 'lapor pkp', 'lapor spt ppn', 'denda 500rb', 'ppn bulanan coretax'],
    answer: `📌 Pelaporan SPT Masa PPN (PKP)

Pelaporan SPT Masa PPN dilakukan secara elektronik setiap bulan melalui portal Coretax pada navigasi berikut:

👉 Surat Pemberitahuan > Konsep SPT > PPN

⚠️ Perhatian: Laporkan SPT tepat waktu untuk menghindari sanksi denda administrasi.`,
    topic: 'SPT_PPN_PKP',
    category: 'SPT',
    priority: 'P2',
  },
  {
    id: 'kb-menu-3',
    keywords: ['3', 'menu 3', 'pilihan 3', 'skb', 'surat keterangan bebas', 'status skb', 'pengambilan skb', 'skb selesai'],
    answer: `📌 Informasi Surat Keterangan Bebas (SKB)

• Jangka Waktu: Maksimal 3 hari kerja sejak berkas diterima lengkap.
• Pengambilan Fisik: Datang ke KPP Pratama Rengat dengan membawa Bukti Penerimaan Surat (BPS).
• Layanan Online: Wajib Pajak yang berdomisili jauh dapat menerima dokumen via pesan WhatsApp setelah verifikasi data selesai.`,
    topic: 'SKB',
    category: 'Layanan',
    priority: 'P3',
  },
  {
    id: 'kb-menu-4',
    keywords: ['4', 'menu 4', 'pilihan 4', 'ubah no hp', 'ganti email', 'verifikasi identitas', 'swafoto ktp', 'akun didaftarkan bank'],
    answer: `📌 Pengubahan Email & Nomor HP Terdaftar

Untuk pembaruan data kontak atau pemulihan akun, kirimkan persyaratan berikut:

1. Nomor NIK / NPWP:
2. Nama Lengkap:
3. Email Baru (Aktif):
4. Nomor HP Baru (Aktif):

⚠️ Wajib Lampirkan: Foto KTP fisik dan Foto Selfie (Swafoto) memegang KTP untuk verifikasi identitas.`,
    topic: 'UPDATE_PROFIL',
    category: 'Profil',
    priority: 'P2',
  },
  {
    id: 'kb-menu-5',
    keywords: ['5', 'menu 5', 'pilihan 5', 'seksi pengawasan kosong', 'maps coretax', 'titik lokasi coretax', 'kendala npwp coretax'],
    answer: `📌 Solusi Kendala Seksi Pengawasan Kosong (Coretax)

Jika kolom Seksi Pengawasan tidak muncul saat pendaftaran NPWP:

• Pastikan Anda telah mengklik dan menentukan titik lokasi alamat pada Peta (Maps) yang tersedia.
• Setelah titik lokasi sesuai, Seksi Pengawasan akan terisi secara otomatis oleh sistem.`,
    topic: 'CORETAX_MAPS',
    category: 'NPWP',
    priority: 'P3',
  },
  {
    id: 'kb-menu-6',
    keywords: ['6', 'menu 6', 'pilihan 6', 'hubungi petugas', 'tanya petugas', 'human'],
    answer: `🎧 Layanan Helpdesk KPP Pratama Rengat

Menghubungkan Anda ke petugas kami...

Silakan tuliskan kendala atau pertanyaan Anda secara lengkap. Petugas kami akan segera membalas pesan Anda.`,
    topic: 'HUMAN_SERVICE',
    category: 'Konsultasi',
    priority: 'P2',
  },
  {
    id: 'kb-001',
    keywords: ['daftar npwp', 'registrasi npwp', 'buat npwp', 'cara npwp', 'permohonan npwp', 'npwp baru', 'aktivasi npwp'],
    answer: `📌 Panduan Pendaftaran NPWP Baru

Langkah-langkah pendaftaran:
1. Kunjungi situs ereg.pajak.go.id
2. Pilih menu Daftar dan isi data diri (NIK, Nama, Alamat)
3. Unggah foto KTP dan Swafoto
4. Kirim permohonan dan tunggu konfirmasi

• Syarat: KTP (WNI) atau KITAS/KITAP (WNA)
• Waktu Verifikasi: 1–3 hari kerja`,
    topic: 'NPWP',
    category: 'NPWP',
    priority: 'P3',
  },
  {
    id: 'kb-002',
    keywords: ['lapor spt', 'spt tahunan', 'batas spt', 'deadline spt', 'lupa lapor spt', 'efiling spt', 'spt pribadi', 'spt badan'],
    answer: `📌 Informasi SPT Tahunan

Batas Waktu Pelaporan:
• Orang Pribadi: Paling lambat 31 Maret
• Badan: Paling lambat 30 April

Langkah Pelaporan:
1. Login ke djponline.pajak.go.id
2. Pilih menu e-Filing > Isi Formulir SPT
3. Kirim SPT dan simpan Bukti Penerimaan Elektronik (BPE)`,
    topic: 'SPT',
    category: 'SPT',
    priority: 'P3',
  },
  {
    id: 'kb-004',
    keywords: ['lupa efin', 'efin hilang', 'reset efin', 'aktivasi efin', 'nomor efin', 'permohonan efin'],
    answer: `📌 Layanan Lupa / Lapor EFIN

Pilihan kanal bantuan EFIN:
• Email: Kirim permohonan ke lupa.efin@pajak.go.id (lampirkan KTP & NPWP)
• Telepon: Kring Pajak di nomor 1500200
• Tatap Muka: Datang langsung ke TPT KPP Pratama Rengat`,
    topic: 'EFIN',
    category: 'EFIN',
    priority: 'P2',
  },
  {
    id: 'kb-023',
    keywords: ['pembatalan stp', 'stp tidak benar', 'batal stp'],
    answer: `📌 Pengajuan Pembatalan STP Tidak Benar

Pengajuan pembatalan Surat Tagihan Pajak (STP) dapat diajukan secara online melalui portal Coretax:

👉 Layanan Wajib Pajak > Permohonan > Pembatalan Produk Hukum (STP Tidak Benar)`,
    topic: 'STP_CANCEL',
    category: 'Coretax',
    priority: 'P2',
  },
  {
    id: 'kb-024',
    keywords: ['cek nitku', 'nitku pt', 'nomor nitku badan'],
    answer: `📌 Pengecekan Nomor NITKU Badan / Perusahaan

Silakan informasikan data berikut untuk pengecekan data:

• NPWP Perusahaan (15/16 Digit):
• Nama Perusahaan / PT:

Petugas kami akan melakukan pengecekan pada database sistem.`,
    topic: 'NITKU',
    category: 'Layanan',
    priority: 'P3',
  }
];

// ─── FUSE.JS CONFIGURATION ───
const fuseOptions = {
  keys: ['keywords'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1,
  shouldSort: true,
};

export const fuse = new Fuse(knowledgeBase, fuseOptions);

// ─── CATEGORY DETECTION ───
export const detectCategory = (text) => {
  const lower = text.toLowerCase().trim();
  if (['1', '1a', '1b', '1c'].includes(lower) || lower.includes('billing') || lower.includes('phtb') || lower.includes('bpn')) return 'e-Billing';
  if (['2'].includes(lower) || lower.includes('spt') || lower.includes('ppn')) return 'SPT';
  if (['3'].includes(lower) || lower.includes('skb') || lower.includes('nitku')) return 'Layanan';
  if (['4'].includes(lower) || lower.includes('email') || lower.includes('no hp') || lower.includes('profil')) return 'Profil';
  if (['5'].includes(lower) || lower.includes('npwp') || lower.includes('coretax')) return 'NPWP';
  return 'Konsultasi';
};

// ─── PRIORITY DETECTION ───
export const detectPriority = (text, category) => {
  const lower = text.toLowerCase().trim();
  if (['1a', '2', '4', '6'].includes(lower)) return 'P2';
  if (category === 'EFIN' || category === 'Profil') return 'P2';
  return 'P3';
};

// ─── FOLLOW-UP INTENT DETECTION ───
export const followUpKeywords = {
  syarat: ['persyaratan', 'butuh apa', 'dokumen', 'berkas', 'apa saja', 'syarat'],
  batas: ['batas waktu', 'jatuh tempo', 'deadline', 'kapan', 'sampai kapan', 'batas'],
  cara: ['bagaimana', 'langkah', 'prosedur', 'step', 'tutorial', 'cara'],
};

export const detectFollowUp = (text, currentContext) => {
  if (!currentContext.lastTopic) return null;
  const lower = text.toLowerCase();
  for (const [intent, keywords] of Object.entries(followUpKeywords)) {
    if (keywords.some(k => lower.includes(k))) {
      return { intent, topic: currentContext.lastTopic };
    }
  }
  return null;
};

// ─── SEARCH FUNCTION ───
export const searchKnowledge = (userText) => {
  const cleanedText = userText.toLowerCase().trim();
  
  const exactMatch = knowledgeBase.find(item => 
    item.keywords.some(kw => kw.toLowerCase() === cleanedText)
  );

  if (exactMatch) {
    return {
      type: 'KNOWLEDGE_MATCH',
      answer: exactMatch.answer,
      confidence: 1.0,
      matchedId: exactMatch.id,
      matchedTopic: exactMatch.topic,
      category: exactMatch.category,
      priority: exactMatch.priority,
      results: [],
    };
  }

  const results = fuse.search(cleanedText);

  if (results.length === 0) {
    return { type: 'NO_MATCH', answer: null, results: [] };
  }

  const best = results[0];

  if (best.score <= 0.4) {
    return {
      type: 'KNOWLEDGE_MATCH',
      answer: best.item.answer,
      confidence: 1 - best.score,
      matchedId: best.item.id,
      matchedTopic: best.item.topic,
      category: best.item.category,
      priority: best.item.priority,
      results,
    };
  }

  if (best.score <= 0.6) {
    const suggestions = results.slice(0, 3).map(r => r.item.keywords[0]);
    return { type: 'WEAK_MATCH', suggestions, results };
  }

  return { type: 'NO_MATCH', answer: null, results: [] };
};

// ─── FALLBACK MESSAGES ───
export const fallbackResponses = {
  weakMatch: (suggestions) => {
    const list = suggestions.map((s) => `• ${s}`).join('\n');
    return `Mohon maaf, saya belum memahami pertanyaan Anda secara pasti. 

Mungkin yang Anda maksud adalah:
${list}

Silakan ketik angka menu (1-6) atau kata kunci yang lebih spesifik.`;
  },
  noMatch: `Mohon maaf, pesan Anda belum dapat saya kenali. 

Silakan pilih topik di bawah ini atau ketik angka menu (1-6):`,
  repeatedNoMatch: `Mohon maaf atas ketidaknyamanannya 🙏

Petugas KPP Pratama Rengat siap membantu Anda secara langsung. 
📞 Kring Pajak: 1500200`,
  greetings: ['halo', 'hi', 'hai', 'hello', 'pagi', 'siang', 'sore', 'malam', 'selamat'],
  greetingResponse: `Selamat datang di layanan Chatbot KPP Pratama Rengat 👋

Silakan ketik angka menu atau pilih tombol di bawah ini:

1️⃣ Kode Billing PPh Tanah / UMKM
2️⃣ Pelaporan SPT Masa PPN (PKP)
3️⃣ Status & Pengambilan SKB
4️⃣ Update Email & Nomor HP
5️⃣ Kendala Coretax & Pendaftaran NPWP
6️⃣ Hubungi Petugas`,
};