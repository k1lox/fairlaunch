
/**
 * 代币卡片组件 - 展示代币基本信息的卡片UI组件
 * Token Card Component - Card UI component that displays basic token information
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Token, TokenStatus } from '../../types/tokens';
import { Card } from '../common/Card';

import logo1 from '../../assests/1.jpg';
import logo2 from '../../assests/2.jpg';
import logo3 from '../../assests/3.jpg';
import logo4 from '../../assests/4.jpg';

/**
 * 代币卡片属性接口
 * Token Card Props Interface
 */
interface TokenCardProps {
  token: Token;
}

/**
 * 样式化的代币卡片基础组件 - 添加交互和视觉效果
 * Styled Token Card Base Component - Add interaction and visual effects
 */
const StyledTokenCard = styled(Card)`
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary}33;
  }
`;


/**
 * 紧凑型代币卡片组件 - 优化显示效果的紧凑布局
 * Compact Token Card Component - Compact layout for optimized display
 */
const CompactTokenCard = styled(StyledTokenCard)`
  padding: ${({ theme }) => theme.spacing.sm};
  max-height: 180px;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto 1fr;
`;

/**
 * 代币卡片头部组件 - 显示代币标志和基本标识信息
 * Token Card Header Component - Display token logo and basic identification information
 */
const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  min-height: 36px;
`;


/**
 * Logo容器组件 - 圆形容器用于展示代币图标
 * Logo Container Component - Circular container for displaying token icon
 */
const LogoContainer = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  margin-right: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

/**
 * 代币Logo图片组件 - 展示代币图标
 * Token Logo Image Component - Display token icon
 */
const TokenLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


/**
 * 备用Logo组件 - 当代币图标加载失败时显示的默认头像
 * Fallback Logo Component - Default avatar displayed when token icon fails to load
 */
const FallbackLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary}33;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 14px;
`;

const TokenInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TokenName = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TokenSymbol = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: inline-block;
`;

const TokenPrice = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
`;

const TokenChange = styled.span<{ isPositive: boolean }>`
  color: ${({ theme, isPositive }) => 
    isPositive ? theme.colors.success : theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const TokenMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TokenMetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenMetaLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TokenMetaValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const StatusBadge = styled.div<{ status: TokenStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `2px ${theme.spacing.sm}`};
  border-radius: 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  height: 20px;
  
  ${({ status, theme }) => {
    switch (status) {
      case TokenStatus.UPCOMING:
        return `
          background-color: ${theme.colors.primary}22;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary}33;
        `;
      case TokenStatus.LAUNCHING:
        return `
          background-color: ${theme.colors.primary}22;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary}33;
        `;
      case TokenStatus.LAUNCHED:
        return `
          background-color: ${theme.colors.success}22;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}33;
        `;
      default:
        return '';
    }
  }}
`;


const ProgressContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

const ProgressLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width ${({ theme }) => theme.transitions.medium};
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

const LaunchTime = styled.div`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
`;

/**
 * 代币卡片组件 - 展示代币信息并处理交互
 * Token Card Component - Display token information and handle interactions
 * 
 * @param token 代币数据对象 (Token data object)
 */
const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  
  /**
   * 处理卡片点击事件 - 导航到代币详情页
   * Handle card click event - Navigate to token detail page
   */
  const handleCardClick = () => {
    navigate(`/token/${token.id}`);
  };

  /**
   * 格式化日期 - 将时间戳转换为本地日期格式
   * Format date - Convert timestamp to local date format
   * 
   * @param timestamp 时间戳 (Timestamp)
   * @returns 格式化的日期字符串 (Formatted date string)
   */
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  /**
   * 获取距离发布的时间 - 计算并格式化距离代币发布的剩余时间
   * Get time until launch - Calculate and format the remaining time until token launch
   * 
   * @param launchDate 发布日期时间戳 (Launch date timestamp)
   * @returns 格式化的倒计时字符串 (Formatted countdown string)
   */
  const getTimeUntilLaunch = (launchDate: number) => {
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    if (distance < 0) return 'Launched';
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  /**
   * 获取状态文本 - 根据代币状态枚举返回对应的文本描述
   * Get status text - Return the corresponding text description based on token status enum
   * 
   * @param status 代币状态枚举 (Token status enum)
   * @returns 状态文本 (Status text)
   */
  const getStatusText = (status: TokenStatus) => {
    switch (status) {
      case TokenStatus.UPCOMING:
        return 'Upcoming';
      case TokenStatus.LAUNCHING:
        return 'Launching';
      case TokenStatus.LAUNCHED:
        return 'Launched';
      default:
        return '';
    }
  };


  /**
   * 默认Logo图片列表 - 当代币没有Logo时使用的备选图片
   * Default Logo Image List - Alternative images used when token has no logo
   */
  const defaultLogos = [logo1, logo2, logo3, logo4];
  

  /**
   * 获取默认Logo - 根据代币ID确定性地选择默认Logo
   * Get default logo - Deterministically select default logo based on token ID
   * 
   * @returns 默认Logo图片 (Default logo image)
   */
  const getDefaultLogo = () => {
    if (!token.id) return defaultLogos[0];

    const lastChar = token.id.charAt(token.id.length - 1);
    const index = lastChar.charCodeAt(0) % defaultLogos.length;
    return defaultLogos[index];
  };
  

  /**
   * 处理图片加载错误 - 当Logo图片加载失败时显示备用Logo
   * Handle image loading error - Display fallback logo when logo image fails to load
   */
  const handleImageError = () => {
    console.log("Image failed to load for token:", token.name);
    setImgError(true);
  };


  /**
   * 获取首字母 - 提取代币名称的首字母作为备用显示
   * Get initials - Extract the first letter of token name as a fallback display
   * 
   * @returns 代币名称首字母 (First letter of token name)
   */
  const getInitials = () => {
    if (!token.name) return '?';
    return token.name.charAt(0).toUpperCase();
  };

  return (
    <CompactTokenCard hoverEffect onClick={handleCardClick}>
      <TokenHeader>
        <LogoContainer>
          {imgError ? (
            <FallbackLogo>{getInitials()}</FallbackLogo>
          ) : (
            <TokenLogo 
              src={token.logo || getDefaultLogo()} 
              alt={`${token.name} logo`}
              onError={handleImageError}
            />
          )}
        </LogoContainer>
        <TokenInfo>
          <TokenName>{token.name}</TokenName>
          <TokenSymbol>{token.symbol}</TokenSymbol>
        </TokenInfo>
        <StatusBadge status={token.status}>
          {getStatusText(token.status)}
        </StatusBadge>
      </TokenHeader>
      
      {token.status === TokenStatus.LAUNCHED && token.currentPrice && (
        <>
          <TokenPrice>
            ${token.currentPrice.toFixed(4)}
            {token.change24h && (
              <TokenChange isPositive={token.change24h >= 0}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </TokenChange>
            )}
          </TokenPrice>
          
          <TokenMeta>
            <TokenMetaItem>
              <TokenMetaLabel>Market Cap</TokenMetaLabel>
              <TokenMetaValue>${token.marketCap?.toLocaleString() || 'N/A'}</TokenMetaValue>
            </TokenMetaItem>
            <TokenMetaItem>
              <TokenMetaLabel>24h Volume</TokenMetaLabel>
              <TokenMetaValue>${token.volume24h?.toLocaleString() || 'N/A'}</TokenMetaValue>
            </TokenMetaItem>
          </TokenMeta>
        </>
      )}
      
      {token.status !== TokenStatus.LAUNCHED && (
        <>
          <TokenPrice>
            Initial: ${token.initialPrice.toFixed(4)}
          </TokenPrice>
          
          <TokenMeta>
            <TokenMetaItem>
              <TokenMetaLabel>Total Supply</TokenMetaLabel>
              <TokenMetaValue>{token.totalSupply.toLocaleString()}</TokenMetaValue>
            </TokenMetaItem>
            <TokenMetaItem>
              <TokenMetaLabel>Launch Date</TokenMetaLabel>
              <TokenMetaValue>{formatDate(token.launchDate)}</TokenMetaValue>
            </TokenMetaItem>
          </TokenMeta>
          
          {token.progress !== undefined && (
            <ProgressContainer>
              <ProgressHeader>
                <ProgressLabel>Progress: {token.progress}%</ProgressLabel>
              </ProgressHeader>
              <ProgressBar>
                <ProgressFill progress={token.progress} />
              </ProgressBar>
              <LaunchTime>
                {getTimeUntilLaunch(token.launchDate)}
              </LaunchTime>
            </ProgressContainer>
          )}
        </>
      )}
    </CompactTokenCard>
  );
};

export default TokenCard;
