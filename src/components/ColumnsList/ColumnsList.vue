<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import Draggable from 'vuedraggable'
import { useApiClient } from '@/api/api-client'
import { API_BASE_URL } from '@/constants/constants'
import { debounce } from '@/helpers'
import PostItem from '@/components/PostItem/PostItem.vue'
import Search from '@/components/Search/Search.vue'
import Loader from '@/components/Loader/Loader.vue'
import Pagination from '../Pagination/Pagination.vue'
import type { Post } from '@/interfaces/post.intefrace'

const apiBaseUrl = API_BASE_URL
const apiCLient = useApiClient(apiBaseUrl)

const allPosts = ref<Post[]>([])
const filteredPosts = ref<Post[]>([])
const pickedPosts = ref<Post[]>([])
const paginatedPosts = ref<Post[]>([])
const loading = ref<boolean>(true)
const loadingFilter = ref<boolean>(false)
const searchInput = ref<string>('')
const selectedPage = ref<number>(0)
const pagesTotal = computed<number>(() => {
  return Math.ceil(filteredPosts.value.length / 10)
})

const paginatePosts = () => {
  const start = selectedPage.value * 10
  const end = selectedPage.value * 10 + 10
  paginatedPosts.value = filteredPosts.value.slice(start, end)
}

const handleChangeFiltered = (evt) => {
  if (evt.removed) {
    filteredPosts.value.splice(selectedPage.value * 10 + evt.removed.oldIndex, 1)
  }
  if (evt.added) {
    filteredPosts.value.splice(selectedPage.value * 10 + evt.added.newIndex, 0, evt.added.element)
  }
  if (evt.moved) {
    filteredPosts.value.splice(selectedPage.value * 10 + evt.moved.oldIndex, 1)
    filteredPosts.value.splice(selectedPage.value * 10 + evt.moved.newIndex, 0, evt.moved.element)
  }
  paginatePosts()
}

const handleChangeOrder = () => {
  // TODO send to LocalStorage
  console.log(filteredPosts.value.length)
}

const loadAllPosts = async () => {
  await apiCLient
    .getPosts()
    .then((data) => {
      allPosts.value = data
      filteredPosts.value = data
      paginatedPosts.value = filteredPosts.value.slice(0, 10)
    })
    .finally(() => (loading.value = false))
}

const deletePickerPosts = (posts: Post[]) => {
  const result: Post[] = posts.filter(
    (ar) => !pickedPosts.value.find((rm) => rm.id === ar.id && ar.userId === rm.userId)
  )
  return result
}

const loadPostsByQuery = async (query: string) => {
  await apiCLient
    .getFilteredPosts(query)
    .then((data) => {
      filteredPosts.value = deletePickerPosts(data)
      paginatedPosts.value = filteredPosts.value.slice(0, 10)
      selectedPage.value = 0
    })
    .finally(() => (loadingFilter.value = false))
}

const debouncedLoadPostsByQuery = debounce((query) => {
  loadPostsByQuery(query)
}, 900)

watch(searchInput, (newValue) => {
  loadingFilter.value = true
  debouncedLoadPostsByQuery(newValue)
})

watch(selectedPage, (newPage) => {
  paginatePosts()
})

watch(pagesTotal, (newTotal) => {
  if (selectedPage.value >= newTotal) {
    selectedPage.value = selectedPage.value - 1
  }
})

onMounted(() => {
  loadAllPosts()
})
</script>

<template>
  <div v-if="!loading" class="columns">
    <section class="columns__item">
      <Search v-model="searchInput" :loading="loadingFilter" />
      <Pagination
        v-if="pagesTotal > 1"
        :pages="pagesTotal"
        :selected-page="selectedPage"
        class="columns__pagination"
        @change="(number) => (selectedPage = number)"
      />
      <p v-if="filteredPosts.length === 0" class="columns__warning">
        Oops! Таких постов нет. Введите другой запрос в поиске.
      </p>
      <Draggable
        v-if="filteredPosts.length > 0"
        :list="paginatedPosts"
        class="columns__posts"
        tag="ul"
        :animation="300"
        :item-key="(item: Post) => item.id"
        group="posts"
        ghost-class="columns__posts-ghost"
        @change="handleChangeFiltered"
      >
        <template #item="{ element, index }">
          <li :key="index" class="columns__post">
            <PostItem :post="element" class="columns__post-item" />
          </li>
        </template>
      </Draggable>
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
        @change="handleChangeOrder"
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
    position: relative
    display: flex
    flex-direction: column
    align-items: center
    gap: 16px
    width: 25%
    padding: 0 20px 0 0
    border-right: 1px solid
    &_size
      &_xl
        width: 75%
  &__pagination
    // position: absolute
    // top: 0
    // transform: translateX(-100%)
    // left: -20px
  &__posts
    display: flex
    flex-direction: column
    gap: 16px
    padding: 0
    &_size
      &_xl
        position: sticky
        top: 90px
        display: flex
        flex-direction: column
        gap: 16px
        padding: 0 0 0 20px
        overflow-y: auto
        max-height: calc(100vh - 90px)
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
    top: 90px
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
