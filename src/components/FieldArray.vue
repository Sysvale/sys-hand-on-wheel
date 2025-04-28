<template>
	<VeeFieldArray
    v-bind="$attrs"
    v-slot="{ fields, push, remove }"
  >
	  <slot
      :fields="fields"
      :push="push"
      :remove="remove"
    />
</VeeFieldArray>
</template>

<script setup>
import { FieldArray as VeeFieldArray } from 'vee-validate';
</script>