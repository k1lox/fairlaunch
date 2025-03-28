// src/theme.ts
export const theme = {
  colors: {
    primary: '#C0B283',     // 淡金色 Pale Gold
    primaryLight: '#D1C7A8', // 浅淡金色
    primaryDark: '#A69868',  // 深淡金色
    secondary: '#DCD0C0',    // 丝绸色 Silk
    background: '#F4F4F4',   // 纸张色 Paper
    backgroundLight: '#FFFFFF', // 白色背景
    surface: '#FFFFFF',     // 表面色，纯白
    text: '#373737',        // 炭黑色 Charcoal
    textSecondary: '#666666', // 次要文本色，灰色
    success: '#6B8E6B',     // 成功色，橄榄绿
    error: '#9B6A6A',       // 错误色，暗红色
    warning: '#B69E68',     // 警告色，深金色
    info: '#7D8BA8',        // 信息色，淡蓝灰色
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    round: '50%',
  },
  typography: {
    fontFamily: "'Playfair Display', 'EB Garamond', 'Georgia', 'Times New Roman', serif",
    fontFamilySecondary: "'Lato', 'Helvetica', 'Arial', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 3px 6px rgba(0,0,0,0.12)',
    lg: '0 5px 15px rgba(0,0,0,0.08)',
  },
  transitions: {
    short: '0.2s',
    medium: '0.3s',
    long: '0.5s',
  },
};

export type Theme = typeof theme;
