import { ref } from 'vue';
import { describe, it, expect } from 'vitest';
import { useRequestLoadings } from '../../src/composables/useRequestLoadings';

describe('registerRequestLoading', () => {
	it('should register a new loading reference with a unique id', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef = ref(false);

		registerRequestLoading('test-id', loadingRef);

		expect(isAnyLoading.value).toBe(false);
	});

	it('should throw an error when trying to register a duplicate id', () => {
		const { registerRequestLoading } = useRequestLoadings();
		const loadingRef = ref(false);

		registerRequestLoading('duplicate-id', loadingRef);

		expect(() => registerRequestLoading('duplicate-id', loadingRef)).toThrow(
			'Loading com id duplicate-id já foi registrado.'
		);
	});

	it('should allow registering multiple different ids', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(false);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(false);
	});
});

describe('unregisterRequestLoading', () => {
	it('should remove a registered loading reference', () => {
		const { registerRequestLoading, unregisterRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef = ref(false);

		registerRequestLoading('test-id', loadingRef);
		expect(isAnyLoading.value).toBe(false);

		unregisterRequestLoading('test-id');
		expect(isAnyLoading.value).toBe(false);
	});

	it('should throw an error when trying to unregister a non-existent id', () => {
		const { unregisterRequestLoading } = useRequestLoadings();

		expect(() => unregisterRequestLoading('non-existent-id')).toThrow(
			'Loading com id non-existent-id não foi registrado.'
		);
	});

	it('should correctly update isAnyLoading after removing a loading reference', () => {
		const { registerRequestLoading, unregisterRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(true);
		const loadingRef2 = ref(false);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(true);

		unregisterRequestLoading('id-1');
		expect(isAnyLoading.value).toBe(false);
	});
});

describe('isAnyLoading computed', () => {
	it('should return false when there are no registered loadings', () => {
		const { isAnyLoading } = useRequestLoadings();

		expect(isAnyLoading.value).toBe(false);
	});

	it('should return false when all registered loadings are false', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(false);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(false);
	});

	it('should return true when at least one loading is true', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(true);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(true);
	});

	it('should return true when all loadings are null', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(null);
		const loadingRef2 = ref(null);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(true);
	});

	it('should return true when some loadings are true and some are false', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(true);
		const loadingRef3 = ref(false);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);
		registerRequestLoading('id-3', loadingRef3);

		expect(isAnyLoading.value).toBe(true);
	});

	it('should reactively update when loading references change', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef = ref(false);

		registerRequestLoading('reactive-test', loadingRef);
		expect(isAnyLoading.value).toBe(false);

		loadingRef.value = true;
		expect(isAnyLoading.value).toBe(true);

		loadingRef.value = false;
		expect(isAnyLoading.value).toBe(false);
	});

	it('should handle mix of null and true values correctly', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(null);
		const loadingRef2 = ref(true);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(true);
	});

	it('should handle mix of null and false values correctly', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef1 = ref(null);
		const loadingRef2 = ref(false);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(true);
	});
});

describe('isLoadingSettled computed', () => {
	it('should return true when there are no registered loadings', () => {
		const { isLoadingSettled } = useRequestLoadings();

		expect(isLoadingSettled.value).toBe(true);
	});

	it('should return true when all registered loadings are false', () => {
		const { registerRequestLoading, isLoadingSettled } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(false);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isLoadingSettled.value).toBe(true);
	});

	it('should return false when at least one loading is true', () => {
		const { registerRequestLoading, isLoadingSettled } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(true);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isLoadingSettled.value).toBe(false);
	});

	it('should return false when at least one loading is null', () => {
		const { registerRequestLoading, isLoadingSettled } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(null);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isLoadingSettled.value).toBe(false);
	});

	it('should reactively update when loading references change', () => {
		const { registerRequestLoading, isLoadingSettled } = useRequestLoadings();
		const loadingRef = ref(true);

		registerRequestLoading('reactive-test', loadingRef);
		expect(isLoadingSettled.value).toBe(false);

		loadingRef.value = false;
		expect(isLoadingSettled.value).toBe(true);
	});

	it('should return false when any value is not false', () => {
		const { registerRequestLoading, isLoadingSettled } = useRequestLoadings();
		const loadingRef1 = ref(true);
		const loadingRef2 = ref(null);
		const loadingRef3 = ref(false);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);
		registerRequestLoading('id-3', loadingRef3);

		expect(isLoadingSettled.value).toBe(false);
	});
});

describe('integration tests', () => {
	it('should work correctly with multiple register/unregister operations', () => {
		const { registerRequestLoading, unregisterRequestLoading, isAnyLoading, isLoadingSettled } = useRequestLoadings();
		const loadingRef1 = ref(false);
		const loadingRef2 = ref(true);
		const loadingRef3 = ref(null);

		registerRequestLoading('id-1', loadingRef1);
		registerRequestLoading('id-2', loadingRef2);

		expect(isAnyLoading.value).toBe(true);
		expect(isLoadingSettled.value).toBe(false);

		unregisterRequestLoading('id-2');
		expect(isAnyLoading.value).toBe(false);
		expect(isLoadingSettled.value).toBe(true);

		registerRequestLoading('id-3', loadingRef3);
		expect(isAnyLoading.value).toBe(true);
		expect(isLoadingSettled.value).toBe(false);
	});

	it('should handle rapid changes in loading states', () => {
		const { registerRequestLoading, isAnyLoading } = useRequestLoadings();
		const loadingRef = ref(false);

		registerRequestLoading('rapid-change', loadingRef);

		loadingRef.value = true;
		expect(isAnyLoading.value).toBe(true);

		loadingRef.value = false;
		expect(isAnyLoading.value).toBe(false);

		loadingRef.value = null;
		expect(isAnyLoading.value).toBe(true);

		loadingRef.value = false;
		expect(isAnyLoading.value).toBe(false);
	});
});