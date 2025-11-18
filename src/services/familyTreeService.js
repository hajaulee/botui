/**
 * Family Tree Service - Xử lý logic cây gia phả
 */

export class FamilyTreeService {
  /**
   * Parse and render family tree từ text
   */
  static parseAndRender(text) {
    if (!text.trim()) {
      return '';
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    let result = '';
    const isLastChild = [];

    // Helper function để lấy indentation level
    const getDepth = (line) => {
      const match = line.match(/^( *)/);
      return match ? match[1].length : 0;
    };

    // Helper function để kiểm tra nếu node là con cuối cùng của parent
    const checkIsLastChild = (index, currentDepth) => {
      // Tìm sibling tiếp theo (same depth hoặc less)
      for (let i = index + 1; i < lines.length; i++) {
        const nextDepth = getDepth(lines[i]);
        if (nextDepth < currentDepth) {
          // Nhảy tới level nông hơn, nên current là con cuối cùng
          return true;
        }
        if (nextDepth === currentDepth) {
          // Tìm thấy sibling tiếp theo, nên current không phải con cuối cùng
          return false;
        }
      }
      // Không tìm thấy sibling nào, nên đây là con cuối cùng
      return true;
    };

    lines.forEach((line, index) => {
      const depth = getDepth(line);
      const text = line.replaceAll('-', '').trimStart();
      
      // Build prefix với tree characters
      const isLast = checkIsLastChild(index, depth);
      isLastChild[depth - 1] = isLast;
      let prefix = '';
      
      for (let i = 0; i < depth; i++) {
        if (i === depth - 1) {
          prefix += isLast ? '└── ' : '├── ';
        } else {
          const ancestorIsLast = isLastChild[i] != false;
          prefix += ancestorIsLast ? '    ' : '│   ';
        }
      }

      if (depth === 0) {
        prefix = '\n───────────────────────\n';
      }

      result += prefix + text + '\n';
    });

    return result;
  }

  /**
   * Validate family tree text
   */
  static validate(text) {
    return text.trim().length > 0;
  }
}
