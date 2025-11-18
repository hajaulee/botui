/**
 * useMemories Composable v2 (API Integration)
 * Quản lý state và logic cho kỷ niệm với API backend
 * - Lazy load memory details khi scroll đến
 * - Show skeleton khi loading
 * - Filter isDeleted items
 */

import { memoriesService } from '../services/memoriesService.js';
import { APIService } from '../services/apiService.js';

export function useMemoriesApi(apiId) {
  // Validate apiId
  if (!apiId) {
    throw new Error('apiId là bắt buộc để sử dụng useMemoriesApi');
  }

  // Initialize APIService
  const apiService = new APIService(apiId);
  const { ref, reactive } = Vue;

  // State
  const memoriesBasic = ref([]); // Basic list từ API (id, title, eventDate)
  const memoriesDetail = ref({}); // Detail cache: { [id]: fullMemoryObject }
  const loadingMemoryIds = ref(new Set()); // IDs đang load
  const filteredMemories = ref([]); // Final list để display
  const searchQuery = ref('');
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  // Pagination state
  const pageSize = 10;
  const currentPage = ref(0);

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
   */
  const loadMemoriesList = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      const list = await apiService.getMemoriesList();
      memoriesBasic.value = list;
      memoriesDetail.value = {};
      loadingMemoryIds.value.clear();
      currentPage.value = 0;
      
      await filterAndPaginate();
    } catch (error) {
      console.error('❌ Error loading memories list:', error);
      errorMessage.value = error.message || 'Lỗi khi tải danh sách kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lazy load chi tiết memory (gọi khi scroll đến hoặc click expand)
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
      const detail = await apiService.loadMemory(memoryId);
      
      if (detail) {
        // Add date info
        const dateInfo = memoriesService.calculateDaysRemaining(detail.eventDate);
        detail.daysInfo = dateInfo;
        
        // Cache detail
        memoriesDetail.value[memoryId] = detail;
        
        // Update filtered memories để hiển thị detail mới
        await filterAndPaginate();
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
   * Lọc và phân trang
   */
  const filterAndPaginate = async () => {
    const start = currentPage.value * pageSize;
    const end = start + pageSize;
    
    const paginated = memoriesBasic.value.slice(start, end);
    
    // Map basic info với detail (nếu có) hoặc placeholder
    const displayMemories = paginated.map(basic => {
      const detail = memoriesDetail.value[basic.id];
      
      if (detail) {
        return detail;
      }

      // Thêm basic info + placeholder
      const dateInfo = memoriesService.calculateDaysRemaining(basic.eventDate);
      return {
        ...basic,
        daysInfo: dateInfo,
        text: '',
        imageBase64: '',
        isLoading: loadingMemoryIds.value.has(basic.id)
      };
    });

    filteredMemories.value = displayMemories;
  };

  /**
   * Load thêm memories (infinite scroll)
   */
  const loadMore = async () => {
    const nextPage = currentPage.value + 1;
    const start = nextPage * pageSize;

    if (start >= memoriesBasic.value.length) {
      return;
    }

    isLoadingMore.value = true;

    try {
      currentPage.value = nextPage;
      await filterAndPaginate();
    } catch (error) {
      console.error('❌ Error loading more:', error);
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
        m.title.toLowerCase().includes(query)
      );

      memoriesBasic.value = filtered;
      currentPage.value = 0;
      await filterAndPaginate();
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
        // Update via API
        const updated = await apiService.updateMemory(editingMemory.value, {
          title: formData.title,
          text: formData.text,
          eventDate: formData.eventDate,
          imageBase64: formData.imageBase64
        });

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
        memoriesDetail.value = {};
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
   * Kiểm tra còn memory để load không
   */
  const hasMore = () => {
    const totalLoaded = (currentPage.value + 1) * pageSize;
    return totalLoaded < memoriesBasic.value.length;
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
    filteredMemories,
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
    filterAndPaginate,
    loadMore,
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
