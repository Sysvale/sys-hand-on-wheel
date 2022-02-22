import { createLocalVue, mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import RequestProvider from '../RequestProvider.vue';

const localVue = createLocalVue();

const serviceMock = (payload) => Promise.resolve({
	data: payload,
});

test('Component renders correctly', async () => {
	const wrapper = mount(RequestProvider, {
		localVue,
		slots: {
			default: '<div />',
		},
		propsData: {
			service: serviceMock,
		},
	});

	await flushPromises();

	expect(wrapper).toMatchSnapshot();
});
