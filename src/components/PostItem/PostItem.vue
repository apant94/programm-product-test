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
    <h2>{{ post.title }}</h2>
    <p>{{ post.body }}</p>
  </div>
</template>

<style scoped lang="sass">
.post
  display: flex
  cursor: pointer
  flex-direction: column
  gap: 10px
  padding: 40px 20px
  border: 2px solid
</style>
