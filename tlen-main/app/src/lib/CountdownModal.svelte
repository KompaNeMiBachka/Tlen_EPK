<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { translations, type Language } from './translations';
	import { getCountdownState, type CountdownState } from './unlock';

	let {
		open = $bindable(false),
		language = 'en',
		onclose
	} = $props<{
		open: boolean;
		language?: Language;
		onclose?: () => void;
	}>();

	const currentLang = $derived<Language>((language as Language) || 'en');
	const t = $derived(translations[currentLang]);
	let countdown = $state<CountdownState>(getCountdownState());

	onMount(() => {
		const interval = setInterval(() => {
			countdown = getCountdownState();
		}, 1000);
		return () => clearInterval(interval);
	});

	function close() {
		open = false;
		if (onclose) onclose();
	}

	function pad(num: number): string {
		return String(num).padStart(2, '0');
	}
</script>

{#if open}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="countdown-modal-title"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
	>
		<!-- Close Button Top Right -->
		<button
			type="button"
			onclick={close}
			class="btn-slide absolute top-5 right-5 z-60 flex cursor-pointer items-center gap-2 border border-white/40 bg-black/70 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:top-8 sm:right-8"
			aria-label={t.countdown.closeBtn}
		>
			<span>{t.countdown.closeBtn}</span>
			<span class="text-sm leading-none">✕</span>
		</button>

		<!-- Modal Container -->
		<div
			transition:scale={{ start: 0.94, duration: 250, easing: cubicOut }}
			class="relative w-full max-w-lg border border-white/20 bg-[#161616]/95 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-8"
		>
			<!-- Header Badge -->
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<div class="flex items-center gap-2">
					{#if countdown.isUnlocked}
						<span class="inline-block size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
						<span class="font-mono text-[10px] tracking-[0.12em] text-emerald-400 uppercase">
							● {t.prelisten.unlockedBadge}
						</span>
					{:else}
						<span class="inline-block size-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
						<span class="font-mono text-[10px] tracking-[0.12em] text-amber-400 uppercase">
							● {t.prelisten.lockedBadge}
						</span>
					{/if}
				</div>
				<span class="font-mono text-[10px] tracking-[0.1em] text-white/40 uppercase">
					TLEN v1.0
				</span>
			</div>

			<!-- Main Content -->
			<div class="mt-6 text-center">
				{#if countdown.isUnlocked}
					<!-- Unlocked State -->
					<div class="py-4">
						<div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-400">
							<svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
							</svg>
						</div>
						<h2 id="countdown-modal-title" class="text-xl font-light tracking-tight text-white sm:text-2xl">
							{t.countdown.unlockedMessage}
						</h2>
						<p class="mt-2 text-[13px] text-white/70">
							{t.prelisten.unlockedWelcome}
						</p>
						<div class="mt-6">
							<a
								href="/pre-listen"
								class="btn-slide inline-flex items-center gap-2 border border-white bg-white px-5 py-2.5 font-mono text-[11px] tracking-[0.1em] text-black uppercase transition-colors hover:bg-transparent hover:text-white"
							>
								<span>{t.countdown.listenNowBtn}</span>
							</a>
						</div>
					</div>
				{:else}
					<!-- Locked / Countdown State -->
					<div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-400">
						<svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
						</svg>
					</div>

					<h2 id="countdown-modal-title" class="text-xl font-light tracking-tight text-white sm:text-2xl">
						{t.countdown.modalTitle}
					</h2>
					<p class="mt-2 text-[13px] leading-relaxed text-white/70">
						{t.countdown.subtitle}
					</p>

					<!-- 4 Digital Counter Boxes -->
					<div class="my-6 grid grid-cols-4 gap-2 sm:gap-3.5">
						<!-- Days -->
						<div class="flex flex-col items-center border border-white/20 bg-black/60 px-2 py-3.5 sm:px-3 sm:py-4">
							<span class="font-mono text-2xl font-semibold tracking-tight text-white sm:text-4xl">
								{pad(countdown.days)}
							</span>
							<span class="mt-1 font-mono text-[9px] tracking-[0.14em] text-white/50 uppercase sm:text-[10px]">
								{t.countdown.daysLabel}
							</span>
						</div>

						<!-- Hours -->
						<div class="flex flex-col items-center border border-white/20 bg-black/60 px-2 py-3.5 sm:px-3 sm:py-4">
							<span class="font-mono text-2xl font-semibold tracking-tight text-white sm:text-4xl">
								{pad(countdown.hours)}
							</span>
							<span class="mt-1 font-mono text-[9px] tracking-[0.14em] text-white/50 uppercase sm:text-[10px]">
								{t.countdown.hoursLabel}
							</span>
						</div>

						<!-- Minutes -->
						<div class="flex flex-col items-center border border-white/20 bg-black/60 px-2 py-3.5 sm:px-3 sm:py-4">
							<span class="font-mono text-2xl font-semibold tracking-tight text-white sm:text-4xl">
								{pad(countdown.minutes)}
							</span>
							<span class="mt-1 font-mono text-[9px] tracking-[0.14em] text-white/50 uppercase sm:text-[10px]">
								{t.countdown.minutesLabel}
							</span>
						</div>

						<!-- Seconds (highlighted amber) -->
						<div class="flex flex-col items-center border border-amber-400/40 bg-black/60 px-2 py-3.5 sm:px-3 sm:py-4">
							<span class="font-mono text-2xl font-semibold tracking-tight text-amber-400 sm:text-4xl">
								{pad(countdown.seconds)}
							</span>
							<span class="mt-1 font-mono text-[9px] tracking-[0.14em] text-amber-400/70 uppercase sm:text-[10px]">
								{t.countdown.secondsLabel}
							</span>
						</div>
					</div>

					<!-- Target release info -->
					<div class="border-t border-white/10 pt-4 font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase">
						{t.countdown.targetLabel}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && open) {
			close();
		}
	}}
/>
