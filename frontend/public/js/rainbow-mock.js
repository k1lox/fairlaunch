// public/js/rainbow-mock.js
// 这个脚本提供了一个模拟的Rainbow Kit环境
// 当实际依赖未安装时使用
(function() {
  console.log('Loading mock Rainbow Kit environment');
  
  // 定义全局命名空间
  window.mockRainbowKit = {
    // 模拟连接状态
    connected: false,
    address: null,
    
    // 模拟OKX钱包连接
    connectOKX: function() {
      console.log('Connecting to OKX Wallet...');
      const randomAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      this.connected = true;
      this.address = randomAddress;
      
      // 保存到localStorage
      localStorage.setItem('mock_rainbow_connected', 'true');
      localStorage.setItem('mock_rainbow_address', randomAddress);
      
      // 触发自定义事件
      const event = new CustomEvent('mockWalletConnected', {
        detail: { address: randomAddress }
      });
      window.dispatchEvent(event);
      
      return randomAddress;
    },
    
    // 断开连接
    disconnect: function() {
      console.log('Disconnecting wallet...');
      this.connected = false;
      this.address = null;
      
      localStorage.removeItem('mock_rainbow_connected');
      localStorage.removeItem('mock_rainbow_address');
      
      // 触发自定义事件
      const event = new CustomEvent('mockWalletDisconnected');
      window.dispatchEvent(event);
    },
    
    // 初始化 - 检查localStorage
    init: function() {
      const isConnected = localStorage.getItem('mock_rainbow_connected') === 'true';
      if (isConnected) {
        const address = localStorage.getItem('mock_rainbow_address');
        if (address) {
          this.connected = true;
          this.address = address;
        }
      }
    }
  };
  
  // 初始化
  window.mockRainbowKit.init();
})();