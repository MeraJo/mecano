const crypto = require('crypto');

const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_DIGEST = 'sha256';
const SESSION_BYTES = 32;
const SESSION_DAYS = 14;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('hex');
  return {
    salt,
    hash: derived
  };
}

function verifyPassword(password, salt, expectedHash) {
  const actual = crypto.pbkdf2Sync(String(password), String(salt), PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(String(expectedHash), 'hex'));
}

function createSessionToken() {
  return crypto.randomBytes(SESSION_BYTES).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function getSessionExpiry(days = SESSION_DAYS) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, pair) => {
    const index = pair.indexOf('=');
    if (index === -1) {
      return cookies;
    }

    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (key) {
      cookies[key] = decodeURIComponent(value);
    }
    return cookies;
  }, {});
}

function normalizeRole(role) {
  return String(role || 'user').trim().toLowerCase() === 'admin' ? 'admin' : 'user';
}

function safeUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: normalizeRole(row.role),
    created_at: row.created_at
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSessionToken,
  hashToken,
  getSessionExpiry,
  parseCookies,
  normalizeRole,
  safeUserRow
};
