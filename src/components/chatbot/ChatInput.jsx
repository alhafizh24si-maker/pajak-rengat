import React, { useState, useEffect, useRef } from 'react';

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
        // Auto-focus the input after voice transcription
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
    // Saat mode live chat: input selalu bisa dikirim
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
        `}
      </style>
      {/* Indikator mode live chat */}
      {isHumanMode && (
        <div style={{
          padding: '4px 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#059669',
          fontWeight: 600,
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
          Terhubung ke Petugas — ketik pesan Anda
        </div>
      )}
      <div style={{
        padding: '10px 12px 14px',
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
              fontSize: '18px',
              transition: 'all 0.2s',
              animation: isListening ? 'micPulse 1.2s infinite' : 'none',
            }}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
        )}

        {/* Text input */}
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
              ? '🎤 Sedang mendengarkan...'
              : placeholder
                ? placeholder
                : isHumanMode
                  ? 'Ketik pesan untuk petugas...'
                  : 'Ketik pertanyaan Anda...'
          }
          style={{
            flex: 1,
            padding: '10px 14px',
            border: isHumanMode ? '1.5px solid #10B981' : '1.5px solid #E9ECEF',
            borderRadius: '24px',
            fontSize: '13.5px',
            color: '#1F2937',
            backgroundColor: (disabled && !isHumanMode) ? '#F8F9FA' : '#FFF',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            fontFamily: 'inherit',
          }}
        />

        {/* Send button */}
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={(disabled && !isHumanMode) || !inputValue.trim()}
          title="Kirim"
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
            fontSize: '16px',
            transition: 'all 0.2s',
          }}
        >
          ➤
        </button>
      </div>
    </>
  );
};

export default ChatInput;
