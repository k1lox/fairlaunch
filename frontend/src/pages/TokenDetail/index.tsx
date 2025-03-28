import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Token, TokenTransaction, TokenPrice } from '../../types/tokens';
import { PriceChart } from '../../components/token/PriceCharts';
import { TransactionList } from '../../components/token/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { apiService } from '../../services/api';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TokenLogo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
`;

const TokenSymbol = styled.span`
  margin-left: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-transform: uppercase;
  margin-left: ${({ theme }) => theme.spacing.md};
  
  ${({ status, theme }) => {
    switch (status) {
      case 'upcoming':
        return `
          background-color: ${theme.colors.primary}33;
          color: ${theme.colors.primary};
        `;
      case 'launching':
        return `
          background-color: ${theme.colors.primary}33;
          color: ${theme.colors.primary};
        `;
      case 'launched':
        return `
          background-color: ${theme.colors.success}33;
          color: ${theme.colors.success};
        `;
      default:
        return '';
    }
  }}
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TokenDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const MetricCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.md};
`;

const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const TokenPriceDisplay = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
`;

const TokenChange = styled.span<{ isPositive: boolean }>`
  color: ${({ theme, isPositive }) => 
    isPositive ? theme.colors.success : theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const BuySellContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const TransactionInputContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TransactionInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProgressContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width ${({ theme }) => theme.transitions.medium};
`;

// 错误显示组件
const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.error}22;
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ErrorMessageContent = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

// 加载中组件
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;

const LoadingDot = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-in-out;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.3s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.6s;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const TokenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<Token | null>(null);
  const [priceHistory, setPriceHistory] = useState<TokenPrice[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // 使用useCallback来避免循环依赖
  const fetchTokenData = useCallback(async () => {
    if (!id) {
      setError("Token ID not found");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 获取代币信息
      const tokenData = await apiService.getTokenById(id);
      if (!tokenData) {
        setError("Token not found");
        setLoading(false);
        return;
      }
      
      setToken(tokenData);
      
      try {
        // 获取价格历史
        const history = await apiService.getTokenPriceHistory(id);
        setPriceHistory(history || []);
      } catch (err) {
        console.log("Error loading price history:", err);
        // 不会因为价格历史加载失败而中断整个页面
        setPriceHistory([]);
      }
      
      try {
        // 获取交易记录
        const txs = await apiService.getTokenTransactions(id);
        setTransactions(txs || []);
      } catch (err) {
        console.log("Error loading transactions:", err);
        // 不会因为交易记录加载失败而中断整个页面
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError("Failed to load token data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    // 只在组件挂载时和id变化时获取数据
    fetchTokenData();
  }, [fetchTokenData]);
  
  const handleBuy = useCallback(async () => {
    if (!token || !amount) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    try {
      const price = token.currentPrice || token.initialPrice || 0;
      await apiService.recordTokenTransaction(token.id, 'buy', numAmount, price);
      
      // 刷新交易记录
      const txs = await apiService.getTokenTransactions(token.id);
      setTransactions(txs);
      
      // 清空输入
      setAmount('');
    } catch (err) {
      console.error('Error buying tokens:', err);
    }
  }, [token, amount]);
  
  const handleSell = useCallback(async () => {
    if (!token || !amount) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    try {
      const price = token.currentPrice || token.initialPrice || 0;
      await apiService.recordTokenTransaction(token.id, 'sell', numAmount, price);
      
      // 刷新交易记录
      const txs = await apiService.getTokenTransactions(token.id);
      setTransactions(txs);
      
      // 清空输入
      setAmount('');
    } catch (err) {
      console.error('Error selling tokens:', err);
    }
  }, [token, amount]);
  
  const formatDate = useCallback((timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch (err) {
      return 'Invalid date';
    }
  }, []);
  
  const getTimeUntilLaunch = useCallback((launchDate: number) => {
    try {
      const now = new Date().getTime();
      const distance = launchDate - now;
      
      if (distance < 0) return 'Launched';
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days}d ${hours}h ${minutes}m`;
    } catch (err) {
      return 'Unknown';
    }
  }, []);
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingDot />
          <LoadingDot />
          <LoadingDot />
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  if (error || !token) {
    return (
      <PageContainer>
        <ErrorMessage>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px' }}></i>
          <ErrorMessageContent>{error || "Token not found"}</ErrorMessageContent>
        </ErrorMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <TokenLogo src={token.logo} alt={`${token.name} logo`} />
        <TokenInfo>
          <TokenName>
            {token.name}
            <TokenSymbol>{token.symbol}</TokenSymbol>
            <StatusBadge status={token.status}>{token.status}</StatusBadge>
          </TokenName>
          <SocialLinks>
            {token.website && (
              <SocialLink href={token.website} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-globe"></i>
              </SocialLink>
            )}
            {token.socialLinks?.twitter && (
              <SocialLink href={token.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </SocialLink>
            )}
            {token.socialLinks?.telegram && (
              <SocialLink href={token.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-telegram-plane"></i>
              </SocialLink>
            )}
            {token.socialLinks?.discord && (
              <SocialLink href={token.socialLinks.discord} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-discord"></i>
              </SocialLink>
            )}
            {token.socialLinks?.github && (
              <SocialLink href={token.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </SocialLink>
            )}
          </SocialLinks>
        </TokenInfo>
      </PageHeader>
      
      <ContentGrid>
        <LeftColumn>
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart data={priceHistory || []} />
            </CardContent>
          </Card>
          
          <TransactionList transactions={transactions || []} />
        </LeftColumn>
        
        <RightColumn>
          <Card>
            <CardHeader>
              <CardTitle>{token.name} Details</CardTitle>
            </CardHeader>
            <CardContent>
              <TokenDescription>{token.description}</TokenDescription>
              
              {token.status === 'launched' && token.currentPrice && (
                <TokenPriceDisplay>
                  ${token.currentPrice.toFixed(4)}
                  {token.change24h !== undefined && (
                    <TokenChange isPositive={token.change24h >= 0}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </TokenChange>
                  )}
                </TokenPriceDisplay>
              )}
              
              {token.status !== 'launched' && (
                <TokenPriceDisplay>
                  Initial: ${token.initialPrice.toFixed(4)}
                </TokenPriceDisplay>
              )}
              
              <MetricsGrid>
                <MetricCard>
                  <MetricLabel>Total Supply</MetricLabel>
                  <MetricValue>{token.totalSupply.toLocaleString()}</MetricValue>
                </MetricCard>
                
                {token.circulatingSupply !== undefined && (
                  <MetricCard>
                    <MetricLabel>Circulating Supply</MetricLabel>
                    <MetricValue>{token.circulatingSupply.toLocaleString()}</MetricValue>
                  </MetricCard>
                )}
                
                {token.marketCap !== undefined && (
                  <MetricCard>
                    <MetricLabel>Market Cap</MetricLabel>
                    <MetricValue>${token.marketCap.toLocaleString()}</MetricValue>
                  </MetricCard>
                )}
                
                {token.volume24h !== undefined && (
                  <MetricCard>
                    <MetricLabel>24h Volume</MetricLabel>
                    <MetricValue>${token.volume24h.toLocaleString()}</MetricValue>
                  </MetricCard>
                )}
              </MetricsGrid>
              
              {token.contractAddress && (
                <div style={{ marginTop: '20px' }}>
                  <MetricLabel>Contract Address</MetricLabel>
                  <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '14px' }}>
                    {token.contractAddress}
                  </div>
                </div>
              )}
              
              {(token.status === 'upcoming' || token.status === 'launching') && (
                <ProgressContainer>
                  <ProgressLabel>
                    <span>Launch Progress</span>
                    <span>{token.progress || 0}%</span>
                  </ProgressLabel>
                  <ProgressBar>
                    <ProgressFill progress={token.progress || 0} />
                  </ProgressBar>
                  <div style={{ 
                    textAlign: 'right', 
                    marginTop: '8px', 
                    fontSize: '14px', 
                    color: '#B3B3B3' 
                  }}>
                    Launch Date: {formatDate(token.launchDate)} ({getTimeUntilLaunch(token.launchDate)})
                  </div>
                </ProgressContainer>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trade {token.symbol}</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionInputContainer>
                <TransactionInput 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Amount of ${token.symbol}`}
                  min="0"
                />
                <BuySellContainer>
                  <Button 
                    onClick={handleBuy} 
                    disabled={!amount}
                    fullWidth
                  >
                    Buy
                  </Button>
                  <Button 
                    onClick={handleSell} 
                    disabled={!amount}
                    variant="outlined"
                    fullWidth
                  >
                    Sell
                  </Button>
                </BuySellContainer>
              </TransactionInputContainer>
            </CardContent>
          </Card>
        </RightColumn>
      </ContentGrid>
    </PageContainer>
  );
};

export default TokenDetailPage;