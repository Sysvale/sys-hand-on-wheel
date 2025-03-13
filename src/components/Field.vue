<template>
	<VeeField
    v-bind="$attrs"
    v-slot="{ field, errors }"
    :validate-on-change="validateOnChange"
    :validate-on-model-update="validateOnModelUpdate"
  >
	  <slot
      :field="{
        ...field,
        modelValue: field.value,
        errorMessage: errors[0],
        state: errors[0] ? 'invalid' : 'default'
      }"
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
    }
  });
  </script>