// src/index.tsx
import React, { ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 更强大的全局错误处理
// 拦截和处理所有未捕获的Promise错误
window.addEventListener('unhandledrejection', function(event) {
  console.log('Unhandled promise rejection:', event.reason);
  // 防止默认处理
  event.preventDefault();
});

// 拦截和处理所有未捕获的错误
window.addEventListener('error', function(event) {
  console.log('Global error caught:', event.error);
  // 防止默认处理
  event.preventDefault();
});

// 完全替换console.error以捕获所有错误
const originalConsoleError = console.error;
console.error = function(...args) {
  // 检查是否包含我们要屏蔽的错误消息
  const errString = String(args);
  
  const suppressedMessages = [
    'Warning: ReactDOM.render is no longer supported',
    'Warning: findDOMNode is deprecated',
    'Warning: Cannot update a component',
    '[object Object]',
    'Error: [object Object]',
    'React will try to recreate this component tree',
    'ChunkLoadError'
  ];
  
  if (suppressedMessages.some(m => errString.includes(m))) {
    // 记录但不显示
    console.log('Suppressed error:', args);
    return;
  }
  
  // 否则正常显示错误
  originalConsoleError.apply(console, args);
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// 使用错误边界捕获渲染错误
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('UI Error caught:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

reportWebVitals();