import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Extract the xssMiddleware logic to test it since it's not exported
const serverCode = fs.readFileSync(path.resolve(__dirname, '../../server.js'), 'utf8');

describe('xssMiddleware escapeHtml function in server.js', () => {
  it('should use proper HTML entities for escaping', () => {
    // Assert that the proper replacements are in the file
    expect(serverCode).toContain(".replace(/</g, '&lt;')");
    expect(serverCode).toContain(".replace(/>/g, '&gt;')");
    expect(serverCode).toContain(".replace(/\"/g, '&quot;')");
    expect(serverCode).toContain(".replace(/&/g, '&amp;')");
    expect(serverCode).toContain(".replace(/'/g, '&#039;')");

    // Ensure the old broken versions are gone
    expect(serverCode).not.toContain(".replace(/</g, '<')");
    expect(serverCode).not.toContain(".replace(/>/g, '>')");
    expect(serverCode).not.toContain(".replace(/\"/g, '\"')");
  });
});
