// src/components/common/input.tsx
import React, { InputHTMLAttributes } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
}

// Styled component props interfaces
interface InputContainerProps {
  fullWidth?: boolean;
  theme: DefaultTheme;
}

interface ThemedProps {
  theme: DefaultTheme;
}

interface StyledInputProps {
  hasError?: boolean;
  hasStartAdornment?: boolean;
  hasEndAdornment?: boolean;
  theme: DefaultTheme;
}

interface AdornmentContainerProps {
  position: 'start' | 'end';
  theme: DefaultTheme;
}

const InputContainer = styled.div<InputContainerProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
`;

const InputLabel = styled.label<ThemedProps>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input<StyledInputProps>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error : theme.colors.backgroundLight};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all ${({ theme }) => theme.transitions.short};
  width: 100%;
  
  ${({ hasStartAdornment, theme }) => hasStartAdornment && css`
    padding-left: ${theme.spacing.xl};
  `}
  
  ${({ hasEndAdornment, theme }) => hasEndAdornment && css`
    padding-right: ${theme.spacing.xl};
  `}
  
  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme, hasError }) => 
      hasError ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span<ThemedProps>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const AdornmentContainer = styled.div<AdornmentContainerProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  ${({ position }) => position === 'start' ? css`left: 12px;` : css`right: 12px;`}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  startAdornment,
  endAdornment,
  ...props
}) => {
  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <InputLabel>{label}</InputLabel>}
      <InputWrapper>
        {startAdornment && (
          <AdornmentContainer position="start">
            {startAdornment}
          </AdornmentContainer>
        )}
        <StyledInput
          hasError={!!error}
          hasStartAdornment={!!startAdornment}
          hasEndAdornment={!!endAdornment}
          {...props}
        />
        {endAdornment && (
          <AdornmentContainer position="end">
            {endAdornment}
          </AdornmentContainer>
        )}
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};
