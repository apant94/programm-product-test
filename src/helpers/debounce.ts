function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeoutID: ReturnType<typeof setTimeout> | null = null

  const debouncedFunction = function (...args: any[]) {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      fn(...args)
    }, delay)
  }
  debouncedFunction.cancel = () => {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
  }
  return debouncedFunction
}

export { debounce }
