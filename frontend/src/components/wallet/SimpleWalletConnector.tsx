/**
 * 安全的Web3交互组件 - 用于安全连接和管理钱包状态
 * Safe Web3 Interaction Component - For safely connecting and managing wallet state
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * 钱包连接按钮样式
 * Wallet connection button styles
 */
const ConnectButton = styled.button`
  background: linear-gradient(90deg, #7B1FA2, #9C27B0);
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(90deg, #9C27B0, #7B1FA2);
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

/**
 * 钱包信息容器样式
 * Wallet info container styles
 */
const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

/**
 * 钱包图标样式
 * Wallet icon styles
 */
const WalletAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, #7B1FA2, #9C27B0);
  margin-right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

/**
 * 钱包地址样式
 * Wallet address styles
 */
const WalletAddress = styled.span`
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

/**
 * 网络指示器样式
 * Network indicator styles
 */
const NetworkIndicator = styled.div`
  width: 12px;
  height: 12px;
  background-color: #22c55e;
  border-radius: 50%;
  margin-left: 8px;
`;

/**
 * 旋转图标样式
 * Spinner icon styles
 */
const SpinnerIcon = styled.span`
  margin-left: 8px;
  display: inline-block;
  animation: spin 1s infinite linear;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

/**
 * 检查ethereum对象是否存在，安全地包装为避免在SSR环境中出错
 * Safely check if ethereum object exists to avoid errors in SSR environment
 */
const getEthereum = (): any | undefined => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }
    return undefined;
  } catch (e) {
    console.error('Error accessing ethereum object:', e);
    return undefined;
  }
};

/**
 * 基本的钱包连接组件
 * Basic wallet connector component
 */
const SimpleWalletConnector: React.FC = () => {
  const { t } = useLanguage();
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const isMounted = useRef(true);
  
  // 安全地更新状态 - 只有在组件仍然挂载时
  const safeSetAccount = useCallback((value: string | null) => {
    if (isMounted.current) {
      setAccount(value);
    }
  }, []);
  
  // 安全地更新连接状态
  const safeSetConnecting = useCallback((value: boolean) => {
    if (isMounted.current) {
      setConnecting(value);
    }
  }, []);
  
  // 安全地更新钱包状态
  const safeSetHasWallet = useCallback((value: boolean) => {
    if (isMounted.current) {
      setHasWallet(value);
    }
  }, []);
  
  // 格式化账户地址显示
  const formatAddress = useCallback((address: string | null): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);
  
  // 安全地执行ethereum方法
  const safeEthereumRequest = useCallback(async (method: string, params?: any[]): Promise<any> => {
    const ethereum = getEthereum();
    if (!ethereum) {
      throw new Error('No ethereum object found');
    }
    
    try {
      return await ethereum.request({ method, params });
    } catch (error: any) {
      // 特殊处理4001错误 - 用户拒绝连接或者没有账户
      if (error && error.code === 4001) {
        console.log('User rejected the request or has no accounts', error.message);
        return []; // 返回空数组作为有效结果
      }
      
      // 重新抛出其他错误
      throw error;
    }
  }, []);
  
  // 处理账户变更
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (!isMounted.current) return;
    
    if (!accounts || accounts.length === 0) {
      safeSetAccount(null);
    } else {
      safeSetAccount(accounts[0]);
    }
  }, [safeSetAccount]);
  
  // 处理链变更
  const handleChainChanged = useCallback(() => {
    if (isMounted.current) {
      window.location.reload();
    }
  }, []);
  
  // 检查钱包连接状态
  useEffect(() => {
    // 重置挂载状态
    isMounted.current = true;
    
    // 检查钱包是否存在
    const checkWalletExists = () => {
      const hasEthereum = !!getEthereum();
      safeSetHasWallet(hasEthereum);
      return hasEthereum;
    };
    
    // 检查账户连接状态
    const checkAccounts = async () => {
      if (!checkWalletExists()) return;
      
      try {
        const accounts = await safeEthereumRequest('eth_accounts');
        
        if (Array.isArray(accounts) && accounts.length > 0) {
          safeSetAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking accounts:', error);
      }
    };
    
    // 设置事件监听器
    const setupListeners = () => {
      const ethereum = getEthereum();
      if (!ethereum) return;
      
      try {
        // 移除任何可能的现有监听器以避免重复
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
        
        // 添加新的监听器
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
      } catch (error) {
        console.error('Error setting up ethereum listeners:', error);
      }
    };
    
    // 初始化
    checkAccounts();
    setupListeners();
    
    // 清理函数
    return () => {
      isMounted.current = false;
      
      try {
        const ethereum = getEthereum();
        if (ethereum) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      } catch (error) {
        console.error('Error removing ethereum listeners:', error);
      }
    };
  }, [safeSetAccount, safeSetHasWallet, handleAccountsChanged, handleChainChanged, safeEthereumRequest]);
  
  // 连接钱包
  const connectWallet = useCallback(async () => {
    if (!getEthereum()) {
      alert(t('installWalletPrompt') || 'Please install MetaMask or another Web3 wallet to connect');
      return;
    }
    
    safeSetConnecting(true);
    
    try {
      const accounts = await safeEthereumRequest('eth_requestAccounts');
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        safeSetAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // 错误已在safeEthereumRequest中处理
    } finally {
      safeSetConnecting(false);
    }
  }, [safeEthereumRequest, safeSetAccount, safeSetConnecting, t]);
  
  // 断开钱包连接 (仅UI层面)
  const disconnectWallet = useCallback(() => {
    safeSetAccount(null);
  }, [safeSetAccount]);
  
  // 处理钱包不可用的情况
  if (hasWallet === false) {
    return (
      <ConnectButton 
        onClick={() => window.open('https://metamask.io/download/', '_blank')}
      >
        {t('installWallet') || 'Install Wallet'}
      </ConnectButton>
    );
  }
  
  return (
    <>
      {account ? (
        <WalletInfo onClick={disconnectWallet} title={t('clickToDisconnect') || 'Click to disconnect'}>
          <WalletAvatar>W</WalletAvatar>
          <WalletAddress>{formatAddress(account)}</WalletAddress>
          <NetworkIndicator />
        </WalletInfo>
      ) : (
        <ConnectButton 
          onClick={connectWallet} 
          disabled={connecting}
          style={{
            opacity: connecting ? 0.7 : 1,
            cursor: connecting ? 'wait' : 'pointer'
          }}
        >
          {connecting ? `${t('connecting') || 'Connecting...'}` : t('connectWallet') || 'Connect Wallet'}
          {connecting && <SpinnerIcon>⟳</SpinnerIcon>}
        </ConnectButton>
      )}
    </>
  );
};

// 为Window对象添加ethereum类型定义
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export default SimpleWalletConnector;
