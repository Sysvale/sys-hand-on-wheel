<template>
	<VeeFieldArray
    v-bind="$attrs"
    v-slot="slotProps"
    v-on="$listeners"
  >
	  <slot
      v-bind="slotProps"
    />
</VeeFieldArray>
</template>

<script setup>
import { FieldArray as VeeFieldArray } from 'vee-validate';
</script>