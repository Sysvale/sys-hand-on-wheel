<template>
	<VeeField
		v-bind="$attrs"
		v-slot="{ field, errors }"
		:validate-on-change="validateOnChange"
		:validate-on-model-update="validateOnModelUpdate"
		v-on="$listeners"
	>
		<slot
			:field="computedField(field, errors)"
			:errors="errors"
		/>
	</VeeField>
</template>
	
<script setup>
import { Field as VeeField } from 'vee-validate';

const props = defineProps({
	validateOnChange: {
		type: Boolean,
		default: true
	},
	validateOnModelUpdate: {
		type: Boolean,
		default: true
	},
	omitModelValue: {
		type: Boolean,
		default: false
	}
});

const computedField = (field, errors) => {
	let defaultField = {
		...field,
		errorMessage: errors[0],
		state: errors[0] ? 'invalid' : 'default'
	};
	
	if(!props.omitModelValue) {
		defaultField.modelValue = field.value;
	}

	return defaultField;
}
</script>