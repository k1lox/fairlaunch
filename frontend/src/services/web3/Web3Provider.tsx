// src/services/web3/Web3Provider.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

// 模拟Web3相关的类型
interface Web3ContextProps {
  provider: any | null;
  signer: any | null;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
  balance: string;
}

// 创建上下文
const Web3Context = createContext<Web3ContextProps>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
  error: null,
  balance: '0'
});

export const useWeb3 = () => useContext(Web3Context);

// 模拟账户数据
const MOCK_ACCOUNTS = [
  {
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    balance: '10.5'
  },
  {
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    balance: '25.2'
  },
  {
    address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    balance: '5.8'
  }
];

// 检查一下环境，避免对window.ethereum重复定义
function isEthereumDefined(): boolean {
  try {
    return typeof window !== 'undefined' && 
           typeof (window as any).ethereum !== 'undefined';
  } catch (e) {
    return false;
  }
}

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 模拟连接钱包
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // 模拟连接延迟
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // 随机选择一个模拟账户
      const randomAccount = MOCK_ACCOUNTS[Math.floor(Math.random() * MOCK_ACCOUNTS.length)];
      
      setAccount(randomAccount.address);
      setBalance(randomAccount.balance);
      
      // 在localStorage中存储连接状态，模拟持久连接
      localStorage.setItem('mockWalletConnected', 'true');
      localStorage.setItem('mockWalletAddress', randomAccount.address);
      localStorage.setItem('mockWalletBalance', randomAccount.balance);
      
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError('Error connecting to wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // 模拟断开连接
  const disconnect = useCallback(() => {
    setAccount(null);
    setBalance('0');
    setError(null);
    
    // 清除localStorage中的连接状态
    localStorage.removeItem('mockWalletConnected');
    localStorage.removeItem('mockWalletAddress');
    localStorage.removeItem('mockWalletBalance');
  }, []);

  // 自动恢复上次连接状态
  React.useEffect(() => {
    // 不使用真实的ethereum钱包，仅使用模拟数据
    const isConnected = localStorage.getItem('mockWalletConnected') === 'true';
    if (isConnected) {
      const address = localStorage.getItem('mockWalletAddress');
      const balance = localStorage.getItem('mockWalletBalance');
      
      if (address) {
        setAccount(address);
        setBalance(balance || '0');
      }
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider: {}, // 提供一个空对象作为模拟provider
        signer: {},   // 提供一个空对象作为模拟signer
        account,
        chainId: 1,   // 模拟以太坊主网
        connect,
        disconnect,
        isConnecting,
        error,
        balance
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
