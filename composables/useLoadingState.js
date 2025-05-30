// composables/useLoadingState.js
export const useLoadingState = () => {
  const createLoadingState = (initialValue = false) => {
    const isLoading = ref(initialValue)
    
    const withLoading = async (asyncFn) => {
      isLoading.value = true
      try {
        const result = await asyncFn()
        return result
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLoading,
      withLoading
    }
  }

  return {
    createLoadingState
  }
}