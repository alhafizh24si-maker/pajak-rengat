import React, { useEffect, useRef, useState } from 'react';

const ChatMessageList = ({ messages, isTyping, isOffline, hasError, onRetry }) => {
  const endOfMessagesRef = useRef(null);
  const [now, setNow] = useState(Date.now());

  // Force re-render to update read receipts over time
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const lastBotIdx = messages.map(m => m.sender).lastIndexOf('BOT');

  return (
    <div style={{
      flex: 1,
      padding: '16px',
      overflowY: 'auto',
      backgroundColor: '#F8F9FA',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {isOffline && (
        <div style={{
          background: '#FFF3CD',
          color: '#856404',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          ⚠️ Koneksi terputus. Beberapa fitur mungkin tidak tersedia.
        </div>
      )}

      {messages.map((msg, idx) => {
        const isBot = msg.sender === 'BOT';
        const isLastBotMessage = isBot && idx === lastBotIdx;
        const msgAge = now - (msg.timestamp || 0);
        const showReadReceipt = isLastBotMessage && (msgAge > 2000); 

        return (
          <div key={idx} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isBot ? 'flex-start' : 'flex-end',
            maxWidth: '100%',
            marginBottom: '4px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', maxWidth: '85%' }}>
              {isBot && (
                <div style={{ 
                  minWidth: '24px', height: '24px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #0056B3, #002B49)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', color: '#FFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '16px'
                }}>✨</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  background: isBot ? '#FFFFFF' : 'linear-gradient(135deg, #0056B3, #003d82)',
                  color: isBot ? '#1F2937' : '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  wordWrap: 'break-word',
                  border: isBot ? '1px solid rgba(0,0,0,0.05)' : 'none'
                }}>
                  {msg.text}
                </div>
                
                <div style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {msg.timeString || '12:00'}
                  {isBot && showReadReceipt && (
                    <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>✓✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ 
              minWidth: '24px', height: '24px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #0056B3, #002B49)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#FFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>✨</div>
            <div style={{
              padding: '12px 16px', 
              background: '#FFFFFF', 
              borderRadius: '16px 16px 16px 4px', 
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
            <style>
              {`
                @keyframes typingBounce { 
                  0%, 60%, 100% { transform: translateY(0); } 
                  30% { transform: translateY(-4px); } 
                }
                .typing-dot {
                  display: inline-block;
                  animation: typingBounce 1.4s infinite ease-in-out both;
                  margin: 0 1px;
                  color: #94a3b8;
                  font-size: 10px;
                }
              `}
            </style>
            <span className="typing-dot" style={{ animationDelay: '0ms' }}>●</span>
            <span className="typing-dot" style={{ animationDelay: '200ms' }}>●</span>
            <span className="typing-dot" style={{ animationDelay: '400ms' }}>●</span>
          </div>
          </div>
        </div>
      )}
      {hasError && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button
            onClick={onRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0056B3',
              color: '#FFF',
              border: 'none',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#003d82'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0056B3'}
          >
            🔄 Coba Lagi
          </button>
        </div>
      )}
      
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatMessageList;
