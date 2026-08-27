import Fuse from 'fuse.js';

// ─────────────────────────────────────────────────
// Knowledge Base — 15 entries (kb-001 … kb-015)
// ─────────────────────────────────────────────────
export const knowledgeBase = [
  {
    id: 'kb-001',
    keywords: ['daftar npwp', 'registrasi npwp', 'buat npwp', 'cara npwp', 'permohonan npwp', 'npwp baru', 'aktivasi npwp'],
    answer:
      'Cara mendaftar NPWP:\n1. Kunjungi ereg.pajak.go.id\n2. Klik \'Daftar\'\n3. Isi formulir dengan data diri (NIK, nama, alamat)\n4. Unggah foto KTP dan foto selfie\n5. Kirim permohonan dan tunggu konfirmasi\n\nSyarat: WNI (KTP), WNA (KITAS/KITAP). Proses verifikasi 1–3 hari kerja.',
    topic: 'NPWP',
  },
  {
    id: 'kb-002',
    keywords: ['lapor spt', 'spt tahunan', 'batas spt', 'deadline spt', 'lupa lapor spt', 'efiling spt', 'spt pribadi', 'spt badan'],
    answer:
      'Pelaporan SPT Tahunan:\n• WP Orang Pribadi: Paling lambat 31 Maret\n• WP Badan: Paling lambat 30 April\n\nCara lapor:\n1. Login djponline.pajak.go.id\n2. Pilih e-Filing\n3. Isi formulir SPT (1770/1770S/1770SS)\n4. Submit dan simpan BPE (Bukti Penerimaan Elektronik)\n\nKeterlambatan dikenakan sanksi Rp 100.000 (OP) atau Rp 1.000.000 (Badan).',
    topic: 'SPT',
  },
  {
    id: 'kb-003',
    keywords: ['bayar pajak', 'kode billing', 'buat billing', 'pembayaran pajak', 'mpn', 'cara bayar pajak'],
    answer:
      'Cara membuat kode billing dan bayar pajak:\n1. Login djponline.pajak.go.id\n2. Pilih e-Billing → Buat Kode Billing\n3. Isi jenis pajak, periode, dan jumlah\n4. Bayar via bank/ATM/internet banking menggunakan kode billing\n\nKode billing berlaku 48 jam. Simpan NTPN sebagai bukti pembayaran.',
    topic: 'BILLING',
  },
  {
    id: 'kb-004',
    keywords: ['lupa efin', 'efin hilang', 'reset efin', 'aktivasi efin', 'nomor efin', 'permohonan efin'],
    answer:
      'Jika lupa atau kehilangan EFIN:\n• Online: Email ke lupa.efin@pajak.go.id dengan lampiran KTP dan NPWP\n• Telepon: Kring Pajak 1500200\n• Datang langsung ke KPP Pratama Rengat\n\nEFIN akan dikirim via email terdaftar dalam 1–2 hari kerja.',
    topic: 'EFIN',
  },
  {
    id: 'kb-005',
    keywords: ['restitusi pajak', 'lebih bayar', 'kelebihan pajak', 'minta pengembalian pajak', 'refund pajak'],
    answer:
      'Permohonan restitusi (pengembalian kelebihan bayar pajak):\n1. Ajukan permohonan ke KPP\n2. Sertakan SPT yang menyatakan lebih bayar\n3. Proses pemeriksaan oleh DJP (rata-rata 12 bulan untuk pemeriksaan penuh)\n\nUntuk restitusi dipercepat (< Rp 1 M), proses maksimal 1 bulan tanpa pemeriksaan.',
    topic: 'RESTITUSI',
  },
  {
    id: 'kb-006',
    keywords: ['ppn', 'pajak pertambahan nilai', 'tarif ppn', 'ppn 12 persen', 'cara hitung ppn'],
    answer:
      'Tarif PPN saat ini adalah 12% (berlaku mulai 2025).\nPPN dikenakan atas penyerahan BKP/JKP oleh PKP.\n\nCara hitung: PPN = 12% × Dasar Pengenaan Pajak (DPP)\nContoh: Barang Rp 1.000.000 → PPN = Rp 120.000\n\nPKP wajib membuat Faktur Pajak untuk setiap transaksi kena pajak.',
    topic: 'PPN',
  },
  {
    id: 'kb-007',
    keywords: ['pph 21', 'pajak karyawan', 'potong gaji', 'slip gaji pajak', 'tunjangan pajak', 'pph pasal 21'],
    answer:
      'PPh Pasal 21 adalah pajak atas penghasilan karyawan yang dipotong oleh pemberi kerja.\n\nTarif progresif:\n• 0–60 juta: 5%\n• 60–250 juta: 15%\n• 250–500 juta: 25%\n• 500 juta–5 M: 30%\n• > 5 M: 35%\n\nWajib lapor via e-SPT PPh 21 setiap bulan (paling lambat tanggal 10 bulan berikutnya).',
    topic: 'PPH21',
  },
  {
    id: 'kb-008',
    keywords: ['faktur pajak', 'efaktur', 'buat faktur', 'faktur elektronik', 'fp'],
    answer:
      'Faktur Pajak Elektronik wajib digunakan oleh PKP. Cara membuat:\n1. Aktivasi sertifikat elektronik di efaktur.pajak.go.id\n2. Unduh dan install aplikasi e-Faktur\n3. Buat faktur dengan data pembeli\n4. Upload ke DJP untuk validasi\n\nFaktur harus diterbitkan paling lambat akhir bulan berikutnya.',
    topic: 'EFAKTUR',
  },
  {
    id: 'kb-009',
    keywords: ['spt masa', 'lapor bulanan', 'ppn masa', 'pph 21 masa', 'pph 23 masa'],
    answer:
      'SPT Masa wajib dilaporkan setiap bulan:\n• PPN: Maksimal tanggal 7 bulan berikutnya\n• PPh 21/23: Maksimal tanggal 10/15 bulan berikutnya\n\nLapor via djponline.pajak.go.id. Keterlambatan dikenakan denda 1% dari jumlah kurang bayar.',
    topic: 'SPT_MASA',
  },
  {
    id: 'kb-010',
    keywords: ['npwp hilang', 'lupa npwp', 'cetak ulang npwp', 'kartu npwp', 'npwp rusak'],
    answer:
      'Jika kartu NPWP hilang/rusak, ajukan permohonan cetak ulang ke KPP dengan membawa:\n1. KTP asli\n2. Surat keterangan kehilangan dari polisi (jika hilang)\n3. Formulir permohonan cetak ulang\n\nAtau cetak mandiri via ereg.pajak.go.id jika sudah terdaftar online.',
    topic: 'NPWP',
  },
  {
    id: 'kb-011',
    keywords: ['perubahan data', 'mutasi npwp', 'pindah kpp', 'ubah alamat', 'ubah nama'],
    answer:
      'Perubahan data NPWP dilakukan dengan:\n1. Login ereg.pajak.go.id\n2. Pilih menu Perubahan Data\n3. Unggah dokumen pendukung\n4. Konfirmasi via email/SMS\n\nUntuk pindah KPP, ajukan pemindahan WP ke KPP tujuan dengan surat permohonan.',
    topic: 'DATA',
  },
  {
    id: 'kb-012',
    keywords: ['pengukuhan pkp', 'pkp baru', 'omzet pkp', 'batas pkp', 'wajib pkp'],
    answer:
      'Pengusaha dengan omzet > Rp 4,8 Miliar dalam satu tahun wajib dikukuhkan sebagai PKP. Proses:\n1. Ajukan permohonan ke KPP\n2. Pemeriksaan lapangan (jika diperlukan)\n3. Terbit SK Pengukuhan PKP\n4. Aktivasi sertifikat elektronik\n\nOmzet < Rp 4,8 M bisa mengajukan pengukuhan PKP sukarela.',
    topic: 'PKP',
  },
  {
    id: 'kb-013',
    keywords: ['tax amnesty', 'pengampunan pajak', 'sunset policy', 'harta tidak lapor'],
    answer:
      'Program Tax Amnesty (PPS) memberikan kesempatan pelaporan harta yang belum/kurang diungkapkan. Silakan cek ketersediaan program terbaru di pajak.go.id atau hubungi KPP untuk konsultasi.',
    topic: 'AMNESTY',
  },
  {
    id: 'kb-014',
    keywords: ['bupot unifikasi', 'bukti potong unifikasi', 'spt unifikasi', 'ebupot unifikasi'],
    answer:
      'Bukti Potong Unifikasi menggabungkan berbagai jenis pemotongan dalam satu format. Wajib untuk:\n• PPh 21/26\n• PPh 22\n• PPh 23/26\n• PPh 4(2)\n\nPelaporan via e-Filing Unifikasi di djponline.pajak.go.id.',
    topic: 'BUPOT',
  },
  {
    id: 'kb-015',
    keywords: ['konsultasi pajak', 'tanya petugas', 'bantuan pajak', 'layanan kpp', 'call center'],
    answer:
      'Anda bisa mendapatkan bantuan melalui:\n• Kring Pajak: 1500200\n• Live Chat DJP Online\n• Datang langsung ke KPP Pratama Rengat\n• Email: kpp.rengat@pajak.go.id\n\nJika chatbot tidak bisa menjawab, klik tombol \'Hubungi Petugas\' untuk terhubung ke layanan human.',
    topic: 'LAYANAN',
  },
];

// ─────────────────────────────────────────────────
// Fuse.js — fuzzy search instance
// ─────────────────────────────────────────────────
const fuseOptions = {
  keys: ['keywords'],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 3,
  shouldSort: true,
};

export const fuse = new Fuse(knowledgeBase, fuseOptions);

// ─────────────────────────────────────────────────
// Follow-up detection keywords
// ─────────────────────────────────────────────────
export const followUpKeywords = {
  syarat: ['persyaratan', 'butuh apa', 'dokumen', 'berkas', 'apa saja', 'syarat'],
  batas:  ['batas waktu', 'jatuh tempo', 'deadline', 'kapan', 'sampai kapan', 'batas'],
  cara:   ['bagaimana', 'langkah', 'prosedur', 'step', 'tutorial', 'cara'],
  lokasi: ['alamat', 'dimana', 'lokasi', 'tempat', 'kantor'],
  biaya:  ['berapa', 'tarif', 'denda', 'sanksi', 'bayar berapa', 'biaya'],
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

// ─────────────────────────────────────────────────
// searchKnowledge — returns typed result object
// ─────────────────────────────────────────────────
export const searchKnowledge = (userText) => {
  const results = fuse.search(userText);

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
      results,
    };
  }

  if (best.score <= 0.6) {
    const suggestions = results.slice(0, 3).map(r => r.item.keywords[0]);
    return { type: 'WEAK_MATCH', suggestions, results };
  }

  return { type: 'NO_MATCH', answer: null, results: [] };
};

// ─────────────────────────────────────────────────
// Fallback response templates
// ─────────────────────────────────────────────────
export const fallbackResponses = {
  weakMatch: (suggestions) =>
    `Saya belum yakin memahami pertanyaan Anda. Mungkin yang Anda maksud:\n${suggestions
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n')}\n\nKetik ulang dengan kata kunci yang lebih spesifik.`,
  noMatch:
    'Maaf, saya belum memiliki informasi mengenai pertanyaan tersebut. Silakan pilih topik di bawah atau hubungi petugas kami.',
  repeatedNoMatch:
    'Saya masih belum bisa menjawab dengan tepat. Mohon maaf atas ketidaknyamanannya. Petugas KPP Pratama Rengat siap membantu Anda langsung. 📞 Kring Pajak: 1500200',
  greetings: ['halo', 'hi', 'hai', 'hello', 'pagi', 'siang', 'sore', 'malam', 'selamat'],
  greetingResponse:
    'Halo! Selamat datang di layanan Chatbot KPP Pratama Rengat 👋\nAda yang bisa saya bantu? Silakan ketik pertanyaan atau pilih menu di bawah.',
};
