import { createLocalVue, mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import convertKeysToSnakeCase from '../../utils/convertKeysToSnakeCase';
import RequestProvider from '../RequestProvider.vue';

const localVue = createLocalVue();

const responseDataMock = {
	'test message': 'success message',
};

const payloadMock = {
	id: '1',
	'test--value': 'test value',
};

const successfulServiceMock = jest.fn(() => Promise.resolve({
	data: responseDataMock,
}));
const failedServiceMock = jest.fn(() => Promise.reject(Error('test error')));
const payloadResolverMock = jest.fn();
const dataResolverMock = jest.fn((data) => convertKeysToSnakeCase(data));
const successFeedbackResolverMock = jest.fn();
const errorFeedbackResolverMock = jest.fn();
const defaultComponent = '<div />';
const componentDefaultSettings = {
	localVue,
	slots: {
		default: defaultComponent,
	},
	provide: {
		$_requestObserver: null,
	},
}

test('Component renders correctly', async () => {
	const wrapper = mount(RequestProvider, {
		...componentDefaultSettings,
		propsData: {
			service: successfulServiceMock,
		},
	});

	await flushPromises();

	expect(wrapper).toMatchSnapshot();
});

describe('Service', () => {
	test('is called on mount if immediate is true', async () => {
		expect.assertions(2);
		mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: successfulServiceMock,
				immediate: false,
			},
		});

		await flushPromises();

		expect(successfulServiceMock).not.toHaveBeenCalled();

		mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: successfulServiceMock,
				immediate: true,
			},
		});

		await flushPromises();

		expect(successfulServiceMock).toHaveBeenCalled();
	});

	test('is called correctly when action is triggered manually', async () => {
		expect.assertions(1);
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: successfulServiceMock,
			},
		});

		await flushPromises();

		wrapper.vm.action(payloadMock);

		await flushPromises();

		expect(successfulServiceMock).toHaveBeenCalledWith(dataResolverMock(payloadMock));
	});
});

describe('Event', () => {
	test('is emitted correctly when a request has succeeded', async () => {
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: successfulServiceMock,
				immediate: true,
			},
		});

		await flushPromises();

		expect(wrapper.emitted()).toHaveProperty('success');
	});

	test('is emitted correctly when a request has failed', async () => {
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: failedServiceMock,
				immediate: true,
			},
		});

		await flushPromises();

		expect(wrapper.emitted()).toHaveProperty('error');
	});
});

describe('Resolvers', () => {
	test('have their results applied correctly to payload and data', async () => {
		expect.assertions(3);
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: successfulServiceMock,
				payloadResolver: payloadResolverMock,
				dataResolver: dataResolverMock,
				showSuccessFeedback: false,
				payload: payloadMock,
				immediate: true,
			},
		});

		expect(payloadResolverMock).toHaveBeenCalledWith(payloadMock);

		await flushPromises();

		expect(dataResolverMock).toHaveBeenCalledWith(responseDataMock);

		await flushPromises();

		expect(wrapper.vm.data).toStrictEqual(convertKeysToSnakeCase(responseDataMock));
	});

	test('are called correctly when a request has succeeded and showSuccessFeedback is false', async () => {
		expect.assertions(4);
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: successfulServiceMock,
				payloadResolver: payloadResolverMock,
				dataResolver: dataResolverMock,
				successFeedbackResolver: successFeedbackResolverMock,
				showSuccessFeedback: false,
				payload: payloadMock,
				immediate: true,
			},
		});

		expect(payloadResolverMock).toHaveBeenCalledWith(payloadMock);

		await flushPromises();

		expect(dataResolverMock).toHaveBeenCalledWith(responseDataMock);
		expect(wrapper.emitted()).toHaveProperty('success');
		expect(successFeedbackResolverMock).not.toHaveBeenCalled();
	});

	test('are called correctly when a request has succeeded and showSuccessFeedback is true', async () => {
		expect.assertions(4);
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: successfulServiceMock,
				payloadResolver: payloadResolverMock,
				dataResolver: dataResolverMock,
				successFeedbackResolver: successFeedbackResolverMock,
				showSuccessFeedback: true,
				payload: payloadMock,
				immediate: true,
			},
		});

		expect(payloadResolverMock).toHaveBeenCalledWith(payloadMock);

		await flushPromises();

		expect(dataResolverMock).toHaveBeenCalledWith(responseDataMock);
		expect(wrapper.emitted()).toHaveProperty('success');
		expect(successFeedbackResolverMock).toHaveBeenCalled();
	});

	test('are called correctly when a request has failed and hideErrorFeedback is true', async () => {
		expect.assertions(4);
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: failedServiceMock,
				payloadResolver: payloadResolverMock,
				dataResolver: dataResolverMock,
				errorFeedbackResolver: errorFeedbackResolverMock,
				hideErrorFeedback: true,
				payload: payloadMock,
				immediate: true,
			},
		});

		expect(payloadResolverMock).toHaveBeenCalledWith(payloadMock);

		await flushPromises();

		expect(dataResolverMock).toHaveBeenCalledWith(responseDataMock);
		expect(wrapper.emitted()).toHaveProperty('error');
		expect(errorFeedbackResolverMock).not.toHaveBeenCalled();
	});

	test('are called correctly when a request has failed and hideErrorFeedback is false', async () => {
		expect.assertions(4);
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: failedServiceMock,
				payloadResolver: payloadResolverMock,
				dataResolver: dataResolverMock,
				errorFeedbackResolver: errorFeedbackResolverMock,
				hideErrorFeedback: false,
				payload: payloadMock,
				immediate: true,
			},
		});

		expect(payloadResolverMock).toHaveBeenCalledWith(payloadMock);

		await flushPromises();

		expect(dataResolverMock).toHaveBeenCalledWith(responseDataMock);
		expect(wrapper.emitted()).toHaveProperty('error');
		expect(errorFeedbackResolverMock).toHaveBeenCalled();
	});
});

describe('Error state', () => {
	test('is reset after forceResetError is set to true', async () => {
		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: failedServiceMock,
				payload: payloadMock,
				immediate: true,
			},
		});

		await flushPromises();

		expect(wrapper.emitted()).toHaveProperty('error');
		expect(wrapper.vm.error).toBeTruthy();

		wrapper.setProps({
			forceResetError: true,
		});

		await flushPromises();

		expect(wrapper.vm.error).toBeFalsy();
	});
});

describe('Label', () => {
	test('changes correctly during request loading', async () => {
		expect.assertions(2);

		const wrapper = mount(RequestProvider, {
			...componentDefaultSettings,
			propsData: {
				service: failedServiceMock,
				payload: payloadMock,
				immediate: true,
			},
		});

		expect(wrapper.vm.loadingTextResolver('test label')).toBe('Carregando...');

		await flushPromises();

		expect(wrapper.vm.loadingTextResolver('test label')).toBe('test label');
	});
});
