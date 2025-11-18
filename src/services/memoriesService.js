/**
 * Memories Service
 * Quản lý lưu trữ kỷ niệm trong IndexedDB
 * - Lưu trữ kỷ niệm với hình ảnh base64
 * - CRUD operations
 * - Tìm kiếm và sắp xếp
 */

const DB_NAME = 'BotUI_Memories';
const STORE_NAME = 'memories';
const DB_VERSION = 1;

class MemoriesService {
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
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
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
   * Tạo kỷ niệm mới
   * @param {Object} memoryData - { title, text, eventDate, imageBase64 }
   * @returns {Promise<Object>} Memory object với id
   */
  async createMemory(memoryData) {
    await this.ensureDB();
    
    const memory = {
      ...memoryData,
      id: Date.now(), // Dùng timestamp làm ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(memory);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(memory);
    });
  }

  /**
   * Cập nhật kỷ niệm
   * @param {number} id - Memory ID
   * @param {Object} updates - Dữ liệu cần update
   * @returns {Promise<Object>} Updated memory object
   */
  async updateMemory(id, updates) {
    await this.ensureDB();

    const memory = await this.getMemoryById(id);
    if (!memory) {
      throw new Error(`Memory with id ${id} not found`);
    }

    const updated = {
      ...memory,
      ...updates,
      id: memory.id,
      createdAt: memory.createdAt,
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(updated);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(updated);
    });
  }

  /**
   * Lấy kỷ niệm theo ID
   * @param {number} id - Memory ID
   * @returns {Promise<Object|null>}
   */
  async getMemoryById(id) {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * Xóa kỷ niệm
   * @param {number} id - Memory ID
   * @returns {Promise<void>}
   */
  async deleteMemory(id) {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Lấy tất cả kỷ niệm, sắp xếp theo ngày sự kiện giảm dần
   * @returns {Promise<Array>}
   */
  async getAllMemories() {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('eventDate');
      const request = index.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const memories = request.result || [];
        // Sắp xếp giảm dần theo ngày sự kiện (event date)
        memories.sort((a, b) => {
          const dateA = new Date(a.eventDate).getTime();
          const dateB = new Date(b.eventDate).getTime();
          return dateB - dateA;
        });
        resolve(memories);
      };
    });
  }

  /**
   * Tìm kiếm kỷ niệm theo tiêu đề (case-insensitive)
   * @param {string} query - Từ khóa tìm kiếm
   * @returns {Promise<Array>}
   */
  async searchMemories(query) {
    const memories = await this.getAllMemories();
    
    if (!query.trim()) {
      return memories;
    }

    const lowerQuery = query.toLowerCase();
    return memories.filter(memory => 
      memory.title.toLowerCase().includes(lowerQuery) ||
      memory.text.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Tính toán khoảng cách thời gian (năm, tháng, ngày)
   * Dùng cho các sự kiện quá khứ
   * @param {string} eventDate - Ngày sự kiện (YYYY-MM-DD)
   * @returns {Object} { label, dateFormatted, isPast }
   */
  calculateDaysRemaining(eventDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = eventDate.split('-').map(Number);
    const eventDateObj = new Date(year, month - 1, day);
    eventDateObj.setHours(0, 0, 0, 0);

    // Định dạng ngày dd/mm/yyyy
    const dateFormatted = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    // Nếu sự kiện là quá khứ (eventDate cũ hơn hôm nay)
    if (eventDateObj < today) {
      // Sự kiện quá khứ - tính khoảng cách năm, tháng, ngày từ eventDateObj đến today
      let startDate = eventDateObj;
      let years = 0, months = 0, days = 0;

      // Tính năm
      years = today.getFullYear() - startDate.getFullYear();
      
      // Tạo date tạm thời để tính tháng
      let tempDate = new Date(startDate.getFullYear() + years, startDate.getMonth(), startDate.getDate());
      
      // Nếu chưa đủ năm đủ thì giảm năm đi
      if (tempDate > today) {
        years--;
        tempDate = new Date(startDate.getFullYear() + years, startDate.getMonth(), startDate.getDate());
      }

      // Tính tháng
      months = today.getMonth() - tempDate.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }

      // Cập nhật tempDate với tháng
      tempDate = new Date(tempDate.getFullYear() + (months > 0 ? 0 : 0), tempDate.getMonth() + months, startDate.getDate());

      // Tính ngày
      days = today.getDate() - tempDate.getDate();
      if (days < 0) {
        months--;
        if (months < 0) {
          years--;
          months += 12;
        }
        // Lấy số ngày của tháng trước
        const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonthDate.getDate();
      }

      // Tạo label
      const parts = [];
      if (years > 0) parts.push(`${years} năm`);
      if (months > 0) parts.push(`${months} tháng`);
      if (days > 0) parts.push(`${days} ngày`);

      const label = parts.length > 0 ? `Đã qua ${parts.join(' ')}` : 'Hôm nay';

      return { label, dateFormatted, isPast: true };
    }

    // Nếu sự kiện là tương lai - tính ngày còn lại
    const diffTime = eventDateObj - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { label: 'Hôm nay', dateFormatted, isPast: false };
    } else if (diffDays === 1) {
      return { label: 'Ngày mai', dateFormatted, isPast: false };
    } else {
      return { label: `Cách ${diffDays} ngày`, dateFormatted, isPast: false };
    }
  }

  /**
   * Chuyển đổi file thành base64
   * @param {File} file - File object
   * @returns {Promise<string>}
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Xóa tất cả kỷ niệm (dùng cho testing/reset)
   * @returns {Promise<void>}
   */
  async clearAllMemories() {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const memoriesService = new MemoriesService();
