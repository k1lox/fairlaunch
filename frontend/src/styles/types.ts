import { ReactNode } from 'react';

// Common styled component props
export interface StyledComponentProps {
  theme: any; // This will be replaced by the DefaultTheme
}

// Button component props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

// Card component props
export interface CardProps {
  hoverEffect?: boolean;
  children: ReactNode;
}

// Input component props
export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

// Status badge props
export interface StatusBadgeProps {
  status: 'upcoming' | 'active' | 'completed' | 'failed';
}

// Token related props
export interface TokenTransactionProps {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  timestamp: number;
  price: number;
  address: string;
}

// Progress props
export interface ProgressProps {
  progress: number;
  max: number;
}
