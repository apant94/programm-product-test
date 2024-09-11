<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Draggable from 'vuedraggable'
import { useApiClient } from '@/api/api-client'
import { API_BASE_URL } from '@/constants/constants'
import { debounce } from '@/helpers'
import PostItem from '@/components/PostItem/PostItem.vue'
import Search from '@/components/Search/Search.vue'
import Loader from '@/components/Loader/Loader.vue'
import type { Post } from '@/interfaces/post.intefrace'

const apiBaseUrl = API_BASE_URL
const apiCLient = useApiClient(apiBaseUrl)

const allPosts = ref<Post[]>([])
const filteredPosts = ref<Post[]>([])
const pickedPosts = ref<Post[]>([])
const loading = ref<boolean>(true)
const loadingFilter = ref<boolean>(false)
const searchInput = ref<string>('')

const handleChangeOrder = () => {
  console.log(pickedPosts.value)
}

const loadAllPosts = async () => {
  await apiCLient
    .getPosts()
    .then((data) => {
      allPosts.value = data
      filteredPosts.value = data
    })
    .finally(() => (loading.value = false))
}

const loadPostsByQuery = async (query: string) => {
  await apiCLient
    .getFilteredPosts(query)
    .then((data) => (filteredPosts.value = data))
    .finally(() => (loadingFilter.value = false))
}

const debouncedLoadPostsByQuery = debounce((query) => {
  loadPostsByQuery(query)
}, 900)

watch(searchInput, (newValue) => {
  loadingFilter.value = true
  debouncedLoadPostsByQuery(newValue)
})

onMounted(() => {
  loadAllPosts()
})
</script>

<template>
  <div v-if="!loading" class="columns">
    <section class="columns__item">
      <Search v-model="searchInput" :loading="loadingFilter" />
      <Draggable
        v-if="filteredPosts.length > 0"
        :list="filteredPosts"
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
      <div v-if="filteredPosts.length === 0" class="columns__warning">
        Oops! Таких постов нет. Введите другой запрос в поиске.
      </div>
    </section>
    <section class="columns__item_size_xl">
      <p v-if="pickedPosts.length === 0" class="columns__action">Перенесите пост сюда</p>
      <Draggable
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
  <section v-else class="columns__loader"><Loader /></section>
</template>

<style lang="sass" scoped>
.columns
  display: flex
  height: 100%
  width: 100%
  &__item
    display: flex
    flex-direction: column
    gap: 16px
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
        top: 103px
        display: flex
        flex-direction: column
        gap: 16px
        padding: 0 0 0 20px
        overflow-y: auto
        max-height: calc(100vh - 103px)
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
  &__warning
    font-size: 20px
    @media screen and (max-width: 768px)
      font-size: 12px
  &__action
    position: sticky
    top: 103px
    display: flex
    justify-content: center
    font-size: 20px
    @media screen and (max-width: 768px)
      font-size: 12px
  &__loader
    width: 100%
    display: flex
    align-items: center
    justify-content: center
    height: calc(100vh - 80px)
</style>
