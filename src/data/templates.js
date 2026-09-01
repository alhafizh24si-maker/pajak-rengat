export const responseTemplates = [
  {
    id: 'TPL-NPWP-001', category: 'NPWP', title: 'Pendaftaran NPWP Online', priority: 'P3', tags: ['npwp', 'daftar', 'baru', 'online'], usageCount: 45,
    template: 'Halo Bapak/Ibu {{nama}},\n\nUntuk pendaftaran NPWP baru, akses https://ereg.pajak.go.id, pilih jenis wajib pajak, isi data sesuai dokumen, unggah berkas, lalu tunggu verifikasi.\n\nLayanan KPP Pratama Rengat GRATIS. Salam, Tim Layanan KPP Pratama Rengat.'
  },
  {
    id: 'TPL-NPWP-002', category: 'NPWP', title: 'Cetak Ulang NPWP', priority: 'P4', tags: ['npwp', 'hilang', 'rusak', 'cetak'], usageCount: 28,
    template: 'Halo Bapak/Ibu {{nama}},\n\nUntuk cetak ulang NPWP, siapkan KTP asli dan surat kehilangan jika kartu hilang. Permohonan dapat diajukan melalui KPP atau kanal resmi DJP.'
  },
  {
    id: 'TPL-NPWP-003', category: 'NPWP', title: 'Perubahan Data Wajib Pajak', priority: 'P3', tags: ['npwp', 'ubah', 'data', 'alamat'], usageCount: 19,
    template: 'Halo Bapak/Ibu {{nama}},\n\nPerubahan data dapat diajukan melalui ereg.pajak.go.id dengan dokumen pendukung sesuai data yang diperbarui. Pastikan seluruh informasi benar sebelum mengirim permohonan.'
  },
  {
    id: 'TPL-EFIN-001', category: 'EFIN', title: 'Lupa EFIN', priority: 'P2', tags: ['efin', 'lupa', 'reset'], usageCount: 89,
    template: 'Halo Bapak/Ibu {{nama}},\n\nUntuk permohonan EFIN, siapkan foto KTP, NPWP jika ada, dan surat permohonan. Layanan ini GRATIS. Jangan pernah memberikan OTP atau password kepada siapapun.'
  },
  {
    id: 'TPL-EFIN-002', category: 'EFIN', title: 'EFIN Terblokir', priority: 'P2', tags: ['efin', 'blokir', 'akses'], usageCount: 51,
    template: 'Halo Bapak/Ibu {{nama}},\n\nJika EFIN terblokir, hubungi Kring Pajak 1500200 atau KPP Pratama Rengat melalui kanal resmi untuk verifikasi dan pemulihan akses.'
  },
  {
    id: 'TPL-EFIN-003', category: 'EFIN', title: 'Aktivasi EFIN', priority: 'P3', tags: ['efin', 'aktivasi', 'djp online'], usageCount: 34,
    template: 'Halo Bapak/Ibu {{nama}},\n\nSetelah menerima EFIN, lakukan aktivasi pada djponline.pajak.go.id dan gunakan email aktif yang dapat diakses. Simpan EFIN secara aman.'
  },
  {
    id: 'TPL-SPT-001', category: 'SPT', title: 'Batas Pelaporan SPT Tahunan', priority: 'P2', tags: ['spt', 'tahunan', 'deadline'], usageCount: 72,
    template: 'Batas pelaporan SPT Tahunan adalah 31 Maret untuk Wajib Pajak Orang Pribadi dan 30 April untuk Wajib Pajak Badan. Simpan Bukti Penerimaan Elektronik setelah pelaporan.'
  },
  {
    id: 'TPL-SPT-002', category: 'SPT', title: 'Panduan e-Filing', priority: 'P3', tags: ['spt', 'efiling', 'lapor'], usageCount: 63,
    template: 'Halo Bapak/Ibu {{nama}},\n\nLogin ke djponline.pajak.go.id, pilih e-Filing, isi formulir yang sesuai, kirim SPT, lalu simpan BPE sebagai bukti pelaporan.'
  },
  {
    id: 'TPL-SPT-003', category: 'SPT', title: 'SPT Masa', priority: 'P3', tags: ['spt', 'masa', 'bulanan'], usageCount: 25,
    template: 'Pelaporan SPT Masa dilakukan melalui kanal DJP sesuai jenis pajak dan periode. Pastikan data pembayaran serta dokumen pendukung telah sesuai sebelum submit.'
  },
  {
    id: 'TPL-BILLING-001', category: 'e-Billing', title: 'Pembuatan Kode Billing', priority: 'P3', tags: ['billing', 'bayar', 'kode'], usageCount: 47,
    template: 'Halo Bapak/Ibu {{nama}},\n\nBuat kode billing melalui djponline.pajak.go.id, isi jenis pajak, masa pajak, dan nominal, lalu lakukan pembayaran melalui kanal bank yang tersedia.'
  },
  {
    id: 'TPL-BILLING-002', category: 'e-Billing', title: 'Bukti Pembayaran Pajak', priority: 'P4', tags: ['billing', 'ntpn', 'bukti'], usageCount: 18,
    template: 'Setelah pembayaran berhasil, simpan NTPN dan Bukti Penerimaan Negara. Data tersebut menjadi bukti pembayaran yang perlu disimpan.'
  },
  {
    id: 'TPL-SEC-001', category: 'Keamanan', title: 'Peringatan Penipuan', priority: 'P1', tags: ['penipuan', 'hoaks', 'curiga'], usageCount: 12,
    template: 'PERINGATAN PENIPUAN\n\nKPP TIDAK PERNAH meminta transfer ke rekening pribadi, OTP, password DJP Online, atau biaya layanan. Jangan ikuti instruksi mencurigakan. Laporkan ke Kring Pajak 1500200.'
  },
  {
    id: 'TPL-SEC-002', category: 'Keamanan', title: 'Verifikasi Kanal Resmi', priority: 'P1', tags: ['penipuan', 'verifikasi', 'resmi'], usageCount: 31,
    template: 'Mohon pastikan komunikasi berasal dari kanal yang tercantum pada pajak.go.id. Jangan membagikan data rahasia sebelum identitas petugas dan kanal terverifikasi.'
  },
  {
    id: 'TPL-CONSULT-001', category: 'Konsultasi', title: 'Konsultasi Umum', priority: 'P3', tags: ['konsultasi', 'tanya', 'bantuan'], usageCount: 56,
    template: 'Halo Bapak/Ibu {{nama}},\n\nSilakan jelaskan kebutuhan perpajakan secara singkat beserta periode dan jenis wajib pajak. Kami akan membantu mengarahkan ke informasi yang sesuai.'
  },
  {
    id: 'TPL-CONSULT-002', category: 'Konsultasi', title: 'Eskalasi ke Petugas', priority: 'P2', tags: ['petugas', 'eskalasi', 'bantuan'], usageCount: 22,
    template: 'Permintaan Bapak/Ibu telah kami catat dan akan diteruskan kepada petugas terkait. Mohon tidak mengirim OTP, password, atau data rahasia melalui chat.'
  },
];

export const templateCategories = ['Semua', ...new Set(responseTemplates.map((template) => template.category))];
