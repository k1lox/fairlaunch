/**
 * 全局未处理Promise拒绝处理器
 * Global unhandled Promise rejection handler
 */
import React, { useEffect } from 'react';

/**
 * 添加全局未处理Promise拒绝处理器的组件
 * Component to add global unhandled Promise rejection handler
 */
const GlobalErrorHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 处理未捕获的Promise拒绝
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // 防止默认行为（控制台错误）
      event.preventDefault();
      
      // 记录错误但不显示给用户
      console.warn('Handled Promise rejection:', event.reason);
      
      // 特殊处理已知的钱包错误
      if (event.reason && event.reason.code === 4001) {
        console.log('User rejected wallet connection or has no accounts');
        return;
      }
      
      // 其他未知错误可以在这里处理
    };
    
    // 添加全局事件监听器
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // 清理函数
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return <>{children}</>;
};

export default GlobalErrorHandler;
