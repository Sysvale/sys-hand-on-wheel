<template>
  <VeeField
    v-bind="$attrs"
    v-slot="slotProps"
    :validate-on-change="validateOnChange"
    :validate-on-model-update="validateOnModelUpdate"
    v-on="$listeners"
  >
    <slot
      v-bind="{
        ...slotProps,
        field: {
          ...slotProps.field,
          errorMessage: slotProps.errors[0],
          state: slotProps.errors[0] ? 'invalid' : 'default',
					modelValue: slotProps.field.value,
        }
      }"
    />
  </VeeField>
</template>

<script setup>
import { Field as VeeField } from 'vee-validate';

const props = defineProps({
  validateOnChange: { type: Boolean, default: true },
  validateOnModelUpdate: { type: Boolean, default: true },
});
</script>