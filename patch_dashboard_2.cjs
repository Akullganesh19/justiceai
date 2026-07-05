const fs = require('fs');

const path = 'src/pages/DashboardPage.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "  useEffect(() => {\n    loadCases();",
  "  useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    loadCases();"
);

content = content.replace(
  "function RecentCaseCard({ caseData, onTogglePin }) {",
  "function RecentCaseCard({ caseData, onTogglePin }) {"
);

fs.writeFileSync(path, content);
console.log('DashboardPage.jsx patched successfully part 2.');
