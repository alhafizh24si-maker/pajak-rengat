const fs = require('fs');
const filePath = 'c:/pajak-rengat/src/components/ui/FloatingWhatsApp.jsx';
let content = fs.readFileSync(filePath, 'utf-8');
content = content.replace(/'6281234567890'/g, "'628125000213'");
fs.writeFileSync(filePath, content);
console.log("Fixed FloatingWhatsApp.jsx");
