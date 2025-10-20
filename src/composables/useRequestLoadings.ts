import { computed, reactive, type Ref } from 'vue';

interface LoadingEntry {
	id: string;
	loading: Ref<boolean | null>;
}

export function useRequestLoadings() {
	const entries = reactive<LoadingEntry[]>([]);

	function registerRequestLoading(id: string, loadingRef: Ref<boolean | null>): void {
		if (!entries.find(e => e.id === id)) {
			entries.push({ id, loading: loadingRef });
			return;
		}

		throw new Error(`Loading com id ${id} já foi registrado.`);
	}

	function unregisterRequestLoading(id: string): void {
		const index = entries.findIndex(e => e.id === id);
		if (index > -1) {
			entries.splice(index, 1);
			return;
		}

		throw new Error(`Loading com id ${id} não foi registrado.`);
	}

	const isAnyLoading = computed<boolean>(() => {
		const values = entries.map(e => e.loading);
		if (values.length === 0) return false;

		const hasTrue = values.some(v => v === true);
		const allNull = values.some(v => v === null);

		return hasTrue || allNull;
	});

	const isLoadingSettled = computed<boolean>(() => {
		const values = entries.map(e => e.loading);
		if (values.length === 0) return true;
		return values.every(v => v === false);
	});

	return {
		registerRequestLoading,
		unregisterRequestLoading,
		isAnyLoading,
		isLoadingSettled
	};
}