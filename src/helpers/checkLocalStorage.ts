function getLocalStorage(name: string) {
  return window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : null
}

function setLocalStorage(name: string, data: any) {
  window.localStorage.setItem(name, JSON.stringify(data))
}

function deleteStorage(name: string) {
  window.localStorage.removeItem(name)
}

export { getLocalStorage, setLocalStorage, deleteStorage }
