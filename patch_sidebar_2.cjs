const fs = require('fs');

const path = 'src/components/chat/CaseHistorySidebar.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "                history.map((item) => (\n                  <div",
  "                {[...history].sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1)).map((item) => (\n                  <div"
);

fs.writeFileSync(path, content);
console.log('CaseHistorySidebar.jsx patched successfully part 2.');
