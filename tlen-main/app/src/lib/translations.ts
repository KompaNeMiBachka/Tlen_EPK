export type Language = 'en' | 'bg';

export interface Show {
	date: string;
	city: string;
	venue: string;
	ticketUrl?: string;
}

export interface PhotoItem {
	src: string;
	alt: string;
	class: string;
}

export interface TranslationDictionary {
	nav: {
		home: string;
		info: string;
		live: string;
		photos: string;
		contact: string;
		prelisten: string;
	};
	hero: {
		genre: string;
		epkTagline: string;
	};
	newsletter: {
		label: string;
		placeholder: string;
		submit: string;
		joined: string;
		already: string;
		success: string;
		error: string;
		close: string;
		popupText: string;
	};
	info: {
		sectionNumber: string;
		intro: string;
		paragraphs: string[];
		watchLabel: string;
		bandName: string;
		videoTitle: string;
	};
	live: {
		sectionNumber: string;
		heading: string;
		ticketsBtn: string;
		shows: Show[];
	};
	photos: {
		sectionNumber: string;
		heading: string;
		closePreview: string;
		items: PhotoItem[];
	};
	contact: {
		sectionNumber: string;
		heading: string;
		managementLabel: string;
		email: string;
		representedBy: string;
		backToTop: string;
		copyright: string;
	};
	prelisten: {
		badge: string;
		title: string;
		subtitle: string;
		lockedBadge: string;
		lockedTitle: string;
		lockedDescription: string;
		emailPlaceholder: string;
		unlockBtn: string;
		verifyingBtn: string;
		notSubscribedText: string;
		unlockedBadge: string;
		unlockedWelcome: string;
		trackTitle: string;
		trackArtist: string;
		playerDescription: string;
		exclusiveNotice: string;
		changeEmailBtn: string;
		backToHome: string;
		invalidEmail: string;
		serverError: string;
		precheckSuccess: string;
	};
	countdown: {
		modalTitle: string;
		subtitle: string;
		daysLabel: string;
		hoursLabel: string;
		minutesLabel: string;
		secondsLabel: string;
		targetLabel: string;
		unlockedMessage: string;
		listenNowBtn: string;
		closeBtn: string;
		lockedBadge: string;
		lockedTooltip: string;
		viewCountdown: string;
	};
}

export const translations: Record<Language, TranslationDictionary> = {
	en: {
		nav: {
			home: 'Home',
			info: 'Info',
			live: 'Live',
			photos: 'Photos',
			contact: 'Contact',
			prelisten: 'Pre-listen'
		},
		hero: {
			genre: 'Indie / post-punk / alternative',
			epkTagline: 'Official Website · Sofia, BG'
		},
		newsletter: {
			label: 'Pre-listen',
			placeholder: 'Enter your email',
			submit: 'Sign up',
			joined: 'Signed up',
			already: 'Already signed up',
			success: 'Signed up successfully for early listen to "znak za trevoga"',
			error: 'Sign up failed',
			close: 'Close',
			popupText: 'Sign up for an early listen.'
		},
		info: {
			sectionNumber: '01 / Info',
			intro:
				'Tlen is a Sofia-based band whose sound feels like it comes from “the end of the endless” — for those who miss something unnamed.',
			paragraphs: [
				'Their music walks the fine line between tenderness and sting, crafting a dark cinematography where the listener becomes a midnight passenger in the last taxi, crossing hushed city streets.',
				'In the rearview mirror, faces flicker — some tasting the bittersweet, some left behind for good, others having lost faith in the morning. These intimate soundscapes carry melancholy not as a burden but as a source of creativity, pushing emotions to a boiling point and (hopefully) towards release.',
				'Tlen’s live shows are immersive journeys, blending atmospheric arrangements with sharp lyrical imagery. Their sound can’t be boxed in one genre — it’s indie, post-punk, alternative, and cinematic rock, all channeled through raw emotion.'
			],
			watchLabel: 'Watch',
			bandName: 'Tlen',
			videoTitle: 'Tlen — music video'
		},
		live: {
			sectionNumber: '02 / Live',
			heading: 'Next\nshows',
			ticketsBtn: 'Tickets',
			shows: [
				{
					date: '14.10.2026',
					city: 'Sofia',
					venue: 'SoAlive Music Conference — Soda Bar',
					ticketUrl: 'https://bilet.bg'
				},
				{
					date: '22.11.2026',
					city: 'Sofia',
					venue: 'Mixtape Side-B — w/ Plattenbau',
					ticketUrl: 'https://bilet.bg/bg/events/plattenbau-tlen-evitceles-live-in-sofia-8690'
				},
				{
					date: '27.11.2026',
					city: 'Sofia',
					venue: 'Toplocentrala — w/ TDK',
					ticketUrl: 'https://bilet.bg/bg/events/tdk-i-tlen-na-zhivo-8888-8888'
				}
			]
		},
		photos: {
			sectionNumber: '03 / Photos',
			heading: 'Gallery',
			closePreview: 'Close preview',
			items: [
				{
					src: '/shows-gallery-1.jpeg',
					alt: '',
					class: 'col-start-1 row-start-1'
				},
				{
					src: '/gallery-2.jpeg',
					alt: '',
					class: 'col-start-2 row-span-2 row-start-1'
				},
				{
					src: '/gallery-3.jpeg',
					alt: '',
					class: 'col-start-1 row-start-2'
				},
				{
					src: '/gallery-4.jpg',
					alt: '',
					class: 'col-start-1 row-start-3'
				},
				{
					src: '/gallery-description-6.jpeg',
					alt: '',
					class: 'col-start-2 row-start-3'
				}
			]
		},
		contact: {
			sectionNumber: '04 / Contact',
			heading: 'Get in touch.',
			managementLabel: 'Management',
			email: 'mgmt@murmur.work',
			representedBy: 'Represented by Nikola Nikolov\nand Gueorgui Linev',
			backToTop: 'Back to top ↑',
			copyright: 'TLEN © 2026'
		},
		prelisten: {
			badge: 'Pre-listen · Exclusive',
			title: 'Early listen to "znak za trevoga"',
			subtitle: 'Exclusive unreleased track preview for our newsletter subscribers.',
			lockedBadge: 'Subscribers Only',
			lockedTitle: 'Early listen to "znak za trevoga"',
			lockedDescription:
				'Sign up for an early listen. Enter the email you subscribed with to unlock the private stream.',
			emailPlaceholder: 'Enter your email',
			unlockBtn: 'Unlock',
			verifyingBtn: 'Checking...',
			notSubscribedText:
				'This email was not found in our subscriber list. Only newsletter subscribers have access.',
			unlockedBadge: 'Unlocked · Early Listen',
			unlockedWelcome:
				'Signed up successfully for early listen to "znak za trevoga".',
			trackTitle: 'TLEN - Znak Za Trevoga - Master_v03',
			trackArtist: 'тлен',
			playerDescription:
				'SoundCloud private stream player embedded below.',
			exclusiveNotice:
				'This track is an unreleased preview for subscribers. Please keep the private stream within the pre-listen circle.',
			changeEmailBtn: 'Lock / Switch email',
			backToHome: '← Back to site',
			invalidEmail: 'Please enter a valid email address.',
			serverError: 'An error occurred. Please try again.',
			precheckSuccess: 'Subscription confirmed! The private stream unlocks automatically when the countdown ends.'
		},
		countdown: {
			modalTitle: 'Pre-listen unlock',
			subtitle: '',
			daysLabel: 'Days',
			hoursLabel: 'Hours',
			minutesLabel: 'Mins',
			secondsLabel: 'Secs',
			targetLabel: 'Official unlock: 19.11.2026 · 23:59:59 EET',
			unlockedMessage: 'Pre-listen is now unlocked!',
			listenNowBtn: 'Listen now →',
			closeBtn: 'Close',
			lockedBadge: 'Locked · Click for countdown',
			lockedTooltip: 'Pre-listen is locked until 19.11.2026 23:59:59. Click to view countdown.',
			viewCountdown: 'View countdown'
		}
	},
	bg: {
		nav: {
			home: 'Начало',
			info: 'Инфо',
			live: 'Концерти',
			photos: 'Снимки',
			contact: 'Контакт',
			prelisten: 'Ранно слушане'
		},
		hero: {
			genre: 'Инди / пост-пънк / алтърнатив',
			epkTagline: 'Официален Сайт · София, БГ'
		},
		newsletter: {
			label: 'Ранно слушане',
			placeholder: 'Въведете имейл',
			submit: 'Записване',
			joined: 'Записан',
			already: 'Вече сте записани',
			success: 'Успешно се записахте за ранно слушане на "знак за тревога"',
			error: 'Възникна грешка',
			close: 'Затвори',
			popupText: 'Запишете се за ранно слушане.'
		},
		info: {
			sectionNumber: '01 / Инфо',
			intro:
				'Тлен е софийска банда, чиято музика сякаш идва „от края на безкрая“ – за всеки, на когото му липсва нещо неуловимо.',
			paragraphs: [
				'Звукът им балансира между нежност и бодливост, създавайки мрачна кинематография, в която слушателят е среднощен пътник в последното такси, прекосяващо притихналите градски улици.',
				'В огледалото за обратно виждане проблясват лица – някои, вкусили горчиво-сладкото; някои, изоставени завинаги; други, изгубили вяра в утрото. Тази естетика носи меланхолията не като товар, а като извор на креативност, довеждаща емоциите до точка на кипене и (дано) до освобождение.',
				'Концертите на Тлен са потапящи пътувания, в които се преплитат атмосферни аранжименти и силно образни текстове. Музиката им не може да бъде сложена в рамка – тя е инди, пост-пънк, алтърнатив и кинематичен рок, пречупени през сурова емоция.'
			],
			watchLabel: 'Гледай',
			bandName: 'Тлен',
			videoTitle: 'Тлен — музикално видео'
		},
		live: {
			sectionNumber: '02 / На живо',
			heading: 'Предстоящи\nсъбития',
			ticketsBtn: 'Билети',
			shows: [
				{
					date: '14.10.2026',
					city: 'София',
					venue: 'SoAlive Музикална конференция — Soda Bar',
					ticketUrl: 'https://bilet.bg'
				},
				{
					date: '22.11.2026',
					city: 'София',
					venue: 'Mixtape Side-B — с Plattenbau',
					ticketUrl: 'https://bilet.bg/bg/events/plattenbau-tlen-evitceles-live-in-sofia-8690'
				},
				{
					date: '27.11.2026',
					city: 'София',
					venue: 'Топлоцентрала — с TDK',
					ticketUrl: 'https://epaygo.bg'
				}
			]
		},
		photos: {
			sectionNumber: '03 / Снимки',
			heading: 'Галерия',
			closePreview: 'Затвори прегледа',
			items: [
				{
					src: '/shows-gallery-1.jpeg',
					alt: '',
					class: 'col-start-1 row-start-1'
				},
				{
					src: '/gallery-2.jpeg',
					alt: '',
					class: 'col-start-2 row-span-2 row-start-1'
				},
				{
					src: '/gallery-3.jpeg',
					alt: '',
					class: 'col-start-1 row-start-2'
				},
				{
					src: '/gallery-4.jpg',
					alt: '',
					class: 'col-start-1 row-start-3'
				},
				{
					src: '/gallery-description-6.jpeg',
					alt: '',
					class: 'col-start-2 row-start-3'
				}
			]
		},
		contact: {
			sectionNumber: '04 / Контакт',
			heading: 'Свържете се с нас.',
			managementLabel: 'Мениджмънт',
			email: 'mgmt@murmur.work',
			representedBy: 'Представлявани от Никола Николов\nи Георги Линев',
			backToTop: 'Към началото ↑',
			copyright: 'ТЛЕН © 2026'
		},
		prelisten: {
			badge: 'Ранно слушане · Ексклузивно',
			title: 'Ранно слушане на "знак за тревога"',
			subtitle: 'Ексклузивен предварителен запис за абонатите на бюлетина.',
			lockedBadge: 'Само за абонати',
			lockedTitle: 'Ранно слушане на "знак за тревога"',
			lockedDescription:
				'Запишете се за ранно слушане. Въведете имейла, с който сте се абонирали, за да отключите частния стрийм.',
			emailPlaceholder: 'Въведете имейл',
			unlockBtn: 'Отключи',
			verifyingBtn: 'Проверка...',
			notSubscribedText:
				'Този имейл не беше открит в списъка с абонати. Достъп имат само абонатите на бюлетина.',
			unlockedBadge: 'Отключен достъп · Ранно слушане',
			unlockedWelcome:
				'Успешно се записахте за ранно слушане на "знак за тревога".',
			trackTitle: 'TLEN - Znak Za Trevoga - Master_v03',
			trackArtist: 'тлен',
			playerDescription:
				'Вграден частен плейър в SoundCloud.',
			exclusiveNotice:
				'Този запис е предварителен и неиздаван. Молим да не разпространявате тайния линк извън кръга на абонатите.',
			changeEmailBtn: 'Заключване / Смяна на имейл',
			backToHome: '← Към сайта',
			invalidEmail: 'Моля, въведете валиден имейл адрес.',
			serverError: 'Възникна грешка. Моля, опитайте отново.',
			precheckSuccess: 'Абонаментът е потвърден! Частният стрийм ще се отключи автоматично след края на отброяването.'
		},
		countdown: {
			modalTitle: 'Отключване на ранно слушане',
			subtitle: '',
			daysLabel: 'Дни',
			hoursLabel: 'Часа',
			minutesLabel: 'Мин',
			secondsLabel: 'Сек',
			targetLabel: 'Официално отключване: 19.11.2026 · 23:59:59 EET',
			unlockedMessage: 'Ранното слушане е вече отключено!',
			listenNowBtn: 'Слушай сега →',
			closeBtn: 'Затвори',
			lockedBadge: 'Заключено · Натиснете за таймер',
			lockedTooltip: 'Ранното слушане е заключено до 19.11.2026 23:59:59. Натиснете за обратно броене.',
			viewCountdown: 'Виж обратното броене'
		}
	}
};
