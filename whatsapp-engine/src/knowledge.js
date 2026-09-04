// Knowledge Base & Menu Respon WhatsApp Bot KPP Pratama Rengat

export const WA_MENU_GREETING = `Halo, Selamat Datang di Layanan WhatsApp Helpdesk *KPP Pratama Rengat* 👋🏛️

Silakan balas dengan *angka menu* (1-6) sesuai kebutuhan Anda:

*1.* Kode Billing PPh Tanah / UMKM
*2.* Pelaporan SPT Masa PPN (PKP)
*3.* Status & Pengambilan SKB
*4.* Update Email & Nomor HP
*5.* Kendala Coretax & Pendaftaran NPWP
*6.* 👨‍💼 *Hubungi Petugas KPP Pratama Rengat*

_Ketik angka pilihan Anda atau ketik kata kunci pertanyaan (contoh: 'lupa efin')._`;

export const WA_KNOWLEDGE_BASE = [
  {
    triggers: ['1', 'billing', 'ebilling', 'bayar pajak', 'phtb', 'umkm'],
    reply: `*📌 LAYANAN KODE BILLING PAJAK*\n\nSilakan pilih kode sub-menu berikut:\n\n*1A* : PPh Tanah / Jual Beli (PHTB)\n*1B* : PPh Final UMKM (0.5%)\n*1C* : Kehilangan Bukti Bayar / Cetak BPN\n\n_Ketik 1A, 1B, atau 1C untuk panduan lengkap._`,
    category: 'e-Billing',
    priority: 'P3'
  },
  {
    triggers: ['1a', 'tanah', 'jual beli tanah', 'phtb'],
    reply: `*📌 PERMOHONAN KODE BILLING PPh TANAH (PHTB)*\n\nSilakan salin dan lengkapi data berikut:\n\n• Nama Wajib Pajak:\n• NIK (tanpa spasi/titik):\n• NOP (tanpa spasi/titik):\n• Alamat Objek Pajak:\n• Masa & Tahun Pembayaran:\n• Nominal PPh:\n\nKirimkan data di atas ke chat ini untuk dibantu petugas kami.`,
    category: 'e-Billing',
    priority: 'P2'
  },
  {
    triggers: ['1b', 'final umkm', 'pph umkm', '0.5%'],
    reply: `*📌 KODE BILLING PPh FINAL UMKM (0.5%)*\n\nFormat permohonan billing UMKM:\n\n• Nama Wajib Pajak:\n• NPWP / NIK:\n• Masa / Bulan Pajak:\n• Total Omzet Bruto (Rp):\n\n💡 *Tips:* Pembuatan kode billing UMKM juga dapat dilakukan mandiri via situs *djponline.pajak.go.id* atau *Coretax*.`,
    category: 'e-Billing',
    priority: 'P3'
  },
  {
    triggers: ['1c', 'bpn', 'bukti bayar hilang'],
    reply: `*📌 PENANGANAN BUKTI BAYAR (BPN) HILANG*\n\n1. *Cetak Mandiri:* Unduh kembali melalui portal DJP Online / Coretax menu *Riwayat Pembayaran*.\n2. *Bantuan Petugas:* Kirimkan NIK/NPWP, perkiraan tanggal pembayaran, dan nominal ke chat ini.`,
    category: 'e-Billing',
    priority: 'P3'
  },
  {
    triggers: ['2', 'spt', 'lapor spt', 'ppn', 'pkp'],
    reply: `*📌 PELAPORAN SPT MASA PPN (PKP)*\n\nPelaporan SPT Masa PPN dilakukan secara elektronik setiap bulan melalui portal Coretax / DJP Online:\n\n👉 Masuk ke *Surat Pemberitahuan* > *Konsep SPT* > *PPN*.\n\n⚠️ Batas akhir pelaporan SPT Masa PPN adalah hari terakhir bulan berikutnya.`,
    category: 'SPT',
    priority: 'P2'
  },
  {
    triggers: ['3', 'skb', 'surat keterangan bebas'],
    reply: `*📌 INFORMASI SURAT KETERANGAN BEBAS (SKB)*\n\n• *Jangka Waktu:* Standar penyelesaian maksimal 3 hari kerja sejak berkas lengkap.\n• *Pengambilan Fisik:* Ke loket TPT KPP Pratama Rengat dengan membawa Bukti Penerimaan Surat (BPS).\n• *Pengiriman Online:* Dapat dikirimkan via WhatsApp PDF jika domisili jauh.`,
    category: 'Layanan',
    priority: 'P3'
  },
  {
    triggers: ['4', 'email', 'nomor hp', 'ganti no hp', 'update profil'],
    reply: `*📌 PENGUBAHAN EMAIL & NOMOR HP TERDAFTAR*\n\nSilakan lengkapi data permohonan:\n\n1. Nomor NIK / NPWP:\n2. Nama Lengkap:\n3. Email Baru (Aktif):\n4. Nomor HP Baru (Aktif/WA):\n\n⚠️ *Syarat Lampiran:* Kirimkan foto KTP asli dan swafoto (selfie) memegang KTP ke chat ini untuk validasi identitas.`,
    category: 'Profil',
    priority: 'P2'
  },
  {
    triggers: ['5', 'coretax', 'daftar npwp', 'maps', 'seksi pengawasan', 'npwp'],
    reply: `*📌 KENDALA CORETAX & PENDAFTARAN NPWP*\n\n• *Kendala Seksi Pengawasan Kosong:* Pastikan Anda telah menentukan *titik lokasi alamat* pada peta (Maps) di portal Coretax.\n• *Pendaftaran NPWP Baru:* Dilakukan mandiri via *ereg.pajak.go.id* secara GRATIS tanpa pungutan biaya.`,
    category: 'NPWP',
    priority: 'P3'
  },
  {
    triggers: ['efin', 'lupa efin', 'reset efin'],
    reply: `*📌 PERMOHONAN LUPA / RESET EFIN ORANG PRIBADI*\n\nUntuk permohonan lupa EFIN, silakan kirimkan data berikut ke chat ini:\n\n1. NIK / NPWP:\n2. Nama Lengkap:\n3. Alamat Domisili:\n4. Lampirkan Foto KTP asli & Swafoto memegang KTP.\n\nPetugas kami akan memverifikasi dan mengirimkan EFIN Anda pada jam kerja operasional (08.00 - 16.00 WIB).`,
    category: 'EFIN',
    priority: 'P1'
  }
];

export const ESCALATION_TRIGGERS = [
  '6',
  'petugas',
  'admin',
  'hubungi petugas',
  'bantuan petugas',
  'manusia',
  'operator',
  'bantuan langsung',
  'helpdesk'
];

export function findAnswer(queryText) {
  if (!queryText || typeof queryText !== 'string') return null;
  const cleaned = queryText.toLowerCase().trim();

  // 1. Cek eskalasi manual
  if (ESCALATION_TRIGGERS.some(t => cleaned === t || cleaned.includes(t))) {
    return {
      type: 'ESCALATION',
      reply: `👨‍💼 *Permintaan Diteruskan ke Petugas KPP Pratama Rengat*\n\nPesan Anda telah diteruskan ke antrean Petugas Helpdesk kami. Petugas kami akan membalas langsung percakapan ini sesaat lagi.\n\n_Mohon tunggu sejenak dan tetap pantau chat ini._`,
      category: 'Konsultasi',
      priority: 'P1'
    };
  }

  // 2. Cek kecocokan trigger eksak atau substring
  for (const item of WA_KNOWLEDGE_BASE) {
    if (item.triggers.some(trigger => cleaned === trigger || cleaned.includes(trigger))) {
      return {
        type: 'MATCH',
        reply: item.reply,
        category: item.category,
        priority: item.priority
      };
    }
  }

  return null;
}
