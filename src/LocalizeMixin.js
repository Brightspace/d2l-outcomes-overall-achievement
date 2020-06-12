import { LocalizeMixin as CoreLocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';

const supportedLangs = [
	'ar', 'de', 'en', 'es', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv', 'tr', 'zh-tw', 'zh'
];

export const LocalizeMixin = (superclass) => class extends CoreLocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		let translations;

		for await (const lang of langs) {
			const langIndex = supportedLangs.indexOf(lang);
			if (langIndex >= 0) {
				const langFile = `../build/lang/${supportedLangs[langIndex]}.js`;
				translations = await import(langFile);

				if (translations && translations.val) {
					return {
						language: supportedLangs[langIndex],
						resources: translations.val
					};
				}
			}
		}

		// Default lang
		translations = await import('../build/lang/en.js');
		return {
			language: 'en',
			resources: translations.val
		};
	}

};
