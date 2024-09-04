<script>
import { h } from 'vue';
import swal from 'sweetalert2';
import get from 'lodash.get';
import convertKeysToCamelCase from '../utils/convertKeysToCamelCase';
import convertKeysToSnakeCase from '../utils/convertKeysToSnakeCase';
import generateKey from '../utils/generateKey';
import getFirstErrorMessage from '../utils/getFirstErrorMessage';

const SUCCESS_SWAL_DEFAULT_CONFIG = {
	title: 'Informações salvas com sucesso!',
	icon: 'success',
	text: '',
	showCloseButton: true,
	confirmButtonText: 'Ok',
};

const ERROR_SWAL_DEFAULT_CONFIG = {
	icon: 'error',
	title: 'Erro',
	text: 'mensagem de error',
	showCancelButton: true,
	showConfirmButton: false,
	cancelButtonText: 'Fechar',
};

export default {
	inject: ['$_requestObserver'],
	emits: ['success', 'error', 'success-feedback-ok', 'error-feedback-ok', 'success-feedback-cancel', 'error-feedback-cancel'],
	props: {
		vid: {
			type: String,
			default: () => generateKey(),
		},
		tag: {
			type: String,
			default: 'div',
		},
		service: {
			type: Function,
			required: true,
		},
		payload: {
			type: Object,
			default: () => ({}),
		},
		payloadResolver: {
			type: Function,
			default: (data) => convertKeysToSnakeCase(data),
		},
		dataResolver: {
			type: Function,
			default: (data) => convertKeysToCamelCase(data),
		},
		successSwalConfig: {
			type: Object,
			default: () => SUCCESS_SWAL_DEFAULT_CONFIG,
		},
		errorSwalConfig: {
			type: Object,
			default: () => ERROR_SWAL_DEFAULT_CONFIG,
		},
		errorFeedbackResolver: {
			type: Function,
			default: null,
		},
		successFeedbackResolver: {
			type: Function,
			default: null,
		},
		showSuccessFeedback: {
			type: Boolean,
			default: false,
		},
		hideErrorFeedback: {
			type: Boolean,
			default: false,
		},
		immediate: {
			type: Boolean,
			default: false,
		},
		forceResetError: {
			type: Boolean,
			default: false,
		},
		initialData: {
			default: null,
		},
	},

	data() {
		return {
			loading: false,
			failed: false,
			succeeded: false,
			error: null,
			data: this.initialData,
		};
	},

	computed: {
		requestState() {
			return {
				loading: this.loading,
				failed: this.failed,
				succeeded: this.succeeded,
				error: this.error,
				data: this.data,
			};
		}
	},

	watch: {
		forceResetError(newValue) {
			if (newValue) {
				this.error = null;
			}
		},
	},

	mounted() {
		if (this.immediate) {
			this.action();
		}
	},

	created() {
		if(this.$_requestObserver) {
			this.$_requestObserver.subscribe(this);
		}
	},

	beforeDestroy() {
		if(this.$_requestObserver) {
			this.$_requestObserver.unsubscribe(this);
		}
	},

	methods: {
		action(payloadFromArgs) {
			this.startRequest();
			const payload = payloadFromArgs || this.payload;
			this.service(this.payloadResolver(payload))
				.then(
					({ data }) => {
						this.data = this.dataResolver(data);
						this.succeeded = true;
						this.$emit('success', this.data);

						if (this.showSuccessFeedback) {
							if (this.successFeedbackResolver) {
								this.successFeedbackResolver({ vm: this, data: this.data });
								return;
							}
							swal.fire({
								...SUCCESS_SWAL_DEFAULT_CONFIG,
								...this.successSwalConfig,
							}).then(() => {
								this.$emit('success-feedback-ok', this.data);
							});
						}
					},
				).catch(
					(error) => {
						this.failed = true;
						this.error = error;
						console.error(error);
						this.$emit('error', error);

						if (!this.hideErrorFeedback) {
							const errorMessage = getFirstErrorMessage(
								get(error, 'response.data', null),
								'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.',
							);

							if (this.errorFeedbackResolver) {
								this.errorFeedbackResolver({ vm: this, error, errorMessage });
								return;
							}

							swal.fire({
								...ERROR_SWAL_DEFAULT_CONFIG,
								...this.errorSwalConfig,
								text: errorMessage,
							}).then((result) => {
								if (result.isDismissed) {
									this.$emit('error-feedback-cancel', error);
								}
								if (result.isConfirmed) {
									this.$emit('error-feedback-ok', error);
								}
							});
						}
					},
				).finally(() => {
					this.loading = false;
				});
		},

		loadingTextResolver(label, loadingLabel = 'Carregando...') {
			if (this.loading) {
				return loadingLabel;
			}
			return label;
		},

		startRequest() {
			this.loading = true;
			this.failed = false;
			this.succeeded = false;
			this.error = null;
		},
	},

	render() {
		const slotProvider = this.$slots;
		const slot = slotProvider.default({
			...this.requestState,
			action: this.action,
			loadingTextResolver: this.loadingTextResolver,
			errorMessage: getFirstErrorMessage(
				get(this.error, 'response.data', null),
				'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.',
			),
		});

		return h(this.tag, slot);
	},
};
</script>
