import test from 'node:test';
import assert from 'node:assert/strict';
import { getSafeErrorMessage } from './errorHandling.js';

test('returns the original string message', () => {
  assert.equal(getSafeErrorMessage('Please try again later.'), 'Please try again later.');
});

test('uses the error message property when present', () => {
  assert.equal(getSafeErrorMessage(new Error('Upload failed')), 'Upload failed');
});

test('falls back to a friendly default when no message exists', () => {
  assert.equal(getSafeErrorMessage(undefined, 'That action could not be completed.'), 'That action could not be completed.');
});
