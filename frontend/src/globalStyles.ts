// src/globalStyles.ts
import { createGlobalStyle, DefaultTheme } from 'styled-components';

// Update to use DefaultTheme from styled-components
export const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    min-height: 100vh;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    overflow-x: hidden;
    scroll-behavior: smooth;
    overscroll-behavior-y: none; /* 防止iOS橡皮筋效果 */
    padding-bottom: ${({ theme }) => theme.spacing.xl};
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.short};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryLight};
    }
  }
  
  input, select, textarea, button {
    font-family: inherit;
  }
  
  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundLight};
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary}66;
    border-radius: 3px;
    border: 1px solid transparent;
    background-clip: padding-box;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
  
  /* 平滑滚动 */
  html {
    scroll-behavior: smooth;
  }

  /* Selection color */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
  
  /* 页面部分之间的分界线样式 */
  section {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    position: relative;
  }
  
  section::after {
    content: '';
    position: absolute;
    bottom: -${({ theme }) => theme.spacing.md};
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, ${({ theme }) => theme.colors.primary}33, transparent);
  }
`;
