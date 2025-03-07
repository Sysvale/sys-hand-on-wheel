<template>
	<template
		v-if="mode !== 'hide'"
	>
		<slot
			:disabled="isDisabled && mode === 'disable'"
		>
		</slot>
	</template>
</template>
<script>
export default {
	inject: ['disabledFeatures'],

	props: {
		feature: {
			type: String,
			required: true,
		},
		mode: {
			type: String,
			default: 'hide',
			validator: (value) => ['hide', 'disable'].includes(value),
		},
		blockMessage: {
			type: String,
			default: 'Essa funcionalidade está desabilitada.',
		},
	},

	computed: {
		isDisabled() {
			return this.disabledFeatures.includes(this.feature);
		},
	},
};
</script>
