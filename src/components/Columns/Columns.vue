<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Draggable from 'vuedraggable'
import { useApiClient } from '@/api/api-client'
import { API_BASE_URL } from '@/constants/constants'
import PostItem from '@/components/PostItem/PostItem.vue'
import type { Post } from '@/interfaces/post.intefrace'

const apiBaseUrl = API_BASE_URL
const apiCLient = useApiClient(apiBaseUrl)

const isListOpened = ref<boolean>(true)
const allPosts = ref<Post[]>([])
const loading = ref<boolean>(true)

const handleChangeOrder = () => {
  console.log('e')
}

onMounted(async () => {
  await apiCLient
    .getPosts()
    .then((data) => (allPosts.value = data))
    .finally(() => (loading.value = false))
  console.log(allPosts.value)
})
</script>

<template>
  <section v-if="loading">loading</section>
  <div v-else class="columns">
    <section class="columns__item">
      <Draggable
        v-if="isListOpened"
        :list="allPosts"
        class="columns__posts"
        tag="ul"
        :animation="300"
        :item-key="(item: Post) => item.id"
        ghost-class="columns__posts-ghost"
        @end="handleChangeOrder"
      >
        <template #item="{ element, index }">
          <li :key="index" :style="{ listStyle: 'none' }">
            <PostItem :post="element" />
          </li>
        </template>
      </Draggable>
    </section>
    <!-- <section class="columns__item_size_xl">
      <Draggable
        v-if="isListOpened"
        :list="pickedPosts"
        class="posts"
        tag="ul"
        :animation="300"
        :item-key="(item: Post) => item.id"
        ghost-class="posts__ghost"
        @end="handleChangeOrder"
      >
        <template #item="{ element, index }">
          <li :key="index" :style="{ listStyle: 'none' }">
            <Post :post="element" />
          </li>
        </template>
      </Draggable>
    </section> -->
  </div>
</template>

<style lang="sass" scoped>
.columns
  display: flex
  gap: 10px
  &__item
    width: 25%
    &_size
      &_xl
        width: auto
  &__posts
    display: flex
    flex-direction: column
    gap: 10px
    padding: 0
</style>
