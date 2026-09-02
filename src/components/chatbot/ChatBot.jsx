import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import OptionButtons from './OptionButtons';
import ChatInput from './ChatInput';
import { supabase } from '../../lib/supabase';
import {
  logChatMessage,
  createChatSession,
  updateChatSession,
  getChatSession,
  generateSessionId,
  createNotification,
} from '../../services/chatService';
import {
  searchKnowledge,
  detectFollowUp,
  fallbackResponses,
  knowledgeBase,
  detectCategory,
  detectPriority,
} from '../../lib/knowledgeBase';

const INITIAL_GREETING = {
  sender: 'BOT',
  text: `Selamat datang di layanan Chatbot KPP Pratama Rengat 👋

Silakan ketik **angka menu** atau **pilih tombol** di bawah ini:

1. Kode Billing PPh Tanah / UMKM
2. Pelaporan SPT Masa PPN (PKP)
3. Status & Pengambilan SKB
4. Update Email & Nomor HP
5. Kendala Coretax & Pendaftaran NPWP
6. Hubungi Petugas`,
  timestamp: Date.now(),
};

const CONTEXT_TIMEOUT_MS = 5 * 60 * 1000;
const WA_ADMIN_NUMBER = '628123456789'; // 💬 Ganti dengan nomor WhatsApp Helpdesk/Admin kamu

const ChatBot = ({ onMinimize, onClose, onClearChat, onNewBotMessage }) => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastMenuId, setLastMenuId] = useState(null);
  const [pendingClicks, setPendingClicks] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const [breadcrumb, setBreadcrumb] = useState([{ id: null, label: 'Beranda' }]);
  const [context, setContext] = useState({
    lastTopic: null,
    lastIntent: null,
    followUpCount: 0,
    lastInteraction: null,
  });
  const [noMatchCount, setNoMatchCount] = useState(0);
  const contextTimerRef = useRef(null);
  const sessionInitialized = useRef(false);

  // ⚡ HELPER: Pengarah ke WhatsApp
  const redirectToWhatsApp = useCallback((customMessage) => {
    const cleanPhone = WA_ADMIN_NUMBER.replace(/[^0-9]/g, '');
    const defaultText = `Halo Admin KPP Pratama Rengat, saya memerlukan bantuan petugas langsung untuk Sesi: ${sessionId || '-'}`;
    const messageText = customMessage || defaultText;
    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    // Membuka WhatsApp di tab baru
    window.open(waUrl, '_blank');
  }, [sessionId]);

  const mockOptions = {
    null: [
      { id: 1, label: '1. Billing PPh Tanah / UMKM', action: 'reply', reply_text: `**📌 Layanan Kode Billing Pajak**\n\nSilakan ketik kode menu pilihan Anda:\n\n* **1A** : PPh Tanah / Jual Beli (PHTB)\n* **1B** : PPh Final UMKM (0,5%)\n* **1C** : Kehilangan Bukti Bayar / Cetak BPN`, category: 'e-Billing', priority: 'P3' },
      { id: 2, label: '2. Lapor SPT PPN (PKP)', action: 'reply', reply_text: '**📌 Pelaporan SPT Masa PPN (PKP)**\n\nPelaporan SPT Masa PPN dilakukan secara elektronik setiap bulan melalui portal Coretax pada navigasi berikut:\n\n👉 **Surat Pemberitahuan** > **Konsep SPT** > **PPN**', category: 'SPT', priority: 'P2' },
      { id: 3, label: '3. Status & Pengambilan SKB', action: 'reply', reply_text: '**📌 Informasi Surat Keterangan Bebas (SKB)**\n\n* **Jangka Waktu:** Maksimal 3 hari kerja.\n* **Pengambilan Fisik:** Ke TPT KPP Pratama Rengat membawa BPS.\n* **Pengiriman Online:** Diproses via WhatsApp jika domisili jauh.', category: 'Layanan', priority: 'P3' },
      { id: 4, label: '4. Update Email & No HP', action: 'reply', reply_text: `**📌 Pengubahan Email & Nomor HP Terdaftar**\n\nSilakan lengkapi data berikut:\n\n1. Nomor NIK / NPWP:\n2. Nama Lengkap:\n3. Email Baru (Aktif):\n4. Nomor HP Baru (Aktif):\n\n⚠️ **Wajib Lampirkan:** Foto KTP fisik dan Foto Selfie memegang KTP.`, category: 'Profil', priority: 'P2' },
      { id: 5, label: '5. Kendala Maps Coretax', action: 'reply', reply_text: '**📌 Solusi Kendala Seksi Pengawasan Kosong (Coretax)**\n\n* Pastikan Anda telah mengklik dan menentukan **titik lokasi alamat** pada **Peta (Maps)** yang tersedia.\n* Seksi Pengawasan akan terisi otomatis setelah lokasi ditentukan.', category: 'NPWP', priority: 'P3' },
      { id: 6, label: '6. Hubungi Petugas', action: 'human', reply_text: '🎧 **Layanan Helpdesk KPP Pratama Rengat**\n\nMenghubungkan Anda ke petugas kami via WhatsApp...', category: 'Konsultasi', priority: 'P2' },
    ],
    1: [
      { id: '1a', label: '1A. PPh Tanah (PHTB)', action: 'reply', reply_text: `**📌 Permohonan Kode Billing PPh Tanah (PHTB)**\n\nSilakan salin dan lengkapi data berikut:\n\n* Nama Wajib Pajak:\n* NIK (tanpa tanda baca):\n* NOP (tanpa tanda baca):\n* Alamat Objek Pajak:\n* Masa Pembayaran:\n* Nominal PPh:\n\nPetugas kami akan segera memproses kode billing Anda.`, category: 'e-Billing', priority: 'P2' },
      { id: '1b', label: '1B. PPh Final UMKM', action: 'reply', reply_text: `**📌 Permohonan Kode Billing PPh Final UMKM**\n\nSilakan salin dan lengkapi data berikut:\n\n* Nama Wajib Pajak:\n* NPWP / NIK:\n* Masa / Bulan Pajak:\n* Nominal Omzet / PPh:\n\n💡 *Tips:* Kode billing juga bisa dibuat mandiri via Coretax.`, category: 'e-Billing', priority: 'P3' },
      { id: '1c', label: '1C. Cetak Ulang BPN', action: 'reply', reply_text: '**📌 Penanganan Bukti Bayar (BPN) Hilang**\n\n1. **Cetak Mandiri:** Unduh via portal Coretax menu **Riwayat Pembayaran**.\n2. **Bantuan Petugas:** Informasikan NIK/NPWP dan Tanggal Pembayaran kepada kami.', category: 'e-Billing', priority: 'P3' },
    ]
  };

  useEffect(() => {
    const initSession = async () => {
      if (sessionInitialized.current) return;
      sessionInitialized.current = true;

      const savedSession = localStorage.getItem('kpp_rengat_session_id');

      if (savedSession) {
        const { data: existingSession } = await getChatSession(savedSession);
        if (existingSession && existingSession.status === 'active') {
          setSessionId(savedSession);
          return;
        }
      }

      const newSessionId = generateSessionId();
      await createChatSession(newSessionId, {
        category: 'Lainnya',
        source: 'web_widget',
      });
      setSessionId(newSessionId);
      localStorage.setItem('kpp_rengat_session_id', newSessionId);
    };

    initSession();
  }, []);

  const playNotificationSound = useCallback(() => {
    if (document.visibilityState !== 'visible') {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.frequency.value = 800;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {
        console.error('AudioContext not supported');
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        document.title = 'KPP Pratama Rengat - AI Assistant Demo';
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchOptions = async (parentId) => {
    setHasError(false);
    const fallbackList = mockOptions[parentId] || [];

    try {
      if (!supabase) {
        setOptions(fallbackList);
        return;
      }

      let query = supabase.from('bot_options').select('*').eq('is_active', true).order('sort_order');
      if (parentId === null) {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        setOptions(fallbackList);
      } else {
        setOptions(data);
      }
    } catch (err) {
      console.warn('Gagal memuat bot_options, memakai fallback:', err);
      setOptions(fallbackList);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('kpp_rengat_chat_history');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const { messages: savedMessages, lastMenuId: savedLastMenu, lastActive, breadcrumb: savedBreadcrumb } = parsed;
        if (Date.now() - lastActive < 24 * 60 * 60 * 1000) {
          setMessages(savedMessages);
          setLastMenuId(savedLastMenu);
          if (savedBreadcrumb) setBreadcrumb(savedBreadcrumb);
          fetchOptions(savedLastMenu);
          return;
        }
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
    const msg = { ...INITIAL_GREETING, timeString: formatTime(new Date()) };
    setMessages([msg]);
    fetchOptions(null);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('kpp_rengat_chat_history', JSON.stringify({
        messages,
        lastMenuId,
        breadcrumb,
        lastActive: Date.now(),
      }));
    }
  }, [messages, lastMenuId, breadcrumb]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (pendingClicks.length > 0) {
        const clicks = [...pendingClicks];
        setPendingClicks([]);
        clicks.forEach(opt => handleOptionClick(opt, true));
      }
    };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingClicks]);

  const formatTime = (date) =>
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const addBotMessage = async (text, metadata = {}) => {
    const msg = { 
      sender: 'BOT', 
      text, 
      timestamp: Date.now(), 
      timeString: formatTime(new Date()) 
    };
    setMessages(prev => [...prev, msg]);
    playNotificationSound();

    if (document.visibilityState !== 'visible') {
      document.title = '📩 Pesan Baru — KPP Pratama Rengat';
    }
    if (onNewBotMessage) onNewBotMessage();

    if (sessionId) {
      await logChatMessage({
        sessionId,
        role: 'bot',
        text,
        category: metadata.category || context.lastTopic || 'Lainnya',
        priority: metadata.priority || 'P4',
        status: 'answered',
        isTemplateUsed: metadata.isTemplateUsed || false,
        templateId: metadata.templateId || null,
      });
    }
  };

  const scheduleContextReset = () => {
    if (contextTimerRef.current) clearTimeout(contextTimerRef.current);
    contextTimerRef.current = setTimeout(() => {
      setContext({ lastTopic: null, lastIntent: null, followUpCount: 0, lastInteraction: null });
    }, CONTEXT_TIMEOUT_MS);
  };

  const handleFreeText = async (text) => {
    if (isOffline) {
      addBotMessage('Koneksi internet terputus. Tidak bisa memproses pertanyaan saat ini.');
      return;
    }

    if (navigator.vibrate) navigator.vibrate(50);

    const userMsg = { 
      sender: 'USER', 
      text, 
      timestamp: Date.now(), 
      timeString: formatTime(new Date()) 
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const detectedCategory = detectCategory(text);
    const detectedPriority = detectPriority(text, detectedCategory);

    if (sessionId) {
      await logChatMessage({
        sessionId,
        role: 'user',
        text,
        category: detectedCategory,
        priority: detectedPriority,
        status: 'received',
      });

      await updateChatSession(sessionId, {
        primary_category: detectedCategory,
      });
    }

    const delay = Math.floor(Math.random() * (1200 - 600 + 1) + 600);

    setTimeout(async () => {
      setIsTyping(false);
      const lower = text.toLowerCase().trim();

      if (fallbackResponses.greetings.some(g => lower.includes(g))) {
        await addBotMessage(fallbackResponses.greetingResponse, { 
          category: 'Konsultasi', 
          priority: 'P4' 
        });
        fetchOptions(null);
        return;
      }

      const followUp = detectFollowUp(text, context);
      if (followUp) {
        const kbItem = knowledgeBase.find(k => k.id === followUp.topic || k.topic === followUp.topic);
        if (kbItem) {
          await addBotMessage(`(Lanjutan topik: ${kbItem.topic})\n\n${kbItem.answer}`, {
            category: kbItem.category || 'Konsultasi',
            priority: kbItem.priority || 'P3',
          });
          setContext(prev => ({
            ...prev,
            followUpCount: prev.followUpCount + 1,
            lastInteraction: Date.now(),
          }));
          scheduleContextReset();
          return;
        }
      }

      const result = searchKnowledge(text);

      if (result.type === 'KNOWLEDGE_MATCH') {
        await addBotMessage(result.answer, {
          category: result.category || 'Konsultasi',
          priority: result.priority || 'P3',
          isTemplateUsed: true,
        });

        if (lower === '1') {
          setLastMenuId(1);
          fetchOptions(1);
          setBreadcrumb(prev => [...prev, { id: 1, label: '1. Billing PPh Tanah / UMKM' }]);
        }

        setContext({
          lastTopic: result.matchedId,
          lastIntent: result.matchedTopic,
          followUpCount: 0,
          lastInteraction: Date.now(),
        });
        setNoMatchCount(0);
        scheduleContextReset();
        return;
      }

      if (result.type === 'WEAK_MATCH') {
        await addBotMessage(fallbackResponses.weakMatch(result.suggestions), {
          category: 'Konsultasi',
          priority: 'P4',
        });
        setNoMatchCount(prev => prev + 1);
        return;
      }

      const newCount = noMatchCount + 1;
      setNoMatchCount(newCount);

      if (newCount >= 3) {
        await addBotMessage(fallbackResponses.repeatedNoMatch, {
          category: 'Konsultasi',
          priority: 'P2',
        });

        if (sessionId) {
          await createNotification({
            eventType: 'escalation',
            sessionId,
            title: 'Chat Perlu Perhatian',
            message: `Wajib pajak mengalami 3x no-match. Session: ${sessionId}`,
            channels: ['push', 'email'],
          });

          await updateChatSession(sessionId, { status: 'escalated' });
        }

        // ⚡ REDIRECT KE WHATSAPP (Setelah 3x tidak ada kecocokan jawaban)
        setTimeout(() => {
          redirectToWhatsApp(`Halo Admin KPP Pratama Rengat, saya memiliki pertanyaan yang membutuhkan jawaban langsung dari petugas (Sesi: ${sessionId}): "${text}"`);
        }, 1500);

      } else {
        await addBotMessage(fallbackResponses.noMatch, {
          category: 'Konsultasi',
          priority: 'P4',
        });
        fetchOptions(null);
        setBreadcrumb([{ id: null, label: 'Beranda' }]);
      }
    }, delay);
  };

  const handleOptionClick = async (opt, fromQueue = false) => {
    if (isOffline && !fromQueue) {
      setPendingClicks(prev => [...prev, opt]);
      return;
    }

    if (navigator.vibrate) navigator.vibrate(50);

    const userMsg = { 
      sender: 'USER', 
      text: opt.label, 
      timestamp: Date.now(), 
      timeString: formatTime(new Date()) 
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    if (sessionId) {
      await logChatMessage({
        sessionId,
        role: 'user',
        text: opt.label,
        category: opt.category || 'Lainnya',
        priority: opt.priority || 'P4',
        status: 'received',
      });

      await updateChatSession(sessionId, {
        primary_category: opt.category || 'Lainnya',
      });
    }

    setBreadcrumb(prev => [...prev, { id: opt.id, label: opt.label }]);
    setContext({ lastTopic: null, lastIntent: null, followUpCount: 0, lastInteraction: null });

    const delay = Math.floor(Math.random() * (1500 - 800 + 1) + 800);

    setTimeout(async () => {
      setIsTyping(false);

      const botResponseText = opt.reply_text || opt.replyText || 'Ini adalah balasan dari KPP Pratama Rengat.';

      await addBotMessage(
        botResponseText,
        { category: opt.category, priority: opt.priority }
      );

      // ⚡ REDIRECT KE WHATSAPP (Jika opsi bertipe 'human' / Hubungi Petugas)
      if (opt.action === 'human' || opt.id === 6 || opt.label.toLowerCase().includes('hubungi petugas')) {
        if (sessionId) {
          await updateChatSession(sessionId, { status: 'escalated' });
        }
        setTimeout(() => {
          redirectToWhatsApp(`Halo Admin KPP Pratama Rengat, saya butuh bantuan langsung mengenai menu '${opt.label}' (Sesi ID: ${sessionId})`);
        }, 1200);
        return;
      }

      if (opt.id) {
        setLastMenuId(opt.id);
        fetchOptions(opt.id);
      }
    }, delay);
  };

  const handleBack = () => {
    if (breadcrumb.length <= 1) return;
    const newBreadcrumb = breadcrumb.slice(0, -1);
    const target = newBreadcrumb[newBreadcrumb.length - 1];
    setBreadcrumb(newBreadcrumb);
    setLastMenuId(target.id);
    fetchOptions(target.id);
  };

  const jumpToBreadcrumb = (idx) => {
    const newBreadcrumb = breadcrumb.slice(0, idx + 1);
    const target = newBreadcrumb[newBreadcrumb.length - 1];
    setBreadcrumb(newBreadcrumb);
    setLastMenuId(target.id);
    fetchOptions(target.id);
  };

  const handleClearChat = async () => {
    localStorage.removeItem('kpp_rengat_chat_history');
    localStorage.removeItem('kpp_rengat_session_id');

    if (sessionId) {
      await updateChatSession(sessionId, { 
        status: 'resolved',
        resolution_time_ms: Date.now() - new Date().getTime(),
      });
    }

    const msg = { ...INITIAL_GREETING, timeString: formatTime(new Date()) };
    setMessages([msg]);
    setLastMenuId(null);
    setBreadcrumb([{ id: null, label: 'Beranda' }]);
    setContext({ lastTopic: null, lastIntent: null, followUpCount: 0, lastInteraction: null });
    setNoMatchCount(0);

    const newSessionId = generateSessionId();
    await createChatSession(newSessionId, { source: 'web_widget' });
    setSessionId(newSessionId);
    localStorage.setItem('kpp_rengat_session_id', newSessionId);

    fetchOptions(null);
    if (onClearChat) onClearChat();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#F8F9FA' }}>
      <ChatHeader
        onMinimize={onMinimize}
        onClose={onClose}
        onClearChat={handleClearChat}
      />

      <ChatMessageList
        messages={messages}
        isTyping={isTyping}
        isOffline={isOffline}
        hasError={hasError}
        onRetry={() => fetchOptions(lastMenuId)}
      />

      {breadcrumb.length > 1 && (
        <div style={{
          padding: '5px 16px',
          fontSize: '11px',
          color: '#64748B',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          flexWrap: 'wrap',
          backgroundColor: '#FAFAFA',
        }}>
          {breadcrumb.map((crumb, idx) => (
            <span key={`${crumb.id ?? 'root'}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {idx > 0 && <span style={{ color: '#94A3B8', margin: '0 2px' }}>›</span>}
              <span
                onClick={() => idx < breadcrumb.length - 1 && jumpToBreadcrumb(idx)}
                style={{
                  cursor: idx < breadcrumb.length - 1 ? 'pointer' : 'default',
                  color: idx < breadcrumb.length - 1 ? '#0056B3' : '#64748B',
                  textDecoration: idx < breadcrumb.length - 1 ? 'underline' : 'none',
                  textUnderlineOffset: '2px',
                }}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: '#F8F9FA' }}>
        {breadcrumb.length > 1 && (
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 14px',
              margin: '8px 12px 0',
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              color: '#0056B3',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0,86,179,0.06)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            ← Kembali
          </button>
        )}
        <OptionButtons
          options={options}
          onOptionClick={handleOptionClick}
          disabled={isTyping || isOffline || hasError}
        />
      </div>

      <ChatInput
        onSend={handleFreeText}
        disabled={isTyping}
      />
    </div>
  );
};

export default ChatBot; 