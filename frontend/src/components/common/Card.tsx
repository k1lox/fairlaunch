// src/components/common/Card.tsx
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { DefaultTheme } from 'styled-components';

interface CardProps {
  children: ReactNode;
  hoverEffect?: boolean;
  onClick?: () => void;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface StyledCardProps {
  hoverEffect?: boolean;
  theme: DefaultTheme;
}

interface StyledComponentProps {
  theme: DefaultTheme;
}

export const Card = styled.div<StyledCardProps>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.short};
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  
  ${({ hoverEffect, theme }) => hoverEffect && `
    cursor: pointer;
    
    &:hover {
      box-shadow: ${theme.shadows.md};
      transform: translateY(-2px);
    }
  `}
`;

export const CardHeader = styled.div<StyledComponentProps>`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CardTitle = styled.h3<StyledComponentProps>`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

export const CardContent = styled.div`
  // Default styling can be empty, determined by inner components
`;

// Component versions
export const CardComponent: React.FC<CardProps> = ({ children, hoverEffect, onClick, className }) => {
  return (
    <Card hoverEffect={hoverEffect} onClick={onClick} className={className}>
      {children}
    </Card>
  );
};

export const CardHeaderComponent: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <CardHeader className={className}>{children}</CardHeader>;
};

export const CardTitleComponent: React.FC<CardTitleProps> = ({ children, className }) => {
  return <CardTitle className={className}>{children}</CardTitle>;
};

export const CardContentComponent: React.FC<CardContentProps> = ({ children, className }) => {
  return <CardContent className={className}>{children}</CardContent>;
};
