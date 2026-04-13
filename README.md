# ⚖️ JusticeAI — AI-Powered Legal Co-pilot for Indian Citizens

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen.svg)](https://justice-ai-ui.onrender.com)

## 🌐 Live Deployment
- **Frontend (UI):** [justice-ai-ui.onrender.com](https://justice-ai-ui.onrender.com)
- **Backend (API):** [justice-ai-api.onrender.com](https://justice-ai-api.onrender.com)

**JusticeAI** empowers every Indian citizen with an AI-powered legal co-pilot. Understand your rights, build winning strategies, and navigate the legal system with confidence — all powered by local, private AI.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Ollama** (for local AI inference)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akullganesh19/justiceai.git
   cd justiceai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Ollama**
   ```bash
   # Install Ollama from https://ollama.com
   # Then pull the required models:
   ollama serve
   ollama pull nomic-embed-text
   ollama pull gemma3:4b
   
   # Optional: After fine-tuning with cook.py, create custom model:
   # ollama create justiceai -f ./Modelfile
   # ollama pull justiceai
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your preferences
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📋 Features

### Core Platform Features

| Feature | Description |
|---------|-------------|
| **AI Legal Chat** | Describe your case to our intelligent co-pilot. Get strategy, arguments, and courtroom preparation. |
| **Document Generator** | Generate Legal Notices, Consumer Complaints, RTI Applications, and FIR drafts instantly. |
| **Know Your Rights** | Explore 18+ rights across Consumer, Tenant, Employee, Women, Digital & Student categories. |
| **Cost Estimator** | Calculate court fees, lawyer costs, and expected timelines before committing to legal action. |
| **Find a Lawyer** | Browse verified advocates by city, specialization, and experience across India. |
| **Case Tracker** | Track your legal journey step by step. Mark milestones and stay organized. |
| **Legal Quiz** | Test your knowledge of Indian law with interactive quizzes. |
| **Legal Glossary** | Searchable dictionary of 35+ essential Indian legal terms. |
| **Limitation Calculator** | Calculate filing deadlines under the Limitation Act, 1963. |
| **Legal Aid Checker** | Determine eligibility for free legal aid under NALSA guidelines. |

### Technical Features

- **RAG (Retrieval-Augmented Generation)** — Grounded in factual law to prevent AI hallucinations
- **Local AI Processing** — All AI inference runs locally via Ollama for maximum privacy
- **Dual Mode Chat** — Legal Co-pilot mode and Opposing Counsel Simulator
- **Multi-Jurisdiction Support** — Handle cases across different Indian states
- **Streaming Responses** — Real-time AI responses for better UX
- **Rate Limiting** — Built-in protection against abuse

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Pages     │  │ Components  │  │    Lib      │             │
│  │  (15+ routes)│  │  (UI/Chat)  │  │  (Utils)    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  /api/chat  │  │ /api/upload │  │ /api/health │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Layer (Ollama)                          │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │  nomic-embed-text   │  │    gemma3:4b        │              │
│  │   (Embeddings)      │  │   (Chat Model)      │              │
│  └─────────────────────┘  └─────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
justiceai/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── chat/         # Chat-related components
│   │   └── analysis/     # Analysis panel components
│   ├── pages/            # Application pages (15+ routes)
│   ├── lib/              # Utility functions and API clients
│   ├── types/            # TypeScript type definitions
│   ├── data/             # Static data files
│   ├── test/             # Test files and setup
│   └── index.css         # Global styles
├── public/
│   └── documents/        # RAG knowledge base documents
├── server.js             # Express backend server
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vitest.config.js      # Vitest configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend servers |
| `npm run dev:client` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |

## 🌐 API Documentation

### Health Check
```
GET /api/health
```
Returns server health status including RAG state and memory usage.

### Chat
```
POST /api/chat
Content-Type: application/json

{
  "messages": [{ "role": "user", "content": "..." }],
  "personality": "Neutral",
  "mode": "copilot",
  "jurisdiction": "National",
  "basePrompt": "...",
  "stream": false
}
```

### Upload Documents
```
POST /api/upload
Content-Type: multipart/form-data

documents: <file> (PDF, TXT, MD)
```

### Get Statistics
```
GET /api/stats
```

### Delete Documents
```
DELETE /api/documents/:source
DELETE /api/documents (clear all)
```

## 🎨 Design System

### Colors
- **Gold**: `#D4AF37` — Primary accent, represents justice and authority
- **Ink**: `#0D0F0E` — Darkest background
- **Void**: `#080909` — Main background
- **Raised**: `#131615` — Elevated surfaces

### Typography
- **Display**: Playfair Display (serif) — Headings
- **Body**: DM Sans (sans-serif) — Body text
- **Mono**: IBM Plex Mono — Code and technical content

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📄 Legal Disclaimer

**⚠️ IMPORTANT**: JusticeAI is a **legal information and guidance tool**, NOT a replacement for professional legal representation.

### What JusticeAI CAN Do:
✅ Explain your legal rights under Indian law
✅ Help draft complaints, petitions, and legal documents
✅ Provide guidance on legal procedures and next steps
✅ Research relevant laws and precedents
✅ Reduce dependency on expensive legal consultations for basic matters

### What JusticeAI CANNOT Do:
❌ Represent you in court
❌ Guarantee legal correctness or case outcomes
❌ Replace lawyer judgment and strategy
❌ Provide legally binding advice
❌ Handle complex litigation requiring human advocacy

**No lawyer-client relationship is formed through the use of this application.** Always consult with a qualified legal professional for advice specific to your situation, especially for court representation and complex legal matters.

### Liability Notice
JusticeAI is provided "as is" for educational and informational purposes. The developers are not responsible for any legal outcomes resulting from the use of this tool. Users assume full responsibility for their legal actions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** — For providing local AI inference capabilities
- **LangChain** — For RAG and AI orchestration tools
- **React** — For the UI framework
- **Vite** — For blazing-fast development experience
- **Tailwind CSS** — For the utility-first CSS framework
- **OpenNyAI** — For pioneering Indian legal NLP open-source tools and document templates
- **Nyaaya** — For inspiring accessible legal information in India
- **TechForJustice** — For RTI templates and civic empowerment tools

## 🔗 Related Open Source Projects

If you're interested in Indian Legal Tech, check out these excellent projects:

| Project | Description |
|---------|-------------|
| [OpenNyAI](https://github.com/OpenNyAI) | Indian legal NLP, document extraction, judgment summarization |
| [Nyaaya](https://github.com/nyaaya) | Legal information access and document templates |
| [TechForJustice](https://github.com/techforjustice) | RTI application templates in multiple Indian languages |
| [CivicDataLab RTI](https://github.com/civicdatalab/RTI-templates) | State-wise RTI templates and PIO address data |

These projects are doing important work in democratizing legal access in India.

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Akullganesh19/justiceai/issues)
- **Discussions**: [Community discussions](https://github.com/Akullganesh19/justiceai/discussions)

---

Built with ⚖️ for the people of India