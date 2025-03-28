// src/components/common/LanguageSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';

const SwitcherContainer = styled.div`
  position: relative;
  margin-left: ${({ theme }) => theme.spacing.md};
  user-select: none;
`;

const SelectedLanguage = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
  
  &:after {
    content: '▼';
    margin-left: ${({ theme }) => theme.spacing.sm};
    font-size: 8px;
  }
`;

const LanguageMenu = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  width: 100px;
`;

const LanguageOption = styled.div<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  cursor: pointer;
  background: ${({ active, theme }) => active ? theme.colors.backgroundLight : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleSelectLanguage = (lang: 'en' | 'zh') => {
    changeLanguage(lang);
    setIsOpen(false);
  };
  
  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case 'en': return 'English';
      case 'zh': return '中文';
      default: return lang;
    }
  };
  
  return (
    <SwitcherContainer ref={menuRef}>
      <SelectedLanguage onClick={toggleMenu}>
        {getLanguageDisplay(language)}
      </SelectedLanguage>
      
      <LanguageMenu isOpen={isOpen}>
        <LanguageOption 
          active={language === 'en'} 
          onClick={() => handleSelectLanguage('en')}
        >
          English
        </LanguageOption>
        <LanguageOption 
          active={language === 'zh'} 
          onClick={() => handleSelectLanguage('zh')}
        >
          中文
        </LanguageOption>
      </LanguageMenu>
    </SwitcherContainer>
  );
};

export default LanguageSwitcher;
