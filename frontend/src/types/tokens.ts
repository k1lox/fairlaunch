// src/types/token.ts
export enum TokenStatus {
    UPCOMING = 'upcoming',   // 即将发射
    LAUNCHING = 'launching', // 新开盘
    LAUNCHED = 'launched'    // 已发射
  }
  
  export interface TokenPrice {
    timestamp: number;
    price: number;
    volume: number;
  }
  
  export interface TokenTransaction {
    id: string;
    tokenId: string;
    address: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    timestamp: number;
  }
  
  export interface Token {
    id: string;
    name: string;
    symbol: string;
    contractAddress?: string; // 已发布的代币才有合约地址
    description: string;
    logo: string;
    website?: string;
    socialLinks?: {
      twitter?: string;
      telegram?: string;
      discord?: string;
      github?: string;
    };
    launchDate: number; // Unix timestamp
    initialPrice: number;
    currentPrice?: number; // 已发布的代币才有当前价格
    marketCap?: number;
    volume24h?: number;
    change24h?: number;
    totalSupply: number;
    circulatingSupply?: number;
    status: TokenStatus;
    priceHistory?: TokenPrice[];
    transactions?: TokenTransaction[];
    progress?: number; // 0-100 表示发射进度
  }