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
      <button class="pagination__btn"></button>
    </li>
  </ul>
</template>

<style scoped lang="sass">
.pagination
	display: flex
	padding: 0
	gap: 6px
	flex-wrap: wrap
	&__item
		list-style: none
		cursor: pointer
		width: 10px
		height: 10px
		border-radius: 5px
		background: grey
		transition: width .3s ease-in-out
		&:hover
			background: orange
			width: 15px
		&_active
			background: #3f5efb
			width: 38px
	&__btn
		display: inline-block
		visibility: hidden
</style>
