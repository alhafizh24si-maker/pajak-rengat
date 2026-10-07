import React, { useState } from 'react';

const RATING_DATA = [
  { value: 1, emoji: '😡', label: 'Sangat Tidak Puas', color: '#DC2626' },
  { value: 2, emoji: '🙁', label: 'Tidak Puas', color: '#EA580C' },
  { value: 3, emoji: '😐', label: 'Cukup Puas', color: '#D97706' },
  { value: 4, emoji: '😊', label: 'Puas', color: '#2563EB' },
  { value: 5, emoji: '🤩', label: 'Sangat Puas', color: '#059669' },
];

const QUICK_TAGS_POSITIVE = [
  '⚡ Respon Cepat',
  '🎯 Penjelasan Jelas & Akurat',
  '👮 Petugas / AI Ramah',
  '💡 Solutif & Membantu',
  '📱 Sistem Mudah Digunakan',
];

const QUICK_TAGS_NEGATIVE = [
  '⏳ Perlu Dipercepat',
  '❓ Jawaban Kurang Lengkap',
  '⚙️ Kendala Teknis',
  '📝 Bahasa Terlalu Kaku',
];

export default function SatisfactionSurveyModal({
  isOpen,
  sessionId,
  onSubmit,
  onClose,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentActiveRating = hoverRating || rating;
  const activeRatingInfo = RATING_DATA.find((r) => r.value === currentActiveRating) || RATING_DATA[4];
  const tagsToShow = rating >= 4 ? QUICK_TAGS_POSITIVE : QUICK_TAGS_NEGATIVE;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        sessionId,
        rating,
        tags: selectedTags,
        feedback: feedbackText.trim(),
      });
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Error submitting survey:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(6, 21, 39, 0.72)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -10px rgba(10, 37, 64, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header DJP KPP Pratama Rengat */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0A2540 0%, #173459 100%)',
            padding: '18px 20px',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 199, 0, 0.15)',
              border: '1px solid rgba(255, 199, 0, 0.4)',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#FFC700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
            }}
          >
            <span>🏛️</span> KPP PRATAMA RENGAT
          </div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '-0.2px' }}>
            Survei Kepuasan Layanan (IKM)
          </h3>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.75)',
              lineHeight: '1.4',
            }}
          >
            Bantu kami mengukur & menyempurnakan kualitas pelayanan publik DJP.
          </p>
        </div>

        {isSubmitted ? (
          /* Tampilan Ucapan Terima Kasih */
          <div
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ECFDF5',
                border: '2px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '14px',
              }}
            >
              🎉
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
              Terima Kasih Banyak!
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: '#64748B',
                lineHeight: '1.5',
                maxWidth: '260px',
              }}
            >
              Penilaian Anda telah tercatat pada basis data Indeks Kepuasan Masyarakat KPP Pratama Rengat.
            </p>
            <div
              style={{
                marginTop: '16px',
                padding: '6px 14px',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '11px',
                fontWeight: '600',
                color: '#10B981',
              }}
            >
              ⭐ {rating}/5 Bintang Terkirim
            </div>
          </div>
        ) : (
          /* Form Survei Interaktif */
          <div
            style={{
              padding: '20px',
              maxHeight: '440px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Pilihan 5 Bintang / Emoji */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '34px',
                  lineHeight: '1',
                  marginBottom: '6px',
                  transition: 'transform 0.15s ease',
                  transform: 'scale(1.05)',
                }}
              >
                {activeRatingInfo.emoji}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: activeRatingInfo.color,
                  marginBottom: '10px',
                }}
              >
                {activeRatingInfo.label}
              </div>

              {/* Bintang 1 - 5 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= currentActiveRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        fontSize: '26px',
                        color: isFilled ? '#FFC700' : '#E2E8F0',
                        textShadow: isFilled ? '0 2px 8px rgba(255, 199, 0, 0.4)' : 'none',
                        transition: 'transform 0.12s, color 0.12s',
                        transform: star === currentActiveRating ? 'scale(1.2)' : 'scale(1)',
                        lineHeight: 1,
                      }}
                      aria-label={`Beri nilai ${star} dari 5`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspek Cepat (Tags) */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#475569',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}
              >
                {rating >= 4 ? 'Apa yang paling memuaskan?' : 'Apa yang perlu kami tingkatkan?'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {tagsToShow.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        fontSize: '11px',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        border: isSelected ? '1px solid #173459' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#173459' : '#F8FAFC',
                        color: isSelected ? '#FFFFFF' : '#334155',
                        fontWeight: isSelected ? '600' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kolom Ulasan / Saran */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#475569',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}
              >
                Kritik, Saran, atau Apresiasi (Opsional)
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tuliskan catatan Anda untuk pelayanan KPP Pratama Rengat..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '9px 12px',
                  fontSize: '12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#173459')}
                onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
              />
            </div>

            {/* Tombol Aksi */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748B',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E8F0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              >
                Lewati
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  flex: 2,
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #173459 0%, #0A2540 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(10, 37, 64, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'opacity 0.15s',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <span>Kirim Penilaian</span>
                    <span style={{ color: '#FFC700' }}>★</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </div>
  );
}
