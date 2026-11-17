import crypto from 'node:crypto';
import { turso } from './turso';

const AUTH_SECRET =
	(typeof process !== 'undefined' && (process.env?.AUTH_SECRET || process.env?.TURSO_AUTH_TOKEN)) ||
	'tlen-prelisten-secret-key-2026';

export const COOKIE_NAME = 'tlen_prelisten_auth';

export function createAuthToken(email: string): string {
	const cleanEmail = email.trim().toLowerCase();
	const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(cleanEmail).digest('hex');
	return `${cleanEmail}:${hmac}`;
}

export function verifyAuthToken(token: string | undefined | null): string | null {
	if (!token || typeof token !== 'string') return null;
	const parts = token.split(':');
	if (parts.length !== 2) return null;
	const [email, signature] = parts;
	const cleanEmail = email.trim().toLowerCase();
	const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(cleanEmail).digest('hex');

	try {
		const a = Buffer.from(signature, 'hex');
		const b = Buffer.from(expectedHmac, 'hex');
		if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
			return cleanEmail;
		}
	} catch {
		return null;
	}
	return null;
}

export async function isSubscriber(email: string): Promise<boolean> {
	const cleanEmail = email.trim().toLowerCase();
	if (!cleanEmail) return false;
	try {
		await turso.execute(
			'CREATE TABLE IF NOT EXISTS subs (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE)'
		);
		const res = await turso.execute({
			sql: 'SELECT 1 FROM subs WHERE LOWER(email) = ? LIMIT 1',
			args: [cleanEmail]
		});
		return res.rows.length > 0;
	} catch (err) {
		console.error('Error checking subscriber in Turso:', err);
		return false;
	}
}
