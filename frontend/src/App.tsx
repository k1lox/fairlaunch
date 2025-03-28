/**
 * App主组件 - 定义应用的路由结构和全局样式
 * Application main component - Defines the application's routing structure and global styles
 */
import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { GlobalStyles } from './globalStyles';
import Navbar from './components/latout/Navbar';
import Footer from './components/latout/Footer';
import HomePage from './pages/Home';
import TokenListPage from './pages/TokenList';
import TokenDetailPage from './pages/TokenDetail';
import CreateTokenPage from './pages/CreateToken';
import { LanguageProvider } from './i18n/LanguageContext';
import { Web3Provider } from './services/web3/Web3Provider';
import GlobalErrorCatcher from './components/common/GlobalErrorCatcher';
import GlobalErrorHandler from './components/common/GlobalErrorHandler';


/**
 * 错误边界组件Props
 * Error Boundary Component Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * 错误边界组件状态
 * Error Boundary Component State
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * 页面错误边界组件 - 捕获并优雅处理页面渲染错误
 * Page Error Boundary Component - Catches and gracefully handles page rendering errors
 */
class PageErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * 从错误中获取派生状态 - 当子组件抛出错误时更新状态
   * Get derived state from error - Updates state when a child component throws an error
   */
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * 捕获组件生命周期中的错误 - 记录错误信息
   * Catch errors in component lifecycle - Log error information
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log('Page Error caught:', error, errorInfo);
  }

  /**
   * 渲染组件 - 如果有错误则显示错误UI，否则渲染子组件
   * Render component - Display error UI if an error occurred, otherwise render children
   */
  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          backgroundColor: 'rgba(156, 39, 176, 0.1)',
          border: '1px solid rgba(156, 39, 176, 0.3)',
          borderRadius: '8px',
          color: '#333',
          textAlign: 'center' 
        }}>
          <h2 style={{ color: '#9C27B0' }}>Something went wrong with this page</h2>
          <p>Please refresh or navigate to another page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}



/**
 * 应用主组件 - 构建应用的主要结构，包括主题、全局样式和路由
 * Application main component - Build the main structure of the application, including theme, global styles and routing
 */
const App: React.FC = () => {
  return (
    <GlobalErrorHandler>
      <ThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <LanguageProvider>
          <Web3Provider>
            <Router>
              <GlobalErrorCatcher>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={
                      <PageErrorBoundary>
                        <HomePage />
                      </PageErrorBoundary>
                    } />
                    <Route path="/tokens" element={
                      <PageErrorBoundary>
                        <TokenListPage />
                      </PageErrorBoundary>
                    } />
                    <Route path="/token/:id" element={
                      <PageErrorBoundary>
                        <TokenDetailPage />
                      </PageErrorBoundary>
                    } />
                    <Route path="/create-token" element={
                      <PageErrorBoundary>
                        <CreateTokenPage />
                      </PageErrorBoundary>
                    } />
                  </Routes>
                </main>
                <Footer />
              </GlobalErrorCatcher>
            </Router>
          </Web3Provider>
        </LanguageProvider>
      </ThemeProvider>
    </GlobalErrorHandler>
  );
};

export default App;
