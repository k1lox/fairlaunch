// src/pages/Home/index.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import TokenCard from '../../components/token/TokenCard';
// import { Token } from '../../types/tokens'; // 未使用，已注释

// 模拟数据 - 实际生产中应该从后端API获取
import { featuredTokens } from '../../mock/tokens';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => `${theme.spacing.xxl} 0`};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(90deg, #9C27B0, #E1BEE7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  display: inline-block;
`;

const FeaturedTokensSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: ${({ theme }) => theme.spacing.lg};
`;

const HowItWorksSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: ${({ theme }) => theme.spacing.lg};
`;

const StepCard = styled(Card)`
  height: 100%;
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepTitle = styled.h3`
  margin: 0;
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCreateToken = () => {
    navigate('/create-token');
  };
  
  const handleExploreTokens = () => {
    navigate('/tokens');
  };
  
  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Launch Your Token to The Moon</HeroTitle>
        <HeroSubtitle>
          Create and launch your own token with just a few clicks. 
          Our platform provides everything you need to successfully launch 
          your token project and manage your token economy.
        </HeroSubtitle>
        <ButtonsContainer>
          <Button size="large" onClick={handleCreateToken}>Create Token</Button>
          <Button size="large" variant="outlined" onClick={handleExploreTokens}>Explore Tokens</Button>
        </ButtonsContainer>
      </HeroSection>
      
      <FeaturedTokensSection>
        <SectionTitle>Featured Tokens</SectionTitle>
        <TokenGrid>
          {featuredTokens.map(token => (
            <TokenCard key={token.id} token={token} />
          ))}
        </TokenGrid>
      </FeaturedTokensSection>
      
      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsContainer>
          <StepCard>
            <CardContent>
              <StepHeader>
                <StepNumber>1</StepNumber>
                <StepTitle>Create</StepTitle>
              </StepHeader>
              <StepDescription>
                Set up your token with just a few clicks. Define the name, symbol, 
                total supply, and other parameters of your token.
              </StepDescription>
            </CardContent>
          </StepCard>
          
          <StepCard>
            <CardContent>
              <StepHeader>
                <StepNumber>2</StepNumber>
                <StepTitle>Launch</StepTitle>
              </StepHeader>
              <StepDescription>
                Set your initial token price, launch date, and distribution 
                mechanism. Our platform handles the smart contract deployment.
              </StepDescription>
            </CardContent>
          </StepCard>
          
          <StepCard>
            <CardContent>
              <StepHeader>
                <StepNumber>3</StepNumber>
                <StepTitle>Manage</StepTitle>
              </StepHeader>
              <StepDescription>
                Track your token's performance, manage token distribution, 
                and engage with your community all from one dashboard.
              </StepDescription>
            </CardContent>
          </StepCard>
          
          <StepCard>
            <CardContent>
              <StepHeader>
                <StepNumber>4</StepNumber>
                <StepTitle>Trade</StepTitle>
              </StepHeader>
              <StepDescription>
                Enable trading for your community. Watch as your token 
                establishes its market value through buy and sell orders.
              </StepDescription>
            </CardContent>
          </StepCard>
        </StepsContainer>
      </HowItWorksSection>
    </HomeContainer>
  );
};

export default HomePage;