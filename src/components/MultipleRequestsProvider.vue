<script>
import swal from 'sweetalert2';
import get from 'lodash.get';
import convertKeysToCamelCase from '../utils/convertKeysToCamelCase';
import convertKeysToSnakeCase from '../utils/convertKeysToSnakeCase';
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
	props: {
		services: {
			type: Object,
			required: true,
		},
		payloads: {
			type: Object,
			default: () => ({}),
		},
		payloadResolvers: {
			type: Object,
			default: () => ({}),
		},
		dataResolvers: {
			type: Object,
			default: () => ({}),
		},
		successSwalConfigs: {
			type: Object,
			default: () => ({}),
		},
		errorSwalConfigs: {
			type: Object,
			default: () => ({}),
		},
		errorFeedbackResolvers: {
			type: Function,
			default: null,
		},
		successFeedbackResolver: {
			type: Function,
			default: null,
		},
		showSuccessFeedback: {
			type: Array,
			default: () => [],
		},
		hideErrorFeedback: {
			type: Array,
			default: () => [],
		},
		immediate: {
			type: Array,
			default: () => [],
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
			loading: {},
			failed: {},
			error: {},
			data: {
				...(this.initialData || {}),
			},
		};
	},

	watch: {
		forceResetError(newValue) {
			if (newValue) {
				this.error = null;
			}
		},
	},

	beforeCreate() {
		const {
			services,
			payloads,
			payloadResolvers,
			dataResolvers,
			successSwalConfigs,
			errorFeedbackResolvers,
			errorSwalConfigs,
		} = this.$options.propsData;

		Object.keys(services).forEach((serviceKey) => {
			this.$options.methods = {
				[`${serviceKey}Action`]: () => {
					this.$options.data.loading[serviceKey] = true;
					this.$options.data.failed[serviceKey] = false;
					this.$options.data.error[serviceKey] = null;

					const payload = payloads[serviceKey]; // n tem payload from args
					this.service(payloadResolvers[serviceKey](payload))
						.then(
							({ data }) => {
								this.data[serviceKey] = dataResolvers[serviceKey](data);
								this.$emit('success', { serviceKey, data: this.data });

								if (this.showSuccessFeedback) {
									if (this.successFeedbackResolver) {
										this.successFeedbackResolver({ vm: this, data: this.data[serviceKey], serviceKey });
										return;
									}
									swal.fire({
										...SUCCESS_SWAL_DEFAULT_CONFIG,
										...successSwalConfigs[serviceKey],
									}).then(() => {
										this.$emit('success-feedback-ok', { data: this.data[serviceKey], serviceKey });
									});
								}
							},
						).catch(
							(error) => {
								this.$options.data.failed[serviceKey] = true;
								this.$options.data.error[serviceKey] = error;
								this.$emit('error', { error, serviceKey });

								if (!this.hideErrorFeedback) {
									const errorMessage = getFirstErrorMessage(
										get(error, 'response.data', null),
										'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.',
									);

									if (errorFeedbackResolvers[serviceKey]) {
										errorFeedbackResolvers[serviceKey]({
											vm: this,
											error,
											errorMessage,
											serviceKey,
										});
										return;
									}

									swal.fire({
										...ERROR_SWAL_DEFAULT_CONFIG,
										...errorSwalConfigs[serviceKey],
										text: errorMessage,
									}).then((result) => {
										if (result.isDismissed) {
											this.$emit('error-feedback-cancel', { error, serviceKey });
										}
										if (result.isConfirmed) {
											this.$emit('error-feedback-ok', { error, serviceKey });
										}
									});
								}
							},
						).finally(() => {
							this.$options.data.loading[serviceKey] = false;
						});
				},
				...this.$options.methods,
			};
		});
	},

	mounted() {
		this.immediate.forEach((serviceKey) => {
			this[`${serviceKey}Action`]();
		});
	},

	methods: {
		labelHelper(label, loadingLabel = 'Carregando...') {
			if (this.loading) {
				return loadingLabel;
			}
			return label;
		},

		payloadResolverFallback(payloadResolver) {
			return payloadResolver || convertKeysToSnakeCase;
		},

		dataResolverFallback(payloadResolver) {
			return payloadResolver || convertKeysToCamelCase;
		},
	},

	render() {
		const slotProvider = this.$scopedSlots || this.$slots;
		const slot = slotProvider.default({
			loading: this.loading,
			failed: this.failed,
			error: this.error,
			data: this.data,
			action: this.action,
			labelHelper: this.labelHelper,
			errorMessage: getFirstErrorMessage(
				get(this.error, 'response.data', null),
				'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.',
			),
		});

		return Array.isArray(slot) ? slot[0] : slot;
	},
};
</script>
