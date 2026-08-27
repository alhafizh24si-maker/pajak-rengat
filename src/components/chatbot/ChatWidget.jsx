import React, { useState, useEffect } from 'react';
import ChatBot from './ChatBot';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('kpp_chat_open');
    if (savedState) {
      const { open, min } = JSON.parse(savedState);
      setIsOpen(open);
      setIsMinimized(min);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kpp_chat_open', JSON.stringify({ open: isOpen, min: isMinimized }));
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  return (
    <>
      <div style={{ display: !isOpen ? 'block' : 'none' }}>
        <button 
          onClick={() => { setIsOpen(true); setUnreadCount(0); }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#0056B3',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 8px 24px rgba(0, 43, 73, 0.4)',
            fontSize: '28px',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 43, 73, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 43, 73, 0.4)';
          }}
        >
          💬
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#DC3545',
              color: '#FFF',
              fontSize: '12px',
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {unreadCount}
            </div>
          )}
        </button>
      </div>

      <div style={{
        position: 'fixed',
        bottom: isMobile ? '0' : '24px',
        right: isMobile ? '0' : '24px',
        width: isMobile ? '100%' : '380px',
        height: isMobile ? '100%' : (isMinimized ? 'auto' : '520px'),
        maxHeight: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: isMobile ? '0' : (isMinimized ? '16px' : '24px'),
        boxShadow: '0 12px 40px rgba(0, 43, 73, 0.15), 0 4px 12px rgba(0, 43, 73, 0.1)',
        zIndex: 9999,
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'chatAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        border: isMobile ? 'none' : '1px solid rgba(0, 43, 73, 0.08)'
      }}>
        <style>
          {`
            @keyframes chatAppear {
              from { transform: translateY(20px) scale(0.95); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}
        </style>
        
        <div 
          onClick={() => { setIsMinimized(false); setUnreadCount(0); }}
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #002B49, #0056B3)',
            color: '#FFF',
            cursor: 'pointer',
            display: isMinimized ? 'flex' : 'none',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🏛️</span>
            <span style={{ fontWeight: '600', fontSize: '15px', letterSpacing: '0.3px' }}>AI Assistant KPP Rengat</span>
            {unreadCount > 0 && (
              <span style={{
                background: '#DC3545',
                color: '#FFF',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginLeft: '8px'
              }}>{unreadCount} Baru</span>
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{ 
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', 
              fontSize: '20px', cursor: 'pointer', lineHeight: 1,
              width: '28px', height: '28px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ×
          </button>
        </div>

        <div style={{ display: isMinimized ? 'none' : 'flex', flex: 1, height: '100%', width: '100%', flexDirection: 'column' }}>
          <ChatBot 
            onMinimize={() => setIsMinimized(true)}
            onClose={() => setIsOpen(false)}
            onNewBotMessage={() => {
              setUnreadCount(prev => prev + 1);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
