export type Language = 'en' | 'bg';

export interface Show {
	date: string;
	city: string;
	venue: string;
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
}

export const translations: Record<Language, TranslationDictionary> = {
	en: {
		nav: {
			home: 'Home',
			info: 'Info',
			live: 'Live',
			photos: 'Photos',
			contact: 'Contact'
		},
		hero: {
			genre: 'Indie / post-punk / alternative',
			epkTagline: 'Electronic Press Kit · Sofia, BG'
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
			shows: [
				{ date: '14.10.2026', city: 'Sofia', venue: 'SoAlive Music Conference — Soda Bar' },
				{ date: '22.11.2026', city: 'Sofia', venue: 'Mixtape Side-B — w/ Plattenbau' },
				{ date: '27.11.2026', city: 'Sofia', venue: 'Toplocentrala — w/ TDK' }
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
		}
	},
	bg: {
		nav: {
			home: 'Начало',
			info: 'Инфо',
			live: 'Концерти',
			photos: 'Снимки',
			contact: 'Контакт'
		},
		hero: {
			genre: 'Инди / пост-пънк / алтърнатив',
			epkTagline: 'Електронен прес кит · София, БГ'
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
			shows: [
				{ date: '14.10.2026', city: 'София', venue: 'SoAlive Музикална конференция — Soda Bar' },
				{ date: '22.11.2026', city: 'София', venue: 'Mixtape Side-B — с Plattenbau' },
				{ date: '27.11.2026', city: 'София', venue: 'Топлоцентрала — с TDK' }
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
		}
	}
};
