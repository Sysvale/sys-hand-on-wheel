<template>
  <VeeForm
    v-bind="$attrs"
    ref="veeFormInstance"
  >
    <slot />
  </VeeForm>
</template>

<script setup>
import { ref } from 'vue';
const veeFormInstance = ref(null);
import { Form as VeeForm } from 'vee-validate';

defineExpose({
  validate: () => veeFormInstance.value.validate(),
  setValues: (values) => veeFormInstance.value.setValues(values),
  resetField: (field) => veeFormInstance.value.resetField(field),
  setFieldValue: (field, value) => veeFormInstance.value.setFieldValue(field, value),
  resetForm: () => veeFormInstance.value.resetForm(),
  setFieldError: (field, error) => veeFormInstance.value.setFieldError(field, error),
  getValues: () => veeFormInstance.value.values,
  getInstance: () => veeFormInstance.value,
});
</script>