import React from 'react';

const OptionButtons = ({ options, onOptionClick, disabled }) => {
  if (!options || options.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '8px 16px 20px 16px',
      backgroundColor: '#F8F9FA'
    }}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => {
            if (!disabled) onOptionClick(opt);
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
  );
};

export default OptionButtons;
