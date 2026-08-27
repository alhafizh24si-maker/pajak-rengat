import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import OptionButtons from './OptionButtons';
import ChatInput from './ChatInput';
import { supabase } from '../../lib/supabase';
import {
  searchKnowledge,
  detectFollowUp,
  fallbackResponses,
  knowledgeBase,
} from '../../lib/knowledgeBase';

const INITIAL_GREETING = {
  sender: 'BOT',
  text: 'Halo! Selamat datang di layanan Chatbot KPP Pratama Rengat. Ada yang bisa kami bantu?',
  timestamp: Date.now(),
};

const CONTEXT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const ChatBot = ({ onMinimize, onClose, onClearChat, onNewBotMessage }) => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastMenuId, setLastMenuId] = useState(null);
  const [pendingClicks, setPendingClicks] = useState([]);
  const [hasError, setHasError] = useState(false);

  // v2 state
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, label: 'Beranda' }]);
  const [context, setContext] = useState({
    lastTopic: null,
    lastIntent: null,
    followUpCount: 0,
    lastInteraction: null,
  });
  const [noMatchCount, setNoMatchCount] = useState(0);
  const contextTimerRef = useRef(null);

  // Mock fallback options
  const mockOptions = {
    null: [
      { id: 1, label: 'Pendaftaran NPWP', action: 'reply', replyText: 'Untuk mendaftar NPWP, Anda bisa melalui ereg.pajak.go.id.' },
      { id: 2, label: 'Lupa EFIN', action: 'reply', replyText: 'Silakan hubungi Kring Pajak 1500200 atau email ke lupa.efin@pajak.go.id' },
      { id: 3, label: 'Bantuan Langsung', action: 'human', replyText: 'Menghubungkan Anda ke petugas...' },
    ],
  };

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
    try {
      setHasError(false);
      let query = supabase.from('bot_options').select('*').eq('is_active', true).order('sort_order');
      if (parentId === null) {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setOptions(data && data.length > 0 ? data : (mockOptions[parentId] || []));
    } catch (err) {
      console.error(err);
      setOptions(mockOptions[parentId] || []);
      setHasError(true);
      addBotMessage('Maaf, sistem sedang mengalami gangguan. Silakan coba beberapa saat lagi atau hubungi petugas kami di (0761) XXXXX.');
    }
  };

  // Restore from localStorage
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

  // Persist to localStorage
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

  // Network listeners
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

  const addBotMessage = (text) => {
    const msg = { sender: 'BOT', text, timestamp: Date.now(), timeString: formatTime(new Date()) };
    setMessages(prev => [...prev, msg]);
    playNotificationSound();
    if (document.visibilityState !== 'visible') {
      document.title = '📩 Pesan Baru — KPP Pratama Rengat';
    }
    if (onNewBotMessage) onNewBotMessage();
  };

  // Schedule context auto-reset after 5min idle
  const scheduleContextReset = () => {
    if (contextTimerRef.current) clearTimeout(contextTimerRef.current);
    contextTimerRef.current = setTimeout(() => {
      setContext({ lastTopic: null, lastIntent: null, followUpCount: 0, lastInteraction: null });
    }, CONTEXT_TIMEOUT_MS);
  };

  // v2: Free-text message handler
  const handleFreeText = (text) => {
    if (isOffline) {
      addBotMessage('Koneksi internet terputus. Tidak bisa memproses pertanyaan saat ini.');
      return;
    }

    if (navigator.vibrate) navigator.vibrate(50);

    const userMsg = { sender: 'USER', text, timestamp: Date.now(), timeString: formatTime(new Date()) };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const delay = Math.floor(Math.random() * (1200 - 600 + 1) + 600);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();

      // Greeting detection
      if (fallbackResponses.greetings.some(g => lower.includes(g))) {
        addBotMessage(fallbackResponses.greetingResponse);
        return;
      }

      // Follow-up detection (check before fuzzy search)
      const followUp = detectFollowUp(text, context);
      if (followUp) {
        const kbItem = knowledgeBase.find(k => k.id === followUp.topic);
        if (kbItem) {
          addBotMessage(`(Lanjutan topik: ${kbItem.topic})\n\n${kbItem.answer}`);
          setContext(prev => ({
            ...prev,
            followUpCount: prev.followUpCount + 1,
            lastInteraction: Date.now(),
          }));
          scheduleContextReset();
          return;
        }
      }

      // Fuzzy search
      const result = searchKnowledge(text);

      if (result.type === 'KNOWLEDGE_MATCH') {
        addBotMessage(result.answer);
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
        addBotMessage(fallbackResponses.weakMatch(result.suggestions));
        setNoMatchCount(prev => prev + 1);
        return;
      }

      // NO_MATCH — 3-tier escalation
      const newCount = noMatchCount + 1;
      setNoMatchCount(newCount);
      if (newCount >= 3) {
        addBotMessage(fallbackResponses.repeatedNoMatch);
      } else {
        addBotMessage(fallbackResponses.noMatch);
        fetchOptions(null);
        setBreadcrumb([{ id: null, label: 'Beranda' }]);
      }
    }, delay);
  };

  // Menu option click handler
  const handleOptionClick = (opt, fromQueue = false) => {
    if (isOffline && !fromQueue) {
      setPendingClicks(prev => [...prev, opt]);
      return;
    }

    if (navigator.vibrate) navigator.vibrate(50);

    const userMsg = { sender: 'USER', text: opt.label, timestamp: Date.now(), timeString: formatTime(new Date()) };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Push to breadcrumb; reset context on tree navigation
    setBreadcrumb(prev => [...prev, { id: opt.id, label: opt.label }]);
    setContext({ lastTopic: null, lastIntent: null, followUpCount: 0, lastInteraction: null });

    const delay = Math.floor(Math.random() * (1500 - 800 + 1) + 800);

    setTimeout(() => {
      setIsTyping(false);
      if (opt.replyText || opt.action === 'reply' || opt.action === 'human') {
        addBotMessage(opt.replyText || 'Ini adalah balasan dari KPP Pratama Rengat.');
      }
      if (opt.id) {
        setLastMenuId(opt.id);
        fetchOptions(opt.id);
      }
    }, delay);
  };

  // Breadcrumb back button
  const handleBack = () => {
    if (breadcrumb.length <= 1) return;
    const newBreadcrumb = breadcrumb.slice(0, -1);
    const target = newBreadcrumb[newBreadcrumb.length - 1];
    setBreadcrumb(newBreadcrumb);
    setLastMenuId(target.id);
    fetchOptions(target.id);
  };

  // Jump to a specific breadcrumb node
  const jumpToBreadcrumb = (idx) => {
    const newBreadcrumb = breadcrumb.slice(0, idx + 1);
    const target = newBreadcrumb[newBreadcrumb.length - 1];
    setBreadcrumb(newBreadcrumb);
    setLastMenuId(target.id);
    fetchOptions(target.id);
  };

  const handleClearChat = () => {
    localStorage.removeItem('kpp_rengat_chat_history');
    const msg = { ...INITIAL_GREETING, timeString: formatTime(new Date()) };
    setMessages([msg]);
    setLastMenuId(null);
    setBreadcrumb([{ id: null, label: 'Beranda' }]);
    setContext({ lastTopic: null, lastIntent: null, followUpCount: 0, lastInteraction: null });
    setNoMatchCount(0);
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

      {/* Breadcrumb trail */}
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

      {/* Back button + option buttons */}
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

      {/* Free-text input field (v2) */}
      <ChatInput
        onSend={handleFreeText}
        disabled={isTyping}
      />
    </div>
  );
};

export default ChatBot;


