import React, { useState } from 'react';
import ChatBot from './ChatBot';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {isOpen ? (
        <div
          style={{
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: 'min(600px, calc(100vh - 40px))',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px -10px rgba(10, 37, 64, 0.35), 0 8px 24px -4px rgba(10, 37, 64, 0.2)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
            animation: 'chatSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ChatBot onClose={() => setIsOpen(false)} onMinimize={() => setIsOpen(false)} />
        </div>
      ) : (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Tooltip Hover */}
          {isHovered && (
            <div
              style={{
                position: 'absolute',
                right: '72px',
                backgroundColor: '#0A2540',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🤖 Tanya Si Rengat (AI 24/7)</span>
              <div
                style={{
                  position: 'absolute',
                  right: '-5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '5px solid #0A2540'
                }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Buka Chatbot Si Rengat"
            className="chat-widget-fab"
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              backgroundColor: '#0056B3',
              background: 'linear-gradient(135deg, #0056B3 0%, #002B49 100%)',
              color: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontSize: '26px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 86, 179, 0.4), 0 2px 6px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              position: 'relative'
            }}
          >
            <span>💬</span>
            {/* Green pulsing online dot */}
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '2.5px solid #FFFFFF',
                boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)'
              }}
            />
          </button>
        </div>
      )}
      <style>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;