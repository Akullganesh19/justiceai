# JusticeAI Production Enhancement Plan

## Executive Summary

This document outlines comprehensive enhancements to make JusticeAI production-ready across security, performance, AI features, UI/UX, and code quality.

---

## 1. Security Enhancements

### 1.1 Critical Security Improvements

#### ✅ COMPLETED: Voice Config Endpoint Security
- Added placeholder validation for Bhashini credentials
- Prevents pipelineId info leak when not configured

#### TODO: Add Security Headers (helmet.js)
```bash
npm install helmet express-rate-limit xss-clean hpp
```

**server.js enhancements:**
```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:11434", "https://*.bhashini.gov.in", "https://*.googleapis.com", "https://api.deepseek.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeUnsubmitted: true,
    preload: true
  }
}));

// Rate limiting (replace custom implementation)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit chat requests more strictly
  message: {
    error: 'Too many chat requests',
    message: 'Please wait before sending more messages'
  }
});

app.use('/api', apiLimiter);
app.use('/api/chat', chatLimiter);

// XSS protection
app.use(xss());

// Prevent parameter pollution
app.use(hpp());
```

#### TODO: Input Validation & Sanitization
```javascript
import { body, param, query, validationResult } from 'express-validator';

// Validation middleware for chat endpoint
const validateChatRequest = [
  body('messages').isArray().withMessage('Messages must be an array'),
  body('messages.*.role').isIn(['user', 'assistant', 'system']).withMessage('Invalid role'),
  body('messages.*.content').isString().trim().escape(),
  body('jurisdiction').optional().isString().trim(),
  body('mode').optional().isIn(['copilot', 'simulator', 'analyzer']),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

app.post('/api/chat', validateChatRequest, async (req, res) => {
  // ... existing code
});
```

#### TODO: Environment Variable Validation
```javascript
// config/validator.js
const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'OLLAMA_BASE_URL',
  'EMBEDDING_MODEL',
  'CHAT_MODEL'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate optional but important vars
  if (!process.env.BHASHINI_API_KEY) {
    console.warn('⚠️ BHASHINI_API_KEY not set - voice recognition will use fallback');
  }
  
  if (!process.env.GEMINI_API_KEY && !process.env.DEEPSEEK_API_KEY) {
    console.warn('⚠️ No cloud AI provider configured - falling back to local Ollama only');
  }
};

export default validateEnv;
```

### 1.2 API Security

#### TODO: Add API Authentication (Optional for Production)
```javascript
import jwt from 'jsonwebtoken';

const API_SECRET = process.env.API_SECRET || 'change-me-in-production';

const authenticateAPI = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, API_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Apply to sensitive endpoints
app.use('/api/chat', authenticateAPI);
```

---

## 2. Performance Enhancements

### 2.1 Response Caching

#### TODO: Add Redis Caching
```bash
npm install redis node-cache
```

```javascript
import { createClient } from 'redis';
import NodeCache from 'node-cache';

// In-memory cache as fallback
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Redis client (optional, for production)
let redisClient;
try {
  redisClient = createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();
} catch (err) {
  console.warn('Redis not available, using in-memory cache');
}

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl || req.url}`;
    
    // Try Redis first
    if (redisClient && redisClient.isOpen) {
      const cached = await redisClient.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } else {
      // Fallback to in-memory
      const cached = cache.get(key);
      if (cached) {
        return res.json(cached);
      }
    }
    
    // Override res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        if (redisClient && redisClient.isOpen) {
          redisClient.setEx(key, duration, JSON.stringify(data));
        } else {
          cache.set(key, data);
        }
      }
      return originalJson(data);
    };
    
    next();
  };
};

// Apply to read-only endpoints
app.get('/api/health', cacheMiddleware(30), (req, res) => { ... });
app.get('/api/stats', cacheMiddleware(60), (req, res) => { ... });
```

### 2.2 Compression

#### TODO: Add Response Compression
```bash
npm install compression
```

```javascript
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

### 2.3 Database Optimization

#### TODO: Add Vector Storage Persistence
```javascript
// Store embeddings in persistent storage instead of memory
import { Pinecone } from '@pinecone-database/pinecone';

// Or use local persistent storage
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';

// This prevents data loss on server restart
```

---

## 3. AI Chat Feature Enhancements

### 3.1 Improved Streaming

#### TODO: Add Proper SSE Streaming
```javascript
app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  
  try {
    const stream = await ollama.chat({
      model: CHAT_MODEL,
      messages: req.body.messages,
      stream: true
    });
    
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});
```

### 3.2 Citation Generation

#### TODO: Add Automatic Citation Generation
```javascript
const generateCitations = (response, context) => {
  const citations = [];
  const sources = new Set();
  
  context.forEach((chunk, index) => {
    if (response.includes(chunk.content.substring(0, 100))) {
      sources.add({
        id: index + 1,
        source: chunk.source,
        relevance: chunk.score
      });
    }
  });
  
  return Array.from(sources);
};

// Add to chat response
res.json({
  message: aiResponse,
  citations: generateCitations(aiResponse.content, topChunks),
  metadata: { ... }
});
```

### 3.3 Conversation Memory

#### TODO: Add Persistent Conversation History
```javascript
// Store conversations in database
app.post('/api/conversations', async (req, res) => {
  const { userId, title, messages } = req.body;
  // Save to database
});

app.get('/api/conversations/:id', async (req, res) => {
  const { id } = req.params;
  // Retrieve from database
});
```

---

## 4. UI/UX Enhancements

### 4.1 Loading States

#### TODO: Add Skeleton Loaders
```jsx
// components/ui/Skeleton.jsx
export function Skeleton({ className, ...props }) {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded ${className}`}
      {...props}
    />
  );
}

// Use in components
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />
```

### 4.2 Error Boundaries

#### TODO: Improve Error Handling
```jsx
// components/ui/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 4.3 Accessibility Improvements

#### TODO: Add ARIA Labels and Keyboard Navigation
```jsx
// Add to all interactive elements
<button 
  aria-label="Send message"
  aria-disabled={isLoading}
  onKeyDown={handleKeyDown}
  tabIndex={0}
>
  <SendIcon />
</button>

// Add skip links
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

---

## 5. Code Quality Enhancements

### 5.1 Logging Improvements

#### TODO: Add Structured Logging
```bash
npm install winston
```

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});

// Use throughout app
logger.info('Server started', { port: PORT });
logger.error('Database connection failed', { error: err.message });
```

### 5.2 Monitoring Hooks

#### TODO: Add Health Check Improvements
```javascript
app.get('/api/health/detailed', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    services: {
      ollama: {
        status: ollamaStatus,
        latency: ollamaLatency
      },
      bhashini: {
        status: bhashiniStatus,
        configured: !!BHASHINI_API_KEY
      }
    }
  });
});
```

---

## 6. Deployment Considerations

### 6.1 Docker Support

#### TODO: Add Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/public ./public
RUN npm ci --only=production
EXPOSE 3001
CMD ["node", "server.js"]
```

### 6.2 Environment-Specific Configs

#### TODO: Add Production Config
```javascript
// config/production.js
export default {
  port: process.env.PORT || 3001,
  nodeEnv: 'production',
  logging: {
    level: 'warn',
    format: 'json'
  },
  cache: {
    enabled: true,
    ttl: 300
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
};
```

---

## Implementation Priority

### Phase 1 (Critical - Do Now)
1. ✅ Voice config security fix
2. Security headers (helmet.js)
3. Input validation
4. Environment variable validation
5. Error boundary improvements

### Phase 2 (High Priority - This Sprint)
1. Response compression
2. Rate limiting improvements
3. Structured logging
4. Health check improvements
5. Loading states

### Phase 3 (Medium Priority - Next Sprint)
1. Response caching
2. Streaming improvements
3. Citation generation
4. Accessibility improvements
5. Docker support

### Phase 4 (Nice to Have - Future)
1. Conversation persistence
2. API authentication
3. Advanced monitoring
4. Performance profiling
5. A/B testing framework

---

## Success Metrics

- **Security**: Zero critical vulnerabilities in security scan
- **Performance**: < 200ms average API response time
- **Reliability**: 99.9% uptime
- **User Experience**: < 3 second page load time
- **Code Quality**: > 80% test coverage, zero ESLint errors