import React, { useState } from 'react';

const OptionButtons = ({ options, onOptionClick, disabled }) => {
  // Menambahkan state untuk mengontrol buka/tutup pilihan
  const [isExpanded, setIsExpanded] = useState(false);

  if (!options || options.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#F8F9FA' }}>
      
      {/* Tombol Buka/Tutup Pilihan */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#64748B',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          userSelect: 'none',
          transition: 'color 0.2s ease',
          borderTop: '1px solid #E2E8F0',
          borderBottom: isExpanded ? 'none' : '1px solid #E2E8F0',
          marginBottom: isExpanded ? '0' : '8px'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#0056B3'}
        onMouseOut={(e) => e.currentTarget.style.color = '#64748B'}
      >
        {isExpanded ? 'Tutup Pilihan Bantuan ▲' : 'Buka Pilihan Bantuan ▼'}
      </div>

      {/* Area Daftar Pilihan (Hanya tampil jika isExpanded = true) */}
      {isExpanded && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 16px 20px 16px',
          maxHeight: '220px', // Membatasi tinggi agar bisa di-scroll jika terlalu banyak
          overflowY: 'auto'
        }}>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                if (!disabled) {
                  onOptionClick(opt);
                  setIsExpanded(false); // Otomatis menutup saat opsi dipilih
                }
              }}
              disabled={disabled}
              style={{
                padding: '10px 16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 86, 179, 0.2)',
                color: '#0056B3',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: disabled ? 0.5 : 1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = '#0056B3';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#0056B3';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 86, 179, 0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#0056B3';
                  e.currentTarget.style.borderColor = 'rgba(0, 86, 179, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                }
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionButtons;