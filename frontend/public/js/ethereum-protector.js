// 此脚本用于防止外部扩展干扰应用
// 它将确保window.ethereum在应用中不会被修改
(function() {
  // 保存原始的 Object.defineProperty 方法
  const originalDefineProperty = Object.defineProperty;
  
  // 覆盖 Object.defineProperty 方法
  Object.defineProperty = function(obj, prop, descriptor) {
    // 如果尝试定义 ethereum 属性，则跳过
    if (obj === window && prop === 'ethereum') {
      console.warn('Attempted to redefine window.ethereum - operation blocked by protector script');
      return obj;
    }
    
    // 否则执行原始方法
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  console.log('Ethereum property protection enabled');
})();