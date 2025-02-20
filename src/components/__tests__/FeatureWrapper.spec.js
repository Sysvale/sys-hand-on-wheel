import { mount } from '@vue/test-utils';
import FeatureWrapper from '../FeatureWrapper.vue';
import { describe, expect, test } from 'vitest';

const defaultComponent = '<div> Test feature </div>';

const componentDefaultSettings = {
	slots: {
		default: defaultComponent,
	},
};

describe('FeatureWrapper', () => {
	test('is hidden when feature is disabled and mode is hide', async () => {
		const wrapper = mount(FeatureWrapper, {
			...componentDefaultSettings,
			global: {
				provide: {
					disabledFeatures: ['test-feature'],
				},
			},
			props: {
				feature: 'test-feature',
				mode: 'hide',
			},
		});

		console.log(wrapper.text());
		expect(wrapper.text()).toBe('');
	});

	test('is disabled when feature is disabled and mode is disable', async () => {
		const wrapper = mount(FeatureWrapper, {
			slots: {
				default: '<div> Test feature {{ disabled }} </div>',
			},
			global: {
				provide: {
					disabledFeatures: ['test-feature'],
				},
			},
			props: {
				feature: 'test-feature',
				mode: 'disable',
			},
		});

		console.log(wrapper.html());

		// expect(wrapper.text()).toBe(defaultComponent);
	});
});
