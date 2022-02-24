import { createLocalVue, mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';
import convertKeysToSnakeCase from '../../utils/convertKeysToSnakeCase';
import RequestProvider from '../RequestProvider.vue';

const localVue = createLocalVue();

const responseDataMock = {
	message: 'success message',
};

const payloadMock = {
	id: '1',
};

const successfulServiceMock = jest.fn(() => Promise.resolve({
	data: responseDataMock,
}));
const failedServiceMock = jest.fn(() => Promise.reject(Error('test error')));
const payloadResolverMock = jest.fn((payload) => convertKeysToCamelCase(payload));
const dataResolverMock = jest.fn((data) => convertKeysToSnakeCase(data));
const successFeedbackResolverMock = jest.fn();
const errorFeedbackResolverMock = jest.fn();

test('Component renders correctly', async () => {
	const wrapper = mount(RequestProvider, {
		localVue,
		slots: {
			default: '<div />',
		},
		propsData: {
			service: successfulServiceMock,
		},
	});

	await flushPromises();

	expect(wrapper).toMatchSnapshot();
});
