import { ref } from 'vue';
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils';

type JsonResponse = {
	data: Object;
	status: Number;
	statusText: Text;
	headers: Object;
	config: Object;
	request: Object;
}

type RequestConfig = {
	dataResolver?: (data: Object|null) => Object,
	payloadResolver?: (payload: Object|null) => Object,
};

export function useRequest<R = JsonResponse>(
	requestFn: (...args: any[]) => Promise<JsonResponse>,
	config: RequestConfig
) {
	const loading = ref<Boolean>(false);
	const error = ref<Error | null>(null);
	const data = ref<Object | null>(null);
	const status = ref<Number | null>(null);

	const internalDataResolver = config?.dataResolver || convertKeysToCamelCase;
	const internalPayloadResolver = config?.payloadResolver || convertKeysToSnakeCase;

	const action = (payload: object|null) => {
		loading.value = true;
		error.value = null;

		const resolvedPayload = payload ? internalPayloadResolver(payload) : payload;
	
		requestFn(resolvedPayload)
			.then((response) => {
				data.value = internalDataResolver(response?.data);
				status.value = response?.status;
			})
			.catch(err => {
				error.value = err;
			})
			.finally(() => {
				loading.value = false;
			});
	}

	return {
		data,
		loading,
		error,
		status,
		action,
	};
}
