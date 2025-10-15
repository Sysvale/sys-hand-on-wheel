<template>
	<VeeFieldArray
    v-bind="$attrs"
    v-slot="{ fields, push, remove, ...context }"
    v-on="$listeners"
  >
	  <slot
      :fields="fields"
      :push="push"
      :remove="remove"
      v-bind="context"

    />
</VeeFieldArray>
</template>

<script setup>
import { FieldArray as VeeFieldArray } from 'vee-validate';
</script>