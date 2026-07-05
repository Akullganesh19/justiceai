const fs = require('fs');

const path = 'src/pages/DashboardPage.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "  BookMarked,\n  AlertCircle,\n} from 'lucide-react';",
  "  BookMarked,\n  AlertCircle,\n  Bookmark,\n} from 'lucide-react';"
);

content = content.replace(
  "function RecentCaseCard({ caseData }) {",
  "function RecentCaseCard({ caseData, onTogglePin }) {"
);

content = content.replace(
  "          <div className=\"flex items-center gap-4 mt-3\">\n            <span className=\"text-[9px] text-text-tertiary font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10\">\n              {date}\n            </span>\n            <span className=\"text-[9px] text-text-tertiary font-bold uppercase tracking-widest\">\n              {msgCount} Exchange{msgCount !== 1 ? 's' : ''}\n            </span>\n          </div>\n        </div>\n        <div className=\"flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-text-tertiary group-hover:text-gold transition-colors\">\n          <div className=\"w-1.5 h-1.5 rounded-sm bg-emerald-400 animate-pulse\" />\n          Analyzed\n        </div>\n      </div>\n    </button>\n  );\n}",
  "          <div className=\"flex items-center gap-4 mt-3\">\n            <span className=\"text-[9px] text-text-tertiary font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10\">\n              {date}\n            </span>\n            <span className=\"text-[9px] text-text-tertiary font-bold uppercase tracking-widest\">\n              {msgCount} Exchange{msgCount !== 1 ? 's' : ''}\n            </span>\n          </div>\n        </div>\n        <div className=\"flex items-center gap-3\">\n          <button\n            onClick={(e) => {\n              e.stopPropagation();\n              if (onTogglePin) onTogglePin(caseData.id);\n            }}\n            className={`p-2 rounded transition-all ${caseData.pinned ? 'text-gold hover:bg-gold/10' : 'text-text-tertiary hover:text-white hover:bg-white/10'} opacity-0 group-hover:opacity-100`}\n            style={caseData.pinned ? { opacity: 1 } : {}}\n          >\n            <Bookmark className={`w-4 h-4 ${caseData.pinned ? 'fill-current' : ''}`} />\n          </button>\n          <div className=\"flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-text-tertiary group-hover:text-gold transition-colors\">\n            <div className=\"w-1.5 h-1.5 rounded-sm bg-emerald-400 animate-pulse\" />\n            Analyzed\n          </div>\n        </div>\n      </div>\n    </button>\n  );\n}"
);

content = content.replace(
  "  useEffect(() => {\n    const saved = localStorage.getItem('justice_ai_history');\n    if (saved) {\n      try {\n        const parsed = JSON.parse(saved);\n        setRecentCases(parsed.slice(0, 5));\n      } catch (e) {}\n    }",
  "  const loadCases = () => {\n    const saved = localStorage.getItem('justice_ai_history');\n    if (saved) {\n      try {\n        const parsed = JSON.parse(saved);\n        setRecentCases(parsed.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).slice(0, 5));\n      } catch (e) {}\n    }\n  };\n\n  const togglePin = (id) => {\n    const saved = localStorage.getItem('justice_ai_history');\n    if (saved) {\n      try {\n        const parsed = JSON.parse(saved);\n        const updated = parsed.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c);\n        localStorage.setItem('justice_ai_history', JSON.stringify(updated));\n        loadCases();\n      } catch (e) {}\n    }\n  };\n\n  useEffect(() => {\n    loadCases();"
);

content = content.replace(
  "                  recentCases.map((c, i) => <RecentCaseCard key={c.id || i} caseData={c} />)",
  "                  recentCases.map((c, i) => <RecentCaseCard key={c.id || i} caseData={c} onTogglePin={togglePin} />)"
);

fs.writeFileSync(path, content);
console.log('DashboardPage.jsx patched successfully.');
