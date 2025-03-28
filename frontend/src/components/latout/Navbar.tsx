// src/components/latout/Navbar.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import SimpleWalletConnector from '../wallet/SimpleWalletConnector';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';

const NavbarContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const LogoIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: 24px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  margin: 0 ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.short};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.short};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">
          <LogoIcon>🚀</LogoIcon>
          FairLaunch
        </Logo>
        
        <Nav>
          <NavLink to="/" active={isActive('/')}>
            {t('home')}
          </NavLink>
          <NavLink to="/tokens" active={isActive('/tokens')}>
            {t('tokens')}
          </NavLink>
          <NavLink to="/create-token" active={isActive('/create-token')}>
            {t('createToken')}
          </NavLink>
        </Nav>
        
        <RightSection>
          <LanguageSwitcher />
          {/* 使用真实的钱包连接器 */}
          <SimpleWalletConnector />
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </RightSection>
      </NavbarContent>
      
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" active={isActive('/')}>
          {t('home')}
        </MobileNavLink>
        <MobileNavLink to="/tokens" active={isActive('/tokens')}>
          {t('tokens')}
        </MobileNavLink>
        <MobileNavLink to="/create-token" active={isActive('/create-token')}>
          {t('createToken')}
        </MobileNavLink>
      </MobileMenu>
    </NavbarContainer>
  );
};

export default Navbar;