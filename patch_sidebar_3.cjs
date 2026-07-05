const fs = require('fs');

const path = 'src/components/chat/CaseHistorySidebar.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "                    <button\n                      onClick={(e) => {\n                        e.stopPropagation();\n                        onDelete(item.id);\n                      }}\n                      className=\"absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-text-tertiary hover:bg-gold/10 hover:text-gold opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-gold/20\"\n                    >\n                      <Trash2 className=\"w-4 h-4\" />\n                    </button>",
  "                    <div className=\"absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all\">\n                      <button\n                        onClick={(e) => {\n                          e.stopPropagation();\n                          if (onTogglePin) onTogglePin(item.id);\n                        }}\n                        className={`p-2.5 rounded-xl transition-all border border-transparent ${item.pinned ? 'text-gold hover:bg-gold/10 hover:border-gold/20' : 'text-text-tertiary hover:text-white hover:bg-white/10'} ${item.pinned ? 'opacity-100 group-hover:opacity-100' : ''}`}\n                        style={item.pinned ? { opacity: 1 } : {}}\n                      >\n                        <Bookmark className={`w-4 h-4 ${item.pinned ? 'fill-current' : ''}`} />\n                      </button>\n                      <button\n                        onClick={(e) => {\n                          e.stopPropagation();\n                          onDelete(item.id);\n                        }}\n                        className=\"p-2.5 rounded-xl text-text-tertiary hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20\"\n                      >\n                        <Trash2 className=\"w-4 h-4\" />\n                      </button>\n                    </div>"
);

fs.writeFileSync(path, content);
console.log('CaseHistorySidebar.jsx patched successfully part 3.');
