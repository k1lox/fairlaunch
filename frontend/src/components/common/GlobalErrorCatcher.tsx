/**
 * 全局错误捕获组件 - 捕获应用中未处理的错误
 * Global Error Catcher - Catches unhandled errors in the application
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface ErrorCatcherProps {
  children: ReactNode;
}

interface ErrorCatcherState {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(156, 39, 176, 0.1);
  border: 1px solid rgba(156, 39, 176, 0.3);
  color: #333;
`;

const ErrorHeader = styled.h2`
  color: #9C27B0;
  margin-bottom: 10px;
`;

const ErrorMessage = styled.p`
  margin-bottom: 15px;
`;

const ReloadButton = styled.button`
  background: linear-gradient(90deg, #7B1FA2, #9C27B0);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(90deg, #9C27B0, #7B1FA2);
  }
`;

/**
 * 全局错误捕获组件 - 处理React组件渲染过程中的错误
 * Global Error Boundary Component - Handles errors in React component rendering
 */
class GlobalErrorCatcher extends Component<ErrorCatcherProps, ErrorCatcherState> {
  constructor(props: ErrorCatcherProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorCatcherState {
    // 更新状态以便下一次渲染显示降级UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误信息
    console.error('Caught an application error:', error, errorInfo);
  }

  handleReload = (): void => {
    // 刷新页面
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 显示降级UI
      return (
        <ErrorContainer>
          <ErrorHeader>Something went wrong</ErrorHeader>
          <ErrorMessage>
            The application encountered an unexpected error. You can try reloading the page.
          </ErrorMessage>
          <ReloadButton onClick={this.handleReload}>
            Reload Page
          </ReloadButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorCatcher;
