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

export function useRequest<R = JsonResponse>(
	requestFn: (...args: any[]) => Promise<JsonResponse>,
	dataResolver?: (data: Object|null) => R,
	payloadResolver?: (payload: Object|null) => R
) {
	const loading = ref<Boolean>(false);
	const error = ref<Error | null>(null);
	const data = ref<Object | null>(null);
	const status = ref<Number | null>(null);

	const internalDataResolver = dataResolver || convertKeysToCamelCase;
	const internalPayloadResolver = payloadResolver || convertKeysToSnakeCase;

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
