/**
 * Safe local storage abstraction for demo tenant preferences & offline persistence.
 * Note: In a production multi-tenant enterprise system, these settings are fetched
 * and authenticated by a tenant-isolated backend.
 */

const STORAGE_PREFIX = 'peoplehub_'

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch (e) {
      console.warn(`[storage] Error reading key ${key}:`, e)
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
    } catch (e) {
      console.warn(`[storage] Error writing key ${key}:`, e)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
    } catch (e) {
      console.warn(`[storage] Error removing key ${key}:`, e)
    }
  },

  clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k))
    } catch (e) {
      console.warn('[storage] Error clearing keys:', e)
    }
  },
}
