import React, { useState, useMemo } from 'react';
import './admin.css';

// ═════════════════════════════════════════════════════════
// DATA SIMULASI (OFFLINE MODE) - Tanpa Koneksi Database
// ═════════════════════════════════════════════════════════
const offlineTemplates = [
  { id: 'TPL-01', category: 'EFIN', title: 'Cara Reset EFIN', priority: 'P1', usageCount: 145, template: 'Halo Sahabat Pajak! Untuk permohonan lupa EFIN, silakan siapkan foto KTP, NPWP, dan foto diri memegang KTP.' },
  { id: 'TPL-02', category: 'NPWP', title: 'Daftar NPWP Online', priority: 'P2', usageCount: 98, template: 'Pendaftaran NPWP kini sepenuhnya online melalui situs ereg.pajak.go.id. Silakan siapkan NIK dan KK Anda.' },
  { id: 'TPL-03', category: 'SPT', title: 'Batas Lapor SPT', priority: 'P1', usageCount: 210, template: 'Batas akhir pelaporan SPT Tahunan Orang Pribadi adalah 31 Maret, dan untuk Badan Usaha adalah 30 April.' }
];

const offlineSessions = [
  {
    sessionId: 'WA-081234567890',
    channel: 'whatsapp',
    status: 'active',
    startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 menit lalu
    messages: [
      { role: 'user', text: 'Siang min, saya mau tanya soal pemadanan NIK jadi NPWP.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
    ]
  },
  {
    sessionId: 'WEB-99887766',
    channel: 'web',
    status: 'resolved',
    startedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    messages: [
      { role: 'user', text: 'Cara buat kode billing gimana ya?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
      { role: 'bot', text: 'Pembuatan kode billing bisa dilakukan di DJP Online menu e-Billing.', timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString() }
    ]
  }
];

const tabs = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'templates', label: '📝 Templates' },
  { id: 'chats', label: '💬 Riwayat Chat' },
  { id: 'unmatched', label: '⚠️ Belum Terjawab' },
];

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
}

// ── Tab 1: Overview ──
function OverviewTab() {
  return (
    <>
      <div className="ad-overview-head">
        <div>
          <span className="ad-kicker">MODE OFFLINE (AMAN)</span>
          <h2>Ringkasan Kinerja (Simulasi)</h2>
          <p>Tampilan ini dijalankan tanpa koneksi database untuk menguji antarmuka.</p>
        </div>
      </div>

      <div className="ad-kpi-grid">
        <div className="ad-kpi"><span className="ad-kpi-icon">💬</span><strong>24</strong><span>Sesi Chat</span></div>
        <div className="ad-kpi"><span className="ad-kpi-icon">✅</span><strong>18</strong><span>Resolved</span></div>
        <div className="ad-kpi"><span className="ad-kpi-icon">🎯</span><strong>85%</strong><span>Match Rate</span></div>
        <div className="ad-kpi"><span className="ad-kpi-icon">⚡</span><strong>2.1s</strong><span>Respons Pertama</span></div>
      </div>

      <div className="ad-panel ad-table-panel">
        <div className="ad-panel-title">
          <strong>Top template digunakan</strong>
          <span>Berdasarkan data simulasi</span>
        </div>
        <div className="ad-table">
          {offlineTemplates.map((template) => (
            <div key={template.id}>
              <span>{template.category}</span>
              <strong>{template.title}</strong>
              <b>{template.usageCount}x</b>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Tab 2: Templates ──
function TemplatesTab() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(offlineTemplates[0].id);

  const filtered = offlineTemplates.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.category.toLowerCase().includes(query.toLowerCase())
  );
  const selected = filtered.find(t => t.id === selectedId) || filtered[0];

  return (
    <>
      <div className="ad-template-toolbar">
        <label className="ad-search">
          ⌕ <input placeholder="Cari SOP..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <button className="ad-primary-btn" onClick={() => alert('Mode Offline: Tambah dinonaktifkan')}>＋ Tambah</button>
      </div>

      <div className="ad-template-layout">
        <div className="ad-template-list">
          {filtered.map((template) => (
            <button
              className={`ad-template-item ${selected?.id === template.id ? 'selected' : ''}`}
              key={template.id}
              onClick={() => setSelectedId(template.id)}
            >
              <span><b>☆ {template.category}</b><em>{template.priority}</em></span>
              <strong>{template.title}</strong>
            </button>
          ))}
        </div>

        {selected && (
          <div className="ad-template-preview">
            <div className="ad-preview-head">
              <div><span>{selected.id}</span><h3>{selected.title}</h3></div>
            </div>
            <pre>{selected.template}</pre>
          </div>
        )}
      </div>
    </>
  );
}

// ── Tab 3: Chats (Simulasi Helpdesk) ──
function ChatsTab() {
  const [status, setStatus] = useState('active');
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filtered = status === 'Semua Status' 
    ? offlineSessions 
    : offlineSessions.filter((s) => s.status === status);

  return (
    <div className="ad-chats-layout flex h-full">
      <div className="ad-session-column w-1/3 border-r">
        <div className="ad-chat-filter p-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mb-2 p-1 border rounded">
            <option value="active">Aktif (Butuh Balasan)</option>
            <option value="resolved">Selesai</option>
            <option>Semua Status</option>
          </select>
          <strong>{filtered.length} sesi</strong>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {filtered.map((session) => (
            <button
              className={`ad-session-item w-full text-left p-3 border-b hover:bg-gray-50 ${selected?.sessionId === session.sessionId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              key={session.sessionId}
              onClick={() => setSelected(session)}
            >
              <div className="flex justify-between items-center">
                <span className={`ad-status text-xs font-bold st-${session.status}`}>{session.status.toUpperCase()}</span>
              </div>
              <code className="block mt-1 text-sm">{session.sessionId}</code>
              <p className="text-xs text-gray-500 mt-1">{formatDate(session.startedAt)}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="ad-detail-column w-2/3 flex flex-col bg-white">
        {selected ? (
          <div className="ad-detail flex flex-col h-full relative">
            <div className="ad-detail-head flex justify-between items-center p-4 border-b bg-gray-50">
              <div>
                <h3 className="font-bold text-lg">Sesi: {selected.sessionId}</h3>
              </div>
              <button className="px-3 py-1 text-gray-500 hover:bg-gray-200 rounded" onClick={() => setSelected(null)}>✕</button>
            </div>
            
            <div className="ad-detail-msgs flex-grow overflow-y-auto p-4 flex flex-col gap-3" style={{ maxHeight: '50vh' }}>
              {selected.messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div className={`flex flex-col max-w-[80%] ${isUser ? 'self-start' : 'self-end'}`} key={index}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <strong className="text-xs text-gray-600">{isUser ? '👤 Wajib Pajak' : '🤖 Petugas'}</strong>
                    </div>
                    <div className={`p-3 rounded-lg ${isUser ? 'bg-gray-100 border' : 'bg-blue-600 text-white'}`}>
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {selected.status === 'active' && (
              <div className="ad-reply-box p-4 border-t bg-gray-50 mt-auto">
                <div className="mb-3 flex gap-2 overflow-x-auto">
                  <span className="text-xs text-gray-500 font-bold py-1 whitespace-nowrap">SOP Cepat:</span>
                  {offlineTemplates.map(tpl => (
                    <button key={tpl.id} onClick={() => setReplyText(tpl.template)} className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-50 whitespace-nowrap">
                      {tpl.title}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <textarea 
                    className="flex-grow p-3 border rounded-lg resize-none text-sm" rows="2"
                    value={replyText} onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button onClick={() => alert('Mode Offline: Fitur kirim dinonaktifkan')} className="px-6 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700">
                    Kirim
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-4xl mb-4">💬</span>
            <p>Pilih antrean chat di sebelah kiri untuk mulai membalas.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard Component ──
export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-dashboard">
      <header className="ad-header">
        <button className="ad-back-btn" onClick={onBack}>← Kembali ke Halaman Utama</button>
        <div>
          <span className="ad-kicker">INTERNAL TOOL</span>
          <h1>Panel Admin</h1>
          <p><span className="ad-live-dot" style={{ backgroundColor: 'orange' }}/> Mode Offline (Data Aman)</p>
        </div>
      </header>

      <nav className="ad-tabs">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? 'active' : ''}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="ad-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'templates' && <TemplatesTab />}
        {activeTab === 'chats' && <ChatsTab />}
        {activeTab === 'unmatched' && <div style={{padding: '20px'}}>Tidak ada pertanyaan yang belum terjawab di Mode Simulasi.</div>}
      </main>
    </div>
  );
}