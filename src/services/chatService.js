import { supabase } from '../lib/supabase';
import { responseTemplates } from '../data/templates';

const unavailable = (message = 'Supabase belum tersedia') => ({ data: null, error: new Error(message) });

// ═══════════════════════════════════════════════════
// HELPER & UTILS
// ═══════════════════════════════════════════════════

export function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

const validateText = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Text harus string non-empty' };
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Text tidak boleh kosong atau hanya whitespace' };
  }
  if (trimmed.length > 5000) {
    return { isValid: false, error: 'Text terlalu panjang (max 5000 karakter)' };
  }
  return { isValid: true, sanitized: trimmed };
};

const validateSessionId = (sessionId) => {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    return { isValid: false, error: 'Session ID tidak valid' };
  }
  return { isValid: true };
};

const validateRole = (role) => {
  const validRoles = ['user', 'bot', 'system'];
  if (!validRoles.includes(role)) {
    return { isValid: false, error: `Role harus salah satu: ${validRoles.join(', ')}` };
  }
  return { isValid: true };
};

const normalizeTemplate = (row) => ({
  id: row.id,
  category: row.category,
  title: row.title,
  priority: row.priority || 'P3',
  tags: row.keywords || row.tags || [],
  usageCount: row.use_count ?? row.usage_count ?? row.usageCount ?? 0,
  template: row.content || row.template || '',
  isFavorite: Boolean(row.is_favorite ?? row.isFavorite),
});

// ═══════════════════════════════════════════════════
// SESSION MANAGEMENT (Disesuaikan dengan ChatBot.jsx)
// ═══════════════════════════════════════════════════

export async function createChatSession(sessionId, metadata = {}) {
  if (!supabase) return unavailable();
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{
        session_id: sessionId,
        status: 'active',
        channel: metadata.source || 'web_widget',
        primary_category: metadata.category || 'Lainnya',
        message_count: 0,
        matched_count: 0,
        unmatched_count: 0,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('[createChatSession] Exception:', err);
    return { data: null, error: err };
  }
}

export async function getChatSession(sessionId) {
  if (!supabase) return unavailable();
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    return { data, error };
  } catch (err) {
    console.error('[getChatSession] Exception:', err);
    return { data: null, error: err };
  }
}

export async function updateChatSession(sessionId, updateData = {}) {
  if (!supabase) return unavailable();
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    return { data, error };
  } catch (err) {
    console.error('[updateChatSession] Exception:', err);
    return { data: null, error: err };
  }
}

export async function ensureChatSession(sessionId, channel = 'web') {
  if (!supabase) return unavailable();
  return supabase.from('chat_sessions').upsert({ 
    session_id: sessionId, 
    channel, 
    status: 'active', 
    started_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  }, { onConflict: 'session_id', ignoreDuplicates: true });
}

export async function endSession(sessionId, status = 'resolved') {
  if (!supabase) return unavailable();
  return supabase.from('chat_sessions').update({ status, ended_at: new Date().toISOString() }).eq('session_id', sessionId);
}

// ═══════════════════════════════════════════════════
// MESSAGE LOGGING (Dengan Fitur Auto Increment Counter)
// ═══════════════════════════════════════════════════

export async function logChatMessage(arg1, roleArg, textArg, confidenceScoreArg = null, metadataArg = {}) {
  if (!supabase) return unavailable();

  // Flexible Parameters: Memungkinkan pemanggilan berjenis Objek (dari ChatBot.jsx) atau Posisional
  let sessionId, role, text, confidenceScore, metadata;

  if (typeof arg1 === 'object' && arg1 !== null) {
    sessionId = arg1.sessionId;
    role = arg1.role;
    text = arg1.text;
    confidenceScore = arg1.confidenceScore || null;
    metadata = {
      category: arg1.category,
      priority: arg1.priority,
      status: arg1.status,
      isTemplateUsed: arg1.isTemplateUsed,
      templateId: arg1.templateId,
    };
  } else {
    sessionId = arg1;
    role = roleArg;
    text = textArg;
    confidenceScore = confidenceScoreArg;
    metadata = metadataArg;
  }

  // ✅ VALIDASI 1: Session ID
  const sessionValidation = validateSessionId(sessionId);
  if (!sessionValidation.isValid) {
    console.warn(`[logChatMessage] ${sessionValidation.error}`, { sessionId });
    return { data: null, error: new Error(sessionValidation.error) };
  }

  // ✅ VALIDASI 2: Text Message
  const textValidation = validateText(text);
  if (!textValidation.isValid) {
    console.warn(`[logChatMessage] ${textValidation.error}`, { text: text?.substring(0, 50) });
    return { data: null, error: new Error(textValidation.error) };
  }

  // ✅ VALIDASI 3: Role
  const roleValidation = validateRole(role);
  if (!roleValidation.isValid) {
    console.warn(`[logChatMessage] ${roleValidation.error}`, { role });
    return { data: null, error: new Error(roleValidation.error) };
  }

  try {
    const messageData = {
      session_id: sessionId,
      role,
      text: textValidation.sanitized,
      created_at: new Date().toISOString(),
      confidence_score: typeof confidenceScore === 'number' ? confidenceScore : null,
      category: metadata.category || null,
      priority: metadata.priority || null,
      message_status: metadata.status || 'received',
      is_template_used: Boolean(metadata.isTemplateUsed),
      template_id: metadata.templateId || null,
    };

    // 1. Simpan pesan baru ke tabel chat_messages
    const { data, error } = await supabase.from('chat_messages').insert(messageData);

    if (error) {
      console.error(`[logChatMessage] Database error:`, error);
      return { data: null, error };
    }

    // 2. ⚡ PERBAIKAN: Hitung & Update message_count di chat_sessions
    const { data: currentSession } = await supabase
      .from('chat_sessions')
      .select('message_count, matched_count, unmatched_count')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (currentSession) {
      const isMatched = role === 'bot' && (metadata.isTemplateUsed || (confidenceScore && confidenceScore > 0));
      const isUnmatched = role === 'bot' && !isMatched;

      await supabase
        .from('chat_sessions')
        .update({
          message_count: (currentSession.message_count || 0) + 1,
          matched_count: isMatched ? (currentSession.matched_count || 0) + 1 : (currentSession.matched_count || 0),
          unmatched_count: isUnmatched ? (currentSession.unmatched_count || 0) + 1 : (currentSession.unmatched_count || 0),
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);
    }

    return { data, error: null };
  } catch (exception) {
    console.error(`[logChatMessage] Exception:`, exception);
    return { data: null, error: exception };
  }
}

// ═══════════════════════════════════════════════════
// NOTIFICATIONS & ESCALATION
// ═══════════════════════════════════════════════════

export async function createNotification(notificationData = {}) {
  if (!supabase) return unavailable();
  try {
    const { data, error } = await supabase.from('notifications').insert([{
      event_type: notificationData.eventType || 'info',
      session_id: notificationData.sessionId || null,
      title: notificationData.title || '',
      message: notificationData.message || '',
      channels: notificationData.channels || ['push'],
      created_at: new Date().toISOString()
    }]);

    if (error) console.error('[createNotification] Database Error:', error);
    return { data, error };
  } catch (err) {
    console.error('[createNotification] Exception:', err);
    return { data: null, error: err };
  }
}

// ═══════════════════════════════════════════════════
// TEMPLATES, DASHBOARD & REALTIME
// ═══════════════════════════════════════════════════

export async function processMessage(sessionId, text, channel = 'web') {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  const { data, error } = await supabase.rpc('process_chat_message', { p_session_id: sessionId, p_message: text, p_channel: channel });
  if (error) throw error;
  const result = Array.isArray(data) ? data[0] : data;
  if (!result || result.error || !result.text?.trim()) {
    throw new Error(result?.error || 'RPC tidak mengembalikan jawaban');
  }
  return {
    ...result,
    text: result.text.trim(),
    category: result.category || null,
  };
}

export async function getTemplates({ search = '', category = 'Semua', favorite = false } = {}) {
  if (!supabase) return { templates: responseTemplates, error: new Error('Supabase belum dikonfigurasi') };
  let query = supabase.from('templates').select('*').eq('is_active', true).order('use_count', { ascending: false });
  if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  if (category && category !== 'Semua') query = query.eq('category', category);
  if (favorite) query = query.eq('is_favorite', true);
  const { data, error } = await query;
  return { templates: error || !data ? responseTemplates : data.map(normalizeTemplate), error };
}

export async function getSessionMessages(sessionId) {
  if (!supabase) return [];
  const { data, error } = await supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getAllCategories() {
  if (!supabase) return [...new Set(responseTemplates.map((template) => template.category))];
  const { data, error } = await supabase.from('templates').select('category').eq('is_active', true);
  if (error || !data) return [...new Set(responseTemplates.map((template) => template.category))];
  return [...new Set(data.map((row) => row.category))];
}

export async function createTemplate(template) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  return supabase.from('templates').insert({ title: template.title, category: template.category, content: template.content, keywords: template.keywords, priority: template.priority, is_favorite: template.isFavorite, is_active: true }).select().single();
}

export async function updateTemplate(id, template) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  return supabase.from('templates').update({ title: template.title, category: template.category, content: template.content, keywords: template.keywords, priority: template.priority }).eq('id', id).select().single();
}

export async function deleteTemplate(id) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  return supabase.from('templates').update({ is_active: false }).eq('id', id);
}

export async function toggleFavorite(id, isFavorite) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  return supabase.from('templates').update({ is_favorite: isFavorite }).eq('id', id);
}

export async function getDashboardStats(period = 30) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  const since = new Date(Date.now() - Number(period) * 86400000).toISOString();
  const [sessionsResult, matchedResult, unmatchedResult, topTemplatesResult, countResult] = await Promise.all([
    supabase.from('chat_sessions').select('*').gte('started_at', since).order('started_at', { ascending: false }),
    supabase.from('chat_messages').select('role, confidence_score, created_at, category').gte('created_at', since).eq('role', 'bot'),
    supabase.from('chat_sessions').select('session_id, channel, updated_at').gte('updated_at', since).eq('status', 'unmatched'),
    supabase.from('templates').select('*').eq('is_active', true).order('use_count', { ascending: false }).limit(5),
    supabase.from('templates').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ]);
  const firstError = [sessionsResult, matchedResult, unmatchedResult, topTemplatesResult].find((result) => result.error)?.error;
  if (firstError) throw firstError;
  const sessions = sessionsResult.data || [];
  const matched = matchedResult.data || [];
  const totalUserMsg = sessions.reduce((sum, session) => sum + (session.message_count || 0), 0);
  const totalMatched = sessions.reduce((sum, session) => sum + (session.matched_count || 0), 0);
  const responseTimes = sessions.map((session) => session.first_response_ms).filter(Boolean);
  const catMap = {};
  matched.forEach((event) => { if (event.category) catMap[event.category] = (catMap[event.category] || 0) + 1; });
  const channelMap = {};
  sessions.forEach((session) => { channelMap[session.channel] = (channelMap[session.channel] || 0) + 1; });
  return {
    kpi: {
      totalSessions: { value: sessions.length, change: 0 },
      resolvedSessions: { value: sessions.filter((session) => session.status === 'resolved').length, change: 0 },
      matchRate: { value: totalUserMsg ? Math.round((totalMatched / totalUserMsg) * 100) : 0, change: 0 },
      avgResponseTime: { value: responseTimes.length ? Math.round(responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length) : 0, change: 0 },
      escalatedSessions: { value: sessions.filter((session) => session.status === 'escalated').length },
    },
    categoryDistribution: Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    channelDistribution: Object.entries(channelMap).map(([name, value]) => ({ name: name === 'web' ? 'Website' : name === 'whatsapp' ? 'WhatsApp' : name, value })),
    sessions,
    topTemplates: (topTemplatesResult.data || []).map(normalizeTemplate),
    recentUnmatched: (unmatchedResult.data || []).map((session) => ({ sessionId: session.session_id, channel: session.channel, timestamp: session.updated_at, lastMessages: [] })),
    totalTemplates: countResult.count || 0,
    pendingEscalations: sessions.filter((session) => session.status === 'escalated').length,
  };
}

export function subscribeToNewChats(callback) {
  if (!supabase) return null;
  return supabase.channel('public:chat_sessions').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_sessions' }, (payload) => callback(payload.new)).subscribe();
}

export function subscribeToNewMessages(callback) {
  if (!supabase) return null;
  return supabase.channel('public:chat_messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => callback(payload.new)).subscribe();
}

export function unsubscribe(channel) {
  if (supabase && channel) return supabase.removeChannel(channel);
  return Promise.resolve();
}