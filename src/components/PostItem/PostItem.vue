<script setup lang="ts">
import type { PropType } from 'vue'
import type { Post } from '@/interfaces/post.intefrace'

const props = defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true
  }
})
</script>

<template>
  <div class="post">
    <h2 class="post__title">{{ post.title }}</h2>
    <p class="post__text">{{ post.body }}</p>
  </div>
</template>

<style scoped lang="sass">
.post
	display: flex
	cursor: pointer
	flex-direction: column
	gap: 10px
	padding: 20px
	border: 1px solid
	border-radius: 6px
	background-image: linear-gradient(to bottom right, #181818, #283048)
	transition: all .2s linear
	&:hover
		transform: scale(0.97)
	&__title
		overflow: hidden
		text-overflow: ellipsis
		display: -moz-box
		-moz-box-orient: vertical
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		line-clamp: 2
		box-orient: vertical
	&__text
		overflow: hidden
		text-overflow: ellipsis
		display: -moz-box
		-moz-box-orient: vertical
		display: -webkit-box
		-webkit-line-clamp: 3
		-webkit-box-orient: vertical
		line-clamp: 3
		box-orient: vertical
</style>
