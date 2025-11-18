/**
 * useMemories Composable
 * Quản lý state và logic cho kỷ niệm
 */

import { memoriesService } from '../services/memoriesService.js';

export function useMemories() {
  const { ref, reactive } = Vue;

  // State
  const memories = ref([]);
  const filteredMemories = ref([]);
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
   * Load tất cả kỷ niệm
   */
  const loadMemories = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      const allMemories = await memoriesService.getAllMemories();
      memories.value = allMemories;
      currentPage.value = 0;
      await filterAndPaginate();
    } catch (error) {
      console.error('Error loading memories:', error);
      errorMessage.value = 'Lỗi khi tải kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Tìm kiếm kỷ niệm
   */
  const searchMemories = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      const results = await memoriesService.searchMemories(searchQuery.value);
      memories.value = results;
      currentPage.value = 0;
      await filterAndPaginate();
    } catch (error) {
      console.error('Error searching memories:', error);
      errorMessage.value = 'Lỗi khi tìm kiếm kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Lọc và phân trang
   */
  const filterAndPaginate = async () => {
    const start = currentPage.value * pageSize;
    const end = start + pageSize;
    
    const paginated = memories.value.slice(start, end);
    
    // Thêm thông tin ngày còn lại
    paginated.forEach(memory => {
      const dateInfo = memoriesService.calculateDaysRemaining(memory.eventDate);
      memory.daysInfo = dateInfo;
    });

    filteredMemories.value = paginated;
  };

  /**
   * Load thêm kỷ niệm (infinite scroll)
   */
  const loadMore = async () => {
    const nextPage = currentPage.value + 1;
    const start = nextPage * pageSize;

    if (start >= memories.value.length) {
      return;
    }

    isLoadingMore.value = true;

    try {
      currentPage.value = nextPage;
      await filterAndPaginate();
    } catch (error) {
      console.error('Error loading more memories:', error);
      errorMessage.value = 'Lỗi khi tải thêm kỷ niệm';
    } finally {
      isLoadingMore.value = false;
    }
  };

  /**
   * Mở modal thêm kỷ niệm
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
   * Mở modal chỉnh sửa kỷ niệm
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
   * Xử lý upload ảnh
   */
  const handleImageUpload = async (file) => {
    try {
      formData.imageBase64 = await memoriesService.fileToBase64(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      errorMessage.value = 'Lỗi khi upload ảnh';
    }
  };

  /**
   * Xóa ảnh
   */
  const removeImage = () => {
    formData.imageBase64 = '';
  };

  /**
   * Lưu kỷ niệm (thêm hoặc sửa)
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
        // Cập nhật
        await memoriesService.updateMemory(editingMemory.value, {
          title: formData.title,
          text: formData.text,
          eventDate: formData.eventDate,
          imageBase64: formData.imageBase64
        });
        successMessage.value = 'Cập nhật kỷ niệm thành công!';
      } else {
        // Tạo mới
        await memoriesService.createMemory({
          title: formData.title,
          text: formData.text,
          eventDate: formData.eventDate,
          imageBase64: formData.imageBase64
        });
        successMessage.value = 'Thêm kỷ niệm thành công!';
      }

      // Reload memories
      await loadMemories();
      
      // Đóng modal sau 1 giây
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Error saving memory:', error);
      errorMessage.value = 'Lỗi khi lưu kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Xóa kỷ niệm
   */
  const deleteMemory = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa kỷ niệm này?')) {
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      await memoriesService.deleteMemory(id);
      successMessage.value = 'Xóa kỷ niệm thành công!';
      await loadMemories();
    } catch (error) {
      console.error('Error deleting memory:', error);
      errorMessage.value = 'Lỗi khi xóa kỷ niệm';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Kiểm tra xem có thêm kỷ niệm để tải không
   */
  const hasMore = () => {
    const totalLoaded = (currentPage.value + 1) * pageSize;
    return totalLoaded < memories.value.length;
  };

  return {
    // State
    memories,
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
    loadMemories,
    searchMemories,
    loadMore,
    openAddModal,
    openEditModal,
    closeModal,
    handleImageUpload,
    removeImage,
    saveMemory,
    deleteMemory,
    hasMore
  };
}
