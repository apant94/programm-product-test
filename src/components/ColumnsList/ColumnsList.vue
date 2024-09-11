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
const pickedPosts = ref<Post[]>([])
const loading = ref<boolean>(true)

const handleChangeOrder = () => {
  console.log(pickedPosts.value)
}

onMounted(async () => {
  await apiCLient
    .getPosts()
    .then((data) => (allPosts.value = data))
    .finally(() => (loading.value = false))
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
        group="posts"
        ghost-class="columns__posts-ghost"
        @end="handleChangeOrder"
      >
        <template #item="{ element, index }">
          <li :key="index" class="columns__post">
            <PostItem :post="element" class="columns__post-item" />
          </li>
        </template>
      </Draggable>
    </section>
    <section class="columns__item_size_xl">
      <Draggable
        v-if="isListOpened"
        :list="pickedPosts"
        class="columns__posts_size_xl"
        tag="ul"
        :animation="300"
        group="posts"
        :item-key="(item: Post) => item.id"
        ghost-class="columns__posts-ghost"
        @end="handleChangeOrder"
      >
        <template #item="{ element, index }">
          <li :key="index" class="columns__post">
            <PostItem :post="element" class="columns__post-item" />
          </li>
        </template>
      </Draggable>
    </section>
  </div>
</template>

<style lang="sass" scoped>
.columns
  display: flex
  height: 100%
  &__item
    width: 25%
    padding: 0 20px 0 0
    border-right: 1px solid
    &_size
      &_xl
        width: calc(100% - 25% - 20px)
  &__posts
    display: flex
    flex-direction: column
    gap: 16px
    padding: 0
    &_size
      &_xl
        position: sticky
        top: 20px
        display: flex
        flex-direction: column
        gap: 16px
        padding: 0 0 0 20px
        overflow-y: auto
        max-height: 100vh
        -ms-overflow-style: none
        scrollbar-width: none
        &::-webkit-scrollbar
          display: none
  &__post
    list-style: none
  &__posts-ghost
    display: flex
    padding: 20px
    border-radius: 6px
    border: 2px dashed #3f5efb
    background: transparent
    & .columns__post-item
      display: none
</style>
