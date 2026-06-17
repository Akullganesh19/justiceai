const fs = require('fs');

let content = fs.readFileSync('src/pages/DashboardPage.jsx', 'utf8');

// Add Oracle import
content = content.replace(
  "import { useNavigate } from 'react-router-dom';",
  "import { useNavigate } from 'react-router-dom';\nimport { Oracle } from '../lib/oracle.js';"
);

// Add state for prediction
const stateHookStr = `  const [greeting, setGreeting] = useState('');
  const [greetIcon, setGreetIcon] = useState(Sun);`;
content = content.replace(
  stateHookStr,
  stateHookStr + "\n  const [prediction, setPrediction] = useState(null);"
);

// Warmup Oracle in useEffect
const useEffectStartStr = `  useEffect(() => {
    const saved = localStorage.getItem('justice_ai_history');`;
content = content.replace(
  useEffectStartStr,
  `  useEffect(() => {
    // 🛸 Oracle: Warm up predictions on dashboard load
    const pred = Oracle.warmUp();
    if (pred) {
      setPrediction(pred);
    }

    const saved = localStorage.getItem('justice_ai_history');`
);

// Insert prediction UI
const headerSectionEndStr = `              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>`;

const oracleUI = `              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* 🛸 Oracle Anticipation Section */}
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-void border-2 border-gold/40 rounded-sm p-6 shadow-luxe flex items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 blur-xl pointer-events-none" />
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-12 h-12 rounded bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-gold animate-pulse" />
                 </div>
                 <div>
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest italic">
                      Oracle Anticipation
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                      Based on your recent consultation: <span className="text-gold/80">{prediction.reason}</span>
                    </p>
                 </div>
              </div>
              <button
                onClick={() => navigate(prediction.path)}
                className="relative z-10 px-6 py-3 bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-gold/10 text-white text-[10px] uppercase font-extrabold tracking-widest rounded transition-all shadow-hard flex items-center gap-2 italic"
              >
                {prediction.action} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}`;

content = content.replace(headerSectionEndStr, oracleUI);

fs.writeFileSync('src/pages/DashboardPage.jsx', content);
