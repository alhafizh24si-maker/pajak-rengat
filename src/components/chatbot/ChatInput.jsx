import { useState, useEffect, useRef } from 'react';
import { FiSend, FiX, FiMic, FiZap } from 'react-icons/fi';

const QUICK_PROMPTS = [
  { label: '💡 PP 20/2026 UMKM', text: 'Bagaimana cara perhitungan pajak PP 20/2026 untuk UMKM 0,5%?' },
  { label: '🔑 Lupa EFIN', text: 'Bagaimana syarat dan cara aktivasi atau pemulihan lupa EFIN?' },
  { label: '🕒 Jam Loket KPP', text: 'Berapa jam operasional loket pelayanan TPT KPP Pratama Rengat hari ini?' },
  { label: '📑 Solusi Coretax', text: 'Bagaimana solusi jika seksi pengawasan kosong di portal Coretax?' },
  { label: '📋 Syarat NPWP', text: 'Apa saja syarat membuat NPWP baru secara online?' },
  { label: '🧾 Buat Kode Billing', text: 'Bagaimana cara meminta atau membuat kode billing pembayaran pajak?' }
];

const ChatInput = ({ onSend, disabled, isHumanMode = false, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        inputRef.current?.focus();
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (disabled && !isHumanMode) return;
    onSend(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (text) => {
    if (disabled && !isHumanMode) return;
    onSend(text);
  };

  return (
    <>
      <style>
        {`
          @keyframes micPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
            50%       { box-shadow: 0 0 0 8px rgba(220, 53, 69, 0); }
          }
          .chat-input-field:focus {
            outline: none;
            border-color: #0056B3 !important;
            box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.12) !important;
          }
          .send-btn:hover:not(:disabled) {
            background: #003d82 !important;
            transform: scale(1.05);
          }
          .send-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          .voice-btn:hover:not(:disabled) {
            background: rgba(0, 86, 179, 0.08) !important;
          }
          .quick-prompt-chip {
            white-space: nowrap;
            background: #F1F5F9;
            color: #1E293B;
            border: 1px solid #CBD5E1;
            padding: 4px 10px;
            border-radius: 14px;
            font-size: 11.5px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
            user-select: none;
          }
          .quick-prompt-chip:hover {
            background: #0056B3;
            color: #FFFFFF;
            border-color: #0056B3;
            transform: translateY(-1px);
          }
          .clear-input-btn {
            background: none;
            border: none;
            color: #94A3B8;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: color 0.15s;
          }
          .clear-input-btn:hover {
            color: #475569;
            background: #F1F5F9;
          }
        `}
      </style>

      {/* Indikator mode live chat */}
      {isHumanMode && (
        <div style={{
          padding: '6px 14px 2px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#059669',
          fontWeight: 600,
          backgroundColor: '#F0FDF4'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 6px #10B981',
            display: 'inline-block',
            animation: 'micPulse 1.5s infinite',
          }} />
          Terhubung ke Petugas Loket — pesan langsung diterima
        </div>
      )}

      {/* Quick Suggestion Chips */}
      {!isHumanMode && (
        <div style={{
          padding: '6px 12px',
          backgroundColor: '#FAFCFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <span style={{ color: '#0056B3', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }} title="Saran Pertanyaan Cepat">
            <FiZap size={13} />
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-prompt-chip"
              onClick={() => handlePromptClick(prompt.text)}
              disabled={disabled}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      )}

      <div style={{
        padding: '8px 12px 12px',
        backgroundColor: isHumanMode ? '#F0FDF4' : '#FFFFFF',
        borderTop: isHumanMode ? '2px solid #10B981' : '1px solid #E9ECEF',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s',
      }}>
        {/* Voice button */}
        {voiceSupported && (
          <button
            type="button"
            className="voice-btn"
            onClick={toggleVoice}
            disabled={disabled && !isHumanMode}
            title={isListening ? 'Stop mendengarkan' : 'Ketuk untuk berbicara (id-ID)'}
            style={{
              flexShrink: 0,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: 'none',
              background: isListening ? '#DC3545' : 'transparent',
              color: isListening ? '#FFF' : '#64748B',
              cursor: (disabled && !isHumanMode) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.2s',
              animation: isListening ? 'micPulse 1.2s infinite' : 'none',
            }}
          >
            <FiMic size={18} />
          </button>
        )}

        {/* Text input wrapper */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input
            ref={inputRef}
            className="chat-input-field"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled && !isHumanMode}
            placeholder={
              isListening
                ? '🎤 Sedang mendengarkan ucapan Anda...'
                : placeholder
                  ? placeholder
                  : isHumanMode
                    ? 'Ketik pesan untuk petugas loket...'
                    : 'Ketik pertanyaan atau pilih tombol...'
            }
            style={{
              width: '100%',
              padding: '10px 36px 10px 14px',
              border: isHumanMode ? '1.5px solid #10B981' : '1.5px solid #CBD5E1',
              borderRadius: '24px',
              fontSize: '13.5px',
              color: '#1F2937',
              backgroundColor: (disabled && !isHumanMode) ? '#F8F9FA' : '#FFF',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              fontFamily: 'inherit',
            }}
          />

          {inputValue && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => {
                setInputValue('');
                inputRef.current?.focus();
              }}
              title="Hapus input"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <FiX size={15} />
            </button>
          )}
        </div>

        {/* Send button */}
        <button
          type="button"
          className="send-btn"
          onClick={handleSend}
          disabled={(disabled && !isHumanMode) || !inputValue.trim()}
          title="Kirim Pesan"
          style={{
            flexShrink: 0,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: isHumanMode
              ? 'linear-gradient(135deg, #059669, #065F46)'
              : 'linear-gradient(135deg, #0056B3, #002B49)',
            color: '#FFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            transition: 'all 0.2s',
            boxShadow: '0 2px 6px rgba(0, 86, 179, 0.25)'
          }}
        >
          <FiSend size={15} style={{ marginLeft: '1px' }} />
        </button>
      </div>
    </>
  );
};

export default ChatInput;
