/**
 * Reminder Service - Xử lý logic nhắc nhở
 */

export class ReminderService {
  /**
   * Parse reminders từ API response
   */
  static parseReminders(data) {
    if (!data.messages || !Array.isArray(data.messages)) {
      return [];
    }

    // Kiểm tra nếu chỉ có một message là "không có nhắc nhở"
    if (data.messages.length === 1 && data.messages[0].text.includes('Bạn chưa có nhắc nhở nào')) {
      return [];
    }

    return data.messages.map((message, index) => {
      const text = message.text || '';
      const lines = text.split('\n').filter(line => line.trim());
      
      let person = '';
      let content = '';
      let time = '';
      let repeatType = 'no';
      
      lines.forEach(line => {
        if (line.includes('Người nhận:')) {
          person = line.replace('Người nhận:', '').trim();
        } else if (line.includes('Nội dung:')) {
          content = line.replace('Nội dung:', '').trim();
        } else if (line.includes('Vào lúc:')) {
          time = line.replace('Vào lúc:', '').trim();
        } else if (line.includes('Lặp lại:')) {
          const repeatText = line.replace('Lặp lại:', '').trim();
          if (repeatText.includes('hàng ngày')) repeatType = 'day';
          else if (repeatText.includes('hàng tuần')) repeatType = 'week';
          else if (repeatText.includes('hàng tháng')) repeatType = 'month';
          else repeatType = 'no';
        }
      });
      
      return {
        id: index,
        person: person || '',
        content: content || '',
        time: time || '',
        repeatType: repeatType,
        rawText: text,
        createdAt: new Date().toLocaleString('vi-VN')
      };
    });
  }

  /**
   * Format datetime từ input (YYYY-MM-DDTHH:mm → YYYY-MM-DD HH:mm)
   */
  static formatDateTime(datetimeInput) {
    return datetimeInput.replace('T', ' ');
  }

  /**
   * Get repeat type label
   */
  static getRepeatLabel(repeatType) {
    const labels = {
      'no': 'Không lặp',
      'day': 'Mỗi ngày',
      'week': 'Mỗi tuần',
      'month': 'Mỗi tháng',
      'weekday': 'Ngày trong tuần',
      'weekend': 'Cuối tuần'
    };
    return labels[repeatType] || 'Không lặp';
  }
}
