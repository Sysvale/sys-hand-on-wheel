<template>
	<component
		:is="computedComponent"
	>
		<slot
			v-if="!isDisabled && mode !== 'hide'"
			:disabled="isDisabled && mode === 'disable'
		">
		</slot>
	</component
		
	>
</template>

<script setup>
import { computed, inject } from 'vue';

const disabledFeatures = inject('disabledFeatures');

const { feature, mode, blockMessage } = defineProps({
	feature: {
		type: String,
		required: true,
	},
	mode: {
		type: String,
		default: 'hide',
		validator: (value) => ['hide', 'disable', 'overlay'].includes(value),
	},
	blockMessage: {
		type: String,
		default: 'Essa funcionalidade está desabilitada.',
	},
});

const isDisabled = computed(() => disabledFeatures.includes(feature));
const computedComponent = computed(() => {
	if (!isDisabled.value) {
		return 'template';
	}

	switch (mode) {
		case 'hide':
			return 'template';
		case 'overlay':
			return 'cds-overlay';
		default:
			return 'template';
	}
});
</script>

<style lang="scss" scoped>
/* Your component styles go here */
</style>
