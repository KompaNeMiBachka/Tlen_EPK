<script lang="ts">
	let language = $state<'en' | 'bg'>('en');
	let subscribeEmail = $state('');
	let subscribeStatus = $state<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
	let subscribeMessage = $state('');

	const newsletterLabels = {
		en: {
			label: 'Newsletter',
			placeholder: 'Enter your email',
			submit: 'Subscribe',
			joined: 'Joined',
			already: 'Already subscribed',
			success: 'Subscribed successfully',
			error: 'Subscription failed'
		},
		bg: {
			label: 'Бюлетин',
			placeholder: 'Въведете имейл',
			submit: 'Абониране',
			joined: 'Записан',
			already: 'Вече сте абонирани',
			success: 'Успешен абонамент',
			error: 'Възникна грешка'
		}
	};

	async function handleSubscribe(e: SubmitEvent) {
		e.preventDefault();
		if (!subscribeEmail) return;
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
				subscribeMessage = newsletterLabels[language].success;
				subscribeEmail = '';
			} else if (res.status === 409) {
				subscribeStatus = 'already';
				subscribeMessage = newsletterLabels[language].already;
			} else {
				const errorText = await res.text();
				subscribeStatus = 'error';
				subscribeMessage = errorText || newsletterLabels[language].error;
			}
		} catch {
			subscribeStatus = 'error';
			subscribeMessage = newsletterLabels[language].error;
		}
	}
	const bios = {
		en: {
			intro:
				'Tlen is a Sofia-based band whose sound feels like it comes from “the end of the endless” — for those who miss something unnamed.',
			paragraphs: [
				'Their music walks the fine line between tenderness and sting, crafting a dark cinematography where the listener becomes a midnight passenger in the last taxi, crossing hushed city streets.',
				'In the rearview mirror, faces flicker — some tasting the bittersweet, some left behind for good, others having lost faith in the morning. These intimate soundscapes carry melancholy not as a burden but as a source of creativity, pushing emotions to a boiling point and (hopefully) towards release.',
				'Tlen’s live shows are immersive journeys, blending atmospheric arrangements with sharp lyrical imagery. Their sound can’t be boxed in one genre — it’s indie, post-punk, alternative, and cinematic rock, all channeled through raw emotion.'
			]
		},
		bg: {
			intro:
				'Тлен е софийска банда, чиято музика сякаш идва „от края на безкрая“ – за всеки, на когото му липсва нещо неуловимо.',
			paragraphs: [
				'Звукът им балансира между нежност и бодливост, създавайки мрачна кинематография, в която слушателят е среднощен пътник в последното такси, прекосяващо притихналите градски улици.',
				'В огледалото за обратно виждане проблясват лица – някои, вкусили горчиво-сладкото; някои, изоставени завинаги; други, изгубили вяра в утрото. Тази естетика носи меланхолията не като товар, а като извор на креативност, довеждаща емоциите до точка на кипене и (дано) до освобождение.',
				'Концертите на Тлен са потапящи пътувания, в които се преплитат атмосферни аранжименти и силно образни текстове. Музиката им не може да бъде сложена в рамка – тя е инди, пост-пънк, алтърнатив и кинематичен рок, пречупени през сурова емоция.'
			]
		}
	};
	const shows = [
		{ date: '14.10.2026', city: 'Sofia', venue: 'SoAlive Music Conference — Soda Bar' },
		{ date: '22.11.2026', city: 'Sofia', venue: 'Mixtape Side-B — w/ Plattenbau' },
		{ date: '27.11.2026', city: 'Sofia', venue: 'Toplocentrala — w/ TDK' },
		{ date: '13.03.2027', city: 'Sofia', venue: 'DKS Sredets — Album Promo' },
		{ date: '24.03.2027', city: 'Bucharest', venue: 'Nether Club' },
		{ date: '26.03.2027', city: 'Novi Sad', venue: 'CK13' },
		{ date: '27.03.2027', city: 'Belgrade', venue: 'TBA' },
		{ date: '28.03.2027', city: 'Skopje', venue: 'TBA' },
		{ date: '29.03.2027', city: 'Thessaloniki', venue: 'TBA' }
	];
	const photos = [
		{
			src: '/shows-gallery-1.jpeg',
			alt: 'Tlen performing live on stage',
			class: 'col-start-1 row-start-1'
		},
		{ src: '/gallery-2.jpeg', alt: 'Tlen portrait', class: 'col-start-2 row-span-2 row-start-1' },
		{ src: '/gallery-3.jpeg', alt: 'Tlen live image', class: 'col-start-1 row-start-2' },
		{ src: '/gallery-4.jpg', alt: 'Tlen photographed outdoors', class: 'col-start-1 row-start-3' },
		{
			src: '/gallery-description-6.jpeg',
			alt: 'Tlen in monochrome',
			class: 'col-start-2 row-start-3'
		}
	];
</script>

<svelte:head>
	<title>Tlen — Electronic Press Kit</title>
	<meta
		name="description"
		content="Tlen — Sofia-based indie, post-punk, alternative and cinematic rock."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="bg-[#111] font-['DM_Sans',Arial,sans-serif] text-[#e9e8e1]">
	<header
		class="fixed inset-x-0 top-0 z-20 flex justify-end px-[30px] py-[22px] font-mono text-[11px] tracking-[0.08em] text-white uppercase mix-blend-difference max-[700px]:px-[18px] max-[700px]:py-[18px]"
	>
		<nav
			class="flex gap-7 max-[700px]:gap-[13px] max-[700px]:text-[9px]"
			aria-label="Main navigation"
		>
			<a class="transition-opacity hover:opacity-55" href="#info">Info</a>
			<a class="transition-opacity hover:opacity-55" href="#live">Live</a>
			<a class="transition-opacity hover:opacity-55" href="#photos">Photos</a>
			<a class="transition-opacity hover:opacity-55" href="#contact">Contact</a>
		</nav>
	</header>

	<section id="top" class="relative min-h-svh overflow-hidden bg-[#242424]">
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
			<!-- <p class="m-0 whitespace-nowrap font-mono text-[10px] tracking-[0.1em] uppercase">Electronic Press Kit · Sofia, BG</p> -->
			<img
				class="mt-[6vh] w-[min(400px,58vw)] self-center object-contain brightness-0 invert max-[700px]:w-[min(310px,73vw)]"
				src="/logo_transparent.png"
				alt="Tlen logo"
			/>
			<div
				class="flex items-end justify-between gap-6 font-mono text-[11px] tracking-[0.06em] uppercase max-[700px]:flex-col max-[700px]:items-start"
			>
				<p class="m-0 max-w-[260px] leading-6">Indie / post-punk / alternative</p>

				<form
					action="/api/subscribe"
					method="POST"
					onsubmit={handleSubscribe}
					class="w-full max-w-[340px] max-[700px]:max-w-full"
				>
					<label
						for="newsletter-email"
						class="mb-1.5 block font-mono text-[10px] tracking-[0.1em] text-white/70 uppercase"
					>
						{newsletterLabels[language].label}
					</label>
					<div
						class="flex items-center border border-white/30 bg-black/40 backdrop-blur-sm transition-colors focus-within:border-white"
					>
						<input
							type="text"
							id="newsletter-email"
							name="email"
							bind:value={subscribeEmail}
							oninput={() => {
								if (subscribeStatus !== 'idle') subscribeStatus = 'idle';
							}}
							placeholder={newsletterLabels[language].placeholder}
							required
							class="w-full bg-transparent px-3 py-2 font-mono text-[11px] tracking-[0.06em] text-white placeholder:text-white/40 focus:outline-none"
						/>
						<button
							type="submit"
							class="cursor-pointer border-l border-white/30 bg-white/10 px-3.5 py-2 font-mono text-[10px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-white hover:text-black"
						>
							{#if subscribeStatus === 'loading'}
								...
							{:else if subscribeStatus === 'success'}
								{newsletterLabels[language].joined}
							{:else}
								{newsletterLabels[language].submit}
							{/if}
						</button>
					</div>
					{#if subscribeStatus === 'success'}
						<p class="mt-1.5 font-mono text-[10px] tracking-[0.08em] text-emerald-400 normal-case">
							{subscribeMessage || newsletterLabels[language].success}
						</p>
					{:else if subscribeStatus === 'already'}
						<p class="mt-1.5 font-mono text-[10px] tracking-[0.08em] text-amber-300 normal-case">
							{subscribeMessage || newsletterLabels[language].already}
						</p>
					{:else if subscribeStatus === 'error'}
						<p class="mt-1.5 font-mono text-[10px] tracking-[0.08em] text-rose-400 normal-case">
							{subscribeMessage || newsletterLabels[language].error}
						</p>
					{/if}
				</form>
			</div>
		</div>
	</section>

	<section
		id="info"
		class="grid grid-cols-[25%_1fr] gap-6 bg-[#e9e8e1] px-[30px] py-28 text-[#171717] max-[700px]:grid-cols-1 max-[700px]:gap-[46px] max-[700px]:px-[18px] max-[700px]:py-[72px]"
	>
		<div class="font-mono text-[10px] tracking-[0.1em] uppercase">
			<p>01 / Info</p>
			<div class="mt-6 flex gap-2">
				<button
					class="border border-[#171717] px-2 py-1 transition-colors"
					class:bg-[#171717]={language === 'en'}
					class:text-[#e9e8e1]={language === 'en'}
					onclick={() => (language = 'en')}>EN</button
				><button
					class="border border-[#171717] px-2 py-1 transition-colors"
					class:bg-[#171717]={language === 'bg'}
					class:text-[#e9e8e1]={language === 'bg'}
					onclick={() => (language = 'bg')}>BG</button
				>
			</div>
		</div>
		<div class="max-w-[805px]">
			<p
				class="m-0 mb-[62px] text-[clamp(28px,4vw,58px)] leading-[1.04] tracking-[-0.035em] max-[700px]:mb-[45px] max-[700px]:text-[32px]"
			>
				{bios[language].intro}
			</p>
			<div
				class="max-w-[590px] columns-2 gap-10 text-[15px] leading-[1.55] max-[700px]:columns-1 max-[700px]:text-[14px]"
			>
				{#each bios[language].paragraphs as paragraph}<p class="mb-5 break-inside-avoid">
						{paragraph}
					</p>{/each}
			</div>
			<div class="mt-[55px] max-w-[590px] border-t border-[#1b1b1b] pt-[14px]">
				<div class="mb-3 flex justify-between font-mono text-[10px] tracking-[0.1em] uppercase">
					<span>Watch</span><span>Tlen</span>
				</div>
				<div class="aspect-video overflow-hidden rounded-xl bg-[#202020]">
					<iframe
						class="size-full"
						src="https://www.youtube-nocookie.com/embed/3IUXNp5WGWA?rel=0&modestbranding=1"
						title="Tlen — music video"
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
		<div class="font-mono text-[10px] tracking-[0.1em] uppercase">02 / Live</div>
		<div
			class="grid grid-cols-[minmax(150px,.65fr)_1fr] gap-[38px] max-[700px]:grid-cols-1 max-[700px]:gap-2.5"
		>
			<h2
				class="m-0 text-[clamp(45px,7.2vw,112px)] leading-[.82] tracking-normal max-[700px]:text-[63px]"
			>
				Next<br />shows
			</h2>
			<div class="border-t border-[#676767]">
				{#each shows as show, i}<article
						class="grid grid-cols-[92px_1fr_1.55fr] gap-4 border-b border-[#464646] py-[17px] text-[14px] leading-[1.2] max-[700px]:grid-cols-[72px_1fr] max-[700px]:gap-[7px] max-[700px]:text-[13px]"
						class:text-white={i === 0}
					>
						<time class="font-mono text-[11px]">{show.date}</time>
						<p>{show.city}</p>
						<p class="text-[#a7a7a2] max-[700px]:col-start-2">{show.venue}</p>
					</article>{/each}
			</div>
		</div>
	</section>

	<section id="photos" class="bg-[#b9b9b3] text-[#171717]">
		<div
			class="grid grid-cols-[25%_1fr] gap-6 px-[30px] pt-28 pb-[75px] max-[700px]:grid-cols-1 max-[700px]:gap-[46px] max-[700px]:px-[18px] max-[700px]:pt-[72px] max-[700px]:pb-12"
		>
			<div class="font-mono text-[10px] tracking-[0.1em] uppercase">03 / Photos</div>
			<h2
				class="m-0 text-[clamp(45px,7.2vw,112px)] leading-[.82] tracking-normal max-[700px]:text-[63px]"
			>
				Gallery
			</h2>
		</div>
		<div
			class="grid grid-cols-[59%_41%] grid-rows-[31vw_31vw_35vw] gap-[3px] max-[700px]:grid-cols-1 max-[700px]:grid-rows-none"
		>
			{#each photos as photo}<figure
					class={`m-0 overflow-hidden bg-[#252525] max-[700px]:!col-start-1 max-[700px]:!row-auto max-[700px]:aspect-[4/3] ${photo.class}`}
				>
					<img
						class="size-full object-cover contrast-110 grayscale transition duration-700 hover:scale-[1.035] hover:contrast-125"
						src={photo.src}
						alt={photo.alt}
						loading="lazy"
					/>
				</figure>{/each}
		</div>
	</section>

	<footer
		id="contact"
		class="bg-[#deddd6] px-[30px] py-28 text-[#171717] max-[700px]:px-[18px] max-[700px]:py-[72px]"
	>
		<div class="font-mono text-[10px] tracking-[0.1em] uppercase">04 / Contact</div>
		<div class="grid grid-cols-[25%_1fr] gap-6 max-[700px]:grid-cols-1">
			<h2
				class="col-start-2 mt-14 mb-10 text-[clamp(45px,7.2vw,112px)] leading-[.82] tracking-normal max-[700px]:col-start-1 max-[700px]:mt-5 max-[700px]:text-[63px]"
			>
				Get in touch.
			</h2>
			<div class="col-start-2 flex flex-col items-start max-[700px]:col-start-1">
				<p class="mb-3 font-mono text-[10px] tracking-[0.1em] uppercase">Management</p>
				<a
					class="text-[clamp(25px,3.2vw,45px)] tracking-[-0.035em] transition-opacity hover:opacity-55"
					href="mailto:mgmt@murmur.work">mgmt@murmur.work</a
				>
				<p class="mt-8 text-[14px] leading-[1.45]">
					Represented by Nikola Nikolov<br />and Gueorgui Linev
				</p>
			</div>
		</div>
		<div
			class="mt-[136px] flex justify-between border-t border-[#333] pt-[14px] font-mono text-[10px] tracking-[0.1em] uppercase max-[700px]:mt-20"
		>
			<span>TLEN © 2026</span><a href="#top">Back to top ↑</a>
		</div>
	</footer>
</main>
