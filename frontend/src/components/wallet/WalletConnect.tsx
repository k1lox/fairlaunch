// src/components/wallet/WalletConnect.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';

// 钱包连接组件的样式
const WalletButton = styled(Button)`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const WalletAddress = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: monospace;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

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
  color: ${({ theme }) => theme.colors.text};
`;

const DisconnectBtn = styled.button`
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

// 彩虹连接器组件（模拟 - 后续会被实际的Rainbow Kit替换）
export const WalletConnect: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  
  // 模拟连接钱包
  const connectWallet = async () => {
    try {
      // 模拟连接过程
      console.log('Connecting to wallet...');
      
      // 2秒后模拟连接成功
      setTimeout(() => {
        const mockAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
        setAddress(mockAddress);
        setConnected(true);
        localStorage.setItem('connected', 'true');
        localStorage.setItem('walletAddress', mockAddress);
      }, 1000);
    } catch (error) {
      console.error('Failed to connect wallet', error);
    }
  };
  
  // 断开钱包连接
  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
    localStorage.removeItem('connected');
    localStorage.removeItem('walletAddress');
  };
  
  // 检查是否有保存的连接状态
  useEffect(() => {
    const isConnected = localStorage.getItem('connected') === 'true';
    if (isConnected) {
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress) {
        setAddress(savedAddress);
        setConnected(true);
      }
    }
  }, []);
  
  // 格式化地址显示
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  return connected ? (
    <WalletAddress onClick={() => navigator.clipboard.writeText(address)}>
      <WalletIcon>W</WalletIcon>
      {formatAddress(address)}
      <DisconnectBtn onClick={(e) => {
        e.stopPropagation();
        disconnectWallet();
      }}>✕</DisconnectBtn>
    </WalletAddress>
  ) : (
    <WalletButton onClick={connectWallet} size="small">
      Connect Wallet
    </WalletButton>
  );
};

export default WalletConnect;