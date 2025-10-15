<template>
	<VeeForm
		v-bind="$attrs"
		ref="veeFormInstance"
	>
		<slot />
	</VeeForm>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { watchSkipFirst } from '@/composables/watchSkipFirst';
const veeFormInstance = ref(null);
import { Form as VeeForm } from 'vee-validate';

const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['update:modelValue']);

watchSkipFirst(() => props.modelValue, (newValue) => {
	if(!veeFormInstance.value) return;
	veeFormInstance.value.setValues(newValue);
}, { deep: true });

watch(()=> veeFormInstance.value?.values, (newValue) => 
{
	emit('update:modelValue', newValue);
}, { deep: true });

onMounted(() => {
	if(!veeFormInstance.value) return;
	veeFormInstance.value.setValues(props.modelValue, false);
});

defineExpose({
	validate: (...args) => veeFormInstance.value.validate(...args),
	setValues: (...args) => veeFormInstance.value.setValues(...args),
	resetField: (...args) => veeFormInstance.value.resetField(...args),
	setFieldValue: (...args) => veeFormInstance.value.setFieldValue(...args),
	resetForm: (...args) => veeFormInstance.value.resetForm(...args),
	setFieldError: (...args) => veeFormInstance.value.setFieldError(...args),
	getValues: () => veeFormInstance.value.values,
	getInstance: () => veeFormInstance.value,
});
</script>
