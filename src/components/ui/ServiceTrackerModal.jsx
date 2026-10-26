import React, { useState } from 'react';
import { FiSearch, FiCheckCircle, FiX, FiCheck } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

// Database Mock Permohonan Layanan KPP Pratama Rengat
const SAMPLE_APPLICATIONS = [
  {
    ticketNumber: 'SKB-2026-0819',
    nik: '1402011508890001',
    applicantName: 'Budi Santoso',
    serviceType: 'Surat Keterangan Bebas (SKB) PPh PHTB',
    submissionDate: '10 Oktober 2026',
    estimatedCompletion: '13 Oktober 2026 (Maks 3 Hari Kerja)',
    currentStep: 3, // 1: Diterima, 2: Verifikasi, 3: Penelitian AR, 4: Selesai
    statusText: 'Penelitian Dokumen oleh Account Representative (AR)',
    statusBadgeColor: '#2563EB',
    officer: 'Tim Pengawasan & Konsultasi (Seksi Waskon II)',
    notes: 'Seluruh berkas persyaratan telah lengkap. Sedang proses penelitian kepatuhan formal dan material.',
    history: [
      { step: 'Pengajuan Diterima', time: '10 Okt 2026 09:15 WIB', desc: 'Permohonan berhasil didaftarkan di sistem loket TPT KPP Pratama Rengat.' },
      { step: 'Verifikasi Berkas', time: '10 Okt 2026 13:40 WIB', desc: 'Kelengkapan dokumen fotokopi KTP, SPPT PBB, dan sertifikat terverifikasi valid.' },
      { step: 'Penelitian oleh AR', time: '11 Okt 2026 10:00 WIB', desc: 'Sedang dilakukan pengujian keabsahan transaksi tanah/bangunan.' },
      { step: 'Penerbitan Surat (SKB)', time: 'Estimasi: 13 Okt 2026', desc: 'Surat Keputusan akan diterbitkan dan siap diambil di loket TPT.' }
    ]
  },
  {
    ticketNumber: 'PHTB-2026-0412',
    nik: '1402022204910003',
    applicantName: 'Siti Rahmawati',
    serviceType: 'Validasi Pembayaran SSP PHTB (Jual Beli Tanah)',
    submissionDate: '11 Oktober 2026',
    estimatedCompletion: '14 Oktober 2026 (Maks 3 Hari Kerja)',
    currentStep: 2,
    statusText: 'Verifikasi Kelengkapan Bukti Setor & NOP PBB',
    statusBadgeColor: '#D97706',
    officer: 'Seksi Pelayanan KPP Pratama Rengat',
    notes: 'Petugas sedang mencocokkan NTPN Bukti Penerimaan Negara dengan rekening kas negara.',
    history: [
      { step: 'Pengajuan Diterima', time: '11 Okt 2026 10:30 WIB', desc: 'Permohonan validasi SSP diajukan mandiri via portal DJP Online.' },
      { step: 'Verifikasi Berkas', time: '11 Okt 2026 14:15 WIB', desc: 'Pengecekan kesesuaian nilai transaksi dengan NJOP PBB objek pajak.' },
      { step: 'Penelitian oleh AR', time: 'Estimasi: 12 Okt 2026', desc: 'Konfirmasi data nilai perolehan tanah.' },
      { step: 'Penerbitan Bukti Penelitian', time: 'Estimasi: 14 Okt 2026', desc: 'Surat Keterangan Penelitian Formal PHTB siap dicetak.' }
    ]
  },
  {
    ticketNumber: 'EFIN-2026-0155',
    nik: '1402035607950002',
    applicantName: 'Hendra Wijaya',
    serviceType: 'Aktivasi / Reset EFIN DJP Online',
    submissionDate: '12 Oktober 2026',
    estimatedCompletion: '12 Oktober 2026 (Hari yang sama)',
    currentStep: 4,
    statusText: 'Selesai — EFIN Berhasil Dikirimkan ke Email Terdaftar',
    statusBadgeColor: '#059669',
    officer: 'Helpdesk Digital KPP Pratama Rengat',
    notes: 'Kode EFIN telah diaktifkan kembali. Silakan cek kotak masuk atau folder spam email Anda.',
    history: [
      { step: 'Pengajuan Diterima', time: '12 Okt 2026 08:20 WIB', desc: 'Formulir permohonan reset EFIN & foto selfie KTP diterima.' },
      { step: 'Verifikasi Berkas', time: '12 Okt 2026 08:35 WIB', desc: 'Validasi identitas biometrik dan NIK pada data Kependudukan (Dukcapil).' },
      { step: 'Pemrosesan Akun', time: '12 Okt 2026 08:45 WIB', desc: 'Reset password dan token EFIN di sistem SIDJP.' },
      { step: 'Selesai', time: '12 Okt 2026 08:50 WIB', desc: 'EFIN telah dikirim ke hendra.w***@gmail.com.' }
    ]
  }
];

export default function ServiceTrackerModal({ isOpen, onClose }) {
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const clean = searchKey.trim().toUpperCase();
    if (!clean) return;

    setHasSearched(true);
    const found = SAMPLE_APPLICATIONS.find(
      (app) => app.ticketNumber.toUpperCase() === clean || app.nik === clean
    );
    setSearchResult(found || null);
  };

  const handleUseDemoTicket = (ticket) => {
    setSearchKey(ticket);
    const found = SAMPLE_APPLICATIONS.find((app) => app.ticketNumber === ticket);
    setSearchResult(found || null);
    setHasSearched(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 37, 64, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Modal */}
        <div style={{
          backgroundColor: '#0A2540',
          color: '#FFFFFF',
          padding: '20px 28px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <FiSearch size={22} color="#FFD100" />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFD100' }}>
                Lacak Status Permohonan Layanan
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1' }}>
              Cek progres permohonan SKB, EFIN, dan Bukti Validasi PHTB KPP Pratama Rengat
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Tutup Modal"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Konten Modal */}
        <div style={{ padding: '28px' }}>
          {/* Form Pencarian */}
          <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
              Masukkan Nomor Tiket / Bukti Penerimaan Surat (BPS) atau NIK:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Contoh: SKB-2026-0819 atau 1402..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0056B3',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cari Status
              </button>
            </div>
          </form>

          {/* Quick Demo Tag */}
          <div style={{ marginBottom: '24px', fontSize: '12px', color: '#64748B' }}>
            <span>Uji coba sampel permohonan: </span>
            {['SKB-2026-0819', 'PHTB-2026-0412', 'EFIN-2026-0155'].map((tk) => (
              <button
                key={tk}
                type="button"
                onClick={() => handleUseDemoTicket(tk)}
                style={{
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#1D4ED8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginRight: '6px',
                  marginTop: '4px'
                }}
              >
                {tk}
              </button>
            ))}
          </div>

          {/* Hasil Pencarian */}
          {searchResult ? (
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '24px'
            }}>
              {/* Header Hasil */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    Nomor Tiket / BPS
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                    {searchResult.ticketNumber}
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                    Pemohon: <strong>{searchResult.applicantName}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: `${searchResult.statusBadgeColor}15`,
                    color: searchResult.statusBadgeColor,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {searchResult.statusText}
                  </span>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Estimasi Selesai: <strong>{searchResult.estimatedCompletion}</strong>
                  </div>
                </div>
              </div>

              {/* Timeline 4 Langkah */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '14px', textTransform: 'uppercase' }}>
                  Progres Penyelesaian Berkas
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  position: 'relative',
                  marginBottom: '16px'
                }}>
                  {[
                    { step: 1, label: 'Diterima' },
                    { step: 2, label: 'Verifikasi' },
                    { step: 3, label: 'Penelitian' },
                    { step: 4, label: 'Terbit' }
                  ].map((s) => {
                    const isPassed = s.step <= searchResult.currentStep;
                    const isCurrent = s.step === searchResult.currentStep;
                    return (
                      <div key={s.step} style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isCurrent ? '#2563EB' : isPassed ? '#10B981' : '#E2E8F0',
                          color: isPassed ? '#FFFFFF' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 6px',
                          fontWeight: 700,
                          fontSize: '13px'
                        }}>
                          {isPassed ? (isCurrent ? s.step : <FiCheck size={14} style={{ strokeWidth: 2.5 }} />) : s.step}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: isCurrent ? 800 : 600,
                          color: isCurrent ? '#1D4ED8' : '#64748B'
                        }}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rincian Petugas & Catatan */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                marginBottom: '20px',
                fontSize: '13px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Layanan: </span>
                  <strong>{searchResult.serviceType}</strong>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Unit Pengolah: </span>
                  <strong>{searchResult.officer}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Catatan Petugas: </span>
                  <span style={{ color: '#0F172A', fontStyle: 'italic' }}>"{searchResult.notes}"</span>
                </div>
              </div>

              {/* Riwayat Tahapan Log */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Log Riwayat Aktivitas
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResult.history.map((h, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '12.5px',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #F1F5F9'
                    }}>
                      <span style={{ color: '#2563EB', fontWeight: 700 }}>•</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: '#0F172A' }}>{h.step}</strong>
                          <span style={{ color: '#94A3B8', fontSize: '11px' }}>{h.time}</span>
                        </div>
                        <p style={{ margin: '2px 0 0', color: '#64748B', fontSize: '12px' }}>{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Hubungi WhatsApp Petugas */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a
                  href={`https://wa.me/628125000213?text=Halo%20KPP%20Pratama%20Rengat,%20saya%20ingin%20menanyakan%20status%20permohonan%20dengan%20nomor%20tiket%20${searchResult.ticketNumber}%20atas%20nama%20${encodeURIComponent(searchResult.applicantName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                >
                  <BsWhatsapp size={15} /> Konfirmasi via Helpdesk WhatsApp
                </a>
              </div>
            </div>
          ) : hasSearched ? (
            <div style={{
              textAlign: 'center',
              padding: '36px 20px',
              backgroundColor: '#FEF2F2',
              borderRadius: '16px',
              border: '1px solid #FEE2E2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <FiSearch size={36} color="#DC2626" />
              </div>
              <h4 style={{ color: '#991B1B', fontWeight: 700, marginBottom: '6px' }}>
                Nomor Tiket / Permohonan Tidak Ditemukan
              </h4>
              <p style={{ color: '#B91C1C', fontSize: '13px', maxWidth: '480px', margin: '0 auto 16px' }}>
                Pastikan nomor tiket atau NIK yang Anda masukkan sudah benar, atau hubungi petugas loket kami untuk pengecekan manual di sistem SIDJP.
              </p>
              <button
                onClick={() => setSearchKey('')}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#991B1B',
                  border: '1px solid #FCA5A5',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Coba Cari Lagi
              </button>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '30px 20px',
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px dashed #CBD5E1',
              color: '#64748B',
              fontSize: '13px'
            }}>
              <p style={{ margin: 0 }}>
                💡 Masukkan nomor tiket dari formulir Bukti Penerimaan Surat (BPS) atau klik salah satu sampel di atas untuk melihat alur status permohonan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
