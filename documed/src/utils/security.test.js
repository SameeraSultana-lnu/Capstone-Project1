import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeText, createSafePersistencePayload } from './security.js';

test('strips dangerous script content from user text', () => {
  assert.equal(sanitizeText('<script>alert(1)</script> Hello'), 'Hello');
});

test('removes control characters from user text', () => {
  assert.equal(sanitizeText('Hello\u0000World'), 'HelloWorld');
});

test('keeps only non-sensitive UI state for persistence', () => {
  const payload = {
    session: { email: 'dr@example.com' },
    staff: [{ name: 'Dr. Example' }],
    patients: [{ name: 'Alice' }],
    auditLog: [{ detail: 'secret' }],
    activeTab: 'chat'
  };

  const safePayload = createSafePersistencePayload(payload);
  assert.deepEqual(safePayload, {
    session: { email: 'dr@example.com' },
    activeTab: 'chat'
  });
});
