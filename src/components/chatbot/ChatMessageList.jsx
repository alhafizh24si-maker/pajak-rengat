import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiCopy, FiCheck } from 'react-icons/fi';

const ChatMessageList = ({ messages, isTyping, isOffline, hasError, onRetry }) => {
  const endOfMessagesRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopyMessage = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => {
      setCopiedIdx(null);
    }, 2000);
  };

  return (
    <div style={{
      flex: 1,
      padding: '16px',
      overflowY: 'auto',
      backgroundColor: '#F8FAFC',
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
        const isOfficer = msg.sender === 'ADMIN' || msg.sender === 'PETUGAS';
        const isIncoming = isBot || isOfficer;

        return (
          <div key={idx} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isIncoming ? 'flex-start' : 'flex-end',
            maxWidth: '100%',
            marginBottom: '4px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', maxWidth: '88%' }}>
              {isIncoming && (
                <div style={{ 
                  minWidth: '26px', height: '26px', borderRadius: '50%', 
                  background: isOfficer 
                    ? 'linear-gradient(135deg, #059669, #047857)' 
                    : 'linear-gradient(135deg, #0056B3, #002B49)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', color: '#FFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '16px'
                }} title={isOfficer ? 'Petugas Loket KPP Pratama' : 'Asisten AI Si Rengat'}>
                  {isOfficer ? '👮' : '✨'}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isIncoming ? 'flex-start' : 'flex-end', width: '100%' }}>
                {isOfficer && (
                  <span style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#059669', marginBottom: '3px' }}>
                    Petugas KPP Pratama Rengat
                  </span>
                )}
                {isBot && (
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748B', marginBottom: '3px' }}>
                    Si Rengat (AI DJP)
                  </span>
                )}

                <div style={{
                  padding: '12px 16px',
                  borderRadius: isIncoming ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  background: isOfficer 
                    ? '#F0FDF4' 
                    : isBot 
                    ? '#FFFFFF' 
                    : 'linear-gradient(135deg, #0056B3, #003d82)',
                  color: isIncoming ? '#1F2937' : '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '13.5px',
                  lineHeight: '1.55',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  border: isOfficer 
                    ? '1px solid #BBF7D0' 
                    : isBot 
                    ? '1px solid rgba(226, 232, 240, 0.9)' 
                    : 'none'
                }}>
                  {isIncoming ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                
                {/* Footer Pesan: Jam, Tombol Salin, atau Tanda Centang */}
                <div style={{
                  fontSize: '10.5px',
                  color: '#94A3B8',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: isIncoming ? 'space-between' : 'flex-end',
                  width: '100%',
                  padding: '0 2px'
                }}>
                  <span>{msg.timeString || '12:00'}</span>

                  {/* Tombol Salin Pesan untuk Balasan Masuk */}
                  {isIncoming && (
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.text, idx)}
                      title="Salin isi jawaban"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        color: copiedIdx === idx ? '#059669' : '#64748B',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s'
                      }}
                    >
                      {copiedIdx === idx ? (
                        <>
                          <FiCheck size={11} color="#059669" />
                          <span style={{ fontWeight: 600, color: '#059669' }}>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy size={11} />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Tanda Centang Dua Biru untuk Pesan Keluar Pengguna */}
                  {!isIncoming && (
                    <span style={{ color: '#3B82F6', fontSize: '11px', fontWeight: 'bold' }} title="Pesan Terkirim">
                      ✓✓
                    </span>
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
              minWidth: '26px', height: '26px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #0056B3, #002B49)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', color: '#FFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>✨</div>
            <div style={{
              padding: '10px 14px', 
              background: '#FFFFFF', 
              borderRadius: '16px 16px 16px 4px', 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(226, 232, 240, 0.9)'
            }}>
              <style>
                {`
                  @keyframes typingBounce { 
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 
                    30% { transform: translateY(-4px); opacity: 1; } 
                  }
                  .typing-dot {
                    display: inline-block;
                    animation: typingBounce 1.4s infinite ease-in-out both;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #0056B3;
                  }
                  .markdown-content p {
                    margin: 0 0 8px 0;
                  }
                  .markdown-content p:last-child {
                    margin-bottom: 0;
                  }
                  .markdown-content ol, .markdown-content ul {
                    margin: 4px 0;
                    padding-left: 20px;
                  }
                  .markdown-content li {
                    margin-bottom: 4px;
                  }
                  .markdown-content code {
                    background: #F1F5F9;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    color: #0F172A;
                  }
                  .chat-retry-btn {
                    padding: 8px 16px;
                    background-color: #0056B3;
                    color: #FFF;
                    border: none;
                    border-radius: 24px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    transition: background-color 0.2s;
                  }
                  .chat-retry-btn:hover {
                    background-color: #003d82;
                  }
                `}
              </style>
              <span className="typing-dot" style={{ animationDelay: '0ms' }} />
              <span className="typing-dot" style={{ animationDelay: '200ms' }} />
              <span className="typing-dot" style={{ animationDelay: '400ms' }} />
              <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '4px' }}>Si Rengat sedang mengetik...</span>
            </div>
          </div>
        </div>
      )}

      {hasError && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button
            type="button"
            className="chat-retry-btn"
            onClick={onRetry}
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
