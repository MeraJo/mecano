const express = require('express');
const router = express.Router();
const db = require('../db/database');
const {
	verifyPassword,
	createSessionToken,
	hashToken,
	getSessionExpiry,
	parseCookies
} = require('../lib/auth');

function safeAdmin(admin) {
	return {
		id: admin.id,
		name: admin.name,
		email: admin.email,
		role: admin.role || 'admin',
		created_at: admin.created_at
	};
}

router.post('/login', (req, res) => {
	const email = String(req.body.email || '').trim().toLowerCase();
	const password = String(req.body.password || '');

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}

	db.get(`SELECT * FROM Admins WHERE lower(email) = ? LIMIT 1`, [email], (err, admin) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (!admin || admin.role !== 'admin') {
			return res.status(401).json({ error: 'Invalid admin credentials' });
		}

		const validPassword = verifyPassword(password, admin.password_salt, admin.password_hash);
		if (!validPassword) {
			return res.status(401).json({ error: 'Invalid admin credentials' });
		}

		const token = createSessionToken();
		const tokenHash = hashToken(token);
		const expiresAt = getSessionExpiry();

		db.run(`DELETE FROM AdminSessions WHERE admin_id = ?`, [admin.id], () => {
			db.run(
				`INSERT INTO AdminSessions (admin_id, token_hash, expires_at) VALUES (?, ?, ?)`,
				[admin.id, tokenHash, expiresAt],
				(sessionErr) => {
					if (sessionErr) {
						return res.status(500).json({ error: sessionErr.message });
					}

					res.cookie('mecano_auth', token, {
						httpOnly: true,
						sameSite: 'lax',
						secure: false,
						maxAge: 14 * 24 * 60 * 60 * 1000,
						path: '/'
					});

					return res.json({
						message: 'Admin login successful',
						admin: safeAdmin(admin)
					});
				}
			);
		});
	});
});

router.post('/logout', (req, res) => {
	const token = parseCookies(req.headers.cookie || '').mecano_auth;

	if (!token) {
		res.clearCookie('mecano_auth', { path: '/' });
		return res.json({ message: 'Logged out successfully' });
	}

	db.run(`DELETE FROM AdminSessions WHERE token_hash = ?`, [hashToken(token)], () => {
		res.clearCookie('mecano_auth', { path: '/' });
		return res.json({ message: 'Logged out successfully' });
	});
});

router.get('/me', (req, res) => {
	if (!req.admin || req.admin.role !== 'admin') {
		return res.status(401).json({ error: 'Not authenticated as admin' });
	}

	return res.json({ admin: req.admin });
});

module.exports = router;
