/**
 * Cache Service - Quản lý cache trong localStorage
 */

export class CacheService {
  /**
   * Lấy dữ liệu từ cache
   */
  static getCacheData(apiUrl) {
    try {
      const url = new URL(apiUrl);
      const cacheKey = `botui_cache_${url.search}`;
      const data = localStorage.getItem(cacheKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Lỗi khi đọc cache:', error);
      return null;
    }
  }

  /**
   * Lưu dữ liệu vào cache
   */
  static setCacheData(apiUrl, data) {
    try {
      const url = new URL(apiUrl);
      const cacheKey = `botui_cache_${url.search}`;
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error('Lỗi khi ghi cache:', error);
    }
  }

  /**
   * Clear cache với pattern
   */
  static clearCache(pattern = 'botui_cache_') {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Lỗi khi xóa cache:', error);
    }
  }
}
