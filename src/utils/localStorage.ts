
// Utility functions for local storage operations

/**
 * Get data from local storage
 * @param key The key to retrieve data for
 * @param defaultValue Default value if key doesn't exist
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Save data to local storage
 * @param key The key to save data under
 * @param value The value to save
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}
