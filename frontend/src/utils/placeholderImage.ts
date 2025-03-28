/**
 * 本地占位符图片生成工具
 * Local placeholder image generator utility
 */

// 颜色转换：将颜色转换为RGB数组
const hexToRgb = (hex: string): [number, number, number] => {
  // 去除#号
  hex = hex.replace(/^#/, '');
  
  // 扩展3位颜色到6位
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // 转换为RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return [r, g, b];
};

// 生成本地数据URL的占位符图片
export const generatePlaceholder = (
  text: string,
  backgroundColor: string = '#7B1FA2',
  textColor: string = '#FFFFFF',
  width: number = 100,
  height: number = 100
): string => {
  try {
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context');
      return '';
    }
    
    // 绘制背景
    const [bgR, bgG, bgB] = hexToRgb(backgroundColor);
    ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
    ctx.fillRect(0, 0, width, height);
    
    // 绘制文本
    const [textR, textG, textB] = hexToRgb(textColor);
    ctx.fillStyle = `rgb(${textR}, ${textG}, ${textB})`;
    ctx.font = `bold ${Math.floor(height / 5)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 如果文本太长，截断它
    let displayText = text;
    if (text.length > 10) {
      const parts = text.split(/\s+/);
      if (parts.length > 1) {
        // 如果有空格，取首字母
        displayText = parts.map(word => word.charAt(0)).join('');
      } else {
        // 否则取前4个字符
        displayText = text.substring(0, 4);
      }
    }
    
    ctx.fillText(displayText, width / 2, height / 2);
    
    // 转换为数据URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating placeholder image:', error);
    
    // 如果canvas失败，使用一个非常基本的备用方案
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${backgroundColor.replace(/^#/, '')}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='${Math.floor(height / 5)}' fill='%23${textColor.replace(/^#/, '')}'%3E${text.substring(0, 2)}%3C/text%3E%3C/svg%3E`;
  }
};

export default {
  generatePlaceholder
};
