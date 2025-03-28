// src/services/api.ts
import { Token, TokenStatus, TokenPrice, TokenTransaction } from '../types/tokens';

// 导入模拟数据
import { 
  allTokens, 
  launchedTokens, 
  launchingTokens, 
  upcomingTokens, 
  mockDataStore 
} from '../mock/tokens';

// 模拟网络延迟
const simulateApiDelay = async (): Promise<void> => {
  const delay = Math.floor(Math.random() * 300) + 100; // 100-400毫秒随机延迟
  return new Promise<void>(resolve => setTimeout(resolve, delay));
};

// 生成唯一ID
const generateId = (): string => {
  return 'token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// API服务类，完全使用模拟数据
class ApiService {
  // 获取所有代币
  async getAllTokens(): Promise<Token[]> {
    await simulateApiDelay();
    
    // 结合固定的模拟数据和用户创建的代币
    const userTokens = mockDataStore.getUserTokens();
    return [...allTokens, ...userTokens];
  }

  // 按状态获取代币
  async getTokensByStatus(status: TokenStatus): Promise<Token[]> {
    await simulateApiDelay();
    
    let tokens: Token[] = [];
    switch (status) {
      case TokenStatus.LAUNCHED:
        tokens = [...launchedTokens];
        break;
      case TokenStatus.LAUNCHING:
        tokens = [...launchingTokens];
        break;
      case TokenStatus.UPCOMING:
        tokens = [...upcomingTokens];
        break;
    }
    
    // 添加用户创建的符合状态的代币
    const userTokens = mockDataStore.getUserTokens()
      .filter((token: { status: string }) => token.status === status);
    
    return [...tokens, ...userTokens];
  }

  // 获取特定代币详情
  async getTokenById(id: string): Promise<Token | null> {
    await simulateApiDelay();
    
    // 先从固定模拟数据中查找
    const token = allTokens.find((token: { id: string }) => token.id === id);
    if (token) return token;
    
    // 再从用户创建的代币中查找
    const userTokens = mockDataStore.getUserTokens();
    const userToken = Array.from(userTokens).find((token: { id: string }) => token.id === id);
    
    return userToken || null;
  }

  // 创建新代币
  async createToken(tokenData: Partial<Token>): Promise<Token> {
    await simulateApiDelay();
    
    // 生成随机的代币ID和合约地址
    const id = generateId();
    const contractAddress = '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // 创建新代币对象
    const newToken: Token = {
      id,
      name: tokenData.name || 'New Token',
      symbol: tokenData.symbol || 'NEW',
      contractAddress,
      description: tokenData.description || '',
      logo: tokenData.logo || `https://via.placeholder.com/100/7B1FA2/FFFFFF?text=${tokenData.symbol || 'NEW'}`,
      website: tokenData.website,
      socialLinks: tokenData.socialLinks,
      launchDate: tokenData.launchDate || (new Date().getTime() + (7 * 24 * 60 * 60 * 1000)),
      initialPrice: tokenData.initialPrice || 0.01,
      totalSupply: tokenData.totalSupply || 1000000,
      status: TokenStatus.UPCOMING,
      progress: 0,
      transactions: []
    };
    
    // 保存到模拟存储
    mockDataStore.addUserToken(newToken);
    
    return newToken;
  }

  // 更新代币状态 - 模拟状态转换功能
  async updateTokenStatus(id: string, newStatus: TokenStatus, progress?: number): Promise<Token> {
    await simulateApiDelay();
    
    // 查找代币
    const token = await this.getTokenById(id);
    if (!token) {
      throw new Error(`Token with id ${id} not found`);
    }
    
    // 更新状态
    const updatedToken = {
      ...token,
      status: newStatus,
      progress: progress !== undefined ? progress : token.progress
    };
    
    // 如果状态为已发射，添加额外的属性
    if (newStatus === TokenStatus.LAUNCHED) {
      Object.assign(updatedToken, {
        currentPrice: token.initialPrice,
        marketCap: token.initialPrice * token.totalSupply,
        volume24h: Math.random() * 500000,
        change24h: (Math.random() * 20) - 10,
        circulatingSupply: token.totalSupply * 0.2
      });
    }
    
    // 保存到模拟存储
    mockDataStore.addUserToken(updatedToken);
    
    return updatedToken;
  }

  // 获取代币价格历史
  async getTokenPriceHistory(id: string, timeframe: string = '30d'): Promise<TokenPrice[]> {
    await simulateApiDelay();
    
    // 查找代币
    const token = await this.getTokenById(id);
    if (!token) {
      throw new Error(`Token with id ${id} not found`);
    }
    
    // 如果有价格历史，则返回
    if (token.priceHistory && token.priceHistory.length > 0) {
      return token.priceHistory;
    }
    
    // 否则生成一个模拟的价格历史
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const initialPrice = token.initialPrice || 0.01;
    const volatility = 0.05;
    
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
  }

  // 获取代币交易记录
  async getTokenTransactions(id: string, limit: number = 50): Promise<TokenTransaction[]> {
    await simulateApiDelay();
    
    // 查找代币
    const token = await this.getTokenById(id);
    if (!token) {
      throw new Error(`Token with id ${id} not found`);
    }
    
    // 如果有交易记录，则返回
    if (token.transactions && token.transactions.length > 0) {
      return token.transactions.slice(0, limit);
    }
    
    // 从用户交易中查找
    const userTransactions = mockDataStore.getTokenTransactions(id);
    if (userTransactions.length > 0) {
      return userTransactions.slice(0, limit);
    }
    
    // 否则生成一些模拟的交易记录
    const transactions: TokenTransaction[] = [];
    const now = new Date().getTime();
    const price = token.currentPrice || token.initialPrice || 0.01;
    
    for (let i = 0; i < 20; i++) {
      const timestamp = now - (i * 15 * 60 * 1000); // 每15分钟一笔交易
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const priceVariation = price * (1 + (Math.random() - 0.5) * 0.02);
      const amount = Math.floor(Math.random() * 10000) + 100;
      
      transactions.push({
        id: `tx-${id}-${i}`,
        tokenId: id,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        type,
        amount,
        price: priceVariation,
        timestamp
      });
    }
    
    return transactions.sort((a: { timestamp: number }, b: { timestamp: number }) => b.timestamp - a.timestamp).slice(0, limit);
  }

  // 搜索代币
  async searchTokens(query: string): Promise<Token[]> {
    await simulateApiDelay();
    
    const lowercaseQuery = query.toLowerCase();
    
    // 从所有固定模拟数据中搜索
    const matchedTokens = allTokens.filter((token: { name: string; symbol: string; description?: string }) => 
      token.name.toLowerCase().includes(lowercaseQuery) ||
      token.symbol.toLowerCase().includes(lowercaseQuery) ||
      token.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    // 从用户创建的代币中搜索
    const userTokens = mockDataStore.getUserTokens();
    const matchedUserTokens = userTokens.filter((token: { name: string; symbol: string; description?: string }) => 
      token.name.toLowerCase().includes(lowercaseQuery) ||
      token.symbol.toLowerCase().includes(lowercaseQuery) ||
      token.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    return [...matchedTokens, ...matchedUserTokens];
  }

  // 更新代币信息
  async updateToken(id: string, updates: Partial<Token>): Promise<Token> {
    await simulateApiDelay();
    
    // 查找代币
    const token = await this.getTokenById(id);
    if (!token) {
      throw new Error(`Token with id ${id} not found`);
    }
    
    // 只允许更新某些字段
    const allowedUpdates = ['description', 'logo', 'website', 'socialLinks'];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]: [string, unknown]) => allowedUpdates.includes(key))
    );
    
    const updatedToken = { ...token, ...filteredUpdates };
    
    // 保存到模拟存储
    mockDataStore.addUserToken(updatedToken);
    
    return updatedToken;
  }

  // 模拟代币交易 - 添加买卖交易记录
  async recordTokenTransaction(
    id: string, 
    type: 'buy' | 'sell',
    amount: number,
    price: number
  ): Promise<TokenTransaction> {
    await simulateApiDelay();
    
    const timestamp = Date.now();
    // 使用模拟的账户地址
    const address = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    
    const transaction: TokenTransaction = {
      id: `tx-${id}-${timestamp}`,
      tokenId: id,
      address,
      type,
      amount,
      price,
      timestamp
    };
    
    // 保存到模拟存储
    mockDataStore.addUserTransaction(transaction);
    
    return transaction;
  }

  // 上传代币Logo
  async uploadTokenLogo(file: File): Promise<string> {
    await simulateApiDelay();
    
    // 模拟上传响应，创建本地URL
    return URL.createObjectURL(file);
  }
}

// 导出单例实例
export const apiService = new ApiService();