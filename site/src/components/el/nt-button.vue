<script lang="ts" setup>
const { primary, danger, submit } = defineProps({
  primary: Boolean,
  submit: Boolean,
  danger: Boolean,
});
defineEmits(['click']);
</script>
<template>
  <button
    class="p-3 uppercase text-white rounded-md text-lg"
    :class="{
      'bg-opacity-70 backdrop-opacity-80 bg-gray-900 hover:bg-sky-300 hover:bg-opacity-10':
        primary,
      'bg-opacity-60 backdrop-opacity-80 bg-red-500 hover:bg-red-600': danger,
      'hover:bg-sky-300 hover:bg-opacity-10': !(primary || danger),
    }"
    @click="$emit('click', $event)"
    :type="submit ? 'submit' : 'button'"
  >
    <slot></slot>
  </button>
</template>
