import React, { useState, useMemo } from 'react';

// Format angka ke format mata uang Rupiah
function formatIDR(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number || 0);
}

// ── Komponen Aksi Berbagi, Salin & Kirim ke WhatsApp Billing ──
function CalculationShareBar({ title, details, taxAmount, note, waSubject }) {
  const [copied, setCopied] = useState(false);

  const formatText = () => {
    let text = `📄 *SIMULASI PERHITUNGAN PAJAK TERKINI (KPP PRATAMA RENGAT)*\n`;
    text += `*Layanan / Regulasi:* ${title}\n`;
    text += `*Tanggal Perhitungan:* ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n`;
    text += `*Rincian Komponen:*\n`;
    details.forEach((d) => {
      text += `• ${d.label}: ${d.value}\n`;
    });
    text += `\n*Hasil Estimasi Terutang / Setoran:* ${taxAmount}\n`;
    if (note) text += `*Dasar Regulasi:* ${note}\n`;
    text += `\nMohon bantuan petugas Helpdesk KPP Pratama Rengat untuk konsultasi lebih lanjut / pembuatan Kode Billing resmi Coretax DJP. Terima kasih.`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const waUrl = `https://wa.me/628125000213?text=${encodeURIComponent(formatText())}`;

  return (
    <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '12.5px',
            padding: '10px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)'
          }}
        >
          <span>💬</span> Kirim ke Helpdesk WA KPP
        </a>

        <button
          type="button"
          onClick={handlePrint}
          style={{
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            color: '#334155',
            fontWeight: 700,
            fontSize: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Cetak atau Simpan PDF"
        >
          <span>🖨️</span> Cetak
        </button>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        style={{
          width: '100%',
          backgroundColor: copied ? '#ECFDF5' : '#F8FAFC',
          color: copied ? '#059669' : '#64748B',
          border: copied ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
          fontSize: '11.5px',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '7px 10px',
          borderRadius: '6px',
          textAlign: 'center',
          transition: 'all 0.2s'
        }}
      >
        {copied ? '✅ Ringkasan Perhitungan Tersalin ke Papan Klip!' : '📋 Salin Ringkasan Perhitungan'}
      </button>
    </div>
  );
}

// ── Tabel Lengkap Skema TER Bulanan (PP 58/2023 & PMK 168/2023) ──
const TER_A_BRACKETS = [
  { max: 5400000, rate: 0 },
  { max: 5650000, rate: 0.0025 },
  { max: 5950000, rate: 0.005 },
  { max: 6300000, rate: 0.0075 },
  { max: 6750000, rate: 0.01 },
  { max: 7500000, rate: 0.0125 },
  { max: 8550000, rate: 0.015 },
  { max: 9650000, rate: 0.0175 },
  { max: 10050000, rate: 0.02 },
  { max: 10350000, rate: 0.0225 },
  { max: 10700000, rate: 0.025 },
  { max: 11050000, rate: 0.03 },
  { max: 11600000, rate: 0.035 },
  { max: 12500000, rate: 0.04 },
  { max: 13750000, rate: 0.05 },
  { max: 15100000, rate: 0.06 },
  { max: 16950000, rate: 0.07 },
  { max: 19750000, rate: 0.08 },
  { max: 24150000, rate: 0.09 },
  { max: 26450000, rate: 0.10 },
  { max: 28000000, rate: 0.11 },
  { max: 30050000, rate: 0.12 },
  { max: 32400000, rate: 0.13 },
  { max: 35400000, rate: 0.14 },
  { max: 39100000, rate: 0.15 },
  { max: 43850000, rate: 0.16 },
  { max: 47800000, rate: 0.17 },
  { max: 51400000, rate: 0.18 },
  { max: 56300000, rate: 0.19 },
  { max: 62200000, rate: 0.20 },
  { max: 68600000, rate: 0.21 },
  { max: 77500000, rate: 0.22 },
  { max: 89000000, rate: 0.23 },
  { max: 103000000, rate: 0.24 },
  { max: 125000000, rate: 0.25 },
  { max: 157000000, rate: 0.26 },
  { max: 206000000, rate: 0.27 },
  { max: 337000000, rate: 0.28 },
  { max: 454000000, rate: 0.29 },
  { max: 550000000, rate: 0.30 },
  { max: 695000000, rate: 0.31 },
  { max: 910000000, rate: 0.32 },
  { max: 1400000000, rate: 0.33 },
  { max: Infinity, rate: 0.34 },
];

const TER_B_BRACKETS = [
  { max: 6200000, rate: 0 },
  { max: 6500000, rate: 0.0025 },
  { max: 6850000, rate: 0.005 },
  { max: 7300000, rate: 0.0075 },
  { max: 9200000, rate: 0.01 },
  { max: 10750000, rate: 0.015 },
  { max: 11350000, rate: 0.02 },
  { max: 11950000, rate: 0.025 },
  { max: 12600000, rate: 0.03 },
  { max: 13600000, rate: 0.04 },
  { max: 14700000, rate: 0.05 },
  { max: 16500000, rate: 0.06 },
  { max: 18950000, rate: 0.07 },
  { max: 22800000, rate: 0.08 },
  { max: 27000000, rate: 0.09 },
  { max: 29500000, rate: 0.10 },
  { max: 31700000, rate: 0.11 },
  { max: 34400000, rate: 0.12 },
  { max: 37400000, rate: 0.13 },
  { max: 41100000, rate: 0.14 },
  { max: 45400000, rate: 0.15 },
  { max: 50000000, rate: 0.16 },
  { max: 54600000, rate: 0.17 },
  { max: 60000000, rate: 0.18 },
  { max: 66000000, rate: 0.19 },
  { max: 73000000, rate: 0.20 },
  { max: 81000000, rate: 0.21 },
  { max: 91000000, rate: 0.22 },
  { max: 104000000, rate: 0.23 },
  { max: 121000000, rate: 0.24 },
  { max: 144000000, rate: 0.25 },
  { max: 175000000, rate: 0.26 },
  { max: 224000000, rate: 0.27 },
  { max: 345000000, rate: 0.28 },
  { max: 460000000, rate: 0.29 },
  { max: 560000000, rate: 0.30 },
  { max: 705000000, rate: 0.31 },
  { max: 920000000, rate: 0.32 },
  { max: 1415000000, rate: 0.33 },
  { max: Infinity, rate: 0.34 },
];

const TER_C_BRACKETS = [
  { max: 6600000, rate: 0 },
  { max: 6950000, rate: 0.0025 },
  { max: 7350000, rate: 0.005 },
  { max: 7800000, rate: 0.0075 },
  { max: 9750000, rate: 0.01 },
  { max: 11200000, rate: 0.015 },
  { max: 11800000, rate: 0.02 },
  { max: 12450000, rate: 0.025 },
  { max: 13100000, rate: 0.03 },
  { max: 14150000, rate: 0.04 },
  { max: 15300000, rate: 0.05 },
  { max: 17150000, rate: 0.06 },
  { max: 19650000, rate: 0.07 },
  { max: 23500000, rate: 0.08 },
  { max: 27900000, rate: 0.09 },
  { max: 30100000, rate: 0.10 },
  { max: 32600000, rate: 0.11 },
  { max: 35400000, rate: 0.12 },
  { max: 38400000, rate: 0.13 },
  { max: 42100000, rate: 0.14 },
  { max: 46400000, rate: 0.15 },
  { max: 51200000, rate: 0.16 },
  { max: 56000000, rate: 0.17 },
  { max: 61500000, rate: 0.18 },
  { max: 67700000, rate: 0.19 },
  { max: 74900000, rate: 0.20 },
  { max: 83200000, rate: 0.21 },
  { max: 93500000, rate: 0.22 },
  { max: 107000000, rate: 0.23 },
  { max: 124000000, rate: 0.24 },
  { max: 148000000, rate: 0.25 },
  { max: 179000000, rate: 0.26 },
  { max: 229000000, rate: 0.27 },
  { max: 350000000, rate: 0.28 },
  { max: 465000000, rate: 0.29 },
  { max: 565000000, rate: 0.30 },
  { max: 710000000, rate: 0.31 },
  { max: 925000000, rate: 0.32 },
  { max: 1419000000, rate: 0.33 },
  { max: Infinity, rate: 0.34 },
];

function calculateTER(bruto, category) {
  const b = Number(bruto) || 0;
  if (b <= 0) return { rate: '0.00', tax: 0, takeHome: 0 };

  let brackets = TER_A_BRACKETS;
  if (category === 'B') brackets = TER_B_BRACKETS;
  else if (category === 'C') brackets = TER_C_BRACKETS;

  const matched = brackets.find((br) => b <= br.max) || brackets[brackets.length - 1];
  const rate = matched.rate;
  const tax = Math.round(b * rate);
  const takeHome = Math.max(0, b - tax);

  return {
    rate: (rate * 100).toFixed(2),
    tax,
    takeHome,
  };
}

export default function TaxCalculator() {
  const [activeTab, setActiveTab] = useState('umkm'); // Default ke UMKM PP 20/2026

  // ══════════════ STATE TAB UMKM (PP 20/2026) ══════════════
  const [subjekUmkm, setSubjekUmkm] = useState('op'); // 'op', 'pt_perorangan', 'koperasi', 'badan_baru', 'badan_lama'
  const [isPekerjaanBebas, setIsPekerjaanBebas] = useState(false); // Kreator digital, influencer, dokter, pengacara dll
  const [omzetBulanan, setOmzetBulanan] = useState(25000000);
  const [omzetKumulatifLalu, setOmzetKumulatifLalu] = useState(300000000);
  const [omzetAfiliasi, setOmzetAfiliasi] = useState(0); // Omzet pasangan suami/istri atau PT Perorangan afiliasi (Anti-Pecah Usaha PP 20/2026)
  const [hasAfiliasi, setHasAfiliasi] = useState(false);

  // ══════════════ STATE TAB PENGHAPUSAN SANKSI (KEP-239/PJ/2026) ══════════════
  const [pokokKurangBayar, setPokokKurangBayar] = useState(15000000);
  const [sanksiDenda, setSanksiDenda] = useState(4500000);
  const [periodeBayar, setPeriodeBayar] = useState('p1'); // 'p1' (100%), 'p2' (50%), 'p3' (25%), 'p4' (0%)
  const [jenisSptSanksi, setJenisSptSanksi] = useState('tahunan'); // 'tahunan' (s.d 2025) atau 'masa' (s.d Sept 2026)

  // ══════════════ STATE TAB PPH 21 TER ══════════════
  const [bruto, setBruto] = useState(8500000);
  const [ptkpCategory, setPtkpCategory] = useState('A');
  const [ptkpDetail, setPtkpDetail] = useState('TK/0');

  // ══════════════ STATE TAB PHTB PROPERTI ══════════════
  const [nilaiTransaksi, setNilaiTransaksi] = useState(150000000);
  const [jenisPhtb, setJenisPhtb] = useState('umum'); // 'umum' (2.5%) atau 'sederhana' (1%)

  // ────────────────── PERHITUNGAN UMKM PP 20/2026 ──────────────────
  const umkmResult = useMemo(() => {
    const bulanan = Number(omzetBulanan) || 0;
    const kumulatifLalu = Number(omzetKumulatifLalu) || 0;
    const afiliasi = hasAfiliasi ? (Number(omzetAfiliasi) || 0) : 0;
    const totalGabunganTahun = kumulatifLalu + bulanan + afiliasi;
    const ambangBatasUmkm = 4800000000; // Rp 4,8 Miliar

    // Kasus 1: Pekerjaan Bebas / Konten Kreator Digital (Dilarang PPh Final 0,5% sesuai PP 20/2026)
    if (isPekerjaanBebas) {
      // Simulasi NPPN (Norma Penghitungan Penghasilan Neto 50% x Tarif PPh Pasal 17)
      const penghasilanNetoEst = bulanan * 0.50; // Asumsi norma 50%
      return {
        eligible: false,
        status: 'dikecualikan_pekerjaan_bebas',
        title: 'Dikecualikan dari PPh Final 0,5% (PP 20/2026)',
        badge: 'Wajib Tarif PPh Normal / NPPN',
        tax: 0,
        netoEst: penghasilanNetoEst,
        totalGabungan: totalGabunganTahun,
        isOverLimit: totalGabunganTahun > ambangBatasUmkm,
        message: 'Berdasarkan PP 20/2026, penghasilan dari pekerjaan bebas dan kreator konten digital (influencer, selebgram, YouTuber, vlogger, blogger, moderator, penceramah) dilarang menggunakan tarif PPh Final 0,5% walau omzet di bawah Rp 4,8 Miliar. Wajib menggunakan Norma Penghitungan (NPPN) atau Pembukuan tarif Pasal 17 UU PPh.',
      };
    }

    // Kasus 2: Badan Usaha Baru CV/PT Reguler (TIDAK BERHAK menurut PP 20/2026)
    if (subjekUmkm === 'badan_baru') {
      // Tarif PPh Badan Normal dengan Fasilitas Pasal 31E (11% dari laba kena pajak)
      return {
        eligible: false,
        status: 'badan_baru_tidak_berhak',
        title: 'Tidak Berhak PPh Final 0,5% (PP 20/2026)',
        badge: 'Tarif PPh Badan (Pasal 31E)',
        tax: 0,
        totalGabungan: totalGabunganTahun,
        isOverLimit: totalGabunganTahun > ambangBatasUmkm,
        message: 'PP No. 20 Tahun 2026 memperketat subjek UMKM. Entitas CV, Firma, dan PT Reguler baru TIDAK LAGI BERHAK menggunakan skema PPh Final 0,5% dan langsung dikenai tarif umum PPh Badan (fasilitas Pasal 31E tarif efektif 11% dari Penghasilan Kena Pajak).',
      };
    }

    // Cek apakah melebihi Rp 4,8 Miliar (Aturan Anti-Pecah Usaha PP 20/2026)
    const isExceeded48M = totalGabunganTahun > ambangBatasUmkm;

    // Kasus 3: CV/PT Lama dalam masa transisi
    if (subjekUmkm === 'badan_lama') {
      const tax = Math.round(bulanan * 0.005);
      return {
        eligible: true,
        status: 'badan_lama_transisi',
        title: 'Masa Transisi Badan Lama (PP 20/2026)',
        badge: 'Tarif Final 0,5% (Sisa Masa Berlaku)',
        tax,
        taxableOmzet: bulanan,
        totalGabungan: totalGabunganTahun,
        isOverLimit: isExceeded48M,
        message: 'Entitas CV/PT lama hanya berhak menggunakan tarif 0,5% sampai masa berlakunya berakhir (CV/Firma maks 4 tahun, PT maks 3 tahun sejak pendaftaran). Tidak ada perpanjangan masa berlaku.',
      };
    }

    // Kasus 4: PT Perorangan (Didirikan 1 orang) & Koperasi
    if (subjekUmkm === 'pt_perorangan' || subjekUmkm === 'koperasi') {
      const tax = Math.round(bulanan * 0.005);
      const labelSubjek = subjekUmkm === 'pt_perorangan' ? 'Perseroan Perorangan (PT 1 Orang)' : 'Koperasi';
      return {
        eligible: true,
        status: 'badan_eligible',
        title: `PPh Final 0,5% ${labelSubjek}`,
        badge: 'Tarif Final 0,5%',
        tax,
        taxableOmzet: bulanan,
        totalGabungan: totalGabunganTahun,
        isOverLimit: isExceeded48M,
        message: `${labelSubjek} berhak atas tarif final 0,5% sesuai PP 20/2026 tanpa fasilitas bebas Rp 500 Juta (seluruh omzet bulanan dikenai tarif 0,5%). ${isExceeded48M ? '⚠️ Total omzet gabungan telah melebihi Rp 4,8 Miliar! Tahun berikutnya wajib beralih ke tarif umum.' : ''}`,
      };
    }

    // Kasus 5: Wajib Pajak Orang Pribadi (OP) - Memiliki Fasilitas Bebas Rp 500 Juta/Tahun
    const batasBebas = 500000000; // Rp 500 Juta
    if (kumulatifLalu + bulanan <= batasBebas) {
      return {
        eligible: true,
        status: 'op_bebas',
        title: 'PPh Final 0,5% Orang Pribadi (Bebas Pajak)',
        badge: 'Fasilitas Bebas Rp 500 Juta',
        tax: 0,
        isFree: true,
        taxableOmzet: 0,
        sisaBebas: batasBebas - (kumulatifLalu + bulanan),
        totalGabungan: totalGabunganTahun,
        isOverLimit: isExceeded48M,
        message: `Fasilitas PP 20/2026 & PP 55/2022 Aktif: Omzet kumulatif tahun berjalan belum menembus Rp 500.000.000. Pajak PPh terutang bulan ini Rp 0 (BEBAS PAJAK). Sisa kuota bebas Anda: ${formatIDR(batasBebas - (kumulatifLalu + bulanan))}.`,
      };
    } else if (kumulatifLalu < batasBebas) {
      // Bulan ini menembus batas bebas Rp 500 Juta
      const kenaPajak = (kumulatifLalu + bulanan) - batasBebas;
      const tax = Math.round(kenaPajak * 0.005);
      return {
        eligible: true,
        status: 'op_transisi_500m',
        title: 'PPh Final 0,5% Orang Pribadi (Menembus Batas Bebas)',
        badge: 'Sebagian Kena Pajak 0,5%',
        tax,
        isFree: false,
        taxableOmzet: kenaPajak,
        totalGabungan: totalGabunganTahun,
        isOverLimit: isExceeded48M,
        message: `Omzet kumulatif Anda bulan ini melewati batas Rp 500 Juta. Bagian yang dikenakan tarif 0,5% hanya kelebihannya yaitu ${formatIDR(kenaPajak)}.`,
      };
    } else {
      // Sudah lewat Rp 500 Juta sebelumnya
      const tax = Math.round(bulanan * 0.005);
      return {
        eligible: true,
        status: 'op_kena_penuh',
        title: 'PPh Final 0,5% Orang Pribadi',
        badge: 'Tarif Final 0,5%',
        tax,
        isFree: false,
        taxableOmzet: bulanan,
        totalGabungan: totalGabunganTahun,
        isOverLimit: isExceeded48M,
        message: `Omzet kumulatif telah melewati Rp 500 Juta. Seluruh omzet bulan ini (${formatIDR(bulanan)}) dikenai tarif PPh Final 0,5%. ${isExceeded48M ? '⚠️ Akumulasi gabungan telah melebihi Rp 4,8 Miliar! Tahun berikutnya wajib menggunakan tarif umum.' : ''}`,
      };
    }
  }, [subjekUmkm, isPekerjaanBebas, omzetBulanan, omzetKumulatifLalu, omzetAfiliasi, hasAfiliasi]);

  // ────────────────── PERHITUNGAN PENGHAPUSAN SANKSI (KEP-239/PJ/2026) ──────────────────
  const sanksiResult = useMemo(() => {
    const pokok = Number(pokokKurangBayar) || 0;
    const denda = Number(sanksiDenda) || 0;
    const totalUtangAwal = pokok + denda;

    let diskonPersen = 100;
    let periodeLabel = 'Periode 1 (8 Okt – 31 Des 2026)';
    let statusLabel = 'Diskon Sanksi 100% (Bebas Denda Penuh)';

    if (periodeBayar === 'p1') {
      diskonPersen = 100;
      periodeLabel = '8 Okt – 31 Des 2026';
      statusLabel = 'Penghapusan Denda 100% (Sanksi Rp 0)';
    } else if (periodeBayar === 'p2') {
      diskonPersen = 50;
      periodeLabel = 'Jan – Mar 2027';
      statusLabel = 'Pengurangan Denda 50%';
    } else if (periodeBayar === 'p3') {
      diskonPersen = 25;
      periodeLabel = 'Apr – Jun 2027';
      statusLabel = 'Pengurangan Denda 25%';
    } else {
      diskonPersen = 0;
      periodeLabel = 'Setelah 30 Juni 2027';
      statusLabel = 'Tanpa Pengurangan Sanksi (Tarif Normal)';
    }

    const sanksiDihapus = Math.round(denda * (diskonPersen / 100));
    const sisaSanksi = Math.max(0, denda - sanksiDihapus);
    const totalWajibSetor = pokok + sisaSanksi;

    return {
      pokok,
      dendaAwal: denda,
      totalUtangAwal,
      diskonPersen,
      periodeLabel,
      statusLabel,
      sanksiDihapus,
      sisaSanksi,
      totalWajibSetor,
    };
  }, [pokokKurangBayar, sanksiDenda, periodeBayar]);

  // ────────────────── PERHITUNGAN PPH 21 TER ──────────────────
  const terResult = useMemo(() => {
    return calculateTER(bruto, ptkpCategory);
  }, [bruto, ptkpCategory]);

  // ────────────────── PERHITUNGAN PHTB TANAH / PROPERTI ──────────────────
  const phtbResult = useMemo(() => {
    const nilai = Number(nilaiTransaksi) || 0;
    const rate = jenisPhtb === 'sederhana' ? 0.01 : 0.025;
    const tax = Math.round(nilai * rate);
    return {
      rate: jenisPhtb === 'sederhana' ? '1.0%' : '2.5%',
      tax,
    };
  }, [nilaiTransaksi, jenisPhtb]);

  const handlePtkpChange = (code) => {
    setPtkpDetail(code);
    if (['TK/0', 'TK/1', 'K/0'].includes(code)) setPtkpCategory('A');
    else if (['TK/2', 'TK/3', 'K/1', 'K/2'].includes(code)) setPtkpCategory('B');
    else setPtkpCategory('C');
  };

  return (
    <section className="tax-calc-section" id="kalkulator" style={{ padding: '60px 0', backgroundColor: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header Seksi */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ 
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              fontWeight: 700,
              fontSize: '11.5px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid #DBEAFE',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✨ Update Regulasi Terkini 2026
            </span>
            <span style={{ 
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontWeight: 700,
              fontSize: '11.5px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid #FDE68A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⚖️ PP 20/2026 &amp; KEP-239/2026
            </span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>
            Simulasi &amp; Kalkulator Pajak Terpadu
          </h2>
          <p style={{ color: '#64748B', fontSize: '14.5px', maxWidth: '680px', margin: '0 auto' }}>
            Hitung estimasi kewajiban pajak Anda secara akurat sesuai regulasi terbaru DJP: 
            <strong> PP No. 20 Tahun 2026</strong>, <strong>KEP-239/PJ/2026 (Hapus Sanksi 100%)</strong>, serta skema TER bulanan.
          </p>
        </div>

        {/* Tab Navigasi Kalkulator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginBottom: '26px',
          flexWrap: 'wrap'
        }}>
          {[
            { 
              id: 'umkm', 
              label: '🏪 PPh Final UMKM 0,5%', 
              badge: 'PP 20/2026', 
              badgeColor: '#059669', 
              badgeBg: '#D1FAE5',
              tooltip: 'Aturan terbaru PP 20/2026: Anti-pecah usaha & pengetatan subjek berhak' 
            },
            { 
              id: 'sanksi', 
              label: '🎁 Hapus Sanksi Pajak 100%', 
              badge: 'KEP-239 & PMK 71', 
              badgeColor: '#DC2626', 
              badgeBg: '#FEE2E2',
              tooltip: 'Fasilitas pembebasan denda hingga 100% s.d. 31 Desember 2026' 
            },
            { 
              id: 'pph21', 
              label: '👔 PPh 21 TER Karyawan', 
              badge: 'PP 58/2023', 
              badgeColor: '#2563EB', 
              badgeBg: '#DBEAFE',
              tooltip: 'Tarif Efektif Rata-Rata (TER) bulanan Kategori A, B, dan C' 
            },
            { 
              id: 'phtb', 
              label: '🏡 PHTB Jual Beli Tanah (2,5%)', 
              badge: 'PP 34/2016', 
              badgeColor: '#D97706', 
              badgeBg: '#FEF3C7',
              tooltip: 'PPh Final pengalihan hak atas tanah dan bangunan wilayah Rengat' 
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.tooltip}
              style={{
                padding: '11px 18px',
                borderRadius: '12px',
                border: activeTab === tab.id ? '2px solid #0056B3' : '1px solid #CBD5E1',
                backgroundColor: activeTab === tab.id ? '#FFFFFF' : '#F8FAFC',
                color: activeTab === tab.id ? '#0056B3' : '#475569',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 4px 14px rgba(0, 86, 179, 0.14)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <span>{tab.label}</span>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 700,
                backgroundColor: tab.badgeBg,
                color: tab.badgeColor,
                padding: '2px 7px',
                borderRadius: '6px'
              }}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Card Utama Kalkulator */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>

          {/* ═════════════════════════════════════════════════════════
              TAB 1: UMKM 0,5% (TERBARU PP 20/2026 & PP 55/2022)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === 'umkm' && (
            <div style={{ padding: '34px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Simulasi PPh Final UMKM 0,5%
                  </h3>
                  <span style={{ fontSize: '11px', backgroundColor: '#ECFDF5', color: '#047857', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    PP No. 20/2026
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '20px', lineHeight: '1.5' }}>
                  Peraturan Pemerintah No. 20 Tahun 2026 memperketat subjek yang berhak, mengecualikan pekerjaan bebas/kreator konten, serta menerapkan <strong>aturan akumulasi anti-pecah usaha</strong>.
                </p>

                {/* 1. Pemilihan Bentuk Usaha */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    1. Bentuk Entitas Wajib Pajak (PP 20/2026)
                  </label>
                  <select
                    value={subjekUmkm}
                    onChange={(e) => setSubjekUmkm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <optgroup label="✅ Subjek Berhak PPh Final 0,5% (PP 20/2026)">
                      <option value="op">Wajib Pajak Orang Pribadi (Ada Fasilitas Bebas Rp 500 Juta)</option>
                      <option value="pt_perorangan">Perseroan Perorangan (PT 1 Orang yang didirikan sendiri)</option>
                      <option value="koperasi">Koperasi</option>
                      <option value="badan_lama">CV / Firma / PT Reguler Lama (Masa Transisi Tanpa Perpanjangan)</option>
                    </optgroup>
                    <optgroup label="❌ Dikecualikan dari PPh Final 0,5%">
                      <option value="badan_baru">CV / Firma / PT Reguler Baru (Wajib Tarif Normal PPh Badan)</option>
                    </optgroup>
                  </select>
                </div>

                {/* 2. Pengecualian Pekerjaan Bebas & Konten Kreator */}
                <div style={{ 
                  marginBottom: '18px', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  backgroundColor: isPekerjaanBebas ? '#FEF2F2' : '#F8FAFC',
                  border: isPekerjaanBebas ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="check-pekerjaan-bebas"
                      checked={isPekerjaanBebas}
                      onChange={(e) => setIsPekerjaanBebas(e.target.checked)}
                      style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <label htmlFor="check-pekerjaan-bebas" style={{ fontSize: '12.5px', color: '#1E293B', cursor: 'pointer', lineHeight: '1.4' }}>
                      <strong>Pekerjaan Bebas / Jasa Kreator Konten Digital</strong>
                      <span style={{ display: 'block', color: '#64748B', fontSize: '11.5px', marginTop: '2px' }}>
                        Centang jika bidang usaha adalah Influencer, Selebgram, YouTuber, Blogger, Vlogger, Penceramah, Pengajar, Dokter, Notaris, Pengacara, Konsultan, atau Akuntan.
                      </span>
                    </label>
                  </div>
                  {isPekerjaanBebas && (
                    <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#B91C1C', fontWeight: 600 }}>
                      ⚠️ Sesuai PP 20/2026, profesi di atas tidak berhak menggunakan tarif PPh Final 0,5% walau omzet di bawah Rp 4,8 Miliar.
                    </div>
                  )}
                </div>

                {/* 3. Input Omzet Bulanan */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    2. Omzet / Peredaran Bruto Bulan Ini (Rp)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748B' }}>
                      Rp
                    </span>
                    <input
                      type="number"
                      value={omzetBulanan}
                      onChange={(e) => setOmzetBulanan(Math.max(0, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 45px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {[10000000, 25000000, 50000000, 100000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setOmzetBulanan(preset)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          color: '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {formatIDR(preset).replace(',00', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Omzet Kumulatif Lalu */}
                {subjekUmkm === 'op' && !isPekerjaanBebas && (
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      3. Akumulasi Omzet dari Awal Tahun s.d. Bulan Lalu (Rp)
                    </label>
                    <input
                      type="number"
                      value={omzetKumulatifLalu}
                      onChange={(e) => setOmzetKumulatifLalu(Math.max(0, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        padding: '11px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <small style={{ color: '#64748B', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                      Validasi fasilitas bebas pajak Rp 500 Juta untuk Wajib Pajak Orang Pribadi.
                    </small>
                  </div>
                )}

                {/* 5. Aturan Anti-Pecah Usaha PP 20/2026 */}
                <div style={{ 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  backgroundColor: '#EFF6FF', 
                  border: '1px solid #BFDBFE',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label htmlFor="toggle-afiliasi" style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E40AF', cursor: 'pointer' }}>
                      🛡️ Hitung Akumulasi Anti-Pecah Usaha (PP 20/2026)
                    </label>
                    <input
                      type="checkbox"
                      id="toggle-afiliasi"
                      checked={hasAfiliasi}
                      onChange={(e) => setHasAfiliasi(e.target.checked)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </div>
                  <p style={{ fontSize: '11px', color: '#1E3A8A', margin: '4px 0 0' }}>
                    PP 20/2026 mewajibkan penggabungan omzet suami-istri dan omzet antara Orang Pribadi dengan Perseroan Perorangan miliknya.
                  </p>
                  {hasAfiliasi && (
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1E40AF', marginBottom: '4px' }}>
                        Omzet Pasangan (Suami/Istri) / PT Perorangan Afiliasi (Rp):
                      </label>
                      <input
                        type="number"
                        value={omzetAfiliasi}
                        onChange={(e) => setOmzetAfiliasi(Math.max(0, Number(e.target.value)))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '6px',
                          border: '1.5px solid #93C5FD',
                          fontSize: '13.5px',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Box Hasil UMKM PP 20/2026 */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Ringkasan Kewajiban UMKM
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      backgroundColor: umkmResult.eligible ? '#D1FAE5' : '#FEE2E2', 
                      color: umkmResult.eligible ? '#065F46' : '#991B1B', 
                      padding: '3px 8px', 
                      borderRadius: '6px', 
                      fontWeight: 700 
                    }}>
                      {umkmResult.badge}
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      {umkmResult.eligible ? 'Estimasi PPh Final Terutang Bulan Ini:' : 'Status Kelayakan Fasilitas:'}
                    </span>
                    {umkmResult.eligible ? (
                      <strong style={{ fontSize: '32px', fontWeight: 900, color: umkmResult.tax > 0 ? '#DC2626' : '#16A34A' }}>
                        {formatIDR(umkmResult.tax)}
                      </strong>
                    ) : (
                      <strong style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626' }}>
                        {umkmResult.title}
                      </strong>
                    )}
                  </div>

                  {/* Callout Penjelasan Regulasi */}
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: umkmResult.eligible ? (umkmResult.isFree ? '#F0FDF4' : '#FFFBEB') : '#FEF2F2',
                    border: umkmResult.eligible ? (umkmResult.isFree ? '1px solid #BBF7D0' : '1px solid #FDE68A') : '1px solid #FCA5A5',
                    fontSize: '12.5px',
                    color: umkmResult.eligible ? (umkmResult.isFree ? '#166534' : '#92400E') : '#991B1B',
                    lineHeight: '1.5',
                    marginBottom: '14px'
                  }}>
                    {umkmResult.message}
                  </div>

                  {/* Rincian Akumulasi Omzet */}
                  <div style={{ padding: '12px 14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '14px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Omzet Bulan Ini:</span>
                      <strong>{formatIDR(omzetBulanan)}</strong>
                    </div>
                    {hasAfiliasi && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: '#64748B' }}>Omzet Pasangan / Afiliasi:</span>
                        <strong>{formatIDR(omzetAfiliasi)}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Total Akumulasi Gabungan:</span>
                      <strong style={{ color: umkmResult.isOverLimit ? '#DC2626' : '#0F172A' }}>
                        {formatIDR(umkmResult.totalGabungan)}
                      </strong>
                    </div>
                    <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                      <span>Batas Maksimal UMKM PP 20/2026:</span>
                      <span>Rp 4.800.000.000 / th</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>
                    ⏰ <strong>Batas Setor &amp; Kode Billing:</strong> Disetor paling lambat tgl 15 bulan berikutnya dengan <strong>KAP 411128 KJS 420</strong> via Coretax DJP / Bank Persepsi / Kantor Pos.
                  </div>
                </div>

                <CalculationShareBar
                  title="PPh Final UMKM 0,5% (PP 20/2026)"
                  details={[
                    { label: 'Bentuk Wajib Pajak', value: subjekUmkm },
                    { label: 'Status Pekerjaan Bebas', value: isPekerjaanBebas ? 'Ya (Dikecualikan dari 0,5%)' : 'Bukan (Berhak Fasilitas)' },
                    { label: 'Omzet Bruto Bulan Ini', value: formatIDR(omzetBulanan) },
                    { label: 'Akumulasi Omzet Gabungan', value: formatIDR(umkmResult.totalGabungan) },
                    { label: 'Kelayakan Tarif 0,5%', value: umkmResult.eligible ? 'Berhak' : 'Wajib Tarif Umum' }
                  ]}
                  taxAmount={umkmResult.eligible ? formatIDR(umkmResult.tax) : 'Wajib PPh Tarif Normal'}
                  note="Kalkulasi disesuaikan dengan PP No. 20 Tahun 2026"
                />

                <div style={{ marginTop: '10px' }}>
                  <a
                    href="https://billing.pajak.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: '#FFC700',
                      color: '#0A2540',
                      fontWeight: 800,
                      fontSize: '13px',
                      padding: '11px',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    Generate Billing UMKM di Portal DJP ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 2: PENGHAPUSAN SANKSI PAJAK 100% (KEP-239/PJ/2026 & PMK 71/2026)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === 'sanksi' && (
            <div style={{ padding: '34px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Simulasi Penghapusan Sanksi Pajak 100%
                  </h3>
                  <span style={{ fontSize: '11px', backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    KEP-239/PJ/2026
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '20px', lineHeight: '1.5' }}>
                  DJP membebaskan sanksi administratif dan denda pajak hingga <strong>100%</strong> bagi Wajib Pajak yang melunasi pokok pajak kurang bayar pada periode <strong>8 Oktober s.d. 31 Desember 2026</strong>.
                </p>

                {/* Jenis Kewajiban SPT */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Jenis SPT yang Kurang Bayar (Objek KEP-239/PJ/2026)
                  </label>
                  <select
                    value={jenisSptSanksi}
                    onChange={(e) => setJenisSptSanksi(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="tahunan">SPT Tahunan PPh (Tahun Pajak s.d. 2025) yang Kurang Bayar</option>
                    <option value="masa">SPT Masa PPh / PPN (Masa Pajak s.d. September 2026)</option>
                    <option value="stp">Surat Tagihan Pajak (STP) / SKPKB Bunga Keterlambatan</option>
                  </select>
                </div>

                {/* Input Pokok Pajak Kurang Bayar */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Pokok Pajak Kurang Bayar (Rp)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748B' }}>
                      Rp
                    </span>
                    <input
                      type="number"
                      value={pokokKurangBayar}
                      onChange={(e) => setPokokKurangBayar(Math.max(0, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 45px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {[5000000, 10000000, 25000000, 50000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPokokKurangBayar(preset)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          color: '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {formatIDR(preset).replace(',00', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Sanksi Administrasi / Denda */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Sanksi Administrasi / Denda Bunga yang Terbit (Rp)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748B' }}>
                      Rp
                    </span>
                    <input
                      type="number"
                      value={sanksiDenda}
                      onChange={(e) => setSanksiDenda(Math.max(0, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 45px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Pemilihan Periode Pembayaran */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Rencana Periode Pelunasan (Tarif Pengurangan KEP-239)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      { id: 'p1', label: '8 Okt – 31 Des 2026', disc: 'Diskon 100%', highlight: true },
                      { id: 'p2', label: 'Jan – Mar 2027', disc: 'Diskon 50%', highlight: false },
                      { id: 'p3', label: 'Apr – Jun 2027', disc: 'Diskon 25%', highlight: false },
                      { id: 'p4', label: 'Setelah Juni 2027', disc: 'Diskon 0%', highlight: false },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPeriodeBayar(p.id)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '8px',
                          border: periodeBayar === p.id ? '2px solid #DC2626' : '1px solid #CBD5E1',
                          backgroundColor: periodeBayar === p.id ? '#FEF2F2' : '#FFFFFF',
                          color: periodeBayar === p.id ? '#991B1B' : '#475569',
                          fontWeight: periodeBayar === p.id ? 800 : 500,
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontSize: '11.5px',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontWeight: 800, color: p.highlight ? '#DC2626' : 'inherit' }}>{p.disc}</div>
                        <div style={{ fontSize: '10px', marginTop: '2px', color: '#64748B' }}>{p.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aturan PMK 71/2026 Info Box */}
                <div style={{ padding: '12px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '12px', color: '#166534' }}>
                  ⚖️ <strong>Aturan Baru PMK 71/2026 (Berlaku 2 Okt 2026):</strong> Pembayaran yang Anda setorkan akan dialokasikan langsung untuk <strong>melunasi pokok utang terlebih dahulu</strong>, tidak lagi dihitung proporsional antara pokok dan denda.
                </div>
              </div>

              {/* Box Hasil Simulasi Penghapusan Sanksi */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Hasil Simulasi KEP-239/PJ/2026
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      Hemat Denda {sanksiResult.diskonPersen}%
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Total Pembayaran Setelah Pemotongan Sanksi:
                    </span>
                    <strong style={{ fontSize: '32px', fontWeight: 900, color: '#16A34A' }}>
                      {formatIDR(sanksiResult.totalWajibSetor)}
                    </strong>
                    <span style={{ fontSize: '12.5px', color: '#059669', display: 'block', marginTop: '4px', fontWeight: 700 }}>
                      🎉 Anda Berhasil Menghemat Denda: {formatIDR(sanksiResult.sanksiDihapus)}
                    </span>
                  </div>

                  <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '16px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Pokok Kurang Bayar (Wajib Lunas):</span>
                      <strong style={{ color: '#0F172A' }}>{formatIDR(sanksiResult.pokok)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Denda Sanksi Semula:</span>
                      <span style={{ textDecoration: sanksiResult.sanksiDihapus > 0 ? 'line-through' : 'none', color: '#64748B' }}>
                        {formatIDR(sanksiResult.dendaAwal)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#059669' }}>
                      <span>Potongan Sanksi ({sanksiResult.diskonPersen}%):</span>
                      <strong>- {formatIDR(sanksiResult.sanksiDihapus)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Sisa Sanksi Denda yang Dibayar:</span>
                      <strong style={{ color: sanksiResult.sisaSanksi > 0 ? '#DC2626' : '#16A34A' }}>
                        {formatIDR(sanksiResult.sisaSanksi)}
                      </strong>
                    </div>
                    <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>Total Bersih yang Disetor:</span>
                      <strong style={{ color: '#16A34A', fontWeight: 900 }}>{formatIDR(sanksiResult.totalWajibSetor)}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>
                    💡 <em>Syarat Pembebasan 100%:</em> Wajib melunasi pokok pajak dan menyampaikan SPT sebelum <strong>31 Desember 2026</strong>. Pengurangan akan berkurang menjadi 50% di awal 2027.
                  </div>
                </div>

                <CalculationShareBar
                  title="Penghapusan Sanksi Denda Pajak (KEP-239/PJ/2026)"
                  details={[
                    { label: 'Objek Pajak / SPT', value: jenisSptSanksi === 'tahunan' ? 'SPT Tahunan (s.d 2025)' : 'SPT Masa (s.d Sept 2026)' },
                    { label: 'Pokok Kurang Bayar', value: formatIDR(sanksiResult.pokok) },
                    { label: 'Denda Awal', value: formatIDR(sanksiResult.dendaAwal) },
                    { label: 'Potongan Denda Disetujui', value: `${sanksiResult.diskonPersen}% (-${formatIDR(sanksiResult.sanksiDihapus)})` },
                    { label: 'Periode Pelunasan', value: sanksiResult.periodeLabel }
                  ]}
                  taxAmount={formatIDR(sanksiResult.totalWajibSetor)}
                  note="Fasilitas KEP-239/PJ/2026 & Mekanisme Pelunasan Pokok PMK 71/2026"
                />

                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const chatWidgetBtn = document.querySelector('.chat-widget-fab, [aria-label="Buka Chatbot"], .chat-floating-button');
                      if (chatWidgetBtn) chatWidgetBtn.click();
                      else alert('Silakan hubungi Helpdesk KPP Pratama Rengat via WhatsApp di 0812-5000-213 untuk pembuatan billing pemutihan denda.');
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '11px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                    }}
                  >
                    💬 Konsultasi Pelunasan KEP-239 via Helpdesk
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 3: PPH 21 TER 2024–2026 (PP 58/2023 & PMK 168/2023)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === 'pph21' && (
            <div style={{ padding: '34px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Input Data Gaji &amp; Status PTKP (TER Bulanan)
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '20px' }}>
                  Perhitungan resmi menggunakan sistem <strong>Tarif Efektif Rata-Rata (TER)</strong> bulanan sesuai Peraturan Pemerintah No. 58 Tahun 2023 &amp; PMK 168/2023.
                </p>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Penghasilan Bruto Sebulan (Gaji Pokok + Tunjangan + Lembur)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748B' }}>
                      Rp
                    </span>
                    <input
                      type="number"
                      value={bruto}
                      onChange={(e) => setBruto(Math.max(0, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 45px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {[5000000, 8500000, 12000000, 15000000, 25000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBruto(preset)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          color: '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {formatIDR(preset).replace(',00', '')}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Status PTKP (Penghasilan Tidak Kena Pajak)
                  </label>
                  <select
                    value={ptkpDetail}
                    onChange={(e) => handlePtkpChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <optgroup label="Kategori A (Bebas s.d Rp 5,4 Jt/bln)">
                      <option value="TK/0">TK/0 - Tidak Kawin, 0 Tanggungan (PTKP Rp 54 Jt)</option>
                      <option value="TK/1">TK/1 - Tidak Kawin, 1 Tanggungan (PTKP Rp 58,5 Jt)</option>
                      <option value="K/0">K/0 - Kawin, 0 Tanggungan (PTKP Rp 58,5 Jt)</option>
                    </optgroup>
                    <optgroup label="Kategori B (Bebas s.d Rp 6,2 Jt/bln)">
                      <option value="TK/2">TK/2 - Tidak Kawin, 2 Tanggungan (PTKP Rp 63 Jt)</option>
                      <option value="TK/3">TK/3 - Tidak Kawin, 3 Tanggungan (PTKP Rp 67,5 Jt)</option>
                      <option value="K/1">K/1 - Kawin, 1 Tanggungan (PTKP Rp 63 Jt)</option>
                      <option value="K/2">K/2 - Kawin, 2 Tanggungan (PTKP Rp 67,5 Jt)</option>
                    </optgroup>
                    <optgroup label="Kategori C (Bebas s.d Rp 6,6 Jt/bln)">
                      <option value="K/3">K/3 - Kawin, 3 Tanggungan (PTKP Rp 72 Jt)</option>
                    </optgroup>
                  </select>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11.5px', color: '#64748B', lineHeight: '1.5' }}>
                  ℹ️ <em>Info Wacana Pajak 2026:</em> Pemerintah melalui Kemenkeu sedang mengkaji rencana kenaikan batas PTKP serta skema Pajak Ditanggung Pemerintah (DTP) bagi pekerja bergaji di bawah Rp 10 Juta.
                </div>
              </div>

              {/* Box Hasil Perhitungan PPh 21 */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Ringkasan Potongan PPh 21 Bulanan
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      Kategori TER: {ptkpCategory}
                    </span>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Estimasi Potongan PPh 21 Bulan Ini:
                    </span>
                    <strong style={{ fontSize: '32px', fontWeight: 900, color: terResult.tax > 0 ? '#DC2626' : '#16A34A' }}>
                      {formatIDR(terResult.tax)}
                    </strong>
                    <span style={{ fontSize: '12.5px', color: '#475569', display: 'block', marginTop: '4px' }}>
                      Tarif Efektif Rata-Rata (TER): <strong>{terResult.rate}%</strong>
                    </span>
                  </div>

                  <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '14px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Gaji Bruto:</span>
                      <strong style={{ color: '#0F172A' }}>{formatIDR(bruto)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#64748B' }}>Potongan PPh 21 (Bulan ini):</span>
                      <strong style={{ color: '#DC2626' }}>- {formatIDR(terResult.tax)}</strong>
                    </div>
                    <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>Gaji Bersih (Take-Home Pay):</span>
                      <strong style={{ color: '#16A34A', fontWeight: 900 }}>{formatIDR(terResult.takeHome)}</strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>
                    💡 <em>Catatan:</em> Pemotongan bulanan Januari–November dihitung menggunakan skema TER. Penghitungan final tahunan tetap dilakukan di masa pajak Desember menggunakan tarif Pasal 17 UU PPh.
                  </p>
                </div>

                <CalculationShareBar
                  title="PPh 21 Pegawai / Karyawan (Skema TER)"
                  details={[
                    { label: 'Gaji Bruto Bulanan', value: formatIDR(bruto) },
                    { label: 'Status PTKP', value: `${ptkpDetail} (Kategori TER ${ptkpCategory})` },
                    { label: 'Tarif Efektif Rata-Rata', value: `${terResult.rate}%` },
                    { label: 'Gaji Bersih Diterima', value: formatIDR(terResult.takeHome) }
                  ]}
                  taxAmount={formatIDR(terResult.tax)}
                  note="Dihitung berdasarkan PP 58/2023 & PMK 168/2023"
                />

                <div style={{ marginTop: '10px' }}>
                  <a
                    href="https://djponline.pajak.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: '#0056B3',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '11px',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    Buka DJP Online / Coretax ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 4: PHTB PROPERTI (PP 34/2016)
             ═════════════════════════════════════════════════════════ */}
          {activeTab === 'phtb' && (
            <div style={{ padding: '34px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Simulasi PPh Pengalihan Hak atas Tanah &amp; Bangunan (PHTB)
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '20px' }}>
                  Kewajiban pembayaran PPh Final bagi penjual atas transaksi jual beli properti di wilayah Kabupaten Indragiri Hulu, Inhil, dan Kuansing.
                </p>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Kategori Objek Properti
                  </label>
                  <select
                    value={jenisPhtb}
                    onChange={(e) => setJenisPhtb(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="umum">Tanah / Rumah / Bangunan Umum (Tarif 2,5%)</option>
                    <option value="sederhana">Rumah Sederhana / Rusun Sederhana Subsidi (Tarif 1,0%)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Nilai Pengalihan / Transaksi (Tertinggi antara NJOP PBB vs Harga Akta)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748B' }}>
                      Rp
                    </span>
                    <input
                      type="number"
                      value={nilaiTransaksi}
                      onChange={(e) => setNilaiTransaksi(Math.max(0, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 45px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {[50000000, 100000000, 200000000, 500000000, 1000000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNilaiTransaksi(preset)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          color: '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {formatIDR(preset).replace(',00', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box Hasil PHTB */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Kewajiban PPh PHTB (Final)
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      KAP 411128 KJS 402
                    </span>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Estimasi PPh yang Harus Dibayar:
                    </span>
                    <strong style={{ fontSize: '32px', fontWeight: 900, color: '#DC2626' }}>
                      {formatIDR(phtbResult.tax)}
                    </strong>
                    <span style={{ fontSize: '12.5px', color: '#475569', display: 'block', marginTop: '4px' }}>
                      Tarif Pengalihan: <strong>{phtbResult.rate}</strong>
                    </span>
                  </div>

                  <div style={{ padding: '12px 14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                    📝 <strong>Alur Validasi Surat Setoran Pajak (SSP):</strong>
                    <ol style={{ paddingLeft: '16px', margin: '6px 0 0' }}>
                      <li>Bayar PPh PHTB via Bank/Pos/Coretax menggunakan kode billing KAP 411128 KJS 402.</li>
                      <li>Ajukan permohonan validasi SSP (e-PHTB) via DJP Online atau loket TPT KPP Pratama Rengat.</li>
                      <li>Bawa Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban ke kantor Notaris/PPAT.</li>
                    </ol>
                  </div>
                </div>

                <CalculationShareBar
                  title="PPh Pengalihan Hak atas Tanah & Bangunan (PHTB)"
                  details={[
                    { label: 'Nilai Transaksi Pengalihan', value: formatIDR(nilaiTransaksi) },
                    { label: 'Kategori Objek', value: jenisPhtb === 'sederhana' ? 'Rumah Sederhana / Subsidi (1%)' : 'Tanah / Properti Umum (2,5%)' },
                    { label: 'Tarif PPh Terutang', value: phtbResult.rate }
                  ]}
                  taxAmount={formatIDR(phtbResult.tax)}
                  note="KAP 411128 KJS 402 - Validasi Surat Setoran Pajak (SSP) di loket TPT KPP Rengat"
                />

                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const chatWidgetBtn = document.querySelector('.chat-widget-fab, [aria-label="Buka Chatbot"], .chat-floating-button');
                      if (chatWidgetBtn) chatWidgetBtn.click();
                      else alert('Silakan buka Chatbot di pojok kanan bawah dan ketik "1A" untuk bantuan kode billing PHTB.');
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '11px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    💬 Bantuan Petugas Kode Billing PHTB (Menu 1A)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
