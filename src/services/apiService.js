/**
 * API Service - Xử lý tất cả các API calls
 */

export class APIService {

    memoryAllowedKeys = ['id', 'title', 'text', 'eventDate', 'imageBase64', 'isDeleted', 'createdAt', 'updatedAt'];

    constructor(apiId) {
        this.apiId = apiId;
    }

    /**
     * Lấy danh sách nhắc nhở
     */
    async listReminders(userId) {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?msg=list_remind&userId=${userId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Tạo nhắc nhở
     */
    async createReminder(userId, username, person, datetime, content, repeatType, timezone = 9) {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?msg=remind%20${encodeURIComponent(person)}%20${encodeURIComponent(datetime)}%20${encodeURIComponent(content)}%20!repeat%20${repeatType}&userId=${userId}&timezone=${timezone}&username=${encodeURIComponent(username)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Xóa nhắc nhở
     */
    async deleteReminder(userId, remindIndex) {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?msg=remove_remind%20${remindIndex + 1}&userId=${userId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Load cây gia phả
     */
    async loadFamilyTree(username) {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?target=family&action=load&username=${encodeURIComponent(username)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Lưu cây gia phả
     */
    async saveFamilyTree(username, content) {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?target=family&action=save&username=${encodeURIComponent(username)}&content=${encodeURIComponent(content)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Load sự kiện âm lịch
     */
    async loadLunarEvents() {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?target=lunarEvents&action=load&username=common`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Lưu sự kiện âm lịch
     */
    async saveLunarEvents(content) {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?target=lunarEvents&action=save&username=common&content=${encodeURIComponent(content)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Lấy danh sách memories (basic info)
     * GET target=memory&action=list
     * @returns {Promise<Array>} List memories với {id, eventDate, title}
     */
    async getMemoriesList() {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?target=memory&action=list`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Response: { id, eventDate, title } // Just basic info
        const data = await response.json();
        // Sort theo eventDate giảm dần
        let memories = Array.isArray(data) ? data : data.data || [];
        memories = memories.sort((a, b) => {
            const dateA = new Date(a.eventDate).getTime();
            const dateB = new Date(b.eventDate).getTime();
            return dateB - dateA;
        });
        return memories;
    }

    /**
     * Lấy chi tiết memory (lazy loading)
     * GET target=memory&action=load&postId={id}
     * @param {number|string} memoryId - ID của memory
     * @returns {Promise<Object|null>} Memory object hoặc null nếu bị delete
     */
    async loadMemory(memoryId) {
        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?target=memory&action=load&postId=${memoryId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let memory = data.data || data;

        memory = Object.fromEntries(
            Object.entries(memory).filter(([key]) => this.memoryAllowedKeys.includes(key))
        );

        return memory;
    }

    /**
     * Lưu memory (tạo/sửa/xóa)
     * GET target=memory&action=save&content={json}
     * @param {Object} memoryData - Memory object
     * @returns {Promise<Object>} Saved memory object
     */
    async saveMemory(memoryData) {
        if (!memoryData.title || !memoryData.eventDate) {
            throw new Error('Title và eventDate là bắt buộc');
        }

        // Chỉ giữ các keys hợp lệ
        memoryData = Object.fromEntries(
            Object.entries(memoryData).filter(([key]) => this.memoryAllowedKeys.includes(key))
        );

        const apiUrl = `https://script.google.com/macros/s/${this.apiId}/exec?target=memory&action=save`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(memoryData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Response: { id, eventDate }
        const data = await response.json();
        return { ...memoryData, ...data };
    }

    /**
     * Tạo memory mới
     * @param {Object} memoryData - { title, text, eventDate, imageBase64 }
     * @returns {Promise<Object>} Created memory object
     */
    async createMemory(memoryData) {
        const newMemory = {
            ...memoryData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        return this.saveMemory(newMemory);
    }

    /**
     * Cập nhật memory
     * @param {number|string} memoryId - ID của memory
     * @param {Object} updates - Dữ liệu cần update
     * @param {Object} existingData - Existing memory data (để tránh call loadMemory)
     * @returns {Promise<Object>} Updated memory object
     */
    async updateMemory(memoryId, updates, existingData = null) {
        let existing = existingData;

        // Nếu không pass existing data, lấy từ API
        if (!existing) {
            existing = await this.loadMemory(memoryId);
        }

        if (!existing) {
            throw new Error(`Memory ${memoryId} không tồn tại hoặc đã bị xóa`);
        }

        const updatedMemory = {
            ...existing,
            ...updates,
            id: memoryId,
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        return this.saveMemory(updatedMemory);
    }

    /**
     * Xóa memory (soft delete)
     * @param {number|string} memoryId - ID của memory
     * @param {Object} existingData - Existing memory data
     * @returns {Promise<Object>} Updated memory object
     */
    async deleteMemory(memoryId, existingData = {}) {
        const memoryData = {
            ...existingData,
            id: memoryId,
            isDeleted: true,
            updatedAt: new Date().toISOString()
        };

        return this.saveMemory(memoryData);
    }
}
