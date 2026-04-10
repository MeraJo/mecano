const db = require('../db/database');
const { hashToken, parseCookies } = require('../lib/auth');

function getTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies.mecano_auth || null;
}

function attachAuth(req, res, next) {
  req.admin = null;

  const token = getTokenFromRequest(req);
  if (!token) {
    return next();
  }

  const tokenHash = hashToken(token);
  const query = `
    SELECT
      Admins.id AS id,
      Admins.name AS name,
      Admins.email AS email,
      Admins.role AS role,
      AdminSessions.expires_at AS expires_at
    FROM AdminSessions
    JOIN Admins ON Admins.id = AdminSessions.admin_id
    WHERE AdminSessions.token_hash = ?
    LIMIT 1
  `;

  db.get(query, [tokenHash], (err, row) => {
    if (err) {
      console.error('Auth lookup failed:', err.message);
      return next();
    }

    if (!row) {
      return next();
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      db.run(`DELETE FROM AdminSessions WHERE token_hash = ?`, [tokenHash], () => next());
      return;
    }

    req.admin = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role || 'admin'
    };

    return next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.admin || req.admin.role !== 'admin') {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  return next();
}

module.exports = {
  attachAuth,
  requireAdmin,
  getTokenFromRequest
};
