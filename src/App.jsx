import React, { useState } from 'react';
import ChatWidget from './components/chatbot/ChatWidget';
import logoDjp from './assets/img/logo-djp-nonfix.jpeg';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('semua');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeNewsTab, setActiveNewsTab] = useState('pengumuman');

  // Data Layanan Utama
  const services = [
    {
      id: 'npwp',
      category: 'layanan',
      code: '01',
      title: 'Pendaftaran & Cetak NPWP',
      desc: 'Petunjuk pembuatan NPWP baru untuk WNI/WNA, cetak ulang kartu fisik, hingga perubahan data wajib pajak.',
      icon: '📋',
    },
    {
      id: 'efin',
      category: 'layanan',
      code: '02',
      title: 'Aktivasi & Lupa EFIN',
      desc: 'Prosedur penetapan kembali EFIN terblokir atau lupa EFIN untuk keperluan akses DJP Online.',
      icon: '🔐',
    },
    {
      id: 'spt',
      category: 'pelaporan',
      code: '03',
      title: 'Pelaporan SPT Tahunan & Masa',
      desc: 'Panduan e-Filing 1770, 1770 S, 1770 SS, serta penyampaian kewajiban masa secara akurat.',
      icon: '📊',
    },
    {
      id: 'ebilling',
      category: 'pembayaran',
      code: '04',
      title: 'Pembuatan Kode e-Billing',
      desc: 'Bantuan generasi kode billing pembayaran pajak setor sendiri atau pemotongan pihak lain.',
      icon: '💳',
    },
    {
      id: 'pkp',
      category: 'layanan',
      code: '05',
      title: 'Pengukuhan PKP',
      desc: 'Prosedur pengajuan pengukuhan Pengusaha Kena Pajak beserta persyaratan dan masa berlaku.',
      icon: '🏢',
    },
    {
      id: 'skpf',
      category: 'pelaporan',
      code: '06',
      title: 'Surat Keterangan Bebas / Lebih Bayar',
      desc: 'Penerbitan SKPF untuk keperluan pindah, pensiun, atau keperluan administrasi lainnya.',
      icon: '📄',
    },
    {
      id: 'pph',
      category: 'pembayaran',
      code: '07',
      title: 'Pemotongan PPh 21/26',
      desc: 'Panduan perhitungan dan pemotongan PPh Pasal 21/26 atas penghasilan pegawai dan pensiunan.',
      icon: '💰',
    },
    {
      id: 'restitusi',
      category: 'pembayaran',
      code: '08',
      title: 'Pengembalian Pendapatan (Restitusi)',
      desc: 'Prosedur pengajuan keberatan, pemeriksaan, dan pencairan restitusi pajak.',
      icon: '🏦',
    },
  ];

  // Data FAQ Accordion
  const faqs = [
    {
      q: 'Berapa lama batas waktu pelaporan SPT Tahunan Orang Pribadi?',
      a: 'Batas akhir pelaporan SPT Tahunan Orang Pribadi adalah tanggal 31 Maret setiap tahunnya. Sedangkan untuk Badan Usaha jatuh pada 30 April.',
    },
    {
      q: 'Bagaimana jika saya lupa EFIN dan butuh cepat?',
      a: 'Anda dapat memanfaatkan layanan cepat chatbot kami di pojok kanan bawah atau mengajukan permohonan via email resmi kpp.rengat@pajak.go.id. Bisa juga datang langsung ke kantor KPP dengan membawa KTP asli.',
    },
    {
      q: 'Apakah pendaftaran NPWP dikenakan biaya?',
      a: 'Seluruh pelayanan di KPP Pratama Rengat bebas dari biaya (Gratis / Rp 0). Jangan percaya pihak yang meminta imbalan untuk pengurusan NPWP.',
    },
    {
      q: 'Bagaimana cara menghubungi KPP Pratama Rengat?',
      a: 'Anda dapat menghubungi melalui telepon (0769) 321234, email kpp.rengat@pajak.go.id, atau langsung datang ke Jl. Jend. Sudirman No. 1, Rengat, Indragiri Hulu.',
    },
    {
      q: 'Apa sanksi jika terlambat melaporkan SPT?',
      a: 'Sanksi keterlambatan pelaporan SPT Tahunan adalah sebesar Rp 100.000 untuk WP Orang Pribadi dan Rp 1.000.000 untuk WP Badan. Segera laporkan meskipun terlambat untuk menghindari sanksi lebih berat.',
    },
    {
      q: 'Apakah bisa melaporkan SPT secara online dari rumah?',
      a: 'Ya, Anda dapat melaporkan SPT secara online melalui situs djponline.pajak.go.id menggunakan EFIN yang telah Anda miliki. Pastikan menggunakan browser yang didukung dan koneksi internet stabil.',
    },
  ];

  // Data Pengumuman & Berita
  const announcements = [
    {
      date: '28 Des 2024',
      title: 'Perpanjangan Masa Pelaporan SPT Tahunan 2024',
      tag: 'Penting',
      tagColor: '#DC2626',
      summary: 'Berdasarkan PER-XX/PJ/2024, batas waktu pelaporan SPT Tahunan OP diperpanjang hingga 31 Maret 2025.',
    },
    {
      date: '15 Des 2024',
      title: 'Jadwal Layanan Tatap Muka Libur Natal & Tahun Baru',
      tag: 'Jadwal',
      tagColor: '#2563EB',
      summary: 'Layanan tatap muka KPP Pratama Rengat libur pada 25-26 Des 2024 dan 1 Jan 2025. Chatbot tetap beroperasi 24 jam.',
    },
    {
      date: '01 Des 2024',
      title: 'Update Aplikasi e-Filing Versi 3.2',
      tag: 'Teknis',
      tagColor: '#059669',
      summary: 'DJP telah merilis pembaruan e-Filing dengan fitur auto-save dan tampilan responsif yang lebih baik.',
    },
  ];

  const newsItems = [
    {
      date: '20 Des 2024',
      title: 'Program Tax Amnesty Jilid II: Peluang Kepatuhan Sukarela',
      tag: 'Program',
      tagColor: '#D97706',
      summary: 'Pemerintah membuka peluang pengungkapan harta secara sukarela dengan tarif spesial dalam rangka meningkatkan kepatuhan pajak.',
    },
    {
      date: '10 Des 2024',
      title: 'Sosialisasi Perpajakan UMKM di Kabupaten Indragiri Hulu',
      tag: 'Kegiatan',
      tagColor: '#7C3AED',
      summary: 'KPP Pratama Rengat mengadakan sosialisasi pemenuhan kewajiban perpajakan bagi pelaku UMKM di seluruh kecamatan.',
    },
    {
      date: '05 Des 2024',
      title: 'Penghargaan Predikat A untuk KPP Pratama Rengat',
      tag: 'Prestasi',
      tagColor: '#059669',
      summary: 'KPP Pratama Rengat meraih predikat A dalam evaluasi kinerja instansi vertikal DJP tahun 2024.',
    },
  ];

  const currentNews = activeNewsTab === 'pengumuman' ? announcements : newsItems;

  // Data Alur Layanan
  const flowSteps = [
    { step: 1, title: 'Kunjungi Portal', desc: 'Akses djponline.pajak.go.id atau datang ke kantor KPP' },
    { step: 2, title: 'Siapkan Dokumen', desc: 'KTP, NPWP (jika ada), dan dokumen pendukung' },
    { step: 3, title: 'Proses Permohonan', desc: 'Isi formulir elektronik atau serahkan berkas fisik' },
    { step: 4, title: 'Verifikasi Data', desc: 'Petugas memverifikasi kelengkapan dan keabsahan data' },
    { step: 5, title: 'Selesai & Terbit', desc: 'Dokumen/bukti selesai diproses dan diterbitkan' },
  ];

  // Data Quick Links
  const quickLinks = [
    { title: 'DJP Online', url: 'https://djponline.pajak.go.id', icon: '🌐' },
    { title: 'e-Billing', url: 'https://billing.pajak.go.id', icon: '🧾' },
    { title: 'e-Registration', url: 'https://ereg.pajak.go.id', icon: '📝' },
    { title: 'Lapor SPT Online', url: 'https://efiling.pajak.go.id', icon: '📱' },
    { title: 'Info Pajak', url: 'https://www.pajak.go.id', icon: 'ℹ️' },
    { title: 'Klikpajak', url: 'https://www.klikpajak.id', icon: '🔗' },
  ];

  // Data Kontak Darurat
  const emergencyContacts = [
    { label: 'Telepon KPP', value: '(0769) 321234', icon: '📞' },
    { label: 'Fax', value: '(0769) 321235', icon: '📠' },
    { label: 'Email Resmi', value: 'kpp.rengat@pajak.go.id', icon: '✉️' },
    { label: 'WhatsApp', value: '0812-XXXX-XXXX', icon: '💬' },
  ];

  const filteredServices = services.filter((s) => {
    const matchCategory = activeTab === 'semua' || s.category === activeTab;
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="app-shell">
      {/* Header Utama / Topbar */}
      <header className="topbar">
        <div className="brand-lockup">
          <img 
            src={logoDjp} 
            alt="Logo Kementerian Keuangan & DJP" 
            className="brand-logo-img"
          />
          <div className="brand-divider" />
          <div className="brand-text">
            <span className="brand-kicker">Direktorat Jenderal Pajak</span>
            <strong>KPP Pratama Rengat</strong>
          </div>
        </div>
        
        <div className="topbar-right">
          <nav className="topbar-nav">
            <a href="#layanan" className="topbar-link">Layanan</a>
            <a href="#informasi" className="topbar-link">Informasi</a>
            <a href="#faq" className="topbar-link">FAQ</a>
            <a href="#kontak" className="topbar-link">Kontak</a>
          </nav>
          <div className="status-badge">
            <span className="status-dot" />
            <span className="status-text">Online</span>
          </div>
        </div>
      </header>

      {/* Marquee Pengumuman */}
      <div className="marquee-bar">
        <div className="marquee-content">
          <span className="marquee-item">⚡ Batas SPT Tahunan OP: 31 Maret 2025</span>
          <span className="marquee-separator">•</span>
          <span className="marquee-item">📋 Layanan chatbot tersedia 24 jam non-stop</span>
          <span className="marquee-separator">•</span>
          <span className="marquee-item">🚫 Seluruh layanan DJP GRATIS — Waspadai pungli!</span>
          <span className="marquee-separator">•</span>
          <span className="marquee-item">📞 Butuh bantuan? Hubungi (0769) 321234</span>
          <span className="marquee-separator">•</span>
          <span className="marquee-item">⚡ Batas SPT Tahunan OP: 31 Maret 2025</span>
          <span className="marquee-separator">•</span>
          <span className="marquee-item">📋 Layanan chatbot tersedia 24 jam non-stop</span>
          <span className="marquee-separator">•</span>
          <span className="marquee-item">🚫 Seluruh layanan DJP GRATIS — Waspadai pungli!</span>
          <span className="marquee-separator">•</span>
          <span className="marquee-item">📞 Butuh bantuan? Hubungi (0769) 321234</span>
        </div>
      </div>

      {/* Konten Utama */}
      <main className="main-content">
        {/* Banner Utama */}
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <span className="eyebrow">Pusat Layanan & Informasi Perpajakan</span>
            <h1 id="welcome-title">Asisten Virtual KPP Pratama Rengat</h1>
            <p className="welcome-description">
              Dapatkan bantuan seputar pendaftaran NPWP, pelaporan SPT, pemulihan EFIN, dan konsultasi perpajakan secara cepat melalui interaksi cerdas terpadu.
            </p>
            
            {/* Interactive Search Bar */}
            <div className="search-box-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Cari layanan (misal: EFIN, NPWP, SPT)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                  &times;
                </button>
              )}
            </div>

            <div className="welcome-actions">
              <button className="btn-primary-hero" onClick={() => window.scrollTo({ top: document.getElementById('layanan')?.offsetTop - 100, behavior: 'smooth' })}>
                Jelajahi Layanan
              </button>
              <button className="btn-outline-hero" onClick={() => window.scrollTo({ top: document.getElementById('faq')?.offsetTop - 100, behavior: 'smooth' })}>
                Lihat FAQ
              </button>
              <span className="action-hint">
                <span className="pulse-arrow">↗</span> Chatbot di pojok kanan bawah
              </span>
            </div>
          </div>

          <div className="welcome-seal" aria-hidden="true">
            <div className="seal-inner">
              <span className="seal-tag">AI 24/7</span>
              <small>Respons Cepat &<br /> Terintegrasi</small>
            </div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="stats-container">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-blue">
              <span>🕐</span>
            </div>
            <div className="stat-info">
              <div className="stat-number">24 Jam</div>
              <div className="stat-label">Layanan Chatbot Virtual</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-green">
              <span>🏢</span>
            </div>
            <div className="stat-info">
              <div className="stat-number">08:00 - 16:00</div>
              <div className="stat-label">Jam Operasional Tatap Muka</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-yellow">
              <span>✅</span>
            </div>
            <div className="stat-info">
              <div className="stat-number">100% Gratis</div>
              <div className="stat-label">Bebas Biaya & Gratifikasi</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-purple">
              <span>👥</span>
            </div>
            <div className="stat-info">
              <div className="stat-number">45.000+</div>
              <div className="stat-label">Wajib Pajak Terlayani</div>
            </div>
          </div>
        </section>

        {/* Alur Layanan Section */}
        <section className="flow-section" id="alur">
          <h2 className="section-title-center">Alur Pelayanan Perpajakan</h2>
          <p className="section-subtitle-center">Lima langkah mudah untuk menyelesaikan kebutuhan perpajakan Anda</p>
          <div className="flow-steps-container">
            {flowSteps.map((item, idx) => (
              <div key={item.step} className="flow-step-card">
                <div className="flow-step-number">{item.step}</div>
                <h4 className="flow-step-title">{item.title}</h4>
                <p className="flow-step-desc">{item.desc}</p>
                {idx < flowSteps.length - 1 && <div className="flow-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* Quick Access Links */}
        <section className="quick-links-section">
          <h2 className="section-title-center">Akses Cepat Layanan DJP</h2>
          <p className="section-subtitle-center">Tautan langsung ke portal resmi Direktorat Jenderal Pajak</p>
          <div className="quick-links-grid">
            {quickLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="quick-link-card">
                <span className="quick-link-icon">{link.icon}</span>
                <span className="quick-link-title">{link.title}</span>
                <span className="quick-link-arrow">→</span>
              </a>
            ))}
          </div>
        </section>

        {/* Dynamic Filter Tabs */}
        <section className="service-section" id="layanan">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title-inline">Katalog Layanan Perpajakan</h2>
              <p className="section-desc-inline">Temukan layanan yang sesuai dengan kebutuhan Anda</p>
            </div>
            <div className="tab-group">
              <button 
                className={`tab-btn ${activeTab === 'semua' ? 'active' : ''}`}
                onClick={() => setActiveTab('semua')}
              >
                Semua
              </button>
              <button 
                className={`tab-btn ${activeTab === 'layanan' ? 'active' : ''}`}
                onClick={() => setActiveTab('layanan')}
              >
                Pendaftaran & Data
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pelaporan' ? 'active' : ''}`}
                onClick={() => setActiveTab('pelaporan')}
              >
                Pelaporan
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pembayaran' ? 'active' : ''}`}
                onClick={() => setActiveTab('pembayaran')}
              >
                Pembayaran
              </button>
            </div>
          </div>

          {/* Grid Layanan */}
          <div className="service-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map((item) => (
                <article key={item.id} className="service-item interactive-card">
                  <div className="service-header">
                    <span className="service-number">{item.code}</span>
                    <span className="service-badge-tag">{item.category}</span>
                  </div>
                  <div className="service-icon-title">
                    <span className="service-card-icon">{item.icon}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.desc}</p>
                  <button className="service-cta-btn">Pelajari Lebih Lanjut →</button>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>Layanan yang Anda cari tidak ditemukan.</p>
                <button className="reset-search-btn" onClick={() => { setSearchTerm(''); setActiveTab('semua'); }}>
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Pengumuman & Berita Section */}
        <section className="news-section" id="informasi">
          <h2 className="section-title-center">Informasi & Pengumuman</h2>
          <p className="section-subtitle-center">Tetap update dengan berita terkini seputar perpajakan</p>
          
          <div className="news-tabs">
            <button 
              className={`news-tab-btn ${activeNewsTab === 'pengumuman' ? 'active' : ''}`}
              onClick={() => setActiveNewsTab('pengumuman')}
            >
              📢 Pengumuman
            </button>
            <button 
              className={`news-tab-btn ${activeNewsTab === 'berita' ? 'active' : ''}`}
              onClick={() => setActiveNewsTab('berita')}
            >
              📰 Berita & Kegiatan
            </button>
          </div>

          <div className="news-grid">
            {currentNews.map((item, idx) => (
              <article key={idx} className="news-card">
                <div className="news-card-top">
                  <span className="news-date">{item.date}</span>
                  <span className="news-tag" style={{ backgroundColor: item.tagColor + '15', color: item.tagColor, borderColor: item.tagColor + '30' }}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-summary">{item.summary}</p>
                <button className="news-read-more">Baca Selengkapnya →</button>
              </article>
            ))}
          </div>
        </section>

        {/* Kanal Kontak Darurat */}
        <section className="contact-cards-section">
          <h2 className="section-title-center">Hubungi Kami</h2>
          <p className="section-subtitle-center">Berbagai kanal komunikasi untuk kebutuhan Anda</p>
          <div className="contact-cards-grid">
            {emergencyContacts.map((item, idx) => (
              <div key={idx} className="contact-card">
                <span className="contact-card-icon">{item.icon}</span>
                <div className="contact-card-info">
                  <span className="contact-card-label">{item.label}</span>
                  <span className="contact-card-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Papan Anti Pungli */}
        <section className="warning-board">
          <div className="warning-board-icon">🚨</div>
          <div className="warning-board-content">
            <h3>HARAP WASPADA — LAYANAN DJP 100% GRATIS</h3>
            <p>Seluruh pelayanan di lingkungan Direktorat Jenderal Pajak tidak dipungut biaya apapun. Jika ada pihak yang meminta imbalan dalam proses pengurusan perpajakan, segera laporkan melalui:</p>
            <div className="warning-channels">
              <span className="warning-channel">📞 Kring Pajak: 1500 200</span>
              <span className="warning-channel">📧 whistleblowing@pajak.go.id</span>
              <span className="warning-channel">🌐 www.pajak.go.id/whistleblowing</span>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="faq-section" id="faq">
          <h2 className="section-title-center">Pertanyaan Sering Diajukan (FAQ)</h2>
          <p className="section-subtitle-center">Jawaban atas pertanyaan yang paling sering muncul dari wajib pajak</p>
          <div className="accordion-group">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`accordion-item ${openFaq === idx ? 'open' : ''}`}
                onClick={() => toggleFaq(idx)}
                role="button"
                tabIndex={0}
                aria-expanded={openFaq === idx}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFaq(idx); } }}
              >
                <div className="accordion-header">
                  <div className="accordion-question-wrapper">
                    <span className="accordion-number">{String(idx + 1).padStart(2, '0')}</span>
                    <h4>{faq.q}</h4>
                  </div>
                  <span className={`accordion-chevron ${openFaq === idx ? 'rotated' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
                <div className={`accordion-body-wrapper ${openFaq === idx ? 'expanded' : ''}`}>
                  <div className="accordion-body">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jam Operasional Detail */}
        <section className="operational-hours-section" id="kontak">
          <div className="ops-grid">
            <div className="ops-card">
              <div className="ops-card-header">
                <span className="ops-icon">📅</span>
                <h3>Jam Operasional Kantor</h3>
              </div>
              <div className="ops-schedule">
                <div className="ops-row">
                  <span className="ops-day">Senin - Kamis</span>
                  <span className="ops-time">08:00 - 16:00 WIB</span>
                </div>
                <div className="ops-row">
                  <span className="ops-day">Jumat</span>
                  <span className="ops-time">08:00 - 16:30 WIB</span>
                </div>
                <div className="ops-row ops-closed">
                  <span className="ops-day">Sabtu - Minggu</span>
                  <span className="ops-time">Tutup</span>
                </div>
                <div className="ops-row ops-closed">
                  <span className="ops-day">Hari Libur Nasional</span>
                  <span className="ops-time">Tutup</span>
                </div>
              </div>
            </div>
            <div className="ops-card">
              <div className="ops-card-header">
                <span className="ops-icon">📍</span>
                <h3>Alamat Kantor</h3>
              </div>
              <div className="ops-address">
                <p className="address-main">Jl. Jenderal Sudirman No. 1</p>
                <p>Kelurahan Rengat Barat, Kecamatan Rengat</p>
                <p>Kabupaten Indragiri Hulu</p>
                <p className="address-postal">Provinsi Riau, 29311</p>
              </div>
              <div className="ops-map-placeholder">
                <div className="map-fake">
                  <span>📍</span>
                  <p>Lihat di Google Maps</p>
                </div>
              </div>
            </div>
            <div className="ops-card">
              <div className="ops-card-header">
                <span className="ops-icon">🎯</span>
                <h3>Misi Kami</h3>
              </div>
              <div className="ops-mission">
                <div className="mission-item">
                  <span className="mission-check">✓</span>
                  <span>Meningkatkan kepatuhan pajak sukarela</span>
                </div>
                <div className="mission-item">
                  <span className="mission-check">✓</span>
                  <span>Melayani dengan integritas dan akuntabilitas</span>
                </div>
                <div className="mission-item">
                  <span className="mission-check">✓</span>
                  <span>Menyederhanakan proses administrasi perpajakan</span>
                </div>
                <div className="mission-item">
                  <span className="mission-check">✓</span>
                  <span>Transparan dan bebas dari pungutan liar</span>
                </div>
                <div className="mission-item">
                  <span className="mission-check">✓</span>
                  <span>Membangun budaya bayar pajak sebagai kebanggaan</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Komprehensif */}
      <footer className="comprehensive-footer">
        <div className="footer-main">
          <div className="footer-grid">
            {/* Kolom 1: Tentang */}
            <div className="footer-col">
              <div className="footer-brand">
                <img src={logoDjp} alt="Logo DJP" className="footer-logo" />
                <div className="footer-brand-text">
                  <span className="footer-brand-kicker">Direktorat Jenderal Pajak</span>
                  <strong>KPP Pratama Rengat</strong>
                </div>
              </div>
              <p className="footer-about">
                Melayani Wajib Pajak di wilayah Kabupaten Indragiri Hulu dengan penuh integritas, profesionalisme, dan komitmen terhadap pelayanan prima.
              </p>
              <div className="footer-compliance-badges">
                <span className="compliance-badge">Zona Integritas</span>
                <span className="compliance-badge">WBK</span>
                <span className="compliance-badge">WBBM</span>
              </div>
            </div>

            {/* Kolom 2: Tautan Cepat */}
            <div className="footer-col">
              <h4 className="footer-col-title">Tautan Penting</h4>
              <ul className="footer-links">
                <li><a href="https://www.pajak.go.id" target="_blank" rel="noopener noreferrer">Portal DJP</a></li>
                <li><a href="https://djponline.pajak.go.id" target="_blank" rel="noopener noreferrer">DJP Online</a></li>
                <li><a href="https://ereg.pajak.go.id" target="_blank" rel="noopener noreferrer">e-Registration NPWP</a></li>
                <li><a href="https://efiling.pajak.go.id" target="_blank" rel="noopener noreferrer">e-Filing SPT</a></li>
                <li><a href="https://billing.pajak.go.id" target="_blank" rel="noopener noreferrer">e-Billing</a></li>
                <li><a href="https://sisdirjen.pajak.go.id" target="_blank" rel="noopener noreferrer">SISDIRJEN</a></li>
                <li><a href="https://www.kemenkeu.go.id" target="_blank" rel="noopener noreferrer">Kemenkeu RI</a></li>
              </ul>
            </div>

            {/* Kolom 3: Layanan */}
            <div className="footer-col">
              <h4 className="footer-col-title">Layanan Unggulan</h4>
              <ul className="footer-links">
                <li><a href="#layanan">Pendaftaran NPWP</a></li>
                <li><a href="#layanan">Aktivasi EFIN</a></li>
                <li><a href="#layanan">Pelaporan SPT Tahunan</a></li>
                <li><a href="#layanan">Pelaporan SPT Masa</a></li>
                <li><a href="#layanan">Pembuatan e-Billing</a></li>
                <li><a href="#layanan">Pengukuhan PKP</a></li>
                <li><a href="#layanan">Restitusi Pajak</a></li>
              </ul>
            </div>

            {/* Kolom 4: Sosial Media & Kontak */}
            <div className="footer-col">
              <h4 className="footer-col-title">Ikuti Kami</h4>
              <p className="footer-social-desc">Ikuti akun resmi DJP dan KPP Pratama Rengat di media sosial untuk informasi terkini.</p>
              <div className="footer-social-grid">
                <a href="https://twitter.com/Djponline" target="_blank" rel="noopener noreferrer" className="social-card social-twitter" aria-label="Twitter DJP">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>@Djponline</span>
                </a>
                <a href="https://www.instagram.com/pajakriau?igsi=MW16NjlrdXhyOHk3MA==" target="_blank" rel="noopener noreferrer" className="social-card social-instagram" aria-label="Instagram DJP">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span>@pajakriau</span>
                </a>
                <a href="https://www.facebook.com/DirektoratJenderalPajak" target="_blank" rel="noopener noreferrer" className="social-card social-facebook" aria-label="Facebook DJP">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>DJP Official</span>
                </a>
                <a href="https://www.youtube.com/@DitjenPajak" target="_blank" rel="noopener noreferrer" className="social-card social-youtube" aria-label="YouTube DJP">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Ditjen Pajak</span>
                </a>
                <a href="https://www.tiktok.com/@djpkemenkeu" target="_blank" rel="noopener noreferrer" className="social-card social-tiktok" aria-label="TikTok DJP">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-3-.59v-.01a4.83 4.83 0 003-4.43z"/>
                  </svg>
                  <span>@djpkemenkeu</span>
                </a>
                <a href="https://t.me/DJPonline" target="_blank" rel="noopener noreferrer" className="social-card social-telegram" aria-label="Telegram DJP">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span>DJP Online</span>
                </a>
              </div>
              
              <div className="footer-kring-pajak">
                <div className="kring-badge">
                  <span className="kring-icon">📞</span>
                  <div>
                    <strong>Kring Pajak</strong>
                    <span>1500 200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© {new Date().getFullYear()} KPP Pratama Rengat — Direktorat Jenderal Pajak, Kementerian Keuangan RI</p>
            <p className="footer-disclaimer">Situs ini merupakan bagian dari sistem informasi internal DJP. Konten bersifat informatif dan tidak mengikat secara hukum.</p>
          </div>
          <div className="footer-bottom-right">
            <a href="https://www.pajak.go.id/id/kebijakan-privasi" target="_blank" rel="noopener noreferrer">Kebijakan Privasi</a>
            <span className="footer-sep">|</span>
            <a href="https://www.pajak.go.id/id/syarat-ketentuan" target="_blank" rel="noopener noreferrer">Syarat & Ketentuan</a>
            <span className="footer-sep">|</span>
            <a href="https://www.pajak.go.id/id/peta-situs" target="_blank" rel="noopener noreferrer">Peta Situs</a>
          </div>
        </div>
      </footer>

      {/* Floating Widget Chatbot */}
      <ChatWidget />
    </div>
  );
}

export default App;