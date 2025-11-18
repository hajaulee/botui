/**
 * Composable - useReminders
 * Quản lý state và logic cho page nhắc nhở
 */

import { APIService } from '../services/apiService.js';
import { CacheService } from '../services/cacheService.js';
import { ReminderService } from '../services/reminderService.js';

export function useReminders(apiId, userId, username) {
  const { ref, reactive } = Vue;
  
  const reminders = ref([]);
  const isLoading = ref(false);
  const isDeleting = ref(false);
  const isCreating = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  
  const formData = reactive({
    person: '',
    content: '',
    time: '',
    repeatType: 'no'
  });

  const apiService = new APIService(apiId);

  const resetForm = () => {
    formData.person = '';
    formData.content = '';
    formData.time = '';
    formData.repeatType = 'no';
    successMessage.value = '';
  };

  const fetchReminders = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    const apiUrl = `https://script.google.com/macros/s/${apiId}/exec?msg=list_remind&userId=${userId}`;
    
    // Hiển thị cache trước
    const cachedReminders = CacheService.getCacheData(apiUrl);
    if (cachedReminders) {
      reminders.value = cachedReminders;
    }
    
    try {
      const data = await apiService.listReminders(userId);
      reminders.value = ReminderService.parseReminders(data);
      CacheService.setCacheData(apiUrl, reminders.value);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhắc nhở:', error);
      errorMessage.value = 'Không thể tải danh sách nhắc nhở. Vui lòng thử lại.';
      reminders.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const createReminder = async () => {
    if (!formData.person || !formData.content || !formData.time) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      isCreating.value = true;
      successMessage.value = '';
      
      const datetimeValue = ReminderService.formatDateTime(formData.time);
      const repeatLabel = ReminderService.getRepeatLabel(formData.repeatType);
      
      await apiService.createReminder(
        userId,
        username,
        formData.person,
        datetimeValue,
        formData.content,
        formData.repeatType
      );
      
      alert(`Hihu sẽ nhắc nhở ${formData.person}: ${formData.content}\nvào lúc: ${datetimeValue}\nlặp lại: ${repeatLabel}`);
      
      await fetchReminders();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi tạo nhắc nhở:', error);
      alert('Không thể tạo nhắc nhở. Vui lòng thử lại.');
    } finally {
      isCreating.value = false;
    }
  };

  const deleteReminder = (id) => {
    if (confirm('Bạn chắc chắn muốn xóa nhắc nhở này?')) {
      deleteReminderFromAPI(id);
    }
  };

  const deleteReminderFromAPI = async (remindIndex) => {
    try {
      isDeleting.value = true;
      await apiService.deleteReminder(userId, remindIndex);
      await fetchReminders();
      alert('Nhắc nhở đã được xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa nhắc nhở:', error);
      alert('Không thể xóa nhắc nhở. Vui lòng thử lại.');
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    reminders,
    isLoading,
    isDeleting,
    isCreating,
    errorMessage,
    successMessage,
    formData,
    resetForm,
    fetchReminders,
    createReminder,
    deleteReminder
  };
}
