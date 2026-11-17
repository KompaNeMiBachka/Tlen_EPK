/**
 * Pre-listen unlock configuration and utilities.
 *
 * Target: automatically unlocked after 23:59:59 of 19.11.2026 (Sofia time, EET / UTC+2).
 * Note: Prompt specified 19.11.2016, which is a typo for 2026 (current year 2026).
 * Using 2016 would mean the target timestamp is 10 years in the past, causing the page
 * to be permanently unlocked and making the lock icon and countdown impossible to see.
 *
 * Testing overrides:
 * - Query param `?test_unlock=1` or `?unlocked=1` to simulate post-unlock.
 * - Query param `?test_unlock=0` or `?locked=1` to simulate locked countdown.
 * - Query param `?test_date=YYYY-MM-DDTHH:mm:ss+02:00` to test arbitrary timestamps.
 * - Environment variable `PUBLIC_PRELISTEN_UNLOCK_DATE` or `PRELISTEN_UNLOCK_DATE`.
 */

export const PRELISTEN_UNLOCK_ISO = '2026-11-19T23:59:59+02:00';
export const PRELISTEN_UNLOCK_DISPLAY_DATE = '19.11.2026';
export const PRELISTEN_UNLOCK_DISPLAY_TIME = '23:59:59';

export function getUnlockTimestamp(): number {
	if (typeof process !== 'undefined' && process.env) {
		const envDate = process.env.PUBLIC_PRELISTEN_UNLOCK_DATE || process.env.PRELISTEN_UNLOCK_DATE;
		if (envDate) {
			const parsed = new Date(envDate).getTime();
			if (!isNaN(parsed)) return parsed;
		}
	}

	if (typeof window !== 'undefined') {
		try {
			const params = new URLSearchParams(window.location.search);
			const testDate = params.get('test_date');
			if (testDate) {
				const parsed = new Date(testDate).getTime();
				if (!isNaN(parsed)) return parsed;
			}
		} catch {
			// ignore in non-browser environments
		}
	}

	return new Date(PRELISTEN_UNLOCK_ISO).getTime();
}

export function isPrelistenUnlocked(now: number = Date.now()): boolean {
	if (typeof window !== 'undefined') {
		try {
			const params = new URLSearchParams(window.location.search);
			if (params.get('test_unlock') === '1' || params.get('unlocked') === '1') {
				return true;
			}
			if (params.get('test_unlock') === '0' || params.get('locked') === '1') {
				return false;
			}
		} catch {
			// ignore in non-browser environments
		}
	}

	return now >= getUnlockTimestamp();
}

export interface CountdownState {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	totalMs: number;
	isUnlocked: boolean;
	targetDateFormatted: string;
}

export function getCountdownState(now: number = Date.now()): CountdownState {
	const target = getUnlockTimestamp();
	const diff = target - now;

	if (diff <= 0) {
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			totalMs: 0,
			isUnlocked: true,
			targetDateFormatted: `${PRELISTEN_UNLOCK_DISPLAY_DATE} · ${PRELISTEN_UNLOCK_DISPLAY_TIME}`
		};
	}

	const totalSeconds = Math.floor(diff / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		days,
		hours,
		minutes,
		seconds,
		totalMs: diff,
		isUnlocked: false,
		targetDateFormatted: `${PRELISTEN_UNLOCK_DISPLAY_DATE} · ${PRELISTEN_UNLOCK_DISPLAY_TIME}`
	};
}
