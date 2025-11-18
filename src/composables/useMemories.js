/**
 * useMemories Composable v2 (API Integration)
 * Quản lý state và logic cho kỷ niệm với API backend
 * - Lazy load memory details khi scroll đến
 * - Show skeleton khi loading
 * - Filter isDeleted items
 */

import { memoriesService } from '../services/memoriesService.js';
import { APIService } from '../services/apiService.js';

export function useMemories(apiId) {
  // Validate apiId
  if (!apiId) {
    throw new Error('apiId là bắt buộc để sử dụng useMemories');
  }

  // Initialize APIService
  const apiService = new APIService(apiId);
  const { ref, reactive } = Vue;

  // State
  const memoriesBasic = ref([]); // Basic list từ API (id, title, eventDate)
  const memoriesDetail = ref({}); // Detail cache: { [id]: fullMemoryObject }
  const loadingMemoryIds = ref(new Set()); // IDs đang load
  const displayedMemories = ref([]); // Memories đang hiển thị (infinite scroll)
  const searchQuery = ref('');
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  // Infinite scroll state
  const itemsPerLoad = 10; // Load 10 items mỗi lần
  const itemsLoaded = ref(0); // Số items đã add vào displayedMemories

  // Form state
  const showAddModal = ref(false);
  const editingMemory = ref(null);
  const formData = reactive({
    title: '',
    text: '',
    eventDate: '',
    imageBase64: ''
  });

  /**
   * Tải danh sách basic memories từ API
   * Infinite scroll: Load 10 items đầu tiên
   */
  const loadMemoriesList = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      const list = await apiService.getMemoriesList();
      memoriesBasic.value = list;
      
      // Giữ lại cache detail của những memory vẫn tồn tại
      const existingIds = new Set(list.map(m => m.id));
      for (const id in memoriesDetail.value) {
        if (!existingIds.has(parseInt(id))) {
          delete memoriesDetail.value[id];
        }
      }
      
      loadingMemoryIds.value.clear();
      itemsLoaded.value = 0;
      displayedMemories.value = [];
      
      // Load 10 items đầu tiên
      await addMoreItems();
    } catch (error) {
      console.error('❌ Error loading memories list:', error);
      errorMessage.value = error.message || 'Lỗi khi tải danh sách kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lazy load chi tiết memory (gọi khi scroll đến hoặc click expand)
   * Kiểm tra cache IndexedDB trước, nếu cũ hơn basic info thì gọi API
   * @param {number|string} memoryId
   */
  const lazyLoadMemory = async (memoryId) => {
    // Nếu đã có detail, skip
    if (memoriesDetail.value[memoryId]) {
      return memoriesDetail.value[memoryId];
    }

    // Nếu đang load, skip
    if (loadingMemoryIds.value.has(memoryId)) {
      return null;
    }

    loadingMemoryIds.value.add(memoryId);

    try {
      // Lấy basicInfo mới nhất để check updatedAt
      const basicInfo = memoriesBasic.value.find(m => m.id === memoryId);
      const basicInfoUpdatedAt = basicInfo?.updatedAt || null;

      // loadMemory sẽ check cache IndexedDB trước
      const detail = await apiService.loadMemory(memoryId, basicInfoUpdatedAt);
      
      if (detail) {
        // Add date info
        const dateInfo = memoriesService.calculateDaysRemaining(detail.eventDate);
        detail.daysInfo = dateInfo;
        
        // Cache detail
        memoriesDetail.value[memoryId] = detail;
        
        // Update displayedMemories để hiển thị detail mới
        const idx = displayedMemories.value.findIndex(m => m.id === memoryId);
        if (idx !== -1) {
          displayedMemories.value[idx] = { ...displayedMemories.value[idx], ...detail };
        }
      }

      return detail;
    } catch (error) {
      console.error(`❌ Error lazy loading memory ${memoryId}:`, error);
      return null;
    } finally {
      loadingMemoryIds.value.delete(memoryId);
    }
  };

  /**
   * Thêm 10 items tiếp theo (infinite scroll)
   */
  const addMoreItems = async () => {    
    const start = itemsLoaded.value;
    const end = start + itemsPerLoad;

    if (start >= memoriesBasic.value.length) {
      return; // Không có items nữa
    }

    isLoadingMore.value = true;

    try {
      // Lấy 10 items tiếp theo từ basic list
      const newItems = memoriesBasic.value
        .filter(m => !memoriesDetail.value[m.id]?.isDeleted)
        .slice(start, end);

      // Map basic info thành display object (với skeleton chưa có detail)
      const itemsToAdd = newItems.map(basic => {
        const detail = memoriesDetail.value[basic.id];
        const dateInfo = detail?.dateInfo ?? memoriesService.calculateDaysRemaining(basic.eventDate);
        
        return {
          ...basic,
          daysInfo: dateInfo,
          text: detail?.text || '',
          imageBase64: detail?.imageBase64 || '',
          ...detail
        };
      });

      // Add vào displayedMemories
      displayedMemories.value.push(...itemsToAdd);
      itemsLoaded.value = end;
    } catch (error) {
      console.error('❌ Error adding more items:', error);
      errorMessage.value = 'Lỗi khi tải thêm kỷ niệm';
    } finally {
      isLoadingMore.value = false;
    }
  };

  /**
   * Tìm kiếm (search local trong basic list)
   */
  const searchMemories = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      if (!searchQuery.value.trim()) {
        await loadMemoriesList();
        return;
      }

      // Filter local
      const query = searchQuery.value.toLowerCase();
      const filtered = memoriesBasic.value.filter(m =>
        m.eventDate?.toLowerCase()?.includes(query) ||
        m.title?.toLowerCase()?.includes(query) ||
        (memoriesDetail.value[m.id]?.text?.toLowerCase()?.includes(query))
      );

      // Reset infinite scroll
      displayedMemories.value = [];
      itemsLoaded.value = 0;
      
      // Tạm set memoriesBasic để filter rồi load 10 items
      const tempBasic = memoriesBasic.value;
      memoriesBasic.value = filtered;
      await addMoreItems();
      
      // Restore nếu cần (search mode)
      memoriesBasic.value = filtered;
    } catch (error) {
      console.error('❌ Error searching:', error);
      errorMessage.value = 'Lỗi khi tìm kiếm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Mở modal thêm
   */
  const openAddModal = () => {
    editingMemory.value = null;
    formData.title = '';
    formData.text = '';
    formData.eventDate = '';
    formData.imageBase64 = '';
    showAddModal.value = true;
  };

  /**
   * Mở modal sửa
   */
  const openEditModal = (memory) => {
    editingMemory.value = memory.id;
    formData.title = memory.title;
    formData.text = memory.text;
    formData.eventDate = memory.eventDate;
    formData.imageBase64 = memory.imageBase64 || '';
    showAddModal.value = true;
  };

  /**
   * Đóng modal
   */
  const closeModal = () => {
    showAddModal.value = false;
    editingMemory.value = null;
    formData.title = '';
    formData.text = '';
    formData.eventDate = '';
    formData.imageBase64 = '';
    successMessage.value = '';
    errorMessage.value = '';
  };

  /**
   * Handle upload image
   */
  const handleImageUpload = async (file) => {
    try {
      formData.imageBase64 = await memoriesService.fileToBase64(file);
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      errorMessage.value = 'Lỗi khi upload ảnh';
    }
  };

  /**
   * Remove image
   */
  const removeImage = () => {
    formData.imageBase64 = '';
  };

  /**
   * Lưu memory (create/update)
   */
  const saveMemory = async () => {
    // Validate
    if (!formData.title.trim()) {
      errorMessage.value = 'Tiêu đề không được để trống';
      return;
    }

    if (!formData.eventDate) {
      errorMessage.value = 'Vui lòng chọn ngày sự kiện';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      if (editingMemory.value) {
        // Update via API - pass cached data to avoid redundant loadMemory call
        const existingData = memoriesDetail.value[editingMemory.value];
        const updated = await apiService.updateMemory(editingMemory.value, {
          title: formData.title,
          text: formData.text,
          eventDate: formData.eventDate,
          imageBase64: formData.imageBase64
        }, existingData);

        // Update cache
        memoriesDetail.value[editingMemory.value] = updated;
        successMessage.value = '✅ Cập nhật thành công!';
      } else {
        // Create via API
        const created = await apiService.createMemory({
          title: formData.title,
          text: formData.text,
          eventDate: formData.eventDate,
          imageBase64: formData.imageBase64
        });

        successMessage.value = '✅ Thêm thành công!';

        // Clear cache để reload từ API
        memoriesDetail.value[created.id] = created;
      }

      // Reload list
      await loadMemoriesList();

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('❌ Error saving memory:', error);
      errorMessage.value = error.message || 'Lỗi khi lưu kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Xóa memory (soft delete)
   */
  const deleteMemory = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa kỷ niệm này?')) {
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      // Get current data
      const data = memoriesDetail.value[id] || memoriesBasic.value.find(m => m.id === id) || {};

      await apiService.deleteMemory(id, data);
      
      successMessage.value = '✅ Xóa thành công!';

      // Reload list
      await loadMemoriesList();
    } catch (error) {
      console.error('❌ Error deleting memory:', error);
      errorMessage.value = error.message || 'Lỗi khi xóa kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Kiểm tra còn memory để load không (infinite scroll)
   */
  const hasMore = () => {
    return itemsLoaded.value < memoriesBasic.value.length;
  };

  /**
   * Kiểm tra memory có đang load không
   */
  const isMemoryLoading = (id) => {
    return loadingMemoryIds.value.has(id);
  };

  /**
   * Lấy memory detail (nếu có)
   */
  const getMemoryDetail = (id) => {
    return memoriesDetail.value[id] || null;
  };

  return {
    // State
    memoriesBasic,
    memoriesDetail,
    displayedMemories,
    searchQuery,
    isLoading,
    isLoadingMore,
    errorMessage,
    successMessage,
    showAddModal,
    editingMemory,
    formData,

    // Methods
    loadMemoriesList,
    lazyLoadMemory,
    addMoreItems,
    searchMemories,
    openAddModal,
    openEditModal,
    closeModal,
    handleImageUpload,
    removeImage,
    saveMemory,
    deleteMemory,
    hasMore,
    isMemoryLoading,
    getMemoryDetail
  };
}
