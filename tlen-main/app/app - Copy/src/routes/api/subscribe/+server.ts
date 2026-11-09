import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { turso } from '../../../lib/turso';

export const POST: RequestHandler = async ({ request }) => {
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
