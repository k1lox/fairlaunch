/**
 * 钱包连接器组件 - 用于连接用户钱包的UI组件
 * Wallet Connector Component - UI component for connecting user wallet
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import { useWeb3 } from '../../services/web3/Web3Provider';

/**
 * 钱包连接按钮样式
 * Wallet connect button style
 */
const ConnectButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

/**
 * 钱包信息显示组件
 * Wallet info display component
 */
const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: monospace;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

/**
 * 钱包图标组件
 * Wallet icon component
 */
const WalletIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
`;

/**
 * 断开连接按钮组件
 * Disconnect button component
 */
const DisconnectButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  margin-left: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

/**
 * 钱包连接器组件
 * Wallet Connector Component
 */
const WalletConnector: React.FC = () => {
  const { t } = useLanguage();
  const { account, connect, disconnect, balance } = useWeb3();
  
  /**
   * 格式化钱包地址显示
   * Format wallet address display
   */
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  /**
   * 处理断开连接事件并阻止事件冒泡
   * Handle disconnect event and prevent event bubbling
   */
  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
  };
  
  /**
   * 复制钱包地址到剪贴板
   * Copy wallet address to clipboard
   */
  const copyAddressToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account)
        .then(() => {
          alert(t('addressCopied'));
        })
        .catch(err => {
          console.error('Failed to copy address: ', err);
        });
    }
  };
  
  return account ? (
    <WalletInfo onClick={copyAddressToClipboard}>
      <WalletIcon>W</WalletIcon>
      {formatAddress(account)}
      <DisconnectButton onClick={handleDisconnect}>
        ✕
      </DisconnectButton>
    </WalletInfo>
  ) : (
    <ConnectButton onClick={connect}>
      {t('connectWallet')}
    </ConnectButton>
  );
};

export default WalletConnector;
