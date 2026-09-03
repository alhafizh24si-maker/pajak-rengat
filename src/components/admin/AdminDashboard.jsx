import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './admin.css';
import { responseTemplates } from '../../data/templates';
import {
  getDashboardStats,
  getTemplates,
  subscribeToNewChats,
  subscribeToNewMessages,
  unsubscribe,
  logChatMessage,
  updateChatSession
} from '../../services/chatService';

// ── Dummy Data Fallback ──
const defaultSessions = [];
const defaultUnmatchedItems = [];

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
function OverviewTab({ period, setPeriod, stats }) {
  const multiplier = period === '7' ? 0.42 : period === '90' ? 2.7 : 1;
  const trend =
    period === '7'
      ? [32, 48, 41, 56, 63, 58, 72]
      : period === '90'
      ? [42, 58, 51, 70, 64, 82, 94]
      : [48, 62, 57, 78, 72, 91, 84];

  return (
    <>
      <div className="ad-overview-head">
        <div>
          <span className="ad-kicker">PUSAT KONTROL · DATA LOKAL</span>
          <h2>Ringkasan Kinerja</h2>
          <p>Pantau kualitas layanan chatbot dan kebutuhan pengembangan jawaban.</p>
        </div>
        <label className="ad-period">
          Periode
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="7">7 Hari</option>
            <option value="30">30 Hari</option>
            <option value="90">90 Hari</option>
          </select>
        </label>
      </div>

      <div className="ad-kpi-grid">
        {[
          ['💬', stats?.kpi?.totalSessions?.value ?? Math.round(8 * multiplier), 'Sesi Chat', '+10%'],
          ['✅', stats?.kpi?.resolvedSessions?.value ?? Math.round(5 * multiplier), 'Resolved', '+8%'],
          ['🎯', stats?.kpi?.matchRate?.value != null ? `${stats.kpi.matchRate.value}%` : '75%', 'Match Rate', '+3%'],
          [
            '⚡',
            stats?.kpi?.avgResponseTime?.display ||
              (stats?.kpi?.avgResponseTime?.value
                ? `${(stats.kpi.avgResponseTime.value / 1000).toFixed(1)}s`
                : '2.8s'),
            'Respons Pertama',
            '-15%',
          ],
        ].map(([icon, value, label, change]) => (
          <div className="ad-kpi" key={label}>
            <span className="ad-kpi-icon">{icon}</span>
            <strong>{value}</strong>
            <span>{label}</span>
            <small className={change.startsWith('-') ? 'good' : ''}>
              {change} dibanding periode sebelumnya
            </small>
          </div>
        ))}
      </div>

      <div className="ad-chart-grid">
        <div className="ad-panel ad-trend-panel">
          <div className="ad-panel-title">
            <strong>Tren sesi harian</strong>
            <span>{period} hari terakhir</span>
          </div>
          <div className="ad-bars">
            {trend.map((value, index) => (
              <div className="ad-bar-col" key={index}>
                <div className="ad-bar" style={{ height: `${value}%` }} title={`${value} sesi`} />
                <small>{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][index]}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-panel">
          <div className="ad-panel-title">
            <strong>Kategori pertanyaan</strong>
            <span>Distribusi</span>
          </div>
          <div className="ad-donut">
            <div className="ad-donut-ring">
              <strong>75%</strong>
              <small>match</small>
            </div>
            <ul>
              <li><i className="blue" />NPWP <b>32%</b></li>
              <li><i className="yellow" />EFIN <b>28%</b></li>
              <li><i className="green" />SPT <b>21%</b></li>
              <li><i className="gray" />Lainnya <b>19%</b></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ad-panel ad-table-panel">
        <div className="ad-panel-title">
          <strong>Top template digunakan</strong>
          <span>Performa jawaban</span>
        </div>
        <div className="ad-table">
          {(
            stats?.topTemplates?.length
              ? stats.topTemplates
              : responseTemplates.slice().sort((a, b) => b.usageCount - a.usageCount).slice(0, 5)
          ).map((template) => (
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
function TemplatesTab({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('Semua');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(['TPL-EFIN-001', 'TPL-SPT-001']);
  const [selectedId, setSelectedId] = useState(responseTemplates[0]?.id);
  const [copied, setCopied] = useState(false);
  const [remoteTemplates, setRemoteTemplates] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    getTemplates({ search: query, category, favorite: favoritesOnly }).then((result) => {
      if (!result?.error && result?.templates) {
        setRemoteTemplates(result.templates);
      }
    });
  }, [category, favoritesOnly, query]);

  const categories = ['Semua', ...new Set(responseTemplates.map((t) => t.category))];

  const filtered = useMemo(() => {
    const list = remoteTemplates || responseTemplates;
    return list.filter((template) => {
      const haystack = `${template.title} ${template.category} ${template.tags?.join(' ') || ''}`.toLowerCase();
      const matchesSearch = haystack.includes(query.toLowerCase());
      const matchesCategory = category === 'Semua' || template.category === category;
      const matchesFavorite = !favoritesOnly || favorites.includes(template.id);
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [category, favorites, favoritesOnly, query, remoteTemplates]);

  const selected = filtered.find((template) => template.id === selectedId) || filtered[0];

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const copyTemplate = async () => {
    if (!selected) return;
    await navigator.clipboard?.writeText(selected.template);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <div className="ad-template-toolbar">
        <label className="ad-search">
          ⌕
          <input
            placeholder="Cari template atau keyword..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button
          className={`ad-filter-btn ${favoritesOnly ? 'active' : ''}`}
          onClick={() => setFavoritesOnly((value) => !value)}
        >
          ⭐ Favorit
        </button>
        <button
          className="ad-primary-btn"
          onClick={() => window.alert('Form template baru siap dihubungkan ke API.')}
        >
          ＋ Tambah
        </button>
      </div>

      <div className="ad-template-layout">
        <div className="ad-template-list">
          {filtered.map((template) => (
            <button
              className={`ad-template-item ${selected?.id === template.id ? 'selected' : ''}`}
              key={template.id}
              onClick={() => setSelectedId(template.id)}
            >
              <span>
                <b>
                  {favorites.includes(template.id) ? '⭐' : '☆'} {template.category}
                </b>
                <em>{template.priority}</em>
              </span>
              <strong>{template.title}</strong>
              <small>{template.usageCount} penggunaan</small>
            </button>
          ))}
          {filtered.length === 0 && <div className="ad-empty-sm">Template tidak ditemukan.</div>}
        </div>

        {selected && (
          <div className="ad-template-preview">
            <div className="ad-preview-head">
              <div>
                <span>
                  {selected.id} · {selected.priority}
                </span>
                <h3>{selected.title}</h3>
              </div>
              <button
                className={`ad-star-btn ${favorites.includes(selected.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(selected.id)}
                aria-label="Toggle favorit"
              >
                ★
              </button>
            </div>
            <div className="ad-tags">
              {selected.tags?.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <pre>{selected.template}</pre>
            <div className="ad-preview-actions">
              <button className="ad-primary-btn" onClick={copyTemplate}>
                📋 {copied ? 'Tersalin' : 'Copy Jawaban'}
              </button>
              <button
                className="ad-ghost-btn"
                onClick={() => window.alert('Editor template siap dihubungkan ke API.')}
              >
                ✏️ Edit
              </button>
              <span>{selected.usageCount} kali digunakan</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Tab 3: Chats (Diperbarui untuk Helpdesk & Reply) ──
function ChatsTab({ remoteSessions = [], onChatUpdated }) {
  const [status, setStatus] = useState('active'); // Fokus utama petugas adalah status active
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sourceSessions = remoteSessions.length
    ? remoteSessions.map((session) => ({
        ...session,
        sessionId: session.session_id || session.sessionId,
        startedAt: session.started_at || session.startedAt,
        firstResponseTimeMs:
          session.first_response_ms ||
          session.first_response_time_ms ||
          session.firstResponseTimeMs ||
          0,
        messages: session.messages || [],
      }))
    : defaultSessions;

  const filtered =
    status === 'Semua Status'
      ? sourceSessions
      : sourceSessions.filter((session) => session.status === status);

  // Update detail sesi jika ada data baru masuk dari props
  useEffect(() => {
    if (selected) {
      const updatedSession = sourceSessions.find(s => s.sessionId === selected.sessionId);
      if (updatedSession) setSelected(updatedSession);
    }
  }, [sourceSessions, selected]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected) return;
    setIsSending(true);

    try {
      // Menyisipkan pesan petugas ke Supabase
      const { error } = await logChatMessage({
        sessionId: selected.sessionId,
        role: 'bot', // 'bot' di sini mewakili balasan sistem/petugas
        text: replyText,
        confidenceScore: null,
        metadata: {
          status: 'sent',
          isTemplateUsed: false // Bisa dibuat true jika dikirim via template
        }
      });

      if (error) throw error;
      
      setReplyText('');
      // Memanggil fungsi fetchDashboard di komponen induk untuk me-refresh data
      if (onChatUpdated) onChatUpdated(); 
      
    } catch (error) {
      alert('Gagal mengirim balasan: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleResolveSession = async () => {
    if (!selected) return;
    try {
      await updateChatSession(selected.sessionId, { status: 'resolved', ended_at: new Date().toISOString() });
      setSelected(null);
      if (onChatUpdated) onChatUpdated();
    } catch (err) {
      alert('Gagal menyelesaikan sesi');
    }
  };

  return (
    <div className="ad-chats-layout flex h-full">
      <div className="ad-session-column w-1/3 border-r">
        <div className="ad-chat-filter p-2">
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full mb-2 p-1 border rounded">
            <option value="active">Aktif (Butuh Balasan)</option>
            <option value="escalated">Eskalasi</option>
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
                <small className="text-gray-500">{session.channel === 'web' ? '🌐 Web' : '📱 WA'}</small>
              </div>
              <code className="block mt-1 text-sm">{session.sessionId}</code>
              <p className="text-xs text-gray-500 mt-1">
                {session.message_count || session.messages.length} pesan · {formatDate(session.startedAt)}
              </p>
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
                <small className="text-gray-500">Mulai: {formatDate(selected.startedAt)}</small>
              </div>
              <div className="flex gap-2">
                {selected.status === 'active' && (
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-bold" onClick={handleResolveSession}>
                    ✓ Tandai Selesai
                  </button>
                )}
                <button className="px-3 py-1 text-gray-500 hover:bg-gray-200 rounded" onClick={() => setSelected(null)}>
                  ✕
                </button>
              </div>
            </div>
            
            <div className="ad-detail-msgs flex-grow overflow-y-auto p-4 flex flex-col gap-3" style={{ maxHeight: '50vh' }}>
              {selected.messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div className={`flex flex-col max-w-[80%] ${isUser ? 'self-start' : 'self-end'}`} key={`${message.timestamp}-${index}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <strong className="text-xs text-gray-600">
                        {isUser ? '👤 Wajib Pajak' : '🤖 Petugas / Bot'}
                      </strong>
                      <small className="text-[10px] text-gray-400">{new Date(message.created_at || message.timestamp).toLocaleTimeString('id-ID')}</small>
                    </div>
                    <div className={`p-3 rounded-lg ${isUser ? 'bg-gray-100 border' : 'bg-blue-600 text-white'}`}>
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {selected.status !== 'resolved' && (
              <div className="ad-reply-box p-4 border-t bg-gray-50 mt-auto">
                <div className="mb-3 flex gap-2 overflow-x-auto">
                  <span className="text-xs text-gray-500 font-bold py-1 whitespace-nowrap">SOP Cepat:</span>
                  {responseTemplates.slice(0, 4).map(tpl => (
                    <button 
                      key={tpl.id}
                      onClick={() => setReplyText(tpl.template)}
                      className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-50 whitespace-nowrap"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <textarea 
                    className="flex-grow p-3 border rounded-lg resize-none text-sm"
                    rows="2"
                    placeholder="Ketik balasan untuk Wajib Pajak..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isSending}
                  />
                  <button 
                    onClick={handleSendReply}
                    disabled={isSending || !replyText.trim()}
                    className={`px-6 rounded-lg font-bold transition-colors ${
                      isSending || !replyText.trim() 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSending ? 'Mengirim...' : 'Kirim'}
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

// ── Tab 4: Unmatched ──
function UnmatchedTab({ items = defaultUnmatchedItems, onCreateAnswer }) {
  return (
    <>
      <div className="ad-unmatched-info">
        ⚠️ Pertanyaan berikut belum memiliki jawaban yang cocok. Buat template baru agar pertanyaan serupa bisa dijawab ke depannya.
      </div>
      <div className="ad-unmatched-list">
        {items.map((item) => {
          const questionText = item.lastMessages?.[0] || 'Pertanyaan belum tersedia';
          return (
            <div className="ad-unmatched-card" key={item.sessionId}>
              <div>
                <code>{item.sessionId}</code>
                <span>{item.channel === 'web' ? '🌐 web' : '📱 whatsapp'}</span>
                <small>{formatDate(item.timestamp)}</small>
              </div>
              <p>"{questionText}"</p>
              <button
                className="ad-primary-btn"
                onClick={() => onCreateAnswer && onCreateAnswer(questionText)}
              >
                📝 Buat Jawaban untuk Ini
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Main Dashboard Component ──
export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState(null);
  const [templateQuery, setTemplateQuery] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await getDashboardStats(period);
      // Opsional: Untuk ChatsTab, kita perlu memetakan relasi pesan ke dalam array `messages`
      // jika getDashboardStats belum melakukan left join dari tabel chat_messages
      setStats(data);
    } catch (error) {
      console.warn('Dashboard memakai data simulasi:', error?.message);
    }
  }, [period]);

  useEffect(() => {
    fetchDashboard();
    
    // Berlangganan sesi baru (Wajib Pajak baru menghubungi)
    const sessionChannel = subscribeToNewChats(() => {
      fetchDashboard();
    });
    
    // Berlangganan pesan baru (Wajib Pajak mengirim balasan pada sesi aktif)
    const messageChannel = subscribeToNewMessages(() => {
      fetchDashboard(); 
    });

    return () => {
      unsubscribe(sessionChannel);
      unsubscribe(messageChannel);
    };
  }, [fetchDashboard]);

  const handleCreateAnswer = (questionText) => {
    setTemplateQuery(questionText);
    setActiveTab('templates');
  };

  const unmatchedCount = stats?.recentUnmatched?.length || defaultUnmatchedItems.length;

  return (
    <div className="admin-dashboard">
      <header className="ad-header">
        <button className="ad-back-btn" onClick={onBack}>
          ← Kembali
        </button>
        <div>
          <span className="ad-kicker">INTERNAL TOOL</span>
          <h1>Panel Admin</h1>
          <p>
            <span className="ad-live-dot" />{' '}
            {stats ? 'Terhubung ke Supabase (Real-time Aktif)' : 'Simulasi · data lokal'}
          </p>
        </div>
        <div className="ad-last-update">
          Update terakhir
          <br />
          <strong>{new Date().toLocaleTimeString('id-ID')}</strong>
        </div>
      </header>

      <nav className="ad-tabs" aria-label="Navigasi admin">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? 'active' : ''}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'unmatched' && <b>{unmatchedCount}</b>}
          </button>
        ))}
      </nav>

      <main className="ad-content">
        {activeTab === 'overview' && (
          <OverviewTab period={period} setPeriod={setPeriod} stats={stats} />
        )}
        {activeTab === 'templates' && (
          <TemplatesTab initialQuery={templateQuery} />
        )}
        {activeTab === 'chats' && (
          <ChatsTab 
            remoteSessions={stats?.sessions} 
            onChatUpdated={fetchDashboard} // Trigger refresh setelah petugas mengirim pesan
          />
        )}
        {activeTab === 'unmatched' && (
          <UnmatchedTab
            items={stats?.recentUnmatched?.length ? stats.recentUnmatched : defaultUnmatchedItems}
            onCreateAnswer={handleCreateAnswer}
          />
        )}
      </main>
    </div>
  );
}