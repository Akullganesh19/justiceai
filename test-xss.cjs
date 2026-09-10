const express = require('express');
const request = require('supertest');

const app = express();
app.use(express.json());

const xssMiddleware = (req, res, next) => {
  const escapeHtml = (str) => {
    if (!str) return str;
    return str
      .replace(/&/g, '&')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const sanitize = (obj) => {
    if (typeof obj === 'string') return escapeHtml(obj);
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }
  next();
};

app.use(xssMiddleware);

app.post('/test', (req, res) => {
  res.json(req.body);
});

const supertest = require('supertest');

supertest(app)
  .post('/test')
  .send({
    message: "<script>alert(1)</script>",
    nested: { "a": "\"quotes\"" },
    testarray: ["<a>", "<b>"]
  })
  .expect(200)
  .expect({
    message: "&lt;script&gt;alert(1)&lt;/script&gt;",
    nested: { a: "&quot;quotes&quot;" },
    testarray: [ "&lt;a&gt;", "&lt;b&gt;" ]
  })
  .end((err, res) => {
    if (err) {
      console.error("Test failed!", err.message);
      process.exit(1);
    }
    console.log("Regression test passed! Output:", res.body);
  });
