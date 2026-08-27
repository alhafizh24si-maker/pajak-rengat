import React, { useState, useEffect, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import OptionButtons from './OptionButtons';
import { supabase } from '../../lib/supabase';

const INITIAL_GREETING = {
  sender: 'BOT',
  text: 'Halo! Selamat datang di layanan Chatbot KPP Pratama Rengat. Ada yang bisa kami bantu?',
  timestamp: Date.now()
};

const ChatBot = ({ onMinimize, onClose, onClearChat, onNewBotMessage }) => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastMenuId, setLastMenuId] = useState(null);
  const [pendingClicks, setPendingClicks] = useState([]);
  const [hasError, setHasError] = useState(false);

  // Mock response mapping in case Supabase table isn't populated
  const mockOptions = {
    null: [
      { id: 1, label: 'Pendaftaran NPWP', action: 'reply', replyText: 'Untuk mendaftar NPWP, Anda bisa melalui ereg.pajak.go.id.' },
      { id: 2, label: 'Lupa EFIN', action: 'reply', replyText: 'Silakan hubungi Kring Pajak 1500200 atau email ke lupa.efin@pajak.go.id' },
      { id: 3, label: 'Bantuan Langsung', action: 'human', replyText: 'Menghubungkan Anda ke petugas...' }
    ]
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
        document.title = 'fizh-sems5'; 
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
      setOptions(data && data.length > 0 ? data : []);
      if (data && data.length === 0) {
        setOptions(mockOptions[parentId] || []);
      }
    } catch (err) {
      console.error(err);
      setOptions(mockOptions[parentId] || []);
      setHasError(true);
      
      addBotMessage("Maaf, sistem sedang mengalami gangguan. Silakan coba beberapa saat lagi atau hubungi petugas kami di (0761) XXXXX.");
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('kpp_rengat_chat_history');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const { messages: savedMessages, lastMenuId: savedLastMenu, lastActive } = parsed;
        
        if (Date.now() - lastActive < 24 * 60 * 60 * 1000) {
          setMessages(savedMessages);
          setLastMenuId(savedLastMenu);
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
        lastActive: Date.now()
      }));
    }
  }, [messages, lastMenuId]);

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

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const addBotMessage = (text) => {
    const msg = { sender: 'BOT', text, timestamp: Date.now(), timeString: formatTime(new Date()) };
    setMessages(prev => [...prev, msg]);
    playNotificationSound();
    if (document.visibilityState !== 'visible') {
      document.title = '📩 Pesan Baru — KPP Pratama Rengat';
    }
    if (onNewBotMessage) onNewBotMessage();
  };

  const handleOptionClick = (opt, fromQueue = false) => {
    if (isOffline && !fromQueue) {
      setPendingClicks(prev => [...prev, opt]);
      return;
    }

    if (navigator.vibrate) navigator.vibrate(50); 

    const userMsg = { sender: 'USER', text: opt.label, timestamp: Date.now(), timeString: formatTime(new Date()) };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const delay = Math.floor(Math.random() * (1500 - 800 + 1) + 800);
    
    setTimeout(() => {
      setIsTyping(false);
      if (opt.replyText || opt.action === 'reply' || opt.action === 'human') {
        addBotMessage(opt.replyText || "Ini adalah balasan dari KPP Pratama Rengat.");
      }
      
      if (opt.id) {
        setLastMenuId(opt.id);
        fetchOptions(opt.id);
      }
    }, delay);
  };

  const handleClearChat = () => {
    localStorage.removeItem('kpp_rengat_chat_history');
    const msg = { ...INITIAL_GREETING, timeString: formatTime(new Date()) };
    setMessages([msg]);
    setLastMenuId(null);
    fetchOptions(null);
    if (onClearChat) onClearChat();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      backgroundColor: '#F8F9FA'
    }}>
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
      <OptionButtons 
        options={options} 
        onOptionClick={handleOptionClick} 
        disabled={isTyping || isOffline || hasError} 
      />
    </div>
  );
};

export default ChatBot;
