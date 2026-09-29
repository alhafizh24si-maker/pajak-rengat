const fs = require('fs');

const fileContent = fs.readFileSync('c:/pajak-rengat/src/pages/TaxPortal.jsx', 'utf-8');
const lines = fileContent.split('\n');

const startIdx = lines.findIndex(line => line.includes('const marqueeItems = ['));
const endIdx = lines.findIndex((line, idx) => idx > startIdx && line.includes('const verifiedChannels = ['));
// We need the end of verifiedChannels which is a few lines down
let finalIdx = endIdx;
while (finalIdx < lines.length && !lines[finalIdx].includes('  ];')) {
    finalIdx++;
}

const dataLines = lines.slice(startIdx, finalIdx + 1);

// Generate mockData.js content
const mockDataContent = dataLines.map(line => {
    // replace `const ` with `export const `
    if (line.trim().startsWith('const ')) {
        return line.replace('const ', 'export const ');
    }
    return line;
}).join('\n');

fs.mkdirSync('c:/pajak-rengat/src/data', { recursive: true });
fs.writeFileSync('c:/pajak-rengat/src/data/mockData.js', mockDataContent);

// Generate new TaxPortal.jsx content
const newTaxPortalLines = [
    ...lines.slice(0, startIdx),
    `  import { marqueeItems, services, faqs, announcements, newsItems, flowSteps, quickLinks, emergencyContacts, slaMetrics, verifiedChannels } from "../data/mockData";`,
    ...lines.slice(finalIdx + 1)
];

// But wait, import statements should be at the top level.
// So let's insert the import after the last import statement
const lastImportIdx = newTaxPortalLines.map(line => line.startsWith('import')).lastIndexOf(true);

const cleanedLines = newTaxPortalLines.filter(line => !line.includes('import { marqueeItems,'));

cleanedLines.splice(lastImportIdx + 1, 0, `import { marqueeItems, services, faqs, announcements, newsItems, flowSteps, quickLinks, emergencyContacts, slaMetrics, verifiedChannels } from "../data/mockData";`);

fs.writeFileSync('c:/pajak-rengat/src/pages/TaxPortal.jsx', cleanedLines.join('\n'));
console.log("Data extracted to mockData.js");
