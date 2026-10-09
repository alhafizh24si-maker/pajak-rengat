import React, { useState, useMemo } from 'react';

// Format angka ke format mata uang Rupiah
function formatIDR(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number || 0);
}

// ── Kalkulasi PPh 21 TER (PP 58/2023 & PMK 168/2023) ──
function calculateTER(bruto, category) {
  const b = Number(bruto) || 0;
  if (b <= 0) return { rate: 0, tax: 0, takeHome: 0 };

  let rate = 0;

  if (category === 'A') {
    // Kategori A: TK/0, TK/1, K/0
    if (b <= 5400000) rate = 0;
    else if (b <= 5650000) rate = 0.0025;
    else if (b <= 5950000) rate = 0.005;
    else if (b <= 6300000) rate = 0.0075;
    else if (b <= 6750000) rate = 0.01;
    else if (b <= 7500000) rate = 0.0125;
    else if (b <= 8550000) rate = 0.015;
    else if (b <= 9650000) rate = 0.0175;
    else if (b <= 10050000) rate = 0.02;
    else if (b <= 10350000) rate = 0.0225;
    else if (b <= 10700000) rate = 0.025;
    else if (b <= 11050000) rate = 0.03;
    else if (b <= 11600000) rate = 0.035;
    else if (b <= 12500000) rate = 0.04;
    else if (b <= 13750000) rate = 0.05;
    else if (b <= 15100000) rate = 0.06;
    else if (b <= 16950000) rate = 0.07;
    else if (b <= 19750000) rate = 0.08;
    else if (b <= 24150000) rate = 0.09;
    else if (b <= 26450000) rate = 0.10;
    else if (b <= 28000000) rate = 0.11;
    else if (b <= 30050000) rate = 0.12;
    else if (b <= 32400000) rate = 0.13;
    else if (b <= 35400000) rate = 0.14;
    else if (b <= 39100000) rate = 0.15;
    else if (b <= 43850000) rate = 0.16;
    else if (b <= 47800000) rate = 0.17;
    else if (b <= 51400000) rate = 0.18;
    else if (b <= 56300000) rate = 0.19;
    else if (b <= 62200000) rate = 0.20;
    else if (b <= 68600000) rate = 0.21;
    else if (b <= 77500000) rate = 0.22;
    else if (b <= 89000000) rate = 0.23;
    else if (b <= 103000000) rate = 0.24;
    else if (b <= 125000000) rate = 0.25;
    else if (b <= 157000000) rate = 0.26;
    else if (b <= 206000000) rate = 0.27;
    else if (b <= 337000000) rate = 0.28;
    else if (b <= 454000000) rate = 0.29;
    else if (b <= 550000000) rate = 0.30;
    else if (b <= 695000000) rate = 0.31;
    else if (b <= 910000000) rate = 0.32;
    else if (b <= 1400000000) rate = 0.33;
    else rate = 0.34;
  } else if (category === 'B') {
    // Kategori B: TK/2, TK/3, K/1, K/2
    if (b <= 6200000) rate = 0;
    else if (b <= 6500000) rate = 0.0025;
    else if (b <= 6850000) rate = 0.005;
    else if (b <= 7300000) rate = 0.0075;
    else if (b <= 9200000) rate = 0.01;
    else if (b <= 10750000) rate = 0.015;
    else if (b <= 12500000) rate = 0.02;
    else if (b <= 14150000) rate = 0.03;
    else if (b <= 16050000) rate = 0.04;
    else if (b <= 18050000) rate = 0.05;
    else if (b <= 20350000) rate = 0.06;
    else if (b <= 23150000) rate = 0.07;
    else if (b <= 26500000) rate = 0.08;
    else if (b <= 30800000) rate = 0.09;
    else if (b <= 36000000) rate = 0.10;
    else if (b <= 42100000) rate = 0.12;
    else if (b <= 50000000) rate = 0.15;
    else if (b <= 75000000) rate = 0.20;
    else if (b <= 100000000) rate = 0.25;
    else rate = 0.30;
  } else {
    // Kategori C: K/3
    if (b <= 6600000) rate = 0;
    else if (b <= 6950000) rate = 0.0025;
    else if (b <= 7350000) rate = 0.005;
    else if (b <= 7800000) rate = 0.0075;
    else if (b <= 8850000) rate = 0.01;
    else if (b <= 9800000) rate = 0.0125;
    else if (b <= 10950000) rate = 0.015;
    else if (b <= 11200000) rate = 0.0175;
    else if (b <= 12050000) rate = 0.02;
    else if (b <= 12950000) rate = 0.03;
    else if (b <= 14150000) rate = 0.04;
    else if (b <= 16000000) rate = 0.05;
    else if (b <= 18000000) rate = 0.06;
    else if (b <= 20000000) rate = 0.07;
    else if (b <= 25000000) rate = 0.09;
    else if (b <= 35000000) rate = 0.12;
    else if (b <= 50000000) rate = 0.15;
    else if (b <= 75000000) rate = 0.20;
    else rate = 0.25;
  }

  const tax = Math.round(b * rate);
  const takeHome = Math.max(0, b - tax);
  return { rate: (rate * 100).toFixed(2), tax, takeHome };
}

export default function TaxCalculator() {
  const [activeTab, setActiveTab] = useState('pph21');

  // State PPh 21 TER
  const [bruto, setBruto] = useState(8500000);
  const [ptkpCategory, setPtkpCategory] = useState('A');
  const [ptkpDetail, setPtkpDetail] = useState('TK/0');

  // State UMKM 0,5%
  const [omzetBulanan, setOmzetBulanan] = useState(25000000);
  const [omzetKumulatif, setOmzetKumulatif] = useState(300000000);
  const [jenisWpUmkm, setJenisWpUmkm] = useState('op'); // 'op' atau 'badan'

  // State PHTB Tanah/Bangunan 2,5%
  const [nilaiTransaksi, setNilaiTransaksi] = useState(150000000);
  const [jenisPhtb, setJenisPhtb] = useState('umum'); // 'umum' (2.5%) atau 'sederhana' (1%)

  // Perhitungan PPh 21 TER
  const terResult = useMemo(() => {
    return calculateTER(bruto, ptkpCategory);
  }, [bruto, ptkpCategory]);

  // Perhitungan UMKM
  const umkmResult = useMemo(() => {
    const omzet = Number(omzetBulanan) || 0;
    const kumulatif = Number(omzetKumulatif) || 0;

    if (jenisWpUmkm === 'badan') {
      const tax = Math.round(omzet * 0.005);
      return {
        tax,
        isFree: false,
        taxableOmzet: omzet,
        message: 'Badan Usaha (CV/PT/Koperasi) dikenakan tarif final 0,5% dari omzet bruto tanpa batasan bebas pajak.',
      };
    }

    // Wajib Pajak Orang Pribadi (PP 55/2022: Bebas pajak sampai omzet kumulatif Rp 500.000.000 / tahun)
    const batasBebas = 500000000;
    if (kumulatif + omzet <= batasBebas) {
      return {
        tax: 0,
        isFree: true,
        taxableOmzet: 0,
        message: `Fasilitas PP 55/2022 Aktif: Omzet kumulatif belum melebihi Rp 500.000.000 dalam tahun ini. Pajak Rp 0 (BEBAS PPh).`,
      };
    } else if (kumulatif < batasBebas) {
      // Sebagian omzet bulan ini menembus batas 500 jt
      const kenaPajak = (kumulatif + omzet) - batasBebas;
      const tax = Math.round(kenaPajak * 0.005);
      return {
        tax,
        isFree: false,
        taxableOmzet: kenaPajak,
        message: `Bulan ini omzet Anda melewati batas Rp 500 jt. Bagian yang dikenakan tarif 0,5% adalah Rp ${new Intl.NumberFormat('id-ID').format(kenaPajak)}.`,
      };
    } else {
      // Sudah lewat 500 jt sepenuhnya
      const tax = Math.round(omzet * 0.005);
      return {
        tax,
        isFree: false,
        taxableOmzet: omzet,
        message: `Omzet kumulatif telah melebihi Rp 500.000.000. Seluruh omzet bulan ini dikenakan tarif PPh Final 0,5%.`,
      };
    }
  }, [omzetBulanan, omzetKumulatif, jenisWpUmkm]);

  // Perhitungan PHTB
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
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header Seksi */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ 
            display: 'inline-block',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            fontWeight: 700,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            padding: '6px 14px',
            borderRadius: '20px',
            marginBottom: '10px',
            border: '1px solid #DBEAFE'
          }}>
            🧮 Fasilitas Wajib Pajak KPP Pratama Rengat
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0A2540', marginBottom: '10px' }}>
            Simulasi &amp; Kalkulator Pajak Terpadu
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
            Hitung estimasi pajak penghasilan Anda secara cepat dan akurat sesuai regulasi perpajakan resmi Republik Indonesia.
          </p>
        </div>

        {/* Tab Navigasi Kalkulator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'pph21', label: '👔 PPh 21 TER 2024 (Karyawan)', badge: 'PP 58/2023' },
            { id: 'umkm', label: '🏪 PPh Final UMKM 0,5%', badge: 'PP 55/2022' },
            { id: 'phtb', label: '🏡 PPh Jual Beli Tanah (PHTB 2,5%)', badge: 'PP 34/2016' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: activeTab === tab.id ? '2px solid #0056B3' : '1px solid #E2E8F0',
                backgroundColor: activeTab === tab.id ? '#FFFFFF' : '#F1F5F9',
                color: activeTab === tab.id ? '#0056B3' : '#475569',
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0, 86, 179, 0.12)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <span>{tab.label}</span>
              <span style={{ 
                fontSize: '10px', 
                backgroundColor: activeTab === tab.id ? '#DBEAFE' : '#E2E8F0',
                color: activeTab === tab.id ? '#1D4ED8' : '#64748B',
                padding: '2px 6px',
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
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>

          {/* ═════════ TAB 1: PPH 21 TER ═════════ */}
          {activeTab === 'pph21' && (
            <div style={{ padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Input Data Gaji &amp; Status PTKP
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                  Perhitungan menggunakan sistem <strong>Tarif Efektif Rata-Rata (TER)</strong> bulanan sesuai Peraturan Pemerintah No. 58 Tahun 2023.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
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
                        padding: '12px 14px 12px 45px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[5000000, 8500000, 12000000, 15000000, 25000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBruto(preset)}
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          borderRadius: '6px',
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Status PTKP (Penghasilan Tidak Kena Pajak)
                  </label>
                  <select
                    value={ptkpDetail}
                    onChange={(e) => handlePtkpChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <optgroup label="Kategori A (Bebas s.d Rp 5,4 Jt)">
                      <option value="TK/0">TK/0 - Tidak Kawin, 0 Tanggungan (PTKP Rp 54 Jt)</option>
                      <option value="TK/1">TK/1 - Tidak Kawin, 1 Tanggungan (PTKP Rp 58,5 Jt)</option>
                      <option value="K/0">K/0 - Kawin, 0 Tanggungan (PTKP Rp 58,5 Jt)</option>
                    </optgroup>
                    <optgroup label="Kategori B (Bebas s.d Rp 6,2 Jt)">
                      <option value="TK/2">TK/2 - Tidak Kawin, 2 Tanggungan (PTKP Rp 63 Jt)</option>
                      <option value="TK/3">TK/3 - Tidak Kawin, 3 Tanggungan (PTKP Rp 67,5 Jt)</option>
                      <option value="K/1">K/1 - Kawin, 1 Tanggungan (PTKP Rp 63 Jt)</option>
                      <option value="K/2">K/2 - Kawin, 2 Tanggungan (PTKP Rp 67,5 Jt)</option>
                    </optgroup>
                    <optgroup label="Kategori C (Bebas s.d Rp 6,6 Jt)">
                      <option value="K/3">K/3 - Kawin, 3 Tanggungan (PTKP Rp 72 Jt)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Box Hasil Perhitungan PPh 21 */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Ringkasan Potongan PPh 21
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      Kategori TER: {ptkpCategory}
                    </span>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Estimasi Potongan Pajak Bulanan:
                    </span>
                    <strong style={{ fontSize: '32px', fontWeight: 900, color: terResult.tax > 0 ? '#DC2626' : '#16A34A' }}>
                      {formatIDR(terResult.tax)}
                    </strong>
                    <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginTop: '4px' }}>
                      Tarif Efektif Rata-Rata (TER): <strong>{terResult.rate}%</strong>
                    </span>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: '#64748B' }}>Gaji Bruto:</span>
                      <strong style={{ color: '#0F172A' }}>{formatIDR(bruto)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: '#64748B' }}>Potongan PPh 21 (Bulan ini):</span>
                      <strong style={{ color: '#DC2626' }}>- {formatIDR(terResult.tax)}</strong>
                    </div>
                    <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>Gaji Bersih Diterima (Take-Home Pay):</span>
                      <strong style={{ color: '#16A34A', fontWeight: 800 }}>{formatIDR(terResult.takeHome)}</strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                    💡 <em>Catatan:</em> Pemotongan bulanan Januari–November dihitung menggunakan TER. Penghitungan final tahunan tetap dilakukan di masa pajak Desember menggunakan tarif Pasal 17 UU PPh.
                  </p>
                </div>

                <div style={{ marginTop: '20px' }}>
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
                      padding: '12px',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    Buka DJP Online / Bukti Potong ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ═════════ TAB 2: UMKM 0,5% ═════════ */}
          {activeTab === 'umkm' && (
            <div style={{ padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Simulasi PPh Final UMKM 0,5% (PP 55/2022)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                  Pelaku UMKM Orang Pribadi mendapatkan fasilitas omzet s.d. <strong>Rp 500 Juta per tahun bebas pajak (Rp 0)</strong>.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Bentuk Wajib Pajak UMKM
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setJenisWpUmkm('op')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: jenisWpUmkm === 'op' ? '2px solid #0056B3' : '1px solid #CBD5E1',
                        backgroundColor: jenisWpUmkm === 'op' ? '#EFF6FF' : '#FFFFFF',
                        fontWeight: jenisWpUmkm === 'op' ? 700 : 500,
                        color: jenisWpUmkm === 'op' ? '#0056B3' : '#475569',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      👤 Orang Pribadi (Ada Bebas Rp 500 Jt)
                    </button>
                    <button
                      type="button"
                      onClick={() => setJenisWpUmkm('badan')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: jenisWpUmkm === 'badan' ? '2px solid #0056B3' : '1px solid #CBD5E1',
                        backgroundColor: jenisWpUmkm === 'badan' ? '#EFF6FF' : '#FFFFFF',
                        fontWeight: jenisWpUmkm === 'badan' ? 700 : 500,
                        color: jenisWpUmkm === 'badan' ? '#0056B3' : '#475569',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      🏢 Badan Usaha (CV/PT)
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Omzet / Penjualan Bruto Bulan Ini (Rp)
                  </label>
                  <input
                    type="number"
                    value={omzetBulanan}
                    onChange={(e) => setOmzetBulanan(Math.max(0, Number(e.target.value)))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {jenisWpUmkm === 'op' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Akumulasi Omzet dari Awal Tahun s.d. Bulan Lalu (Rp)
                    </label>
                    <input
                      type="number"
                      value={omzetKumulatif}
                      onChange={(e) => setOmzetKumulatif(Math.max(0, Number(e.target.value)))}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <small style={{ color: '#64748B', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                      Diperlukan untuk memvalidasi batas omzet Rp 500 Juta per tahun pajak.
                    </small>
                  </div>
                )}
              </div>

              {/* Box Hasil UMKM */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Setoran PPh Final 0,5%
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      KAP 411128 KJS 420
                    </span>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Pajak Terutang yang Harus Disetor:
                    </span>
                    <strong style={{ fontSize: '32px', fontWeight: 900, color: umkmResult.tax > 0 ? '#DC2626' : '#16A34A' }}>
                      {formatIDR(umkmResult.tax)}
                    </strong>
                    <div style={{
                      marginTop: '10px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: umkmResult.isFree ? '#F0FDF4' : '#FFFBEB',
                      border: umkmResult.isFree ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                      fontSize: '12.5px',
                      color: umkmResult.isFree ? '#166534' : '#92400E',
                      lineHeight: '1.5'
                    }}>
                      {umkmResult.message}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                    ⏰ <strong>Batas Waktu Setor:</strong> Paling lambat tanggal 15 bulan berikutnya melalui Bank Persepsi / Pos / ATM / m-Banking menggunakan Kode Billing e-Billing DJP.
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
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
                      padding: '12px',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    Buat Kode Billing di Portal DJP ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ═════════ TAB 3: PHTB TANAH / BANGUNAN 2,5% ═════════ */}
          {activeTab === 'phtb' && (
            <div style={{ padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Simulasi PPh Pengalihan Hak atas Tanah &amp; Bangunan (PHTB)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                  Kewajiban pembayaran PPh Final bagi penjual atas transaksi jual beli tanah dan/atau bangunan di wilayah Kabupaten Indragiri Hulu, Inhil, dan Kuansing.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Kategori Objek Properti
                  </label>
                  <select
                    value={jenisPhtb}
                    onChange={(e) => setJenisPhtb(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Nilai Pengalihan / Transaksi (Pilih yang tertinggi antara NJOP PBB vs Harga Akta)
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
                        padding: '12px 14px 12px 45px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[50000000, 100000000, 200000000, 500000000, 1000000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNilaiTransaksi(preset)}
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          borderRadius: '6px',
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
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      Kewajiban PPh PHTB (Final)
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      KAP 411128 KJS 402
                    </span>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Estimasi PPh yang Harus Dibayar:
                    </span>
                    <strong style={{ fontSize: '32px', fontWeight: 900, color: '#DC2626' }}>
                      {formatIDR(phtbResult.tax)}
                    </strong>
                    <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginTop: '4px' }}>
                      Tarif Pengalihan: <strong>{phtbResult.rate}</strong>
                    </span>
                  </div>

                  <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                    📝 <strong>Alur Validasi Surat Setoran Pajak (SSP):</strong>
                    <ol style={{ paddingLeft: '16px', margin: '6px 0 0' }}>
                      <li>Bayar PPh PHTB via Bank/Pos/Coretax.</li>
                      <li>Ajukan validasi SSP (e-PHTB) secara mandiri via DJP Online atau loket TPT KPP Pratama Rengat.</li>
                      <li>Bawa Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban ke kantor Notaris/PPAT.</li>
                    </ol>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
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
                      padding: '12px',
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
