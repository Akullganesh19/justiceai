const fs = require('fs');

const path = 'src/pages/DashboardPage.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "        </div>\n          <div className=\"flex items-center gap-1.5 text-[9px] uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-400/5 px-2.5 py-1 rounded-sm border-2 border-emerald-400/20 shadow-hard\">\n            <div className=\"w-1.5 h-1.5 rounded-sm bg-emerald-400 animate-pulse\" />\n            Analyzed\n          </div>\n      </div>",
  "        </div>\n        <div className=\"flex items-center gap-3\">\n          <button\n            onClick={(e) => {\n              e.stopPropagation();\n              if (onTogglePin) onTogglePin(caseData.id);\n            }}\n            className={`p-2 rounded-sm transition-all ${caseData.pinned ? 'text-gold hover:bg-gold/10' : 'text-text-tertiary hover:text-white hover:bg-white/10'} opacity-0 group-hover:opacity-100`}\n            style={caseData.pinned ? { opacity: 1 } : {}}\n          >\n            <Bookmark className={`w-4 h-4 ${caseData.pinned ? 'fill-current' : ''}`} />\n          </button>\n          <div className=\"flex items-center gap-1.5 text-[9px] uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-400/5 px-2.5 py-1 rounded-sm border-2 border-emerald-400/20 shadow-hard\">\n            <div className=\"w-1.5 h-1.5 rounded-sm bg-emerald-400 animate-pulse\" />\n            Analyzed\n          </div>\n        </div>\n      </div>"
);

fs.writeFileSync(path, content);
console.log('DashboardPage.jsx patched successfully part 3.');
