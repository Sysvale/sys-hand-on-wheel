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
});

const isDisabled = computed(() => disabledFeatures.includes(feature));
</script>
