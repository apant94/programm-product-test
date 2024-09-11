<script setup lang="ts">
const props = defineProps({
  pages: {
    type: Number,
    required: true
  },
  selectedPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['change'])
</script>

<template>
  <ul class="pagination">
    <li
      v-for="(page, i) in pages"
      :key="page"
      class="pagination__item"
      @click="emit('change', i)"
      :class="{ pagination__item_active: i === selectedPage }"
    >
      {{ page }}
    </li>
  </ul>
</template>

<style scoped lang="sass">
.pagination
  display: flex
  flex-direction: column
  padding: 0
  &__item
    list-style: none
    cursor: pointer
    &_active
      color: red
</style>
