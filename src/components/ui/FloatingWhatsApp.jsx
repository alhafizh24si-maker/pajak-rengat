import React, { useState } from "react";

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const waNumber = '6281234567890'; // Ganti dengan nomor WhatsApp tujuan

  const handleSend = () => {
    if (message.trim()) {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setIsOpen(false);
      setMessage('');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 1000, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      {isOpen && (
        <div style={{
          backgroundColor: '#efeae2',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          width: '340px',
          marginBottom: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'bottom left'
        }}>
          <style>
            {`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(20px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .wa-chat-bg {
                background-color: #efeae2;
                background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
              }
            `}
          </style>
          {/* Header */}
          <div style={{ 
            backgroundColor: '#005e54', 
            color: '#fff', 
            padding: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            position: 'relative'
          }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              backgroundColor: '#fff', 
              borderRadius: '50%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img src="https://ui-avatars.com/api/?name=Admin+KPP&background=128C7E&color=fff&rounded=true" alt="Admin" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>Admin KPP Pratama</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Membalas dalam beberapa menit</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px', padding: 0, alignSelf: 'flex-start', lineHeight: 1 }}>&times;</button>
          </div>
          
          {/* Body */}
          <div className="wa-chat-bg" style={{ padding: '24px 20px', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '12px 16px', 
              borderRadius: '0 12px 12px 12px', 
              display: 'inline-block', 
              maxWidth: '85%', 
              fontSize: '14px', 
              lineHeight: '1.5',
              position: 'relative',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              color: '#303030'
            }}>
              <svg style={{ position: 'absolute', top: 0, left: '-8px', width: '8px', height: '13px', color: '#fff' }} viewBox="0 0 8 13">
                <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" fill="currentColor"></path>
              </svg>
              Halo! 👋<br/><br/>Ada yang bisa kami bantu seputar layanan perpajakan KPP Pratama Rengat?
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#999', marginTop: '6px' }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div style={{ padding: '12px', backgroundColor: '#f0f0f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pesan Anda..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ 
                flex: 1, 
                padding: '12px 16px', 
                borderRadius: '24px', 
                border: 'none', 
                outline: 'none', 
                fontSize: '14px',
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim()}
              style={{ 
                backgroundColor: message.trim() ? '#00a884' : '#a9a9a9', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '50%', 
                width: '44px', 
                height: '44px', 
                cursor: message.trim() ? 'pointer' : 'default', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexShrink: 0,
                transition: 'background-color 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginLeft: '4px' }}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37,211,102,0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'scale(0.8) rotate(-15deg)' : 'scale(1) rotate(0)',
          zIndex: 1001,
          position: 'relative'
        }}
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
