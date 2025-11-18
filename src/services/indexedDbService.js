
const DB_NAME = 'BotUI_Memories';
const MEMORY_STORE_NAME = 'memories';
const DB_VERSION = 1;

class IndexedDBService {
  constructor() {
    this.db = null;
    this.initPromise = this.initDB();
  }

  /**
   * Khởi tạo IndexedDB
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Tạo object store nếu chưa tồn tại
        if (!db.objectStoreNames.contains(MEMORY_STORE_NAME)) {
          const store = db.createObjectStore(MEMORY_STORE_NAME, { keyPath: 'id', autoIncrement: true });
          // Tạo index cho ngày sự kiện (để sort)
          store.createIndex('eventDate', 'eventDate', { unique: false });
          // Tạo index cho ngày tạo (để sort)
          store.createIndex('createdAt', 'createdAt', { unique: false });
          // Tạo index cho tiêu đề (để search)
          store.createIndex('title', 'title', { unique: false });
        }
      };
    });
  }

  /**
   * Đảm bảo DB đã khởi tạo
   */
  async ensureDB() {
    if (!this.db) {
      await this.initPromise;
    }
  }

  /**
   * Lưu kỷ niệm
   * @param {Object} memoryData - { title, text, eventDate, imageBase64 }
   * @returns {Promise<Object>} Memory object với id
   */
  async saveMemory(memoryData) {
    await this.ensureDB();
    
    const memory = {...memoryData}

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MEMORY_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(MEMORY_STORE_NAME);
      const request = store.add(memory);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(memory);
    });
  }

  /**
   * Lấy kỷ niệm theo ID
   * @param {number|string} id - Memory ID
   * @returns {Promise<Object|null>}
   */
  async getMemoryById(id) {
    await this.ensureDB();

    // Convert id thành number để match keyPath
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MEMORY_STORE_NAME], 'readonly');
      const store = transaction.objectStore(MEMORY_STORE_NAME);
      const request = store.get(numId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * Xóa kỷ niệm
   * @param {number|string} id - Memory ID
   * @returns {Promise<void>}
   */
  async deleteMemory(id) {
    await this.ensureDB();

    // Convert id thành number để match keyPath
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MEMORY_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(MEMORY_STORE_NAME);
      const request = store.delete(numId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const indexedDBService = new IndexedDBService();
