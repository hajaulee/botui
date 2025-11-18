/**
 * API Service - Xử lý tất cả các API calls
 */

export class APIService {
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
}
