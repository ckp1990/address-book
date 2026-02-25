// Adapter to switch between Electron File Storage and LocalStorage

export const StorageAdapter = {
  /**
   * Check if running in Electron.
   */
  isElectron: () => typeof window !== 'undefined' && !!window.electronAPI,

  /**
   * Load data from storage.
   * @param {string} key - The key for localStorage (ignored in Electron if using single file, but good for future)
   * @returns {Promise<any>} - The data (parsed object/array) or empty array if not found.
   */
  async load(key) {
    if (this.isElectron()) {
      try {
        // In Electron, we currently support one file 'contacts.json'.
        // We could extend this to support multiple keys if needed.
        const result = await window.electronAPI.loadData();
        return result || [];
      } catch (error) {
        console.error("Electron load error:", error);
        return [];
      }
    } else {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
      } catch (error) {
        console.error("LocalStorage load error:", error);
        return [];
      }
    }
  },

  /**
   * Save data to storage.
   * @param {string} key - The key for localStorage.
   * @param {any} data - The data to save.
   */
  async save(key, data) {
    if (this.isElectron()) {
      try {
        await window.electronAPI.saveData(data);
        return true;
      } catch (error) {
        console.error("Electron save error:", error);
        return false;
      }
    } else {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error("LocalStorage save error:", error);
        return false;
      }
    }
  }
};
