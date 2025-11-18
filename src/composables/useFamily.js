/**
 * Composable - useFamily
 * Quản lý state và logic cho page cây gia phả
 */

import { APIService } from '../services/apiService.js';
import { CacheService } from '../services/cacheService.js';
import { FamilyTreeService } from '../services/familyTreeService.js';

export function useFamily(apiId) {
  const { ref } = Vue;
  
  const familyPerson = ref('leha');
  const familyText = ref('');
  const familyTree = ref('');
  const isFamilyLoading = ref(false);
  const familyMessage = ref('');

  const apiService = new APIService(apiId);

  const parseAndRenderFamilyTree = () => {
    familyTree.value = FamilyTreeService.parseAndRender(familyText.value);
  };

  const loadFamilyTree = async () => {
    try {
      isFamilyLoading.value = true;
      familyMessage.value = '';
      
      const apiUrl = `https://script.google.com/macros/s/${apiId}/exec?target=family&action=load&username=${encodeURIComponent(familyPerson.value)}`;
      
      // Hiển thị cache trước
      const cachedFamilyTree = CacheService.getCacheData(apiUrl);
      if (cachedFamilyTree) {
        familyText.value = cachedFamilyTree;
        parseAndRenderFamilyTree();
      }
      
      const data = await apiService.loadFamilyTree(familyPerson.value);
      
      if (data.content) {
        familyText.value = data.content;
        parseAndRenderFamilyTree();
        familyMessage.value = 'Tải cây gia phả thành công!';
        CacheService.setCacheData(apiUrl, data.content);
        setTimeout(() => {
          familyMessage.value = '';
        }, 3000);
      } else if (data.message) {
        familyMessage.value = data.message;
      } else {
        familyText.value = '';
        familyTree.value = '';
        familyMessage.value = 'Không có dữ liệu cây gia phả cho người này';
      }
    } catch (error) {
      console.error('Lỗi khi tải cây gia phả:', error);
      familyMessage.value = 'Lỗi khi tải dữ liệu. Vui lòng thử lại.';
    } finally {
      isFamilyLoading.value = false;
    }
  };

  const saveFamilyTree = async () => {
    if (!FamilyTreeService.validate(familyText.value)) {
      alert('Vui lòng nhập cây gia phả trước khi lưu');
      return;
    }

    try {
      isFamilyLoading.value = true;
      familyMessage.value = '';
      
      const data = await apiService.saveFamilyTree(familyPerson.value, familyText.value);
      
      familyMessage.value = data.message || 'Lưu cây gia phả thành công!';
      setTimeout(() => {
        familyMessage.value = '';
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi lưu cây gia phả:', error);
      familyMessage.value = 'Lỗi khi lưu dữ liệu. Vui lòng thử lại.';
    } finally {
      isFamilyLoading.value = false;
    }
  };

  return {
    familyPerson,
    familyText,
    familyTree,
    isFamilyLoading,
    familyMessage,
    parseAndRenderFamilyTree,
    loadFamilyTree,
    saveFamilyTree
  };
}
