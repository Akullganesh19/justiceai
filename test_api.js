import { spawn } from 'child_process';
import assert from 'assert';

async function testFix() {
  const server = spawn('node', ['server.js'], { stdio: 'pipe' });

  await new Promise(r => setTimeout(r, 4000));

  try {
    const res1 = await fetch('http://localhost:3001/api/documents/%', { method: 'DELETE' });
    console.log("URI test:", res1.status);
    assert.strictEqual(res1.status, 400, "URI decoding failed to return 400");

    const res2 = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [null] })
    });
    console.log("Chat test:", res2.status);
    assert.strictEqual(res2.status, 400, "Chat validation failed to return 400");

    const res3 = await fetch('http://localhost:3001/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: { foo: "bar" } })
    });
    console.log("Embed test:", res3.status);
    assert.strictEqual(res3.status, 400, "Embed validation failed to return 400");

    console.log("All regressions tests passed!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    server.kill();
  }
}
testFix();
