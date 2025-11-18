/**
 * Composable - useLunarEvents
 * Quản lý state và logic cho page sự kiện âm lịch
 */

import { APIService } from '../services/apiService.js';
import { CacheService } from '../services/cacheService.js';
import { LunarEventsService } from '../services/lunarEventsService.js';

export function useLunarEvents(apiId) {
  const { ref } = Vue;
  
  const lunarEvents = ref([]);
  const lunarEventsInput = ref('');
  const isLunarEventLoading = ref(false);
  const lunarEventMessage = ref('');

  const apiService = new APIService(apiId);

  const loadLunarEvents = async () => {
    const apiUrl = `https://script.google.com/macros/s/${apiId}/exec?target=lunarEvents&action=load&username=common`;
    
    // Hiển thị cache trước
    const cachedLunarEvents = CacheService.getCacheData(apiUrl);
    if (cachedLunarEvents) {
      lunarEventsInput.value = cachedLunarEvents;
      lunarEvents.value = LunarEventsService.parseLunarEvents(cachedLunarEvents);
    }
    
    try {
      isLunarEventLoading.value = true;
      lunarEventMessage.value = '';

      const data = await apiService.loadLunarEvents();

      if (data.content) {
        lunarEventsInput.value = data.content;
        lunarEvents.value = LunarEventsService.parseLunarEvents(data.content);
        CacheService.setCacheData(apiUrl, data.content);
      } else {
        lunarEventsInput.value = '';
        lunarEvents.value = [];
      }
    } catch (error) {
      console.error('Lỗi khi tải sự kiện âm lịch:', error);
      lunarEventMessage.value = 'Lỗi khi tải dữ liệu. Vui lòng thử lại.';
    } finally {
      isLunarEventLoading.value = false;
    }
  };

  const saveLunarEvents = async () => {
    if (!lunarEventsInput.value.trim()) {
      alert('Vui lòng nhập sự kiện');
      return;
    }

    try {
      isLunarEventLoading.value = true;
      lunarEventMessage.value = '';

      const data = await apiService.saveLunarEvents(lunarEventsInput.value);

      lunarEvents.value = LunarEventsService.parseLunarEvents(lunarEventsInput.value);
      lunarEventMessage.value = data.message || 'Lưu sự kiện thành công!';
      setTimeout(() => {
        lunarEventMessage.value = '';
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi lưu sự kiện âm lịch:', error);
      lunarEventMessage.value = 'Lỗi khi lưu dữ liệu. Vui lòng thử lại.';
    } finally {
      isLunarEventLoading.value = false;
    }
  };

  return {
    lunarEvents,
    lunarEventsInput,
    isLunarEventLoading,
    lunarEventMessage,
    loadLunarEvents,
    saveLunarEvents
  };
}
