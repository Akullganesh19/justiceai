fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'hello' }],
    provider: 'ollama',
    stream: false
  })
}).then(r => console.log(r.status));
