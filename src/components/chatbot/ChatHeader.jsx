import { FiMinus, FiX, FiTrash2, FiStar, FiCpu } from 'react-icons/fi';

const ChatHeader = ({ onMinimize, onClose, onClearChat, onOpenSurvey }) => {
  const handleClear = () => {
    if (window.confirm('Yakin ingin menyelesaikan & mengakhiri sesi percakapan ini?')) {
      onClearChat();
    }
  };

  return (
    <>
      <style>{`
        .chat-header-ikm-btn {
          background: rgba(255, 209, 0, 0.15);
          border: 1px solid rgba(255, 209, 0, 0.45);
          color: #FFD100;
          border-radius: 8px;
          cursor: pointer;
          font-size: 11px;
          padding: 4px 8px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          transition: all 0.2s;
          margin-right: 2px;
        }
        .chat-header-ikm-btn:hover {
          background: rgba(255, 209, 0, 0.3);
        }
        .chat-header-icon-btn {
          background: none;
          border: none;
          color: #FFFFFF;
          cursor: pointer;
          padding: 6px;
          opacity: 0.85;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .chat-header-icon-btn:hover {
          opacity: 1;
          background-color: rgba(255, 255, 255, 0.15);
        }
        .chat-header-close-btn {
          background: none;
          border: none;
          color: #FFFFFF;
          cursor: pointer;
          padding: 6px;
          opacity: 0.85;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .chat-header-close-btn:hover {
          opacity: 1;
          background-color: rgba(220, 38, 38, 0.5);
        }
      `}</style>
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(135deg, #0A2540 0%, #0056B3 100%)',
        color: '#FFFFFF',
        borderRadius: '20px 20px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.15)', 
            padding: '8px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFD100',
            border: '1px solid rgba(255, 209, 0, 0.3)'
          }}>
            <FiCpu size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: '700', letterSpacing: '0.2px' }}>
                Si Rengat Virtual
              </h3>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                color: '#34D399',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 600
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                Online
              </span>
            </div>
            <p style={{ margin: '1px 0 0 0', fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)' }}>
              KPP Pratama Rengat • AI 24/7
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {onOpenSurvey && (
            <button 
              type="button"
              onClick={onOpenSurvey}
              title="Beri Penilaian Layanan (IKM)"
              className="chat-header-ikm-btn"
            >
              <FiStar size={12} color="#FFD100" />
              <span>IKM</span>
            </button>
          )}

          <button 
            type="button"
            onClick={handleClear}
            title="Hapus / Akhiri Percakapan"
            className="chat-header-icon-btn"
          >
            <FiTrash2 size={15} />
          </button>

          <button 
            type="button"
            onClick={onMinimize}
            title="Perkecil Jendela"
            className="chat-header-icon-btn"
          >
            <FiMinus size={16} />
          </button>

          <button 
            type="button"
            onClick={onClose}
            title="Tutup Chatbot"
            className="chat-header-close-btn"
          >
            <FiX size={17} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
