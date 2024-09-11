import axios from 'axios'

export const useApiClient = (baseURL: string) => {
  const getPosts = async () => {
    try {
      const response = await axios.get(baseURL + '/posts')
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const getFilteredPosts = async (title: string) => {
    try {
      const response = await axios.get(baseURL + '/posts', {
        params: {
          title_like: title
        }
      })
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  return {
    getPosts,
    getFilteredPosts
  }
}
