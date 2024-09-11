<script setup lang="ts">
import { computed } from 'vue'
import Loader from '@/components/Loader/Loader.vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean
  }
})

const innerSearch = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <label class="search">
    <input
      v-model="innerSearch"
      name="search"
      id="search-input"
      placeholder="Найти..."
      class="search__input"
    />
    <Loader v-if="loading" class="search__loader" :width="20" :height="20" />
  </label>
</template>

<style scoped lang="sass">
.search
  position: relative
  &__input
    width: 100%
    padding: 10px 40px 10px 10px
    background-color: transparent
    border: 1px solid #3f5efb
    border-radius: 6px
    color: rgba(235, 235, 235, 0.64)
    &:focus-visible
      outline: none
  &__loader
    position: absolute
    top: calc(50% - 10px)
    right: 10px
</style>
