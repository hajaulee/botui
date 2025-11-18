/**
 * Lunar Events Service - Xử lý logic sự kiện âm lịch
 */

import { lunarToSolar } from '../utils/lunar-solar-converter.js';

export class LunarEventsService {
  /**
   * Parse lunar events từ text input
   * Format: "8/8: Giỗ ông A"
   */
  static parseLunarEvents(text) {
    if (!text.trim()) {
      return [];
    }

    const lines = text.split('\n').filter(line => line.trim());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return lines.map(line => {
      const parts = line.split(':').map(p => p.trim());
      if (parts.length < 2) return null;

      const dateParts = parts[0].split('/');
      if (dateParts.length !== 2) return null;

      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const solarDate = lunarToSolar({ year: today.getFullYear(), month, day });
      const eventName = parts[1];

      // Tính ngày sự kiện năm hiện tại
      let eventDate = new Date(today.getFullYear(), solarDate.solarMonth - 1, solarDate.solarDay);

      let daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
      if (daysLeft < -200) {
        // Nếu sự kiện đã qua năm nay, tính cho năm tới
        eventDate = new Date(today.getFullYear() + 1, solarDate.solarMonth - 1, solarDate.solarDay);
        daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
      }

      let daysText = '';
      if (daysLeft === 0) {
        daysText = 'Hôm nay';
      } else if (daysLeft === 1) {
        daysText = 'Ngày mai';
      } else if (daysLeft > 1) {
        daysText = `Cách ${daysLeft} ngày`;
      } else {
        daysText = `Đã qua ${-daysLeft} ngày`;
      }

      return {
        date: `${day}/${month}`,
        lunarDate: `${day}/${month}`,
        solarDate: `${solarDate.solarDay}/${solarDate.solarMonth}`,
        eventName: eventName,
        daysLeft: daysLeft,
        daysText: daysText
      };
    }).filter(e => e !== null).sort((a, b) => a.daysLeft - b.daysLeft);
  }
}
