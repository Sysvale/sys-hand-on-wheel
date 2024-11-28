<template>
	<request-provider
		:ref="providerKey"
		v-slot="{ loadingTextResolver, loading }"
		v-bind="requestProviderOptions"
		:service="optionsService"
		:payload="requestPayload"
		:immediate="!hasDependencyPayload || dependencyPayloadIsSetted"
		@success="handleSuccess"
	>
		<cds-select
			v-bind="selectAttrs"
			v-model="internalSelected"
			:disabled="shouldBeDisabled(loading)"
			:options-field="computedKeyToValue"
			:options="computedOptions"
			:placeholder="computedPlaceholder(loadingTextResolver)"
		/>
	</request-provider>
</template>
<script>
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import reduce from 'lodash.reduce';

import RequestProvider from './RequestProvider.vue';
import { generateKey } from '../utils';
export default {
	props: {
		modelValue: {
			type: [Array, Object],
			required: true,	
		},
		optionsService: {
			type: Function,
			required: true,
		},
		optionsRequestPayload: {
			type: Object,
			default: () => ({}),
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		optionsResolver: {
			type: Function,
			default: (item) => item,
		},
		responseResolver: {
			type: Function,
			default: (item) => item,
		},
		requestProviderOptions: {
			type: Object,
			default: () => ({
				showSuccessFeedback: false,
				hideErrorFeedback: true,
			}),
		},
		dependencyPayload: {
			type: Object,
			default: () => ({}),
		},
		keyToId: {
			type: String,
			default: 'id',
		},
		keyToValue: {
			type: String,
			default: 'value',
		},
	},
	components: {
		RequestProvider,
	},

	data() {
		return {
			options: [],
			internalSelected: {},
			providerKey: `provider-${generateKey()}`,
		};
	},

	computed: {
		selectAttrs() {
			const { options, disabled, placeholder, optionsService, ...attrs } = this.$attrs;
			return attrs;
		},

		computedOptions() {
			return this.optionsResolver(this.options);
		},

		computedPlaceholder() {
			return (cb) => cb((this.$attrs.placeholder || 'Selecione uma opção'));
		},

		shouldBeDisabled() {
			return (requestIsLoading) => !this.dependencyPayloadIsSetted || this.disabled || requestIsLoading;
		},

		hasDependencyPayload() {
			return !isEmpty(this.dependencyPayload);
		},

		dependencyPayloadIsSetted() {
			if(!this.hasDependencyPayload) return true;

			const allParamsSetted = reduce(this.dependencyPayload, (acc, curr) => {
				return acc && curr;
			}, true);

			return !!allParamsSetted;
		},

		computedKeyToValue() {
			return this.$attrs.optionsField || this.keyToValue;
		},

		requestPayload() {
			return {
				...this.optionsRequestPayload,
				...this.dependencyPayload,
			};
		},

	},

	watch: {
		dependencyPayload: {
			handler(newValue, oldValue) {
				if(!this.hasDependencyPayload) return;
				if(!isEqual(newValue, oldValue)) {
					this.internalSelected = null;
					if(this.dependencyPayloadIsSetted) {
						this.internalSelected = {};
						this.$refs[this.providerKey].action(this.requestPayload);
					}
					this.$emit('update:modelValue', null);
				}
			},
			deep: true,
		},

		computedOptions(newValue) {
			let selectedOption = {};
			if (this.modelValue instanceof Object) {
				[selectedOption] = newValue.filter((option) => option[this.keyToId] === this.modelValue[this.keyToId]);
			} else {
				[selectedOption] = newValue.filter((option) => option[this.keyToId] === this.modelValue);
			}
			this.internalSelected = selectedOption;
			this.$emit('update:modelValue', selectedOption);
		}
	},

	methods: {
		handleSuccess(data = []) {
			this.options = this.responseResolver(data).map((item) => {
				if(item instanceof Object) {
					return {
						...item,
						[this.computedKeyToValue]: item[this.computedKeyToValue],
						id: item[this.keyToId],
					};
				}
				return {
					[this.keyToId]: item,
					[this.computedKeyToValue]: item,
				};
			});
		},
	},
};
</script>