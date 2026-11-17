import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { COOKIE_NAME, createAuthToken, isSubscriber } from '../../../../lib/auth';
import { isPrelistenUnlocked } from '../../../../lib/unlock';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	let email: string | null = null;
	const contentType = request.headers.get('content-type') || '';

	if (contentType.includes('application/json')) {
		const body = await request.json().catch(() => ({}));
		email = body.email;
	} else {
		const formData = await request.formData().catch(() => null);
		email = formData?.get('email') as string | null;
	}

	email = email?.trim().toLowerCase() || null;

	if (!email) {
		return json({ success: false, message: 'Email is required' }, { status: 400 });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return json({ success: false, message: 'Invalid email address' }, { status: 400 });
	}

	const subscribed = await isSubscriber(email);

	if (!subscribed) {
		return json(
			{
				success: false,
				notFound: true,
				message: 'Email not found in subscriber list'
			},
			{ status: 404 }
		);
	}

	// Support test overrides via query param or headers if needed
	const testUnlock = url.searchParams.get('test_unlock') === '1' || url.searchParams.get('unlocked') === '1';
	const testLock = url.searchParams.get('test_unlock') === '0' || url.searchParams.get('locked') === '1';
	const timeUnlocked = (isPrelistenUnlocked() || testUnlock) && !testLock;

	if (!timeUnlocked) {
		// Valid subscriber, but pre-listen stream has not unlocked yet
		return json({
			success: true,
			subscribed: true,
			unlocked: false,
			timeLocked: true,
			email
		});
	}

	cookies.set(COOKIE_NAME, createAuthToken(email), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30
	});

	return json({
		success: true,
		unlocked: true,
		email
	});
};
