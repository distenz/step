export const LocalStorage: Storage = {
  length: window.localStorage.length,
  clear(): void {
    window.localStorage.clear()
  },
  key(index: number): string | null {
    return window.localStorage.key(index)
  },
  getItem(key: string): string | null {
    return window.localStorage.key(+key)
  },
  setItem(key: string, value: string): void {
    this._storage.setItem(key, value)
  },
  removeItem(key: string): void {
    this._storage.removeItem(key)
  },
}
