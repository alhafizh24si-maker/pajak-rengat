const fs = require('fs');
const filePath = 'c:/pajak-rengat/src/style.css';

const addition = `

/* TAMBAHAN UNTUK FIX FONT DARK MODE */
[data-theme='dark'] .service-item p,
[data-theme='dark'] .news-card p,
[data-theme='dark'] .news-summary,
[data-theme='dark'] .section-subtitle-center,
[data-theme='dark'] .section-desc-inline,
[data-theme='dark'] .stat-label,
[data-theme='dark'] .flow-step-desc,
[data-theme='dark'] .accordion-body p,
[data-theme='dark'] .ops-address,
[data-theme='dark'] .ops-address p,
[data-theme='dark'] .ops-schedule span,
[data-theme='dark'] .mission-item span,
[data-theme='dark'] .contact-card-value,
[data-theme='dark'] .verification-card-info,
[data-theme='dark'] .verification-handle,
[data-theme='dark'] .verification-note,
[data-theme='dark'] .footer-about,
[data-theme='dark'] .footer-social-desc {
  color: var(--text-muted) !important;
}

[data-theme='dark'] .accordion-header h4 {
  color: #F8FAFC !important;
}
`;

fs.appendFileSync(filePath, addition);
console.log("CSS appended");
