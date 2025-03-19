<template>
  <VeeForm v-bind="$attrs">
    <slot />
  </VeeForm>
</template>

<script setup>
import { Form as VeeForm } from 'vee-validate';
</script>