<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { translations, type Language } from '../../lib/translations';
	import { getCountdownState, isPrelistenUnlocked, type CountdownState } from '../../lib/unlock';

	let { data } = $props<{
		data: {
			isTimeUnlocked: boolean;
			unlocked: boolean;
			email: string | null;
		};
	}>();

	let language = $state<Language>('en');
	const t = $derived(translations[language]);

	// Whether the user has successfully verified their email
	let emailVerified = $state<boolean>(false);
	let currentEmail = $state<string>('');

	// Whether the release time has arrived
	let localTimeUnlocked = $state<boolean | null>(null);
	const isTimeUnlocked = $derived(localTimeUnlocked !== null ? localTimeUnlocked : data.isTimeUnlocked);

	// The player is ONLY unlocked when BOTH time has arrived AND email has been verified
	const isPlayerUnlocked = $derived(emailVerified && isTimeUnlocked);

	let emailInput = $state('');
	let status = $state<'idle' | 'verifying' | 'notFound' | 'error' | 'success'>('idle');
	let statusMessage = $state('');

	let showCountdown = $state(false);
	let countdown = $state<CountdownState>(getCountdownState());

	function pad(num: number): string {
		return String(num).padStart(2, '0');
	}

	onMount(() => {
		localTimeUnlocked = isPrelistenUnlocked();

		// Check for URL query params like ?countdown=1 to expand countdown by default
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			if (params.get('countdown') === '1') {
				showCountdown = true;
			}
			if (params.get('test_unlock') === '1' || params.get('unlocked') === '1') {
				localTimeUnlocked = true;
			}
		}

		const interval = setInterval(() => {
			countdown = getCountdownState();
			const unlockedNow = isPrelistenUnlocked();
			if (unlockedNow && !isTimeUnlocked) {
				localTimeUnlocked = true;
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	async function handleVerify(e: SubmitEvent) {
		e.preventDefault();
		const cleanEmail = emailInput.trim().toLowerCase();
		if (!cleanEmail) return;

		status = 'verifying';
		statusMessage = '';

		try {
			const res = await fetch('/api/pre-listen/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: cleanEmail })
			});

			const result = await res.json().catch(() => ({}));

			if (res.ok && result.unlocked) {
				// Time is unlocked AND subscriber verified
				status = 'success';
				statusMessage = '';
				setTimeout(() => {
					emailVerified = true;
					currentEmail = cleanEmail;
					status = 'idle';
				}, 400);
			} else if (res.ok && result.timeLocked) {
				// Verified subscriber, but stream is waiting for countdown to unlock
				status = 'success';
				statusMessage = t.prelisten.precheckSuccess;
				emailVerified = true;
				currentEmail = cleanEmail;
			} else if (res.status === 404 || result.notFound) {
				status = 'notFound';
				statusMessage = t.prelisten.notSubscribedText;
			} else {
				status = 'error';
				statusMessage = result.message || t.prelisten.serverError;
			}
		} catch {
			status = 'error';
			statusMessage = t.prelisten.serverError;
		}
	}
</script>

<svelte:head>
	<title>{language === 'bg' ? 'Тлен — Ранно слушане (Ексклузивно)' : 'Tlen — Pre-listen (Exclusive Access)'}</title>
	<meta
		name="description"
		content={language === 'bg'
			? 'Ексклузивно предпремиерно слушане за абонати на бюлетина на Тлен.'
			: 'Exclusive unreleased track preview for Tlen newsletter subscribers.'}
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&family=Onest:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main lang={language} class="relative min-h-screen bg-[#111] text-[#e9e8e1]">
	<!-- Background image with dark overlay -->
	<div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
		<img
			class="absolute inset-0 size-full object-cover contrast-110 grayscale opacity-25"
			src="/main.jpeg"
			alt=""
			aria-hidden="true"
		/>
		<div
			class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,20,20,0.6)_0%,rgba(10,10,10,0.95)_100%)]"
		></div>
	</div>

	<!-- Top Navigation Bar -->
	<header
		class="relative z-20 flex items-center justify-between px-[30px] py-[22px] font-mono text-[11px] tracking-[0.08em] uppercase max-[700px]:px-[18px] max-[700px]:py-[16px]"
	>
		<!-- Left: Logo & Home Link -->
		<a
			href="/"
			class="group flex items-center gap-3 transition-opacity hover:opacity-70"
			aria-label="Tlen Home"
		>
			<img
				class="h-7 w-auto object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
				src="/logo_transparent.png"
				alt="Tlen logo"
			/>
			<span class="hidden text-[10px] tracking-[0.12em] text-white/60 sm:inline">
				/ {t.prelisten.badge}
			</span>
		</a>

		<!-- Right: Language Toggle & Back Button -->
		<div class="flex items-center gap-4 max-[700px]:gap-2.5">
			<div
				class="flex items-center border border-white/40 bg-black/50 text-[10px] tracking-[0.1em] backdrop-blur-xs"
				role="group"
				aria-label="Language selector"
			>
				<button
					type="button"
					class="btn-slide cursor-pointer px-2.5 py-1 transition-colors"
					class:bg-white={language === 'en'}
					class:text-black={language === 'en'}
					class:text-white={language !== 'en'}
					onclick={() => (language = 'en')}
					aria-pressed={language === 'en'}
					aria-label="Switch to English"
				>
					EN
				</button>
				<button
					type="button"
					class="btn-slide cursor-pointer px-2.5 py-1 transition-colors"
					class:bg-white={language === 'bg'}
					class:text-black={language === 'bg'}
					class:text-white={language !== 'bg'}
					onclick={() => (language = 'bg')}
					aria-pressed={language === 'bg'}
					aria-label="Превключи на български"
				>
					BG
				</button>
			</div>

			<a
				href="/"
				class="btn-slide inline-flex items-center border border-white/30 bg-black/40 px-3 py-1 text-[10px] tracking-[0.1em] text-white/90 backdrop-blur-xs hover:bg-white hover:text-black"
			>
				{t.prelisten.backToHome}
			</a>
		</div>
	</header>

	<!-- Content Area -->
	<div class="relative z-10 flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
		{#if isPlayerUnlocked}
			<!-- UNLOCKED VIEW (Music Player - strictly requires verified subscriber email) -->
			<div
				transition:scale={{ start: 0.96, duration: 400, easing: cubicOut }}
				class="w-full max-w-2xl border border-white/20 bg-[#161616]/95 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-10"
			>
				<!-- Top Bar with status -->
				<div class="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
					<div class="flex items-center gap-2">
						<span class="inline-block size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
						<span class="font-mono text-[10px] tracking-[0.12em] text-emerald-400 uppercase">
							{t.prelisten.unlockedBadge}
						</span>
						{#if currentEmail}
							<span class="font-mono text-[10px] text-white/40">
								· {currentEmail}
							</span>
						{/if}
					</div>
					<span class="font-mono text-[10px] tracking-[0.1em] text-white/40 uppercase">
						TLEN · EPK
					</span>
				</div>

				<!-- Track Header -->
				<div class="mb-6">
					<p class="font-mono text-[10px] tracking-[0.15em] text-white/50 uppercase">
						{t.prelisten.badge}
					</p>
					<h1 class="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
						{t.prelisten.trackTitle}
					</h1>
				</div>

				<!-- SoundCloud Player Embed (Height 300) -->
				<div class="my-6 overflow-hidden rounded-sm border border-white/20 bg-black/60 p-2 shadow-inner">
					<iframe
						title="SoundCloud Player - TLEN - Znak Za Trevoga"
						width="100%"
						height="300"
						scrolling="no"
						frameborder="no"
						allow="autoplay; encrypted-media"
						src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%3Atracks%3A2439847545%3Fsecret_token%3Ds-NMV6CY9Cd86&color=%23404abc&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
					></iframe>
					<div
						style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100; margin-top: 6px; padding: 0 4px;"
					>
						<a
							href="https://soundcloud.com/vsichkoetlen"
							title="тлен"
							target="_blank"
							rel="noreferrer"
							style="color: #cccccc; text-decoration: none;"
						>
							тлен
						</a>
						·
						<a
							href="https://soundcloud.com/vsichkoetlen/tlen-znak-za-trevoga/s-NMV6CY9Cd86"
							title="TLEN - Znak Za Trevoga - Master_v03"
							target="_blank"
							rel="noreferrer"
							style="color: #cccccc; text-decoration: none;"
						>
							TLEN - Znak Za Trevoga - Master_v03
						</a>
					</div>
				</div>

				<!-- Band Notice & Information -->
				<div class="mt-6 border-t border-white/10 pt-4 font-mono text-[11px] leading-relaxed text-white/60">
					<p class="text-white/80">
						{t.prelisten.exclusiveNotice}
					</p>
				</div>
			</div>
		{:else}
			<!-- LOCKED / VERIFICATION VIEW (Pre-listen strictly requires email verification) -->
			<div
				transition:scale={{ start: 0.94, duration: 350, easing: cubicOut }}
				class="w-full max-w-md border border-white/20 bg-[#161616]/95 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-8"
				role="region"
				aria-labelledby="locked-title"
			>
				<!-- Lock icon & Badge (Clickable to reveal countdown) -->
				<div class="flex items-center justify-between">
					<button
						type="button"
						onclick={() => (showCountdown = !showCountdown)}
						class="btn-slide group flex cursor-pointer items-center gap-2 border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-amber-400 uppercase transition-all hover:border-amber-400 hover:bg-amber-400/20"
						aria-expanded={showCountdown}
						aria-label={t.countdown.lockedTooltip}
						title={t.countdown.lockedTooltip}
					>
						<svg
							class="size-3.5 text-amber-400 transition-transform group-hover:scale-110"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.8"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
							/>
						</svg>
						<span>● {t.countdown.lockedBadge}</span>
					</button>

					<span class="font-mono text-[10px] tracking-[0.1em] text-white/40 uppercase">
						TLEN · 2026
					</span>
				</div>

				<!-- Live Countdown (shown when locked icon is clicked) -->
				{#if showCountdown}
					<div
						transition:scale={{ start: 0.95, duration: 250, easing: cubicOut }}
						class="mt-5 border border-white/20 bg-black/70 p-4 shadow-inner"
					>
						<div class="flex items-center justify-between text-white/60">
							<span class="font-mono text-[10px] tracking-[0.1em] uppercase">
								{t.countdown.modalTitle}
							</span>
							<span class="font-mono text-[9px] tracking-[0.08em] text-amber-400 uppercase">
								{countdown.targetDateFormatted}
							</span>
						</div>

						<!-- 4 Digital Counter Boxes -->
						<div class="my-3 grid grid-cols-4 gap-2 text-center">
							<!-- Days -->
							<div class="border border-white/10 bg-white/5 py-2.5">
								<span class="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
									{pad(countdown.days)}
								</span>
								<span class="block font-mono text-[8px] tracking-[0.12em] text-white/50 uppercase">
									{t.countdown.daysLabel}
								</span>
							</div>

							<!-- Hours -->
							<div class="border border-white/10 bg-white/5 py-2.5">
								<span class="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
									{pad(countdown.hours)}
								</span>
								<span class="block font-mono text-[8px] tracking-[0.12em] text-white/50 uppercase">
									{t.countdown.hoursLabel}
								</span>
							</div>

							<!-- Minutes -->
							<div class="border border-white/10 bg-white/5 py-2.5">
								<span class="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
									{pad(countdown.minutes)}
								</span>
								<span class="block font-mono text-[8px] tracking-[0.12em] text-white/50 uppercase">
									{t.countdown.minutesLabel}
								</span>
							</div>

							<!-- Seconds (amber) -->
							<div class="border border-amber-400/40 bg-white/5 py-2.5">
								<span class="font-mono text-xl font-bold tracking-tight text-amber-400 sm:text-2xl">
									{pad(countdown.seconds)}
								</span>
								<span class="block font-mono text-[8px] tracking-[0.12em] text-amber-400/70 uppercase">
									{t.countdown.secondsLabel}
								</span>
							</div>
						</div>

						<p class="text-center font-mono text-[9px] tracking-[0.08em] text-white/50 uppercase">
							{t.countdown.targetLabel}
						</p>
					</div>
				{/if}

				<!-- Heading & Explanation -->
				<h1 id="locked-title" class="mt-5 text-xl font-light tracking-tight text-white sm:text-2xl">
					{t.prelisten.lockedTitle}
				</h1>
				<p class="mt-2 text-[13px] leading-relaxed text-white/75">
					{t.prelisten.lockedDescription}
				</p>

				<!-- Verification Form (MANDATORY TO UNLOCK THE STREAM) -->
				<form onsubmit={handleVerify} class="mt-6">
					<label for="subscriber-email" class="mb-2 block font-mono text-[10px] tracking-[0.08em] text-white/60 uppercase">
						{t.prelisten.emailPlaceholder}
					</label>

					<div class="flex items-center border border-white/30 bg-black/60 backdrop-blur-xs transition-colors focus-within:border-white">
						<input
							type="email"
							id="subscriber-email"
							name="email"
							bind:value={emailInput}
							required
							disabled={status === 'verifying'}
							placeholder={t.prelisten.emailPlaceholder}
							oninput={() => {
								if (status !== 'idle') {
									status = 'idle';
									statusMessage = '';
								}
							}}
							class="w-full bg-transparent px-3 py-2.5 font-mono text-[12px] tracking-[0.06em] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
						/>
						<button
							type="submit"
							disabled={status === 'verifying'}
							class="btn-slide cursor-pointer border-l border-white/30 bg-white/10 px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if status === 'verifying'}
								{t.prelisten.verifyingBtn}
							{:else}
								{t.prelisten.unlockBtn}
							{/if}
						</button>
					</div>

					<!-- Status feedback -->
					{#if status === 'success'}
						<p transition:fade class="mt-3 font-mono text-[11px] tracking-[0.04em] text-emerald-400">
							{statusMessage}
						</p>
					{:else if status === 'error' || status === 'notFound'}
						<p transition:fade class="mt-3 font-mono text-[11px] tracking-[0.04em] text-rose-400">
							{statusMessage}
						</p>
					{/if}
				</form>

				<div class="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-[11px]">
					<a
						href="/"
						class="btn-slide font-mono text-[10px] tracking-[0.08em] text-white/50 uppercase transition-colors hover:text-white"
					>
						{t.prelisten.backToHome}
					</a>
					<button
						type="button"
						onclick={() => (showCountdown = !showCountdown)}
						class="btn-slide cursor-pointer font-mono text-[10px] tracking-[0.08em] text-amber-400/80 uppercase transition-colors hover:text-amber-400"
					>
						{showCountdown ? t.countdown.closeBtn : t.countdown.viewCountdown}
					</button>
				</div>
			</div>
		{/if}
	</div>
</main>
