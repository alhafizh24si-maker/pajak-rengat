const fs = require('fs');
let content = fs.readFileSync('c:/pajak-rengat/src/pages/TaxPortal.jsx', 'utf-8');
content = content.replace(
  '  const filteredServices = services.filter((s) => {',
  '  const currentNews = activeNewsTab === "pengumuman" ? announcements : newsItems;\n\n  const filteredServices = services.filter((s) => {'
);
fs.writeFileSync('c:/pajak-rengat/src/pages/TaxPortal.jsx', content);
console.log("Fixed TaxPortal.jsx");
