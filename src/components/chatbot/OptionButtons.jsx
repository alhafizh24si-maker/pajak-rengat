import { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiGrid } from 'react-icons/fi';

const OptionButtons = ({ options, onOptionClick, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!options || options.length === 0) return null;

  return (
    <>
      <style>{`
        .option-header-bar {
          padding: 8px 16px;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
          transition: background-color 0.2s ease;
          background-color: #F1F5F9;
        }
        .option-header-bar:hover {
          background-color: #E2E8F0;
        }
        .quick-option-btn {
          padding: 8px 12px;
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #0A2540;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .quick-option-btn:hover:not(:disabled) {
          background-color: #0056B3;
          color: #FFFFFF;
          border-color: #0056B3;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 86, 179, 0.2);
        }
        .quick-option-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <div style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        {/* Header Bar Pilihan */}
        <div 
          className="option-header-bar"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0056B3' }}>
            <FiGrid size={13} />
            <span>Pilihan Menu Cepat ({options.length})</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', color: '#64748B' }}>
            {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </span>
        </div>

        {/* Area Daftar Pilihan */}
        {isExpanded && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '7px',
            padding: '10px 14px 14px 14px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="quick-option-btn"
                onClick={() => {
                  if (!disabled) {
                    onOptionClick(opt);
                  }
                }}
                disabled={disabled}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OptionButtons;
