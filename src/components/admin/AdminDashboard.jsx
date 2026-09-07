import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './admin.css';
import { responseTemplates } from '../../data/templates';
import {
  getDashboardStats,
  getTemplates,
  getSessionMessages,
  subscribeToNewChats,
  subscribeToNewMessages,
  subscribeToSessionMessages,
  unsubscribe,
  logChatMessage,
  updateChatSession
} from '../../services/chatService';

// ── Dummy Data Fallback ──
const defaultSessions = [];
const defaultUnmatchedItems = [];

const tabs = [
  { id: 'overview', label: 'Dashboard Kinerja', icon: '📊' },
  { id: 'templates', label: 'Template Jawaban', icon: '📝' },
  { id: 'chats', label: 'Helpdesk Omnichannel', icon: '💬' },
  { id: 'unmatched', label: 'AI Belum Terjawab', icon: '⚠️' },
];

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
}

class TabErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Tab render error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="ad-error-boundary p-8 text-center bg-white rounded-xl border border-red-200 shadow-sm max-w-xl mx-auto my-8">
          <div className="text-3xl mb-3">⚠️</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Terjadi kendala pada tab ini</h3>
          <p className="text-sm text-gray-500 mb-4">{this.state.error?.message || 'Gagal memuat komponen.'}</p>
          <button
            className="ad-primary-btn"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Muat Ulang Tab
          </button>
        </div>
      );
    }
    return this.props.children;
  }
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
    <div className="ad-overview-tab max-w-7xl mx-auto">
      <div className="ad-overview-head flex justify-between items-end mb-6">
        <div>
          <h2 className="ad-overview-title text-2xl font-extrabold text-[#0A2540]">Ringkasan Kinerja</h2>
          <p className="ad-overview-subtitle text-sm text-gray-500 mt-1">Pantau kualitas layanan chatbot dan kebutuhan pengembangan jawaban.</p>
        </div>
        <label className="ad-period flex items-center gap-2 text-sm font-semibold text-gray-600">
          <span>Periode:</span>
          <select 
            value={period} 
            onChange={(event) => setPeriod(event.target.value)}
            className="ad-period-select px-3 py-1.5 border rounded-lg bg-white outline-none focus:border-blue-500"
          >
            <option value="7">7 Hari Terakhir</option>
            <option value="30">30 Hari Terakhir</option>
            <option value="90">90 Hari Terakhir</option>
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
    </div>
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

  const categories = ['Semua', ...new Set((responseTemplates || []).map((t) => t.category).filter(Boolean))];

  const filtered = useMemo(() => {
    const list = Array.isArray(remoteTemplates) ? remoteTemplates : responseTemplates;
    return (list || []).filter((template) => {
      if (!template) return false;
      const tagsString = Array.isArray(template.tags) ? template.tags.join(' ') : String(template.tags || '');
      const haystack = `${template.title || ''} ${template.category || ''} ${tagsString}`.toLowerCase();
      const matchesSearch = haystack.includes(String(query || '').toLowerCase());
      const matchesCategory = category === 'Semua' || template.category === category;
      const matchesFavorite = !favoritesOnly || favorites.includes(template.id);
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [category, favorites, favoritesOnly, query, remoteTemplates]);

  const selected = filtered.find((template) => template.id === selectedId) || filtered[0] || null;

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const copyTemplate = async () => {
    if (!selected) return;
    await navigator.clipboard?.writeText(selected.template || '');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="ad-templates-tab max-w-7xl mx-auto h-full flex flex-col">
      <div className="ad-template-toolbar">
        <label className="ad-search">
          <span className="ad-search-icon absolute left-3 text-gray-400">⌕</span>
          <input
            className="pl-8"
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
          ＋ Tambah Template
        </button>
      </div>

      <div className="ad-template-layout flex-1 overflow-hidden pb-4">
        <div className="ad-template-list overflow-y-auto h-full pr-2">
          {filtered.map((template) => (
            <button
              className={`ad-template-item ${selected?.id === template.id ? 'selected' : ''}`}
              key={template.id}
              onClick={() => setSelectedId(template.id)}
            >
              <span>
                <b>
                  {favorites.includes(template.id) ? '⭐' : '☆'} {template.category || 'Umum'}
                </b>
                <em className={`ad-priority-badge priority-${String(template.priority || '').toLowerCase().trim()}`}>
                  {template.priority || 'P3'}
                </em>
              </span>
              <strong>{template.title || 'Tanpa Judul'}</strong>
              <small>{template.usageCount || 0} penggunaan</small>
            </button>
          ))}
          {filtered.length === 0 && <div className="ad-empty-state p-8 text-center text-gray-400">Template tidak ditemukan.</div>}
        </div>

        {selected && (
          <div className="ad-template-preview h-full overflow-y-auto">
            <div className="ad-preview-head">
              <div>
                <span>
                  {selected.id} · {selected.priority || 'P3'}
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
              {(Array.isArray(selected.tags) ? selected.tags : []).map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <pre>{selected.template || ''}</pre>
            <div className="ad-preview-actions mt-auto pt-4 border-t border-gray-100">
              <button className="ad-primary-btn" onClick={copyTemplate}>
                📋 {copied ? 'Tersalin' : 'Copy Jawaban'}
              </button>
              <button
                className="ad-ghost-btn"
                onClick={() => window.alert('Editor template siap dihubungkan ke API.')}
              >
                ✏️ Edit
              </button>
              <span>{selected.usageCount || 0} kali digunakan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab 3: Chats ──
function ChatsTab({ remoteSessions = [], onChatUpdated }) {
  const [status, setStatus] = useState('active'); 
  const [channelFilter, setChannelFilter] = useState('all'); 
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sourceSessions = remoteSessions.length
    ? remoteSessions.map((session) => ({
        ...session,
        sessionId: session.session_id || session.sessionId,
        channel: session.channel || 'web',
        wpName: session.wp_name || session.wpName || null,
        startedAt: session.started_at || session.startedAt,
        firstResponseTimeMs:
          session.first_response_ms ||
          session.first_response_time_ms ||
          session.firstResponseTimeMs ||
          0,
      }))
    : defaultSessions;

  const filtered = sourceSessions.filter((session) => {
    const matchStatus = status === 'Semua Status' || session.status === status;
    const matchChannel = channelFilter === 'all' || session.channel === channelFilter;
    return matchStatus && matchChannel;
  });

  useEffect(() => {
    if (selected) {
      const updatedSession = sourceSessions.find(s => s.sessionId === selected.sessionId);
      if (updatedSession) setSelected(updatedSession);
    }
  }, [sourceSessions, selected?.sessionId]);

  useEffect(() => {
    if (!selected?.sessionId) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    setLoadingMessages(true);

    getSessionMessages(selected.sessionId)
      .then((data) => {
        if (isMounted) {
          setMessages(data || []);
          setLoadingMessages(false);
        }
      })
      .catch((err) => {
        console.error('[ChatsTab] getSessionMessages error:', err);
        if (isMounted) setLoadingMessages(false);
      });

    const channel = subscribeToSessionMessages(selected.sessionId, (newMsg) => {
      if (!isMounted || !newMsg) return;
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === newMsg.id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      isMounted = false;
      if (channel) unsubscribe(channel);
    };
  }, [selected?.sessionId]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected) return;
    setIsSending(true);

    try {
      const isWa = selected.channel === 'whatsapp';
      const { error } = await logChatMessage({
        sessionId: selected.sessionId,
        role: 'admin',
        text: replyText.trim(),
        confidenceScore: null,
        metadata: {
          status: isWa ? 'pending_to_wa' : 'sent',
          isTemplateUsed: false
        }
      });

      if (error) throw error;
      
      setReplyText('');
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
      alert('Gagal menyelesaikan sesi: ' + err.message);
    }
  };

  return (
    <div className="ad-chats-tab flex h-[calc(100vh-140px)] gap-6 w-full max-w-full">
      {/* Kolom Daftar Antrean */}
      <div className="ad-chats-sidebar w-1/3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="ad-chats-sidebar-header p-4 border-b bg-gray-50/50">
          <div className="ad-channel-filter flex gap-2 mb-3 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setChannelFilter('all')}
              className={`ad-channel-btn text-xs px-3 py-1.5 rounded-md flex-1 transition-colors ${channelFilter === 'all' ? 'active bg-white shadow-sm text-gray-800 font-bold' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setChannelFilter('web')}
              className={`ad-channel-btn channel-web text-xs px-3 py-1.5 rounded-md flex-1 transition-colors ${channelFilter === 'web' ? 'active bg-blue-600 shadow-sm text-white font-bold' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              🌐 Web
            </button>
            <button 
              onClick={() => setChannelFilter('whatsapp')}
              className={`ad-channel-btn channel-wa text-xs px-3 py-1.5 rounded-md flex-1 transition-colors ${channelFilter === 'whatsapp' ? 'active bg-green-600 shadow-sm text-white font-bold' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              📱 WA
            </button>
          </div>

          <select value={status} onChange={(event) => setStatus(event.target.value)} className="ad-chats-status-select w-full p-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-2">
            <option value="active">Aktif (Butuh Balasan)</option>
            <option value="escalated">⚠️ Eskalasi (Petugas)</option>
            <option value="resolved">✓ Selesai</option>
            <option value="Semua Status">Semua Status</option>
          </select>
          <div className="ad-chats-counter-row flex justify-between items-center text-[11px] text-gray-500 px-1">
            <span>Ditemukan: <strong>{filtered.length} sesi</strong></span>
            {status === 'escalated' && <span className="ad-escalated-alert text-amber-600 font-bold">⚠️ Perlu Perhatian</span>}
          </div>
        </div>

        <div className="ad-chats-list flex-1 overflow-y-auto p-2 space-y-1 bg-gray-50/30">
          {filtered.map((session) => (
            <button
              className={`ad-session-card w-full text-left p-3 rounded-lg border transition-all ${selected?.sessionId === session.sessionId ? 'selected bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'}`}
              key={session.sessionId}
              onClick={() => setSelected(session)}
            >
              <div className="ad-session-badges flex justify-between items-center">
                <span className={`ad-session-status text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider status-${session.status} ${session.status === 'resolved' ? 'bg-green-100 text-green-700' : session.status === 'escalated' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {session.status}
                </span>
                <span className={`ad-session-channel text-[10px] px-2 py-0.5 rounded font-medium channel-${session.channel} ${session.channel === 'whatsapp' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {session.channel === 'whatsapp' ? '📱 WhatsApp' : '🌐 Web'}
                </span>
              </div>
              <div className="ad-session-info mt-2">
                <div className="ad-session-title text-sm font-bold text-gray-800 truncate" title={session.wpName || session.sessionId}>
                  {session.wpName ? `👤 ${session.wpName}` : session.sessionId}
                </div>
                {session.wpName && (
                  <code className="ad-session-id block text-[10px] text-gray-400 truncate mt-0.5 font-mono">
                    {session.sessionId}
                  </code>
                )}
              </div>
              <p className="ad-session-meta text-[11px] text-gray-500 mt-2 flex justify-between items-center">
                <span className="ad-session-category bg-gray-100 px-2 py-0.5 rounded">{session.primary_category || 'Lainnya'}</span>
                <span className="ad-session-time">{formatDate(session.startedAt)}</span>
              </p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="ad-chats-empty-list p-8 text-center text-gray-400 text-sm">
              Tidak ada sesi pada filter ini.
            </div>
          )}
        </div>
      </div>

      {/* Kolom Detail & Balasan */}
      <div className="ad-chats-main w-2/3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {selected ? (
          <div className="ad-chat-conversation flex flex-col h-full relative">
            <div className="ad-chat-header flex justify-between items-center p-4 border-b bg-white shadow-sm z-10">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`ad-channel-tag text-[10px] px-2 py-1 rounded-md font-bold tracking-widest channel-${selected.channel} ${selected.channel === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selected.channel === 'whatsapp' ? 'WHATSAPP' : 'WEB WIDGET'}
                  </span>
                  <h3 className="ad-chat-title font-extrabold text-lg text-gray-800 truncate max-w-sm">
                    {selected.wpName ? `${selected.wpName}` : selected.sessionId}
                  </h3>
                </div>
                <div className="ad-chat-meta text-xs text-gray-500 mt-1 flex gap-3">
                  <span>Mulai: {formatDate(selected.startedAt)}</span>
                  <span>•</span>
                  <span>Kategori: {selected.primary_category || 'Umum'}</span>
                  <span>•</span>
                  <code className="ad-chat-session-code text-gray-400">{selected.sessionId}</code>
                </div>
              </div>
              <div className="flex gap-2">
                {selected.status !== 'resolved' && (
                  <button 
                    className="ad-resolve-btn px-4 py-1.5 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 hover:border-green-600 rounded-lg text-sm font-bold transition-all" 
                    onClick={handleResolveSession}
                  >
                    ✓ Selesai
                  </button>
                )}
              </div>
            </div>
            
            {/* Riwayat Obrolan Live */}
            <div className="ad-chat-thread flex-grow overflow-y-auto p-6 flex flex-col gap-4 bg-[#F8FAFC]">
              {loadingMessages ? (
                <div className="ad-thread-loading text-center py-8 text-gray-400 text-sm">Memuat percakapan...</div>
              ) : messages.length === 0 ? (
                <div className="ad-thread-empty text-center py-12 text-gray-400 text-sm flex flex-col items-center">
                  <span className="text-3xl mb-2">💬</span>
                  Belum ada pesan tercatat pada sesi ini.
                </div>
              ) : (
                messages.map((message, index) => {
                  const isUser = message.role === 'user';
                  const isOfficer = message.role === 'admin';

                  return (
                    <div 
                      className={`ad-chat-bubble flex flex-col max-w-[75%] ${isUser ? 'ad-bubble-user self-start' : isOfficer ? 'ad-bubble-officer self-end' : 'ad-bubble-bot self-start'}`} 
                      key={message.id || `${message.created_at}-${index}`}
                    >
                      <div className={`ad-bubble-info flex items-baseline gap-2 mb-1 px-1 ${isUser ? 'self-start' : 'self-end'}`}>
                        <strong className="text-[11px] text-gray-500 uppercase tracking-wide">
                          {isUser ? '👤 Wajib Pajak' : isOfficer ? '👮 Anda (Petugas)' : '🤖 Bot'}
                        </strong>
                        <small className="text-[10px] text-gray-400">
                          {new Date(message.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                      <div className={`ad-bubble-content p-3.5 rounded-2xl text-[13px] shadow-sm ${
                        isUser 
                          ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm' 
                          : isOfficer
                          ? 'bg-[#173459] text-white rounded-tr-sm'
                          : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] rounded-tr-sm'
                      }`}>
                        <p className="whitespace-pre-wrap m-0 leading-relaxed">{message.text || message.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Kotak Balasan Petugas */}
            {selected.status !== 'resolved' ? (
              <div className="ad-reply-box p-4 bg-white border-t z-10">
                <div className="ad-quick-templates mb-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <span className="ad-quick-title text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">Template Cepat:</span>
                  {responseTemplates.slice(0, 5).map(tpl => (
                    <button 
                      key={tpl.id}
                      onClick={() => setReplyText(tpl.template)}
                      className="ad-quick-chip text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 whitespace-nowrap transition-colors"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>

                <div className="ad-reply-input-row flex gap-3">
                  <textarea 
                    className="ad-reply-textarea flex-grow p-3 border border-gray-300 rounded-xl resize-none text-[13px] focus:outline-none focus:border-[#173459] focus:ring-1 focus:ring-[#173459] bg-gray-50 focus:bg-white transition-colors"
                    rows="2"
                    placeholder={`Ketik balasan untuk Wajib Pajak (${selected.channel === 'whatsapp' ? 'Pesan akan ditembakkan ke WhatsApp' : 'Akan muncul langsung di Web Widget'})...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isSending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <button 
                    onClick={handleSendReply}
                    disabled={isSending || !replyText.trim()}
                    className={`ad-reply-send-btn px-6 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                      isSending || !replyText.trim() 
                        ? 'disabled bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : selected.channel === 'whatsapp'
                        ? 'channel-wa bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                        : 'channel-web bg-[#173459] text-white hover:bg-[#0A2540] shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isSending ? (
                      <span className="animate-pulse">Mengirim...</span>
                    ) : (
                      <>
                        <span className="text-lg leading-none">{selected.channel === 'whatsapp' ? '📱' : '🚀'}</span>
                        <span className="text-[10px] uppercase tracking-wider">Kirim</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="ad-resolved-banner p-4 bg-gray-50 text-center text-xs text-gray-500 border-t font-medium">
                🔒 Sesi ini telah diselesaikan (Resolved). Ubah status di panel kiri jika ingin membuka kembali.
              </div>
            )}
          </div>
        ) : (
          <div className="ad-chats-placeholder flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center bg-gray-50/50">
            <div className="ad-placeholder-icon w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">💬</div>
            <strong className="ad-placeholder-title text-gray-700 text-lg mb-2">Helpdesk Omnichannel Inbox</strong>
            <p className="ad-placeholder-desc max-w-sm text-sm leading-relaxed">Pilih salah satu antrean percakapan di sebelah kiri untuk membaca dan membalas pertanyaan Wajib Pajak secara langsung.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab 4: Unmatched ──
function UnmatchedTab({ items = defaultUnmatchedItems, onCreateAnswer }) {
  return (
    <div className="ad-unmatched-tab max-w-7xl mx-auto">
      <div className="ad-unmatched-alert bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium mb-6 shadow-sm flex items-start gap-3">
        <span className="ad-alert-icon text-xl leading-none">⚠️</span>
        <div className="ad-alert-content">
          <p>Pertanyaan-pertanyaan di bawah ini diajukan oleh Wajib Pajak namun <strong>belum memiliki jawaban yang cocok di database AI</strong>. Buat template jawaban baru agar pertanyaan serupa otomatis terjawab ke depannya.</p>
        </div>
      </div>
      <div className="ad-unmatched-list">
        {items.map((item) => {
          const questionText = item.lastMessages?.[0] || 'Pertanyaan belum tersedia';
          return (
            <div className="ad-unmatched-card hover:shadow-md transition-shadow" key={item.sessionId}>
              <div className="ad-unmatched-head flex justify-between w-full border-b pb-2 mb-2">
                <code className="ad-unmatched-code text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{item.sessionId}</code>
                <span className="ad-unmatched-time text-xs text-gray-400">{formatDate(item.timestamp)}</span>
              </div>
              <p className="ad-unmatched-text text-gray-800 text-[15px] leading-relaxed mb-4">"{questionText}"</p>
              <button
                className="ad-unmatched-btn mt-auto w-full bg-white border-2 border-[#173459] text-[#173459] hover:bg-[#173459] hover:text-white font-bold py-2 rounded-lg text-sm transition-colors"
                onClick={() => onCreateAnswer && onCreateAnswer(questionText)}
              >
                📝 Buat Template Jawaban
              </button>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="ad-unmatched-empty p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200 col-span-full">
            <span className="text-3xl block mb-2">🎉</span>
            <strong className="text-gray-700 block mb-1">Semua Pertanyaan Terjawab!</strong>
            <p className="text-sm">Tidak ada pertanyaan yang gagal dijawab oleh AI saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard Component ──
export default function AdminDashboard({ onBack }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState(null);
  const [templateQuery, setTemplateQuery] = useState('');

  const handleSignOut = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
      await signOut();
      navigate('/login');
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await getDashboardStats(period);
      setStats(data);
    } catch (error) {
      console.warn('Dashboard memakai data simulasi:', error?.message);
    }
  }, [period]);

  useEffect(() => {
    fetchDashboard();
    
    const sessionChannel = subscribeToNewChats(() => {
      fetchDashboard();
    });
    
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
    <div className="ad-dashboard-root flex h-screen w-full bg-[#F4F7FA] font-sans overflow-hidden">
      
      {/* ── SIDEBAR KIRI ── */}
      <aside className="ad-sidebar w-[280px] bg-gradient-to-b from-[#0A2540] to-[#173459] flex flex-col shadow-2xl z-20 text-white shrink-0">
        <div className="ad-sidebar-header p-6 border-b border-white/10">
          <div className="ad-brand-row flex items-center gap-3 mb-1">
            <div className="ad-logo-badge w-8 h-8 bg-[#FFC700] rounded-lg flex items-center justify-center font-bold text-[#0A2540] shadow-lg">DJP</div>
            <div className="ad-brand-text">
              <span className="ad-brand-tag text-[#FFC700] text-[10px] font-bold uppercase tracking-[2px] block leading-none">Internal Tool</span>
              <h1 className="ad-brand-title text-xl font-extrabold tracking-tight mt-1 leading-none">Pusat Kontrol</h1>
            </div>
          </div>
          <p className="ad-brand-subtitle text-xs text-blue-200 mt-3 opacity-80">KPP Pratama Rengat</p>
        </div>

        <nav className="ad-sidebar-nav flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`ad-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === tab.id
                  ? 'active bg-white/10 text-white shadow-inner border-l-4 border-[#FFC700]'
                  : 'text-blue-200 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <span className="ad-nav-icon text-lg">{tab.icon}</span>
              <span className="ad-nav-label">{tab.label}</span>
              {tab.id === 'unmatched' && unmatchedCount > 0 && (
                <span className="ad-nav-badge ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {unmatchedCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-footer p-5 border-t border-white/10 bg-black/10">
          <div className="ad-officer-info text-[11px] text-blue-300 mb-3 px-1">
            <div className="ad-officer-label flex items-center gap-1.5">
              <span className="ad-officer-dot"></span>
              <span>Petugas Aktif:</span>
            </div>
            <strong className="ad-officer-email text-white block truncate text-[13px] mt-0.5">{user?.email || 'Admin DJP'}</strong>
          </div>
          <button
            onClick={handleSignOut}
            className="ad-logout-btn w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-300 border border-red-500/30 py-2.5 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            🚪 Keluar Sistem
          </button>
        </div>
      </aside>

      {/* ── AREA KONTEN UTAMA ── */}
      <div className="ad-main-wrapper flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        
        {/* HEADER ATAS */}
        <header className="ad-header bg-white h-[72px] border-b border-gray-200 px-8 flex justify-between items-center shadow-sm shrink-0 z-10">
          <div className="ad-header-left flex items-center gap-5">
            <button 
              onClick={handleGoBack} 
              className="ad-back-btn flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-bold transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border"
            >
              ← Portal Publik
            </button>
            <div className="ad-header-divider h-6 w-px bg-gray-300"></div>
            <h2 className="ad-header-title text-xl font-extrabold text-[#0A2540] flex items-center gap-2">
              <span className="ad-tab-icon">{tabs.find(t => t.id === activeTab)?.icon}</span>
              <span>{tabs.find(t => t.id === activeTab)?.label}</span>
            </h2>
          </div>
          
          <div className="ad-header-status flex items-center gap-4 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
            <div className="ad-live-pill flex items-center gap-2 text-sm font-medium">
              <span className="ad-live-dot relative flex h-2.5 w-2.5">
                {stats && <span className="ad-dot-ping animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`ad-dot-solid relative inline-flex rounded-full h-2.5 w-2.5 ${stats ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </span>
              <span className={stats ? 'text-green-700' : 'text-gray-500'}>
                {stats ? 'Koneksi Stabil' : 'Mode Offline/Simulasi'}
              </span>
            </div>
            <span className="ad-status-sep text-gray-300">|</span>
            <span className="ad-update-time text-gray-500 text-xs font-medium">Update: {new Date().toLocaleTimeString('id-ID')}</span>
          </div>
        </header>

        {/* KONTEN HALAMAN */}
        <main className="ad-content-main flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
          <TabErrorBoundary key={activeTab}>
            {activeTab === 'overview' && (
              <OverviewTab period={period} setPeriod={setPeriod} stats={stats} />
            )}
            {activeTab === 'templates' && (
              <TemplatesTab initialQuery={templateQuery} />
            )}
            {activeTab === 'chats' && (
              <ChatsTab remoteSessions={stats?.sessions} onChatUpdated={fetchDashboard} />
            )}
            {activeTab === 'unmatched' && (
              <UnmatchedTab
                items={stats?.recentUnmatched?.length ? stats.recentUnmatched : defaultUnmatchedItems}
                onCreateAnswer={handleCreateAnswer}
              />
            )}
          </TabErrorBoundary>
        </main>
      </div>
    </div>
  );
}