/**
 * Memories Service
 */

class MemoriesService {
  

  /**
   * Tính toán khoảng cách thời gian (năm, tháng, ngày)
   * Dùng cho các sự kiện quá khứ
   * @param {string} eventDate - Ngày sự kiện (YYYY-MM-DD)
   * @returns {Object} { label, dateFormatted, isPast }
   */
  calculateDaysRemaining(eventDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = eventDate.split('-').map(Number);
    const eventDateObj = new Date(year, month - 1, day);
    eventDateObj.setHours(0, 0, 0, 0);

    // Định dạng ngày dd/mm/yyyy
    const dateFormatted = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    // Nếu sự kiện là quá khứ (eventDate cũ hơn hôm nay)
    if (eventDateObj < today) {
      // Sự kiện quá khứ - tính khoảng cách năm, tháng, ngày từ eventDateObj đến today
      let startDate = eventDateObj;
      let years = 0, months = 0, days = 0;

      // Tính năm
      years = today.getFullYear() - startDate.getFullYear();
      
      // Tạo date tạm thời để tính tháng
      let tempDate = new Date(startDate.getFullYear() + years, startDate.getMonth(), startDate.getDate());
      
      // Nếu chưa đủ năm đủ thì giảm năm đi
      if (tempDate > today) {
        years--;
        tempDate = new Date(startDate.getFullYear() + years, startDate.getMonth(), startDate.getDate());
      }

      // Tính tháng
      months = today.getMonth() - tempDate.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }

      // Cập nhật tempDate với tháng
      tempDate = new Date(tempDate.getFullYear() + (months > 0 ? 0 : 0), tempDate.getMonth() + months, startDate.getDate());

      // Tính ngày
      days = today.getDate() - tempDate.getDate();
      if (days < 0) {
        months--;
        if (months < 0) {
          years--;
          months += 12;
        }
        // Lấy số ngày của tháng trước
        const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonthDate.getDate();
      }

      // Tạo label
      const parts = [];
      if (years > 0) parts.push(`${years} năm`);
      if (months > 0) parts.push(`${months} tháng`);
      if (days > 0) parts.push(`${days} ngày`);

      const label = parts.length > 0 ? `Đã qua ${parts.join(' ')}` : 'Hôm nay';

      return { label, dateFormatted, isPast: true };
    }

    // Nếu sự kiện là tương lai - tính ngày còn lại
    const diffTime = eventDateObj - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { label: 'Hôm nay', dateFormatted, isPast: false };
    } else if (diffDays === 1) {
      return { label: 'Ngày mai', dateFormatted, isPast: false };
    } else {
      return { label: `Cách ${diffDays} ngày`, dateFormatted, isPast: false };
    }
  }

  /**
   * Resize ảnh (keep ratio, max 800px các chiều)
   * @param {File} file - File object
   * @param {number} maxWidth - Max width (default 800)
   * @param {number} maxHeight - Max height (default 800)
   * @param {number} quality - Compression quality 0-1 (default 0.7 = 70%)
   * @returns {Promise<string>} Base64 JPG image
   */
  async resizeAndCompressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        
        img.onload = () => {
          // Tính toán kích thước mới (keep ratio)
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          // Tạo canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Draw image lên canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert thành JPG base64 với quality
          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve(base64);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Chuyển đổi file thành base64 (với resize/compress)
   * @param {File} file - File object
   * @returns {Promise<string>} Base64 JPG image (resize max 800px, quality 70%)
   */
  async fileToBase64(file) {
    return this.resizeAndCompressImage(file, 800, 800, 0.7);
  }

}

export const memoriesService = new MemoriesService();
