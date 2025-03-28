// public/js/error-handler.js
(function() {
  // 全局错误处理
  window.onerror = function(message, source, lineno, colno, error) {
    console.log('Global JS error:', { 
      message, 
      source, 
      lineno, 
      colno, 
      error: error ? error.stack : null 
    });
    // 返回true表示错误已处理
    return true;
  };

  // 处理Promise错误
  window.addEventListener('unhandledrejection', function(event) {
    console.log('Unhandled promise rejection:', event.reason);
    // 防止错误显示在控制台
    event.preventDefault();
  });

  // 创建一个安全版本的fetch
  const originalFetch = window.fetch;
  window.fetch = function safeFetch(...args) {
    return originalFetch.apply(this, args)
      .catch(err => {
        console.log('Fetch error caught:', err);
        // 返回一个mock响应而不是抛出错误
        return new Response(JSON.stringify({ 
          error: true, 
          message: 'Request failed'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      });
  };

  // 防止ethereum属性重定义
  Object.defineProperty(window, 'ethereum', {
    value: undefined,
    writable: false,
    configurable: false
  });

  console.log('Enhanced error protection loaded');
})();