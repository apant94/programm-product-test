<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import Draggable from 'vuedraggable'
import { useApiClient } from '@/api/api-client'
import { API_BASE_URL } from '@/constants/constants'
import { debounce, getLocalStorage, setLocalStorage, deleteStorage } from '@/helpers'
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
const loading = ref<boolean>(false)
const loadingFilter = ref<boolean>(false)
const searchInput = ref<string>(
  getLocalStorage('programm_search_query') ? getLocalStorage('programm_search_query') : ''
)
const selectedPage = ref<number>(0)
const pagesTotal = computed<number>(() => {
  return Math.ceil(filteredPosts.value.length / 10)
})

const paginatePosts = () => {
  if (selectedPage.value < 0) selectedPage.value = 0
  const start = selectedPage.value * 10
  const end = selectedPage.value * 10 + 10
  paginatedPosts.value = filteredPosts.value.slice(start, end)
  setLocalStorage('programm_paginated_posts', paginatedPosts.value)
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
  setLocalStorage('programm_filtered_posts', filteredPosts.value)
  paginatePosts()
}

const handleChangeOrder = () => {
  setLocalStorage('programm_picked_posts', pickedPosts.value)
}

const loadAllPosts = async () => {
  const storagedAllPosts = getLocalStorage('programm_all_posts')
  const storagedFilteredPosts = getLocalStorage('programm_filtered_posts')
  const storagedPaginatedPosts = getLocalStorage('programm_paginated_posts')
  const storagedSelectedPage = getLocalStorage('programm_selected_page')
  const storagedPickesPosts = getLocalStorage('programm_picked_posts')

  if (storagedAllPosts && storagedFilteredPosts && storagedPaginatedPosts) {
    allPosts.value = storagedAllPosts
    filteredPosts.value = storagedFilteredPosts
    paginatedPosts.value = storagedPaginatedPosts
    selectedPage.value = storagedSelectedPage
    pickedPosts.value = storagedPickesPosts || []
  } else {
    loading.value = true
    await apiCLient
      .getPosts()
      .then((data) => {
        allPosts.value = data
        filteredPosts.value = data
        paginatedPosts.value = filteredPosts.value.slice(0, 10)
      })
      .then(() => {
        setLocalStorage('programm_all_posts', allPosts.value)
        setLocalStorage('programm_filtered_posts', filteredPosts.value)
        setLocalStorage('programm_paginated_posts', paginatedPosts.value)
        setLocalStorage('programm_selected_page', selectedPage.value)
      })
      .finally(() => (loading.value = false))
  }
}

const deletePickerPosts = (posts: Post[]) => {
  const result: Post[] =
    pickedPosts.value.length > 0
      ? posts.filter(
          (ar) => !pickedPosts.value.find((rm) => rm.id === ar.id && ar.userId === rm.userId)
        )
      : posts
  return result
}

const loadPostsByQuery = async (query: string) => {
  const setCurrentPosts = (data: Post[]) => {
    filteredPosts.value = deletePickerPosts(data)
    paginatedPosts.value = filteredPosts.value.slice(0, 10)
    selectedPage.value = 0
    setLocalStorage('programm_filtered_posts', filteredPosts.value)
    setLocalStorage('programm_paginated_posts', paginatedPosts.value)
    setLocalStorage('programm_selected_page', selectedPage.value)
  }
  if (query !== '') {
    await apiCLient
      .getFilteredPosts(query)
      .then((data) => {
        setCurrentPosts(data)
      })
      .finally(() => (loadingFilter.value = false))
  } else {
    loadingFilter.value = false
    setCurrentPosts(allPosts.value)
  }
}

const debouncedLoadPostsByQuery = debounce((query) => {
  loadPostsByQuery(query)
}, 900)

watch(searchInput, (newValue) => {
  loadingFilter.value = true
  if (newValue) {
    setLocalStorage('programm_search_query', newValue)
  } else {
    deleteStorage('programm_search_query')
  }
  debouncedLoadPostsByQuery(newValue)
})

watch(selectedPage, (newPage) => {
  setLocalStorage('programm_selected_page', selectedPage.value)
  paginatePosts()
})

watch(pagesTotal, (newTotal) => {
  if (selectedPage.value >= newTotal) {
    selectedPage.value = selectedPage.value - 1
    setLocalStorage('programm_selected_page', selectedPage.value)
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
      <p v-if="filteredPosts.length === 0" class="columns__warning">
        Oops! Таких постов нет. Введите другой запрос в поиске.
      </p>
      <Draggable
        :list="paginatedPosts"
        class="columns__posts"
        :class="{ columns__posts_empty: filteredPosts.length === 0 }"
        tag="ul"
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
      <Pagination
        v-if="pagesTotal > 1"
        :pages="pagesTotal"
        :selected-page="selectedPage"
        @change="(number) => (selectedPage = number)"
      />
    </section>
    <section class="columns__item_size_xl">
      <p v-if="pickedPosts.length === 0" class="columns__action">Перенесите пост сюда</p>
      <Draggable
        :list="pickedPosts"
        class="columns__posts_size_xl"
        tag="ul"
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
    @media screen and (max-width: 768px)
      width: 50%
      padding: 0 10px 0 0
    &_size
      &_xl
        width: 75%
        @media screen and (max-width: 768px)
          width: 50%
  &__posts
    display: flex
    flex-direction: column
    gap: 16px
    padding: 0
    min-height: 80dvh
    @media screen and (max-width: 768px)
      min-height: calc(100dvh - 110px)
    &_empty
      width: 100%
      min-height: 60dvh
    &_size
      &_xl
        min-height: 80dvh
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
        @media screen and (max-width: 768px)
          padding: 0 0 0 10px
          top: 110px
          min-height: calc(100dvh - 110px)
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
