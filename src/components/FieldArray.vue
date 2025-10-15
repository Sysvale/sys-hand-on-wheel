<template>
	<VeeFieldArray
    v-bind="$attrs"
    v-slot="{ fields, push, remove, ...fieldArray }"
    v-on="$listeners"
  >
	  <slot
      :fields="fields"
      :push="push"
      :remove="remove"
      v-bind="fieldArray"
    />
</VeeFieldArray>
</template>

<script setup>
import { FieldArray as VeeFieldArray } from 'vee-validate';
</script>