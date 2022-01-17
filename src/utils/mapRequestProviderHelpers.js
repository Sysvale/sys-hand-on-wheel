export default function mapRequestProviderState(ref) {
	return {
		loading: ref.loading,
		failed: ref.failed,
		error: ref.error,
		data: ref.data,
	};
};

export default function mapRequestProviderAction(ref) {
	return {
		action: ref.action,
	};
};
