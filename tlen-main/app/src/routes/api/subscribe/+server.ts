import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { turso } from '../../../lib/turso';

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Check session submission count (limit to 3 per session entry)
	const sessionCount = parseInt(cookies.get('session_sub_count') || '0', 10);
	if (sessionCount >= 3) {
		return text('Maximum of 3 submissions reached for this session.', { status: 429 });
	}

	let email: string | null = null;
	const contentType = request.headers.get('content-type') || '';

	if (contentType.includes('application/json')) {
		const body = await request.json().catch(() => ({}));
		email = body.email;
	} else {
		const formData = await request.formData().catch(() => null);
		email = formData?.get('email') as string | null;
	}

	email = email?.trim() || null;

	if (!email) {
		return text('Email is required.', { status: 400 });
	}

	// Basic email validation regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return text('Please enter a valid email address.', { status: 400 });
	}

	// Increment session count cookie (session lifetime)
	cookies.set('session_sub_count', String(sessionCount + 1), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});

	try {
		// Ensure the subs table exists
		await turso.execute(
			'CREATE TABLE IF NOT EXISTS subs (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE)'
		);

		// Check if the email is already in the database
		const existing = await turso.execute({
			sql: 'SELECT 1 FROM subs WHERE email = ? LIMIT 1',
			args: [email]
		});

		if (existing.rows.length > 0) {
			return text('This email is already subscribed.', { status: 409 });
		}

		// Insert safely into the subs table using parameterized queries
		await turso.execute({
			sql: 'INSERT INTO subs (email) VALUES (?)',
			args: [email]
		});

		return text('Successfully subscribed!', { status: 200 });
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.includes('UNIQUE constraint failed')) {
			return text('This email is already subscribed.', { status: 409 });
		}
		console.error('Turso DB error:', err);
		return text('An error occurred on the server.', { status: 500 });
	}
};
