// src/components/latout/Footer.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: ${({ theme }) => theme.spacing.xl};
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.lg} 0`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const LogoIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: 20px;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: ${({ theme }) => `${theme.spacing.md} 0`};
  
  @media (max-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 20px;
  transition: color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>{t('platform')}</FooterTitle>
          <FooterLinks>
            <FooterLink>
              <StyledLink to="/tokens">{t('browseTokens')}</StyledLink>
            </FooterLink>
            <FooterLink>
              <StyledLink to="/create-token">{t('createToken')}</StyledLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('documentation')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('api')}
              </ExternalLink>
            </FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>{t('resources')}</FooterTitle>
          <FooterLinks>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('howItWorks')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('tokenStandards')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('smartContractSecurity')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('tokenomicsGuide')}
              </ExternalLink>
            </FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>{t('company')}</FooterTitle>
          <FooterLinks>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('aboutUs')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('blog')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('careers')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('contact')}
              </ExternalLink>
            </FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>{t('connect')}</FooterTitle>
          <FooterLinks>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('twitter')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('telegram')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('discord')}
              </ExternalLink>
            </FooterLink>
            <FooterLink>
              <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                {t('github')}
              </ExternalLink>
            </FooterLink>
          </FooterLinks>
          
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              🐦
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              ✈️
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              💬
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              💻
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <FooterLogo to="/">
          <LogoIcon>🚀</LogoIcon>
          FairLaunch
        </FooterLogo>
        
        <Copyright>
          {t('copyright')}
        </Copyright>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;