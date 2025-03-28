// src/mock/tokens.ts
import { Token, TokenStatus, TokenPrice, TokenTransaction } from '../types/tokens';

// 生成随机价格历史
const generatePriceHistory = (
  days: number, 
  initialPrice: number, 
  volatility: number = 0.05
): TokenPrice[] => {
  const now = new Date().getTime();
  const history: TokenPrice[] = [];
  let price = initialPrice;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const change = (Math.random() - 0.5) * 2 * volatility;
    price = price * (1 + change);
    
    // 每天添加多个价格点
    for (let hour = 0; hour < 24; hour += 4) {
      const hourlyTimestamp = timestamp + (hour * 60 * 60 * 1000);
      const hourlyChange = (Math.random() - 0.5) * 2 * volatility * 0.3;
      const hourlyPrice = price * (1 + hourlyChange);
      const volume = Math.random() * 100000 + 10000;
      
      history.push({
        timestamp: hourlyTimestamp,
        price: hourlyPrice,
        volume
      });
    }
  }
  
  return history;
};

// 生成随机交易记录
const generateTransactions = (tokenId: string, count: number, price: number): TokenTransaction[] => {
  const now = new Date().getTime();
  const transactions: TokenTransaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const timestamp = now - (i * 15 * 60 * 1000); // 每15分钟一笔交易
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const priceVariation = price * (1 + (Math.random() - 0.5) * 0.02);
    const amount = Math.floor(Math.random() * 10000) + 100;
    
    transactions.push({
      id: `tx-${tokenId}-${i}`,
      tokenId,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      type,
      amount,
      price: priceVariation,
      timestamp
    });
  }
  
  return transactions.sort((a: { timestamp: number }, b: { timestamp: number }) => b.timestamp - a.timestamp);
};

// 生成随机的合约地址
const generateContractAddress = () => {
  return '0x' + Array.from({length: 40}, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// 模拟已发布的代币
export const launchedTokens: Token[] = [
  {
    id: 'token-1',
    name: 'Lunar Coin',
    symbol: 'LUNAR',
    contractAddress: generateContractAddress(),
    description: 'Lunar Coin is a governance token for the Lunar Protocol, a decentralized platform for automated market making and yield farming.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=LUNAR',
    website: 'https://lunarcoin.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/lunarcoin',
      telegram: 'https://t.me/lunarcoin',
      discord: 'https://discord.gg/lunarcoin'
    },
    launchDate: new Date().getTime() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
    initialPrice: 0.05,
    currentPrice: 0.12,
    marketCap: 12000000,
    volume24h: 1500000,
    change24h: 5.2,
    totalSupply: 100000000,
    circulatingSupply: 25000000,
    status: TokenStatus.LAUNCHED,
    priceHistory: generatePriceHistory(30, 0.05, 0.08),
    transactions: generateTransactions('token-1', 50, 0.12)
  },
  {
    id: 'token-2',
    name: 'Galaxy Token',
    symbol: 'GLXY',
    contractAddress: generateContractAddress(),
    description: 'Galaxy Token powers the Galaxy NFT marketplace, allowing creators to mint and trade NFTs with low fees and high speed.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=GLXY',
    website: 'https://galaxytoken.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/galaxytoken',
      telegram: 'https://t.me/galaxytoken'
    },
    launchDate: new Date().getTime() - (45 * 24 * 60 * 60 * 1000), // 45 days ago
    initialPrice: 0.02,
    currentPrice: 0.035,
    marketCap: 3500000,
    volume24h: 500000,
    change24h: -2.8,
    totalSupply: 200000000,
    circulatingSupply: 50000000,
    status: TokenStatus.LAUNCHED,
    priceHistory: generatePriceHistory(45, 0.02, 0.06),
    transactions: generateTransactions('token-2', 40, 0.035)
  },
  {
    id: 'token-3',
    name: 'Nebula Finance',
    symbol: 'NEBU',
    contractAddress: generateContractAddress(),
    description: 'Nebula Finance is a decentralized lending protocol that allows users to earn interest on deposits and borrow assets against collateral.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=NEBU',
    website: 'https://nebulafinance.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/nebulafinance',
      telegram: 'https://t.me/nebulafinance',
      github: 'https://github.com/nebulafinance'
    },
    launchDate: new Date().getTime() - (15 * 24 * 60 * 60 * 1000), // 15 days ago
    initialPrice: 0.1,
    currentPrice: 0.18,
    marketCap: 18000000,
    volume24h: 2200000,
    change24h: 12.5,
    totalSupply: 100000000,
    circulatingSupply: 20000000,
    status: TokenStatus.LAUNCHED,
    priceHistory: generatePriceHistory(15, 0.1, 0.1),
    transactions: generateTransactions('token-3', 60, 0.18)
  },
  {
    id: 'token-9',
    name: 'Cosmic Cash',
    symbol: 'CSMC',
    contractAddress: generateContractAddress(),
    description: 'Cosmic Cash is a stablecoin pegged to a basket of major currencies, designed to provide stability in the volatile crypto market.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=CSMC',
    website: 'https://cosmiccash.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/cosmiccash',
      telegram: 'https://t.me/cosmiccash',
      discord: 'https://discord.gg/cosmiccash'
    },
    launchDate: new Date().getTime() - (60 * 24 * 60 * 60 * 1000), // 60 days ago
    initialPrice: 1.0,
    currentPrice: 1.01,
    marketCap: 50000000,
    volume24h: 3500000,
    change24h: 0.1,
    totalSupply: 50000000,
    circulatingSupply: 30000000,
    status: TokenStatus.LAUNCHED,
    priceHistory: generatePriceHistory(60, 1.0, 0.01),
    transactions: generateTransactions('token-9', 70, 1.01)
  }
];

// 模拟新开盘的代币
export const launchingTokens: Token[] = [
  {
    id: 'token-4',
    name: 'Quantum Chain',
    symbol: 'QNTM',
    contractAddress: generateContractAddress(),
    description: 'Quantum Chain is a layer-2 scaling solution for Ethereum that enables faster and cheaper transactions while maintaining security.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=QNTM',
    website: 'https://quantumchain.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/quantumchain',
      telegram: 'https://t.me/quantumchain',
      discord: 'https://discord.gg/quantumchain'
    },
    launchDate: new Date().getTime() + (2 * 24 * 60 * 60 * 1000), // 2 days from now
    initialPrice: 0.08,
    totalSupply: 150000000,
    status: TokenStatus.LAUNCHING,
    progress: 85,
    transactions: generateTransactions('token-4', 20, 0.08)
  },
  {
    id: 'token-5',
    name: 'Fusion Protocol',
    symbol: 'FUSN',
    contractAddress: generateContractAddress(),
    description: 'Fusion Protocol is a cross-chain interoperability protocol that enables seamless asset transfers between different blockchains.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=FUSN',
    website: 'https://fusionprotocol.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/fusionprotocol',
      telegram: 'https://t.me/fusionprotocol'
    },
    launchDate: new Date().getTime() + (1 * 24 * 60 * 60 * 1000), // 1 day from now
    initialPrice: 0.05,
    totalSupply: 200000000,
    status: TokenStatus.LAUNCHING,
    progress: 92,
    transactions: generateTransactions('token-5', 15, 0.05)
  },
  {
    id: 'token-10',
    name: 'Stellar Network',
    symbol: 'STNW',
    contractAddress: generateContractAddress(),
    description: 'Stellar Network is a decentralized social networking platform that allows users to own their data and earn rewards for content creation.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=STNW',
    website: 'https://stellarnetwork.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/stellarnetwork',
      telegram: 'https://t.me/stellarnetwork',
      discord: 'https://discord.gg/stellarnetwork'
    },
    launchDate: new Date().getTime() + (3 * 24 * 60 * 60 * 1000), // 3 days from now
    initialPrice: 0.15,
    totalSupply: 120000000,
    status: TokenStatus.LAUNCHING,
    progress: 78,
    transactions: generateTransactions('token-10', 12, 0.15)
  }
];

// 模拟即将发射的代币
export const upcomingTokens: Token[] = [
  {
    id: 'token-6',
    name: 'Cipher Network',
    symbol: 'CIPR',
    description: 'Cipher Network is a privacy-focused protocol that enables confidential transactions and obscures transaction amounts and addresses.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=CIPR',
    website: 'https://ciphernetwork.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/ciphernetwork',
      telegram: 'https://t.me/ciphernetwork',
      github: 'https://github.com/ciphernetwork'
    },
    launchDate: new Date().getTime() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
    initialPrice: 0.12,
    totalSupply: 80000000,
    status: TokenStatus.UPCOMING,
    progress: 40
  },
  {
    id: 'token-7',
    name: 'Nexus Oracle',
    symbol: 'NXOR',
    description: 'Nexus Oracle is a decentralized oracle network that provides reliable off-chain data to smart contracts on various blockchains.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=NXOR',
    website: 'https://nexusoracle.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/nexusoracle',
      telegram: 'https://t.me/nexusoracle',
      discord: 'https://discord.gg/nexusoracle'
    },
    launchDate: new Date().getTime() + (14 * 24 * 60 * 60 * 1000), // 14 days from now
    initialPrice: 0.1,
    totalSupply: 100000000,
    status: TokenStatus.UPCOMING,
    progress: 25
  },
  {
    id: 'token-8',
    name: 'Photon Pay',
    symbol: 'PHTN',
    description: 'Photon Pay is a decentralized payment protocol that enables instant, fee-less transactions with built-in privacy features.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=PHTN',
    website: 'https://photonpay.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/photonpay',
      telegram: 'https://t.me/photonpay'
    },
    launchDate: new Date().getTime() + (21 * 24 * 60 * 60 * 1000), // 21 days from now
    initialPrice: 0.03,
    totalSupply: 500000000,
    status: TokenStatus.UPCOMING,
    progress: 10
  },
  {
    id: 'token-11',
    name: 'Astro Finance',
    symbol: 'ASTR',
    description: 'Astro Finance is a DeFi protocol offering yield optimization strategies across multiple blockchains with automated compounding.',
    logo: 'https://via.placeholder.com/100/7B1FA2/FFFFFF?text=ASTR',
    website: 'https://astrofinance.example.com',
    socialLinks: {
      twitter: 'https://twitter.com/astrofinance',
      telegram: 'https://t.me/astrofinance',
      discord: 'https://discord.gg/astrofinance'
    },
    launchDate: new Date().getTime() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
    initialPrice: 0.07,
    totalSupply: 250000000,
    status: TokenStatus.UPCOMING,
    progress: 5
  }
];

// 所有代币
export const allTokens: Token[] = [
  ...launchedTokens,
  ...launchingTokens,
  ...upcomingTokens
];

// 精选代币（用于首页展示）
export const featuredTokens: Token[] = [
  launchedTokens[0],
  launchingTokens[0],
  upcomingTokens[0],
  launchedTokens[1]
];

// 模拟状态存储 - 用于保存用户的操作结果
export class MockDataStore {
  private static instance: MockDataStore;
  private userTokens: Map<string, any> = new Map();
  private userTransactions: any[] = [];
  
  private constructor() {}
  
  public static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }
  
  // 添加用户创建的代币
  public addUserToken(token: any): void {
    this.userTokens.set(token.id, token);
  }
  
  // 获取用户创建的所有代币
  public getUserTokens(): any[] {
    return Array.from(this.userTokens.values());
  }
  
  // 添加用户交易
  public addUserTransaction(transaction: any): void {
    this.userTransactions.push(transaction);
  }
  
  // 获取用户的所有交易
  public getUserTransactions(): any[] {
    return this.userTransactions;
  }
  
  // 获取特定代币的交易
  public getTokenTransactions(tokenId: string): any[] {
    return this.userTransactions.filter((tx: { tokenId: string }) => tx.tokenId === tokenId);
  }
}

export const mockDataStore = MockDataStore.getInstance();