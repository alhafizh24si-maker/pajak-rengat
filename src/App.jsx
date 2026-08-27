import React from 'react';
import ChatWidget from './components/chatbot/ChatWidget';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">KPP</div>
          <div>
            <span className="brand-kicker">Direktorat Jenderal Pajak</span>
            <strong>KPP Pratama Rengat</strong>
          </div>
        </div>
        <span className="status-pill"><span aria-hidden="true" /> Layanan online</span>
      </header>

      <main className="main-content">
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p className="eyebrow">Pusat informasi perpajakan</p>
            <h1 id="welcome-title">KPP Pratama Rengat - AI Assistant Demo</h1>
            <p className="welcome-description">
              Temukan jawaban seputar layanan pajak dengan cepat. Gunakan asisten virtual kami untuk memulai.
            </p>
            <div className="welcome-actions">
              <span className="action-hint"><span aria-hidden="true">&#8595;</span> Buka tombol chat di kanan bawah</span>
            </div>
          </div>
          <div className="welcome-seal" aria-hidden="true">
            <span>AI</span>
            <small>Asisten<br />Pajak</small>
          </div>
        </section>

        <section className="service-grid" aria-label="Layanan bantuan">
          <article className="service-item">
            <span className="service-number">01</span>
            <h2>Informasi pajak</h2>
            <p>Jawaban ringkas untuk pertanyaan perpajakan yang sering diajukan.</p>
          </article>
          <article className="service-item">
            <span className="service-number">02</span>
            <h2>Panduan layanan</h2>
            <p>Ikuti langkah layanan administrasi pajak dengan lebih mudah.</p>
          </article>
          <article className="service-item">
            <span className="service-number">03</span>
            <h2>Bantuan langsung</h2>
            <p>Dapatkan arahan untuk terhubung dengan petugas kami.</p>
          </article>
        </section>
      </main>

      <footer className="footer-note">Melayani dengan informasi yang akurat dan mudah dipahami.</footer>
      <ChatWidget />
    </div>
  );
}

export default App;
