import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { responseTemplates } from '../../data/templates';
import { getDashboardStats, getTemplates, subscribeToNewChats, unsubscribe } from '../../services/chatService';

const sessions = [
  {
    sessionId: 'web-1705312200000-a3f2k1', channel: 'web', status: 'resolved', startedAt: '2025-01-15T10:30:00', endedAt: '2025-01-15T10:35:00', firstResponseTimeMs: 23000, messages: [
      { role: 'user', text: 'lupa efin', timestamp: '2025-01-15T10:30:10' },
      { role: 'bot', text: 'Cara 1 - Datang ke KPP atau hubungi kanal resmi DJP untuk mendapatkan kembali EFIN.', timestamp: '2025-01-15T10:30:33', confidenceScore: 126 },
      { role: 'user', text: 'makasih', timestamp: '2025-01-15T10:34:12' },
      { role: 'system', text: 'Sesi diakhiri - resolved', timestamp: '2025-01-15T10:35:00' },
    ],
  },
  { sessionId: 'web-1705311800000-b7k3', channel: 'web', status: 'active', startedAt: '2025-01-15T09:16:00', firstResponseTimeMs: 18000, messages: [{ role: 'user', text: 'cara daftar npwp', timestamp: '2025-01-15T09:16:10' }, { role: 'bot', text: 'Saya bantu menjelaskan pendaftaran NPWP online.', timestamp: '2025-01-15T09:16:28', confidenceScore: 114 }] },
  { sessionId: 'wa-1705309000000-c9p4n', channel: 'whatsapp', status: 'resolved', startedAt: '2025-01-14T14:12:00', endedAt: '2025-01-14T14:20:00', firstResponseTimeMs: 31000, messages: [{ role: 'user', text: 'batas lapor spt kapan?', timestamp: '2025-01-14T14:12:00' }, { role: 'bot', text: 'SPT Tahunan Orang Pribadi dilaporkan paling lambat 31 Maret.', timestamp: '2025-01-14T14:12:31', confidenceScore: 132 }] },
  { sessionId: 'web-1705305000000-d1q5', channel: 'web', status: 'escalated', startedAt: '2025-01-14T10:05:00', firstResponseTimeMs: 46000, messages: [{ role: 'user', text: 'saya butuh bicara dengan petugas', timestamp: '2025-01-14T10:05:00' }, { role: 'system', text: 'Permintaan diteruskan ke petugas.', timestamp: '2025-01-14T10:05:46' }] },
];

const unmatchedItems = [
  { sessionId: 'web-1705312500000-new1', channel: 'web', timestamp: '2025-01-15T10:45:00', lastMessages: ['berapa denda telat bayar ppn'] },
  { sessionId: 'web-1705312000000-new2', channel: 'web', timestamp: '2025-01-15T10:32:00', lastMessages: ['apakah bisa bayar pajak pakai shopeepay'] },
  { sessionId: 'wa-1705311500000-new3', channel: 'whatsapp', timestamp: '2025-01-15T10:20:00', lastMessages: ['saya pindah ke jakarta, npwpnya gimana'] },
];

const tabs = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'templates', label: '📝 Templates' },
  { id: 'chats', label: '💬 Riwayat Chat' },
  { id: 'unmatched', label: '⚠️ Belum Terjawab', count: unmatchedItems.length },
];

function formatDate(value) {
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
}

function OverviewTab({ period, setPeriod, stats }) {
  const multiplier = period === '7' ? 0.42 : period === '90' ? 2.7 : 1;
  const trend = period === '7' ? [32, 48, 41, 56, 63, 58, 72] : period === '90' ? [42, 58, 51, 70, 64, 82, 94] : [48, 62, 57, 78, 72, 91, 84];
  return <>
    <div className="ad-overview-head"><div><span className="ad-kicker">PUSAT KONTROL · DATA LOKAL</span><h2>Ringkasan Kinerja</h2><p>Pantau kualitas layanan chatbot dan kebutuhan pengembangan jawaban.</p></div><label className="ad-period">Periode<select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="7">7 Hari</option><option value="30">30 Hari</option><option value="90">90 Hari</option></select></label></div>
    <div className="ad-kpi-grid">
      {[['💬', stats?.kpi?.totalSessions?.value ?? Math.round(8 * multiplier), 'Sesi Chat', '+10%'], ['✅', stats?.kpi?.resolvedSessions?.value ?? Math.round(5 * multiplier), 'Resolved', '+8%'], ['🎯', stats?.kpi?.matchRate?.value != null ? `${stats.kpi.matchRate.value}%` : '75%', 'Match Rate', '+3%'], ['⚡', stats?.kpi?.avgResponseTime?.display || (stats?.kpi?.avgResponseTime?.value ? `${(stats.kpi.avgResponseTime.value / 1000).toFixed(1)}s` : '2.8s'), 'Respons Pertama', '-15%']].map(([icon, value, label, change]) => <div className="ad-kpi" key={label}><span className="ad-kpi-icon">{icon}</span><strong>{value}</strong><span>{label}</span><small className={change.startsWith('-') ? 'good' : ''}>{change} dibanding periode sebelumnya</small></div>)}
    </div>
    <div className="ad-chart-grid"><div className="ad-panel ad-trend-panel"><div className="ad-panel-title"><strong>Tren sesi harian</strong><span>{period} hari terakhir</span></div><div className="ad-bars">{trend.map((value, index) => <div className="ad-bar-col" key={index}><div className="ad-bar" style={{ height: `${value}%` }} title={`${value} sesi`} /><small>{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][index]}</small></div>)}</div></div><div className="ad-panel"><div className="ad-panel-title"><strong>Kategori pertanyaan</strong><span>Distribusi</span></div><div className="ad-donut"><div className="ad-donut-ring"><strong>75%</strong><small>match</small></div><ul><li><i className="blue" />NPWP <b>32%</b></li><li><i className="yellow" />EFIN <b>28%</b></li><li><i className="green" />SPT <b>21%</b></li><li><i className="gray" />Lainnya <b>19%</b></li></ul></div></div></div>
    <div className="ad-panel ad-table-panel"><div className="ad-panel-title"><strong>Top template digunakan</strong><span>Performa jawaban</span></div><div className="ad-table">{(stats?.topTemplates?.length ? stats.topTemplates : responseTemplates.slice().sort((a, b) => b.usageCount - a.usageCount).slice(0, 5)).map((template) => <div key={template.id}><span>{template.category}</span><strong>{template.title}</strong><b>{template.usageCount}x</b></div>)}</div></div>
  </>;
}

function TemplatesTab() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(['TPL-EFIN-001', 'TPL-SPT-001']);
  const [selectedId, setSelectedId] = useState(responseTemplates[3].id);
  const [copied, setCopied] = useState(false);
  const [remoteTemplates, setRemoteTemplates] = useState(null);
  useEffect(() => { getTemplates({ search: query, category, favorite: favoritesOnly }).then((result) => { if (!result.error) setRemoteTemplates(result.templates); }); }, [category, favoritesOnly, query]);
  const categories = ['Semua', ...new Set(responseTemplates.map((template) => template.category))];
  const filtered = useMemo(() => (remoteTemplates || responseTemplates).filter((template) => {
    const haystack = `${template.title} ${template.category} ${template.tags.join(' ')}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (category === 'Semua' || template.category === category) && (!favoritesOnly || favorites.includes(template.id));
  }), [category, favorites, favoritesOnly, query, remoteTemplates]);
  const selected = filtered.find((template) => template.id === selectedId) || filtered[0];
  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const copyTemplate = async () => { if (!selected) return; await navigator.clipboard?.writeText(selected.template); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <><div className="ad-template-toolbar"><label className="ad-search">⌕<input placeholder="Cari template atau keyword..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><button className={`ad-filter-btn ${favoritesOnly ? 'active' : ''}`} onClick={() => setFavoritesOnly((value) => !value)}>⭐ Favorit</button><button className="ad-primary-btn" onClick={() => window.alert('Form template baru siap dihubungkan ke API.')}>＋ Tambah</button></div><div className="ad-template-layout"><div className="ad-template-list">{filtered.map((template) => <button className={`ad-template-item ${selected?.id === template.id ? 'selected' : ''}`} key={template.id} onClick={() => setSelectedId(template.id)}><span><b>{favorites.includes(template.id) ? '⭐' : '☆'} {template.category}</b><em>{template.priority}</em></span><strong>{template.title}</strong><small>{template.usageCount} penggunaan</small></button>)}{filtered.length === 0 && <div className="ad-empty-sm">Template tidak ditemukan.</div>}</div>{selected && <div className="ad-template-preview"><div className="ad-preview-head"><div><span>{selected.id} · {selected.priority}</span><h3>{selected.title}</h3></div><button className={`ad-star-btn ${favorites.includes(selected.id) ? 'active' : ''}`} onClick={() => toggleFavorite(selected.id)} aria-label="Toggle favorit">★</button></div><div className="ad-tags">{selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><pre>{selected.template}</pre><div className="ad-preview-actions"><button className="ad-primary-btn" onClick={copyTemplate}>📋 {copied ? 'Tersalin' : 'Copy Jawaban'}</button><button className="ad-ghost-btn" onClick={() => window.alert('Editor template siap dihubungkan ke API.')}>✏️ Edit</button><span>{selected.usageCount} kali digunakan</span></div></div>}</div></>;
}

function ChatsTab({ remoteSessions = [] }) {
  const [status, setStatus] = useState('Semua Status');
  const [selected, setSelected] = useState(null);
  const sourceSessions = remoteSessions.length ? remoteSessions.map((session) => ({ ...session, sessionId: session.session_id || session.sessionId, startedAt: session.started_at || session.startedAt, firstResponseTimeMs: session.first_response_ms || session.first_response_time_ms || session.firstResponseTimeMs || 0, messages: session.messages || [] })) : sessions;
  const filtered = status === 'Semua Status' ? sourceSessions : sourceSessions.filter((session) => session.status === status);
  return <div className="ad-chats-layout"><div className="ad-session-column"><div className="ad-chat-filter"><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Semua Status</option><option value="active">Aktif</option><option value="resolved">Resolved</option><option value="escalated">Escalated</option></select><strong>{filtered.length} sesi</strong></div>{filtered.map((session) => <button className={`ad-session-item ${selected?.sessionId === session.sessionId ? 'selected' : ''}`} key={session.sessionId} onClick={() => setSelected(session)}><span className={`ad-status st-${session.status}`}>{session.status}</span><small>{session.channel === 'web' ? '🌐 web' : '📱 whatsapp'}</small><code>{session.sessionId}</code><p>{session.message_count || session.messages.length} pesan · {formatDate(session.startedAt)}</p></button>)}</div><div className="ad-detail-column">{selected ? <div className="ad-detail"><div className="ad-detail-head"><h3>Detail Sesi</h3><button className="ad-ghost-btn" onClick={() => setSelected(null)}>✕ Tutup</button></div><div className="ad-detail-meta"><div><b>Session:</b> <code>{selected.sessionId}</code></div><div><b>Kanal:</b> {selected.channel}</div><div><b>Status:</b> <span className={`ad-status st-${selected.status}`}>{selected.status}</span></div><div><b>Mulai:</b> {formatDate(selected.startedAt)}</div><div><b>Respons pertama:</b> {selected.firstResponseTimeMs ? `${(selected.firstResponseTimeMs / 1000).toFixed(1)}s` : 'Belum ada'}</div></div><div className="ad-detail-msgs">{selected.messages.map((message, index) => <div className={`ad-dmsg ad-dmsg-${message.role}`} key={`${message.timestamp}-${index}`}><div><strong>{message.role === 'user' ? '👤 Pengguna' : message.role === 'bot' ? '🤖 Bot' : '⚙️ Sistem'}</strong><small>{new Date(message.timestamp).toLocaleTimeString('id-ID')}</small>{message.confidenceScore && <em>Skor: {message.confidenceScore}</em>}</div><p>{message.text}</p></div>)}</div></div> : <div className="ad-empty"><span>💬</span><p>Pilih sesi untuk melihat percakapan.</p></div>}</div></div>;
}

function UnmatchedTab({ items = unmatchedItems }) {
  return <><div className="ad-unmatched-info">⚠️ Pertanyaan berikut belum memiliki jawaban yang cocok. Buat template baru agar pertanyaan serupa bisa dijawab ke depannya.</div><div className="ad-unmatched-list">{items.map((item) => <div className="ad-unmatched-card" key={item.sessionId}><div><code>{item.sessionId}</code><span>{item.channel === 'web' ? '🌐 web' : '📱 whatsapp'}</span><small>{formatDate(item.timestamp)}</small></div><p>"{item.lastMessages[0] || 'Pertanyaan belum tersedia'}"</p><button className="ad-primary-btn" onClick={() => window.alert('Form jawaban baru siap dihubungkan ke API.')}>📝 Buat Jawaban untuk Ini</button></div>)}</div></>;
}

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState(null);
  const fetchDashboard = useCallback(async () => { try { setStats(await getDashboardStats(period)); } catch (error) { console.warn('Dashboard memakai data simulasi:', error.message); } }, [period]);
  useEffect(() => { fetchDashboard(); const channel = subscribeToNewChats(fetchDashboard); return () => unsubscribe(channel); }, [fetchDashboard]);
  return <div className="admin-dashboard"><header className="ad-header"><button className="ad-back-btn" onClick={onBack}>← Kembali</button><div><span className="ad-kicker">INTERNAL TOOL</span><h1>Panel Admin</h1><p><span className="ad-live-dot" /> {stats ? 'Terhubung ke Supabase' : 'Simulasi · data lokal'}</p></div><div className="ad-last-update">Update terakhir<br /><strong>{new Date().toLocaleTimeString('id-ID')}</strong></div></header><nav className="ad-tabs" aria-label="Navigasi admin">{tabs.map((tab) => <button className={activeTab === tab.id ? 'active' : ''} key={tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}{tab.count && <b>{stats?.recentUnmatched?.length || tab.count}</b>}</button>)}</nav><main className="ad-content">{activeTab === 'overview' && <OverviewTab period={period} setPeriod={setPeriod} stats={stats} />}{activeTab === 'templates' && <TemplatesTab />}{activeTab === 'chats' && <ChatsTab remoteSessions={stats?.sessions} />}{activeTab === 'unmatched' && <UnmatchedTab items={stats?.recentUnmatched?.length ? stats.recentUnmatched : unmatchedItems} />}</main></div>;
}
