<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { translations, type Language, type PhotoItem } from '../lib/translations';

	let language = $state<Language>('en');
	const t = $derived(translations[language]);

	const MAX_SESSION_SUBMISSIONS = 3;
	let submissionCount = $state(0);
	const isLimitReached = $derived(submissionCount >= MAX_SESSION_SUBMISSIONS);
	const limitReachedMessage = $derived(
		language === 'bg'
			? 'Достигнат е максималният лимит от 3 опита за тази сесия.'
			: 'Maximum of 3 submissions reached for this session.'
	);

	function parseShowDate(dateStr: string): Date | null {
		const parts = dateStr.trim().split('.');
		if (parts.length !== 3) return null;
		const [day, month, year] = parts.map(Number);
		if (!day || !month || !year) return null;
		// End of the show day so current-day shows aren't marked as passed until midnight
		return new Date(year, month - 1, day, 23, 59, 59, 999);
	}

	function isShowPast(dateStr: string): boolean {
		const d = parseShowDate(dateStr);
		return d ? d.getTime() < Date.now() : false;
	}

	const nextUpcomingIndex = $derived.by(() => {
		const now = Date.now();
		for (let i = 0; i < t.live.shows.length; i++) {
			const d = parseShowDate(t.live.shows[i].date);
			if (d && d.getTime() >= now) {
				return i;
			}
		}
		return -1;
	});

	let subscribeEmail = $state('');
	let subscribeStatus = $state<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
	let subscribeMessage = $state('');
	let showNewsletterPopup = $state(false);
	let previewPhoto = $state<PhotoItem | null>(null);

	onMount(() => {
		// Retrieve current session submission count
		const savedCount = sessionStorage.getItem('tlen_sub_count');
		if (savedCount) {
			submissionCount = parseInt(savedCount, 10) || 0;
		}

		// Automatically open the email input box pop-up over the logo upon entering the site
		const timer = setTimeout(() => {
			showNewsletterPopup = true;
		}, 500);
		return () => clearTimeout(timer);
	});

	function closeNewsletterPopup() {
		showNewsletterPopup = false;
	}

	function openPhotoPreview(photo: PhotoItem) {
		previewPhoto = photo;
	}

	function closePhotoPreview() {
		previewPhoto = null;
	}

	function scrollToTop(e?: MouseEvent) {
		if (e) e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
		history.replaceState(null, '', '#top');
	}

	async function handleSubscribe(e: SubmitEvent) {
		e.preventDefault();
		if (!subscribeEmail) return;

		// Enforce maximum 3 submissions per session
		if (submissionCount >= MAX_SESSION_SUBMISSIONS) {
			subscribeStatus = 'error';
			subscribeMessage = limitReachedMessage;
			return;
		}

		submissionCount += 1;
		sessionStorage.setItem('tlen_sub_count', String(submissionCount));

		subscribeStatus = 'loading';
		try {
			const formData = new FormData();
			formData.append('email', subscribeEmail);
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				body: formData
			});
			if (res.status === 200) {
				subscribeStatus = 'success';
				subscribeMessage = t.newsletter.success;
				subscribeEmail = '';
			} else if (res.status === 409) {
				subscribeStatus = 'already';
				subscribeMessage = t.newsletter.already;
			} else if (res.status === 429) {
				subscribeStatus = 'error';
				subscribeMessage = limitReachedMessage;
				submissionCount = MAX_SESSION_SUBMISSIONS;
				sessionStorage.setItem('tlen_sub_count', String(MAX_SESSION_SUBMISSIONS));
			} else {
				const errorText = await res.text();
				subscribeStatus = 'error';
				subscribeMessage = errorText || t.newsletter.error;
			}
		} catch {
			subscribeStatus = 'error';
			subscribeMessage = t.newsletter.error;
		}
	}
</script>

<svelte:head>
	<title>{language === 'bg' ? 'Тлен — Електронен прес кит' : 'Tlen — Electronic Press Kit'}</title>
	<meta
		name="description"
		content={language === 'bg'
			? 'Тлен — Софийска инди, пост-пънк, алтърнатив и кинематичен рок група.'
			: 'Tlen — Sofia-based indie, post-punk, alternative and cinematic rock.'}
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&family=Onest:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main lang={language} class="bg-[#111] text-[#e9e8e1]">
	<!-- Fixed Header: navigation only so language selector stays solely on the top page -->
	<header
		class="fixed inset-x-0 top-0 z-20 flex items-center justify-end px-[30px] py-[22px] font-mono text-[11px] tracking-[0.08em] text-white uppercase mix-blend-difference max-[700px]:px-[18px] max-[700px]:py-[16px]"
	>
		<nav
			class="flex items-center gap-7 max-[700px]:gap-[11px] max-[700px]:text-[9px]"
			aria-label="Main navigation"
		>
			<a
				class="btn-slide inline-block transition-opacity hover:opacity-55"
				href="#top"
				onclick={scrollToTop}
			>
				{t.nav.home}
			</a>
			<a class="btn-slide inline-block transition-opacity hover:opacity-55" href="#info">
				{t.nav.info}
			</a>
			<a class="btn-slide inline-block transition-opacity hover:opacity-55" href="#live">
				{t.nav.live}
			</a>
			<a class="btn-slide inline-block transition-opacity hover:opacity-55" href="#photos">
				{t.nav.photos}
			</a>
			<a class="btn-slide inline-block transition-opacity hover:opacity-55" href="#contact">
				{t.nav.contact}
			</a>
		</nav>
	</header>

	<section id="top" class="relative min-h-svh overflow-hidden bg-[#242424]">
		<!-- EN/BG toggle stays ONLY on the top page -->
		<div
			class="absolute top-[22px] left-[30px] z-20 max-[700px]:top-[18px] max-[700px]:left-[18px]"
		>
			<div
				class="flex items-center border border-white/40 bg-black/40 text-[10px] tracking-[0.1em] backdrop-blur-xs"
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
		</div>

		<img
			class="absolute inset-0 size-full object-cover contrast-110 grayscale"
			src="/main.jpeg"
			alt="Tlen band portrait"
		/>
		<div
			class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.33),transparent_40%,rgba(0,0,0,.6))]"
		></div>
		<div
			class="relative flex min-h-svh flex-col justify-between px-[30px] pt-[92px] pb-7 text-[#fafaf6] max-[700px]:px-[18px] max-[700px]:pt-[74px] max-[700px]:pb-5"
		>
			<!-- Centered Logo area with Pop-Up positioned directly over the logo -->
			<div
				class="relative mt-[6vh] flex w-[min(400px,58vw)] flex-col items-center justify-center self-center max-[700px]:w-[min(310px,73vw)]"
			>
				<img
					class="w-full object-contain brightness-0 invert transition-opacity duration-300"
					class:opacity-15={showNewsletterPopup}
					src="/logo_transparent.png"
					alt="Tlen logo"
				/>

				<!-- Email Input Box Pop-Up over the logo -->
				{#if showNewsletterPopup}
					<div
						transition:scale={{ start: 0.94, duration: 350, easing: cubicOut }}
						class="absolute z-30 w-[min(380px,calc(100vw-36px))] border border-white/20 bg-[#161616]/95 p-5 text-[#fafaf6] shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md"
						role="dialog"
						aria-labelledby="newsletter-popup-title"
					>
						<div class="flex items-start justify-between gap-3">
							<span
								id="newsletter-popup-title"
								class="font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase"
							>
								{t.newsletter.label}
							</span>
							<button
								type="button"
								onclick={closeNewsletterPopup}
								class="btn-slide -mt-1 -mr-1 cursor-pointer p-1 font-mono text-sm text-white/60 transition-colors hover:text-white"
								aria-label={t.newsletter.close}
							>
								✕
							</button>
						</div>

						{#if subscribeStatus === 'success'}
							<p class="my-4 font-mono text-sm tracking-[0.04em] text-emerald-400">
								{subscribeMessage || t.newsletter.success}
							</p>
							{#if isLimitReached}
								<p class="mb-3 font-mono text-[11px] tracking-[0.04em] text-amber-300">
									{limitReachedMessage}
								</p>
							{/if}
							<div class="mt-4 flex justify-end">
								<button
									type="button"
									onclick={closeNewsletterPopup}
									class="btn-slide cursor-pointer border border-white/30 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-white hover:text-black"
								>
									{t.newsletter.close}
								</button>
							</div>
						{:else}
							<p class="mt-2 text-[13px] leading-relaxed text-white/80">
								{t.newsletter.popupText}
							</p>

							{#if isLimitReached}
								<div class="my-3 border border-amber-400/30 bg-amber-400/10 p-2.5">
									<p class="font-mono text-[11px] tracking-[0.04em] text-amber-300">
										{limitReachedMessage}
									</p>
								</div>
								<div class="mt-3 flex justify-end">
									<button
										type="button"
										onclick={closeNewsletterPopup}
										class="btn-slide cursor-pointer border border-white/30 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-white hover:text-black"
									>
										{t.newsletter.close}
									</button>
								</div>
							{:else}
								<form
									action="/api/subscribe"
									method="POST"
									onsubmit={handleSubscribe}
									class="mt-3.5"
								>
									<div
										class="flex items-center border border-white/30 bg-black/50 backdrop-blur-xs transition-colors focus-within:border-white"
									>
										<input
											type="email"
											id="popup-newsletter-email"
											name="email"
											bind:value={subscribeEmail}
											disabled={isLimitReached || subscribeStatus === 'loading'}
											oninput={() => {
												if (subscribeStatus !== 'idle') subscribeStatus = 'idle';
											}}
											placeholder={t.newsletter.placeholder}
											required
											class="w-full bg-transparent px-3 py-2 font-mono text-[11px] tracking-[0.06em] text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
										/>
										<button
											type="submit"
											disabled={isLimitReached || subscribeStatus === 'loading'}
											class="btn-slide cursor-pointer border-l border-white/30 bg-white/10 px-3.5 py-2 font-mono text-[10px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
										>
											{#if subscribeStatus === 'loading'}
												...
											{:else}
												{t.newsletter.submit}
											{/if}
										</button>
									</div>

									{#if subscribeStatus === 'already'}
										<p class="mt-2 font-mono text-[11px] tracking-[0.04em] text-amber-300">
											{subscribeMessage}
										</p>
									{:else if subscribeStatus === 'error'}
										<p class="mt-2 font-mono text-[11px] tracking-[0.04em] text-rose-400">
											{subscribeMessage}
										</p>
									{/if}
								</form>
							{/if}
						{/if}
					</div>
				{/if}
			</div>

			<div
				class="flex items-end justify-between gap-6 font-mono text-[11px] tracking-[0.06em] uppercase max-[700px]:flex-col max-[700px]:items-start"
			>
				<p class="m-0 max-w-[280px] leading-6">{t.hero.genre}</p>

				<!-- Toggle to reopen newsletter pop-up over the logo if dismissed -->
				{#if !showNewsletterPopup}
					<button
						type="button"
						onclick={() => (showNewsletterPopup = true)}
						class="btn-slide cursor-pointer border border-white/30 bg-black/40 px-3.5 py-2 font-mono text-[10px] tracking-[0.1em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
					>
						{t.newsletter.label}
					</button>
				{/if}
			</div>
		</div>
	</section>

	<section
		id="info"
		class="grid grid-cols-[25%_1fr] gap-6 bg-[#e9e8e1] px-[30px] py-28 text-[#171717] max-[700px]:grid-cols-1 max-[700px]:gap-[46px] max-[700px]:px-[18px] max-[700px]:py-[72px]"
	>
		<div class="font-mono text-[10px] tracking-[0.1em] uppercase">
			<p>{t.info.sectionNumber}</p>
		</div>
		<div class="max-w-[805px]">
			<p
				class="m-0 mb-[62px] text-[clamp(26px,3.2vw,48px)] leading-[1.18] tracking-[-0.025em] break-words max-[700px]:mb-[45px] max-[700px]:text-[30px]"
			>
				{t.info.intro}
			</p>
			<div
				class="max-w-[590px] columns-2 gap-10 text-[15px] leading-[1.6] max-[700px]:columns-1 max-[700px]:text-[14px]"
			>
				{#each t.info.paragraphs as paragraph}
					<p class="mb-5 break-inside-avoid">
						{paragraph}
					</p>
				{/each}
			</div>
			<div class="mt-[55px] max-w-[590px] border-t border-[#1b1b1b] pt-[14px]">
				<div class="mb-3 flex justify-between font-mono text-[10px] tracking-[0.1em] uppercase">
					<span>{t.info.watchLabel}</span><span>{t.info.bandName}</span>
				</div>
				<div class="aspect-video overflow-hidden rounded-xl bg-[#202020]">
					<iframe
						class="size-full"
						src="https://www.youtube-nocookie.com/embed/3IUXNp5WGWA?rel=0&modestbranding=1"
						title={t.info.videoTitle}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</div>
	</section>

	<section
		id="live"
		class="grid grid-cols-[25%_1fr] gap-6 bg-[#161616] px-[30px] py-28 max-[700px]:grid-cols-1 max-[700px]:gap-[46px] max-[700px]:px-[18px] max-[700px]:py-[72px]"
	>
		<div class="font-mono text-[10px] tracking-[0.1em] uppercase">{t.live.sectionNumber}</div>
		<!-- Grid layout that prevents text overlapping across all viewports -->
		<div
			class="grid grid-cols-[minmax(280px,0.85fr)_1.15fr] gap-10 max-[1024px]:grid-cols-1 max-[1024px]:gap-8"
		>
			<h2
				class="m-0 text-[clamp(36px,4.6vw,72px)] leading-[0.98] tracking-tight break-words whitespace-pre-line max-[700px]:text-[48px]"
			>
				{t.live.heading}
			</h2>
			<div class="border-t border-[#676767]">
				{#each t.live.shows as show, i}
					{@const isPast = isShowPast(show.date)}
					{@const isNext = i === nextUpcomingIndex}
					<article
						class="grid grid-cols-[92px_1fr_1.55fr] gap-4 border-b border-[#464646] py-[17px] text-[14px] leading-snug transition-opacity max-[700px]:grid-cols-[72px_1fr] max-[700px]:gap-[7px] max-[700px]:text-[13px]"
						class:opacity-50={isPast}
						class:line-through={isPast}
						class:text-white={isNext}
					>
						<time class="font-mono text-[11px] whitespace-nowrap">{show.date}</time>
						<p class="font-medium">{show.city}</p>
						<p class="break-words text-[#a7a7a2] max-[700px]:col-start-2">
							{show.venue}
						</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="photos" class="bg-[#b9b9b3] text-[#171717]">
		<div
			class="grid grid-cols-[25%_1fr] gap-6 px-[30px] pt-28 pb-[75px] max-[700px]:grid-cols-1 max-[700px]:gap-[46px] max-[700px]:px-[18px] max-[700px]:pt-[72px] max-[700px]:pb-12"
		>
			<div class="font-mono text-[10px] tracking-[0.1em] uppercase">{t.photos.sectionNumber}</div>
			<h2
				class="m-0 text-[clamp(45px,6.8vw,104px)] leading-[0.9] tracking-normal max-[700px]:text-[63px]"
			>
				{t.photos.heading}
			</h2>
		</div>
		<div
			class="grid grid-cols-[59%_41%] grid-rows-[31vw_31vw_35vw] gap-[3px] max-[700px]:grid-cols-1 max-[700px]:grid-rows-none"
		>
			{#each t.photos.items as photo}
				<figure
					class={`m-0 overflow-hidden bg-[#252525] max-[700px]:!col-start-1 max-[700px]:!row-auto max-[700px]:aspect-[4/3] ${photo.class}`}
				>
					<button
						type="button"
						class="group relative block size-full cursor-pointer text-left focus:ring-1 focus:ring-white/60 focus:outline-none"
						onclick={() => openPhotoPreview(photo)}
						aria-label={photo.alt}
					>
						<img
							class="size-full object-cover contrast-110 grayscale transition duration-700 group-hover:scale-[1.035] group-hover:contrast-125"
							src={photo.src}
							alt={photo.alt}
							loading="lazy"
						/>
					</button>
				</figure>
			{/each}
		</div>
	</section>

	<footer
		id="contact"
		class="bg-[#deddd6] px-[30px] py-28 text-[#171717] max-[700px]:px-[18px] max-[700px]:py-[72px]"
	>
		<div class="font-mono text-[10px] tracking-[0.1em] uppercase">{t.contact.sectionNumber}</div>
		<div class="grid grid-cols-[25%_1fr] gap-6 max-[700px]:grid-cols-1">
			<h2
				class="col-start-2 mt-14 mb-10 text-[clamp(45px,6.8vw,104px)] leading-[0.9] tracking-normal max-[700px]:col-start-1 max-[700px]:mt-5 max-[700px]:text-[63px]"
			>
				{t.contact.heading}
			</h2>
			<div class="col-start-2 flex flex-col items-start max-[700px]:col-start-1">
				<p class="mb-3 font-mono text-[10px] tracking-[0.1em] uppercase">
					{t.contact.managementLabel}
				</p>
				<a
					class="btn-slide text-[clamp(24px,3vw,42px)] tracking-[-0.035em] break-all transition-opacity hover:opacity-55"
					href={`mailto:${t.contact.email}`}>{t.contact.email}</a
				>
				<p class="mt-8 text-[14px] leading-[1.5] whitespace-pre-line">
					{t.contact.representedBy}
				</p>
			</div>
		</div>
		<div
			class="mt-[136px] flex justify-between border-t border-[#333] pt-[14px] font-mono text-[10px] tracking-[0.1em] uppercase max-[700px]:mt-20"
		>
			<span>{t.contact.copyright}</span>
			<a class="btn-slide transition-opacity hover:opacity-55" href="#top" onclick={scrollToTop}>
				{t.contact.backToTop}
			</a>
		</div>
	</footer>

	<!-- Photo Preview Modal in Center of Screen with Close Button in Top-Right Corner -->
	{#if previewPhoto}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
			role="dialog"
			aria-modal="true"
			aria-label={previewPhoto.alt}
			tabindex="-1"
			onclick={(e) => {
				if (e.target === e.currentTarget) closePhotoPreview();
			}}
			onkeydown={(e) => {
				if (e.key === 'Escape') closePhotoPreview();
			}}
		>
			<!-- Button in top-right corner to close -->
			<button
				type="button"
				onclick={closePhotoPreview}
				class="btn-slide absolute top-5 right-5 z-60 flex cursor-pointer items-center gap-2 border border-white/40 bg-black/70 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:top-8 sm:right-8"
				aria-label={t.photos.closePreview}
			>
				<span>{t.newsletter.close}</span>
				<span class="text-sm leading-none">✕</span>
			</button>

			<!-- Centered preview image -->
			<div
				transition:scale={{ start: 0.92, duration: 250, easing: cubicOut }}
				class="relative flex max-h-[85vh] max-w-[92vw] flex-col items-center justify-center"
			>
				<img
					src={previewPhoto.src}
					alt={previewPhoto.alt}
					class="max-h-[80vh] max-w-[90vw] border border-white/20 object-contain shadow-2xl"
				/>
				{#if previewPhoto.alt}
					<p
						class="mt-3.5 max-w-xl text-center font-mono text-[11px] tracking-[0.08em] text-white/70 uppercase"
					>
						{previewPhoto.alt}
					</p>
				{/if}
			</div>
		</div>
	{/if}
</main>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			if (previewPhoto) {
				closePhotoPreview();
			} else if (showNewsletterPopup) {
				closeNewsletterPopup();
			}
		}
	}}
/>
