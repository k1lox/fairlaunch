// src/pages/TokenList/index.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/input';
import { Button } from '../../components/common/Button';
import { Token, TokenStatus as TokenStatusEnum } from '../../types/tokens';

// 模拟数据 - 实际生产中应该从后端API获取
import { allTokens } from '../../mock/tokens';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  background: linear-gradient(90deg, #7B1FA2, #E1BEE7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const FiltersBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 300px;
`;

// 预留FilterGroup组件，可能在未来功能迭代中使用
// const FilterGroup = styled.div`
//   display: flex;
//   align-items: center;
//   gap: ${({ theme }) => theme.spacing.sm};
// `;

// 预留FilterButton组件，可能在未来功能迭代中使用
// const FilterButton = styled.button<{ active?: boolean }>`
//   background-color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.backgroundLight};
//   color: ${({ theme, active }) => active ? theme.colors.text : theme.colors.textSecondary};
//   border: none;
//   padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
//   border-radius: ${({ theme }) => theme.borderRadius.sm};
//   cursor: pointer;
//   font-size: ${({ theme }) => theme.typography.fontSize.sm};
//   display: flex;
//   align-items: center;
//   transition: all 0.2s ease;
//   
//   &:hover {
//     background-color: ${({ theme, active }) => active ? theme.colors.primaryLight : theme.colors.backgroundLight};
//     transform: translateY(-1px);
//   }
//   
//   svg {
//     margin-right: ${({ theme }) => theme.spacing.xs};
//   }
// `;

// 三栏布局容器
const TriColumnLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

// 单个栏目容器
const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  height: min-content;
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

// 栏目标题
const ColumnHeader = styled.div<{ color: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ color }) => color};
  background: ${({ color }) => `linear-gradient(90deg, ${color}15, transparent)`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(5px);
`;

const ColumnTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme, color }) => color || theme.colors.text};
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: ${({ theme }) => theme.spacing.sm};
    border-radius: 50%;
    background-color: ${({ color }) => color};
  }
`;

const TokenCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

// 代币卡片容器
const TokensList = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 70vh;
  overflow-y: auto;
  overscroll-behavior: contain; /* 防止滚动传播到父元素 */
  scroll-behavior: smooth; /* 平滑滚动 */
  
  /* 美化滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundLight};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary}66;
    border-radius: 4px;
    border: 1px solid transparent;
    background-clip: padding-box;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  
  /* 添加淡入淡出效果 */
  mask-image: linear-gradient(to bottom, transparent, black 10px, black calc(100% - 20px), transparent);
`;

// 单个代币卡片
const TokenCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary}33;
  }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TokenLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spacing.sm};
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
`;

const TokenInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TokenSymbol = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const TokenMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundLight}55;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetricValue = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  border-top: 1px solid ${({ theme }) => theme.colors.backgroundLight}33;
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundLight}33;
  margin: ${({ theme }) => `${theme.spacing.xs} 0`};
`;

const TokenPrice = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const TokenChange = styled.div<{ positive: boolean }>`
  color: ${({ theme, positive }) => positive ? theme.colors.success : theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, positive }) => 
    positive ? theme.colors.success + '15' : theme.colors.error + '15'};
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const ProgressContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const ProgressLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
`;

const ProgressFill = styled.div<{ progress: number; color: string }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ color }) => color};
  transition: width 0.3s ease;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%
  );
  background-size: 10px 10px;
`;

// 空状态
const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

// 箭头图标组件
const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="#4CAF50"/>
  </svg>
);

const ArrowDown = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10L0.669873 2.5L9.33013 2.5L5 10Z" fill="#F44336"/>
  </svg>
);

const TokenListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(allTokens);
  
  const launchingTokens = filteredTokens.filter(token => token.status === TokenStatusEnum.LAUNCHING);
  const upcomingTokens = filteredTokens.filter(token => token.status === TokenStatusEnum.UPCOMING);
  const launchedTokens = filteredTokens.filter(token => token.status === TokenStatusEnum.LAUNCHED);
  
  useEffect(() => {
    let result = [...allTokens];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(token => 
        token.name.toLowerCase().includes(term) || 
        token.symbol.toLowerCase().includes(term)
      );
    }
    
    setFilteredTokens(result);
  }, [searchTerm]);
  
  const handleTokenClick = (id: string) => {
    navigate(`/token/${id}`);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const getTimeRemaining = (launchDate: number) => {
    const now = Date.now();
    const distance = launchDate - now;
    
    if (distance < 0) return 'Launched';
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };
  
  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(decimals)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(decimals)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(decimals)}K`;
    } else {
      return `$${num.toFixed(decimals)}`;
    }
  };
  
  // 渲染单个代币卡片
  const renderTokenCard = (token: Token) => (
    <TokenCard key={token.id} onClick={() => handleTokenClick(token.id)}>
      <TokenHeader>
        <TokenLogo 
          src={token.logo || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23C0B283"/><text x="16" y="20" font-size="14" text-anchor="middle" fill="white" font-family="Arial, sans-serif">${token.symbol?.[0] || '?'}</text></svg>`} 
          alt={token.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23C0B283"/><text x="16" y="20" font-size="14" text-anchor="middle" fill="white" font-family="Arial, sans-serif">${token.symbol?.[0] || '?'}</text></svg>`;
          }}
        />
        <TokenInfo>
          <TokenName>{token.name}</TokenName>
          <TokenSymbol>{token.symbol}</TokenSymbol>
        </TokenInfo>
      </TokenHeader>
      
      <PriceArea>
        <TokenPrice>
          ${(token.currentPrice || token.initialPrice).toFixed(4)}
        </TokenPrice>
        {token.change24h !== undefined ? (
          <TokenChange positive={token.change24h >= 0}>
            {token.change24h >= 0 ? <ArrowUp /> : <ArrowDown />}
            {Math.abs(token.change24h).toFixed(2)}%
          </TokenChange>
        ) : null}
      </PriceArea>
      
      <TokenMetrics>
        {token.marketCap ? (
          <MetricItem>
            <MetricLabel>Market Cap</MetricLabel>
            <MetricValue>{formatNumber(token.marketCap)}</MetricValue>
          </MetricItem>
        ) : (
          <MetricItem>
            <MetricLabel>Total Supply</MetricLabel>
            <MetricValue>{token.totalSupply.toLocaleString()}</MetricValue>
          </MetricItem>
        )}
        
        {token.volume24h ? (
          <MetricItem>
            <MetricLabel>24h Volume</MetricLabel>
            <MetricValue>{formatNumber(token.volume24h)}</MetricValue>
          </MetricItem>
        ) : (
          <MetricItem>
            <MetricLabel>Launch Date</MetricLabel>
            <MetricValue>{formatDate(token.launchDate)}</MetricValue>
          </MetricItem>
        )}
      </TokenMetrics>
      
      {token.progress !== undefined && (
        <ProgressContainer>
          <ProgressInfo>
            <ProgressLabel>Launch Progress</ProgressLabel>
            <ProgressValue>{token.progress}%</ProgressValue>
          </ProgressInfo>
          <ProgressBar>
            <ProgressFill 
              progress={token.progress} 
              color={token.status === 'upcoming' ? '#2196F3' : '#FFC107'} 
            />
          </ProgressBar>
          <ProgressLabel style={{ textAlign: 'right', marginTop: '4px' }}>
            {getTimeRemaining(token.launchDate)}
          </ProgressLabel>
        </ProgressContainer>
      )}
    </TokenCard>
  );
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Token Explorer</PageTitle>
        <Button onClick={() => navigate('/create-token')}>Create Token</Button>
      </PageHeader>
      
      <FiltersBar>
        {/* Removed All Categories button */}
        
        <SearchContainer>
          <Input
            placeholder="Search tokens"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </SearchContainer>
      </FiltersBar>
      
      <TriColumnLayout>
        {/* 新开盘代币 */}
        <Column>
          <ColumnHeader color="#FFC107">
            <ColumnTitle color="#FFC107">New Launches</ColumnTitle>
            <TokenCount>{launchingTokens.length}</TokenCount>
          </ColumnHeader>
          <TokensList>
            {launchingTokens.length > 0 ? (
              launchingTokens.map(renderTokenCard)
            ) : (
              <EmptyState>No launching tokens found</EmptyState>
            )}
          </TokensList>
        </Column>
        
        {/* 即将发射代币 */}
        <Column>
          <ColumnHeader color="#2196F3">
            <ColumnTitle color="#2196F3">Upcoming</ColumnTitle>
            <TokenCount>{upcomingTokens.length}</TokenCount>
          </ColumnHeader>
          <TokensList>
            {upcomingTokens.length > 0 ? (
              upcomingTokens.map(renderTokenCard)
            ) : (
              <EmptyState>No upcoming tokens found</EmptyState>
            )}
          </TokensList>
        </Column>
        
        {/* 已发射代币 */}
        <Column>
          <ColumnHeader color="#4CAF50">
            <ColumnTitle color="#4CAF50">Launched</ColumnTitle>
            <TokenCount>{launchedTokens.length}</TokenCount>
          </ColumnHeader>
          <TokensList>
            {launchedTokens.length > 0 ? (
              launchedTokens.map(renderTokenCard)
            ) : (
              <EmptyState>No launched tokens found</EmptyState>
            )}
          </TokensList>
        </Column>
      </TriColumnLayout>
    </PageContainer>
  );
};

export default TokenListPage;
