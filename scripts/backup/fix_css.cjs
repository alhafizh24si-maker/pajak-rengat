const fs = require('fs');
const filePath = 'c:/pajak-rengat/src/style.css';
let content = fs.readFileSync(filePath, 'utf-8');

const target = `[data-theme='dark'] .service-item h3,
[data-theme='dark'] .news-card h3,
[data-theme='dark'] .quick-link-title,
[data-theme='dark'] .section-title-center,
[data-theme='dark'] .section-title-inline,
[data-theme='dark'] .stat-number,
[data-theme='dark'] .flow-step-title,
[data-theme='dark'] .ops-card-header h3,
[data-theme='dark'] .accordion-header h4,
[data-theme='dark'] .contact-card-label {
  color: #F8FAFC !important;
}`;

const addition = `

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
[data-theme='dark'] .verification-note {
  color: var(--text-muted) !important;
}`;

if (content.includes(target) && !content.includes('.service-item p')) {
    content = content.replace(target, target + addition);
    fs.writeFileSync(filePath, content);
    console.log("CSS fixed");
} else {
    console.log("Target not found or already applied");
}
