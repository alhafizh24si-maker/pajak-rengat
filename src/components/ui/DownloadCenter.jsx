import React, { useState } from 'react';

const officialForms = [
  {
    id: 'efin',
    category: 'Layanan',
    title: 'Formulir Permohonan Aktivasi / Lupa EFIN',
    code: 'PER-04/PJ/2020',
    desc: 'Digunakan oleh Wajib Pajak Orang Pribadi atau Badan untuk aktivasi awal atau cetak ulang kode EFIN DJP Online.',
    fileType: 'PDF',
    size: '145 KB',
    link: 'https://www.pajak.go.id/sites/default/files/2020-03/Formulir%20Permohonan%20EFIN.pdf',
    icon: '🔐'
  },
  {
    id: 'spt-1770s',
    category: 'SPT Tahunan',
    title: 'Formulir SPT Tahunan PPh Orang Pribadi 1770 S',
    code: 'Form 1770 S',
    desc: 'Untuk Wajib Pajak Orang Pribadi berstatus karyawan dengan penghasilan bruto di atas Rp 60.000.000 setahun.',
    fileType: 'PDF',
    size: '320 KB',
    link: 'https://www.pajak.go.id/id/formulir-spt-tahunan-orang-pribadi-1770-s',
    icon: '📊'
  },
  {
    id: 'spt-1770ss',
    category: 'SPT Tahunan',
    title: 'Formulir SPT Tahunan PPh Orang Pribadi 1770 SS',
    code: 'Form 1770 SS',
    desc: 'Untuk Wajib Pajak Orang Pribadi karyawan dengan penghasilan bruto tidak lebih dari Rp 60.000.000 setahun.',
    fileType: 'PDF',
    size: '180 KB',
    link: 'https://www.pajak.go.id/id/formulir-spt-tahunan-orang-pribadi-1770-ss',
    icon: '📝'
  },
  {
    id: 'spt-1770',
    category: 'SPT Tahunan',
    title: 'Formulir SPT Tahunan PPh OP Usahawan 1770',
    code: 'Form 1770',
    desc: 'Untuk Wajib Pajak yang memiliki usaha (UMKM, toko, bengkel, dokter, arsitek) atau pekerjaan bebas.',
    fileType: 'PDF',
    size: '410 KB',
    link: 'https://www.pajak.go.id/id/formulir-spt-tahunan-orang-pribadi-1770',
    icon: '🏪'
  },
  {
    id: 'update-data',
    category: 'Profil',
    title: 'Formulir Perubahan Data Wajib Pajak',
    code: 'PER-04/PJ/2020',
    desc: 'Untuk pengkinian alamat, nomor HP, email terdaftar, atau klasifikasi lapangan usaha (KLU).',
    fileType: 'PDF',
    size: '215 KB',
    link: 'https://www.pajak.go.id/id/formulir-perubahan-data-wajib-pajak',
    icon: '👤'
  },
  {
    id: 'skb-phtb',
    category: 'Layanan',
    title: 'Formulir Permohonan SKB PPh Pengalihan Tanah (PHTB)',
    code: 'PMK 261/2016',
    desc: 'Permohonan pembebasan PPh tanah/bangunan karena warisan atau hibah keluarga sedarah semenda.',
    fileType: 'PDF',
    size: '190 KB',
    link: 'https://www.pajak.go.id/id/formulir-permohonan-skb-phtb',
    icon: '📄'
  }
];

export default function DownloadCenter() {
  const [filterCat, setFilterCat] = useState('Semua');
  const [search, setSearch] = useState('');

  const categories = ['Semua', 'SPT Tahunan', 'Layanan', 'Profil'];

  const filteredForms = officialForms.filter((f) => {
    const matchCat = filterCat === 'Semua' || f.category === filterCat;
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="download-center-section" id="unduh-formulir" style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ 
            display: 'inline-block',
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            fontWeight: 700,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            padding: '6px 14px',
            borderRadius: '20px',
            marginBottom: '10px',
            border: '1px solid #FDE68A'
          }}>
            📁 Berkas &amp; Dokumen Resmi
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0A2540', marginBottom: '10px' }}>
            Pusat Unduh Formulir Perpajakan
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
            Unduh formulir permohonan resmi Direktorat Jenderal Pajak untuk pengurusan administrasi di KPP Pratama Rengat.
          </p>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: filterCat === cat ? '1.5px solid #0056B3' : '1px solid #E2E8F0',
                  backgroundColor: filterCat === cat ? '#EFF6FF' : '#F8FAFC',
                  color: filterCat === cat ? '#0056B3' : '#64748B',
                  fontWeight: filterCat === cat ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari formulir (misal: EFIN, 1770)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1.5px solid #E2E8F0',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Grid Formulir */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredForms.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{item.icon}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.fileType}
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.size}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0056B3', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {item.code}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', lineHeight: '1.4' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', marginBottom: '16px' }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Resmi DJP RI</span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#0056B3',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>⬇️ Unduh Berkas</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748B' }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>📄</span>
            <p>Tidak ada formulir yang sesuai dengan pencarian Anda.</p>
          </div>
        )}

      </div>
    </section>
  );
}
