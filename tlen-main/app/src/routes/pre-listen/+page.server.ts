import type { Actions, PageServerLoad } from './$types';
import {
	COOKIE_NAME,
	createAuthToken,
	isSubscriber
} from '../../lib/auth';
import { isPrelistenUnlocked } from '../../lib/unlock';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const testUnlock = url.searchParams.get('test_unlock') === '1' || url.searchParams.get('unlocked') === '1';
	const testLock = url.searchParams.get('test_unlock') === '0' || url.searchParams.get('locked') === '1';

	// Whether the pre-listen release time (19.11.2026 23:59:59) has passed
	const isTimeUnlocked = (isPrelistenUnlocked() || testUnlock) && !testLock;

	// Always require email verification on entry
	cookies.delete(COOKIE_NAME, { path: '/' });

	return {
		isTimeUnlocked,
		unlocked: false,
		email: null
	};
};

export const actions: Actions = {
	verify: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const email = (formData.get('email') as string | null)?.trim().toLowerCase();

		if (!email) {
			return fail(400, { missing: true, message: 'Email is required' });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { invalid: true, message: 'Please enter a valid email address.' });
		}

		const subscribed = await isSubscriber(email);
		if (!subscribed) {
			return fail(404, { notFound: true, email, message: 'Email not found in subscriber list.' });
		}

		const testUnlock = url.searchParams.get('test_unlock') === '1' || url.searchParams.get('unlocked') === '1';
		const testLock = url.searchParams.get('test_unlock') === '0' || url.searchParams.get('locked') === '1';
		const isTimeUnlocked = (isPrelistenUnlocked() || testUnlock) && !testLock;

		if (!isTimeUnlocked) {
			return {
				success: true,
				subscribed: true,
				unlocked: false,
				timeLocked: true,
				email
			};
		}

		cookies.set(COOKIE_NAME, createAuthToken(email), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		return { success: true, unlocked: true, email };
	},

	logout: async ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: '/' });
		return { success: true, unlocked: false };
	}
};
