const fs = require('fs');
const filePath = 'c:/pajak-rengat/src/style.css';

const addition = `
/* TAMBAHAN KEDUA UNTUK FIX FONT DARK MODE */
[data-theme='dark'] .search-dropdown-header span,
[data-theme='dark'] .search-dropdown-header strong,
[data-theme='dark'] .search-dropdown-section-title,
[data-theme='dark'] .search-item-title span,
[data-theme='dark'] .search-item-desc,
[data-theme='dark'] .search-dropdown-item p,
[data-theme='dark'] .empty-state p,
[data-theme='dark'] .modal-scam-body p,
[data-theme='dark'] .modal-scam-body strong,
[data-theme='dark'] .modal-scam-warning,
[data-theme='dark'] .modal-scam-item div span,
[data-theme='dark'] .modal-scam-item div strong,
[data-theme='dark'] .address-main,
[data-theme='dark'] .address-postal,
[data-theme='dark'] .ops-time,
[data-theme='dark'] .ops-day,
[data-theme='dark'] .accordion-number,
[data-theme='dark'] .search-input,
[data-theme='dark'] .news-date {
  color: var(--text-main) !important;
}

[data-theme='dark'] .search-chip,
[data-theme='dark'] .search-see-all-btn,
[data-theme='dark'] .reset-search-btn {
  color: var(--text-muted) !important;
}

[data-theme='dark'] .warning-board-content p,
[data-theme='dark'] .warning-board-content h3 {
  color: #FCA5A5 !important; /* light red for warning */
}

/* Chatbot override for dark mode */
[data-theme='dark'] .chatbot-message,
[data-theme='dark'] .chatbot-header,
[data-theme='dark'] .chatbot-option-btn,
[data-theme='dark'] .chatbot-input {
  color: var(--text-main);
}
`;

fs.appendFileSync(filePath, addition);
console.log("CSS appended phase 2");
