import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark?: string;
      secondary?: string;
      text: string;
      textSecondary: string;
      background: string;
      backgroundLight: string;
      surface: string;
      error: string;
      success: string;
      warning: string;
      info: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      round: string;
    };
    typography: {
      fontFamily: string;
      fontFamilySecondary?: string;
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
      };
      fontWeight: {
        light?: number;
        regular: number;
        medium: number;
        bold: number;
      };
    };
    transitions: {
      short: string;
      medium: string;
      long?: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg?: string;
    };
  }
}

// Default theme definition
const theme: DefaultTheme = {
  colors: {
    primary: '#C0B283',     // Pale Gold
    primaryLight: '#D1C7A8', // Light Pale Gold
    primaryDark: '#A69868',  // Dark Pale Gold
    secondary: '#DCD0C0',    // Silk
    background: '#F4F4F4',   // Paper
    backgroundLight: '#FFFFFF', // White background
    surface: '#FFFFFF',     // Surface, pure white
    text: '#373737',        // Charcoal
    textSecondary: '#666666', // Secondary text, gray
    success: '#6B8E6B',     // Success, olive green
    error: '#9B6A6A',       // Error, dark red
    warning: '#B69E68',     // Warning, deep gold
    info: '#7D8BA8',        // Info, light bluish gray
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
  transitions: {
    short: '0.2s ease',
    medium: '0.4s ease',
    long: '0.5s ease',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 3px 6px rgba(0,0,0,0.12)',
    lg: '0 5px 15px rgba(0,0,0,0.08)',
  }
};

export default theme;
