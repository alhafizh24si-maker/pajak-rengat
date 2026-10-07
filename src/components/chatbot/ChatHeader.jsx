import React from 'react';

const ChatHeader = ({ onMinimize, onClose, onClearChat, onOpenSurvey }) => {
  const handleClear = () => {
    if (window.confirm('Yakin ingin menyelesaikan & mengakhiri sesi chat ini?')) {
      onClearChat();
    }
  };

  return (
    <div style={{
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #002B49, #0056B3)',
      color: '#FFF',
      borderRadius: '24px 24px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '8px', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '20px' }}>🏛️</span>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', letterSpacing: '0.2px' }}>AI Assistant</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>KPP Pratama Rengat</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {onOpenSurvey && (
          <button 
            onClick={onOpenSurvey}
            title="Beri Penilaian Layanan (IKM)"
            style={{ 
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,199,0,0.4)', 
              color: '#FFC700', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px', padding: '4px 8px',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontWeight: '600', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            ⭐ <span style={{ fontSize: '11px', color: '#FFF' }}>IKM</span>
          </button>
        )}
        <button 
          onClick={handleClear}
          title="Hapus / Akhiri Percakapan"
          style={{ 
            background: 'none', border: 'none', color: '#FFF', 
            cursor: 'pointer', fontSize: '16px', padding: '6px',
            opacity: 0.8, transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          🗑️
        </button>
        <button 
          onClick={onMinimize}
          title="Minimize"
          style={{ 
            background: 'none', border: 'none', color: '#FFF', 
            cursor: 'pointer', fontSize: '18px', padding: '6px',
            opacity: 0.8, transition: 'opacity 0.2s',
            transform: 'translateY(-2px)'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          _
        </button>
        <button 
          onClick={onClose}
          title="Tutup"
          style={{ 
            background: 'none', border: 'none', color: '#FFF', 
            cursor: 'pointer', fontSize: '24px', padding: '6px',
            lineHeight: 1, opacity: 0.8, transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
