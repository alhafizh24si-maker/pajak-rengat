import React, { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FiX, FiSend } from "react-icons/fi";

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const waNumber = '628125000213'; // Nomor WhatsApp resmi Helpdesk KPP Pratama Rengat

  const handleSend = () => {
    if (message.trim()) {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setIsOpen(false);
      setMessage('');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 1000, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
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
              width: '42px', 
              height: '42px', 
              backgroundColor: '#fff', 
              borderRadius: '50%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}>
              <img src="https://ui-avatars.com/api/?name=KPP+Rengat&background=002B49&color=FFD100&bold=true&rounded=true" alt="Helpdesk KPP Pratama Rengat" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px', color: '#FFFFFF' }}>Helpdesk KPP Pratama</div>
              <div style={{ fontSize: '12px', opacity: 0.9, color: '#D1FAE5' }}>Layanan Resmi WhatsApp DJP</div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer', 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                alignSelf: 'center',
                transition: 'background 0.2s'
              }}
              aria-label="Tutup Obrolan"
            >
              <FiX size={18} />
            </button>
          </div>
          
          {/* Body */}
          <div className="wa-chat-bg" style={{ padding: '24px 20px', minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '12px 16px', 
              borderRadius: '0 12px 12px 12px', 
              display: 'inline-block', 
              maxWidth: '90%', 
              fontSize: '13.5px', 
              lineHeight: '1.5',
              position: 'relative',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              color: '#1E293B'
            }}>
              <svg style={{ position: 'absolute', top: 0, left: '-8px', width: '8px', height: '13px', color: '#fff' }} viewBox="0 0 8 13">
                <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" fill="currentColor"></path>
              </svg>
              Selamat datang di Helpdesk WhatsApp KPP Pratama Rengat.<br/><br/>Ada yang dapat kami bantu seputar administrasi atau konsultasi perpajakan Anda?
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
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
                padding: '10px 16px', 
                borderRadius: '24px', 
                border: '1px solid #CBD5E1', 
                outline: 'none', 
                fontSize: '13.5px',
                boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                backgroundColor: '#FFFFFF'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim()}
              style={{ 
                backgroundColor: message.trim() ? '#00a884' : '#94A3B8', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '50%', 
                width: '42px', 
                height: '42px', 
                cursor: message.trim() ? 'pointer' : 'default', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexShrink: 0,
                transition: 'background-color 0.2s, transform 0.15s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }}
              aria-label="Kirim Pesan WhatsApp"
            >
              <FiSend size={17} style={{ marginLeft: '2px' }} />
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '50%',
          width: '62px',
          height: '62px',
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(37,211,102,0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'scale(0.85) rotate(-15deg)' : 'scale(1) rotate(0)',
          zIndex: 1001,
          position: 'relative'
        }}
        aria-label="Buka WhatsApp Helpdesk KPP Pratama Rengat"
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <BsWhatsapp size={32} />
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
