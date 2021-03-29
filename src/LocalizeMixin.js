import { Consts } from './consts.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin.js';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

const LocalizeMixinInternal = (superclass) => class extends LocalizeDynamicMixin(RtlMixin(superclass)) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

	localizeActivityName(name) {
		if (!name || name.trim() === '') {
			return this.localize('untitled');
		}

		if (name === Consts.overallAchievementActivityName) {
			return this.localize('labelOverallAchievement');
		}

		return name;
	}

};

export const LocalizeMixin = dedupeMixin(LocalizeMixinInternal);
