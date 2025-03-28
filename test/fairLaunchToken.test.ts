import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenSwap } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { parseEther, formatEther } from "ethers";

describe("TokenSwap Multiple Test Scenarios", function () {
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress; 
  let user4: SignerWithAddress;
  
  before(async function () {
    [user1, user2, user3, user4] = await ethers.getSigners();
    
    console.log("=".repeat(80));
    console.log("测试用户地址:");
    console.log(`用户1 (创建者): ${user1.address}`);
    console.log(`用户2: ${user2.address}`);
    console.log(`用户3: ${user3.address}`);
    console.log(`用户4: ${user4.address}`);
    console.log("=".repeat(80));
  });
  
  async function printState(tokenSwap: TokenSwap, title: string) {
    const contractAddress = await tokenSwap.getAddress();
    const tokenInPool = await tokenSwap.getTokenReserve();
    const bnbInPool = await tokenSwap.getBnbReserve();
    const launchStatus = await tokenSwap.getLaunchStatus();
    
    console.log("\n" + "=".repeat(80));
    console.log(title);
    console.log("=".repeat(80));
    console.log(`合约地址: ${contractAddress}`);
    console.log(`池子中的代币数量: ${formatEther(tokenInPool)}`);
    console.log(`池子中的BNB数量: ${formatEther(bnbInPool)}`);
    console.log(`启动状态: ${launchStatus ? "已完成" : "未完成"}`);
    
    console.log("\n各用户代币余额:");
    console.log(`用户1: ${formatEther(await tokenSwap.balanceOf(user1.address))}`);
    console.log(`用户2: ${formatEther(await tokenSwap.balanceOf(user2.address))}`);
    console.log(`用户3: ${formatEther(await tokenSwap.balanceOf(user3.address))}`);
    console.log(`用户4: ${formatEther(await tokenSwap.balanceOf(user4.address))}`);
    console.log("=".repeat(80) + "\n");
    
    return { tokenInPool, bnbInPool, launchStatus };
  }
  
  async function deployContract(initialBnb = 0n) {
    const TokenSwapFactory = await ethers.getContractFactory("TokenSwap", user1);
    const deployValue = initialBnb > 0n ? { value: initialBnb } : {};
    
    const tokenSwap = await TokenSwapFactory.deploy(
      "Testing Token",
      "TEST",
      deployValue
    ) as TokenSwap;
    
    await tokenSwap.waitForDeployment();
    return tokenSwap;
  }
  
  // 测试场景1: 多用户交易序列
  // 用户1部署合约并初始注入5BNB
  // 用户2买入10BNB（累计15BNB）
  // 用户3买入3BNB（累计18BNB）
  // 用户2卖出一半代币，减少池中BNB
  // 用户4买入10BNB（接近上限）
  // 用户3买入6BNB（预期达到25BNB，触发启动完成）
  // 用户2尝试买入2BNB（预期被拒绝，因启动已完成）
  // 用户3尝试买入2BNB（预期被拒绝，因启动已完成）
  it.skip("场景1: 多用户交易序列测试", async function () {
    console.log("\n" + "*".repeat(100));
    console.log("场景1: 多用户交易序列测试");
    console.log("*".repeat(100));
    
    // 步骤1: 用户1部署合约并支付5BNB
    console.log("步骤1: 用户1部署合约并支付5BNB");
    const tokenSwap = await deployContract(parseEther("5"));
    await printState(tokenSwap, "用户1部署合约并存入5BNB后");
    
    // 步骤2: 用户2买入10BNB
    console.log("步骤2: 用户2买入10BNB");
    await tokenSwap.connect(user2).swapBNBForTokens({ value: parseEther("10") });
    await printState(tokenSwap, "用户2买入10BNB后");
    
    // 步骤3: 用户3买入3BNB
    console.log("步骤3: 用户3买入3BNB");
    await tokenSwap.connect(user3).swapBNBForTokens({ value: parseEther("3") });
    await printState(tokenSwap, "用户3买入3BNB后");
    
    // 步骤4: 用户2卖出约5BNB等值的代币
    console.log("步骤4: 用户2卖出约5BNB等值的代币");
    const user2Balance = await tokenSwap.balanceOf(user2.address);
    const sellAmount = user2Balance / 2n;
    console.log(`用户2当前代币余额: ${formatEther(user2Balance)}`);
    console.log(`用户2准备卖出: ${formatEther(sellAmount)} 代币`);

    // 授权并卖出
    try {
      await tokenSwap.connect(user2).approve(tokenSwap, sellAmount);
      await tokenSwap.connect(user2).swapTokensForBNB(sellAmount);
      console.log("卖出交易成功");
    } catch (error: any) {
      console.error("卖出交易失败:", error.message);
    }
    
    await printState(tokenSwap, "用户2卖出代币后");
    
    // 步骤5: 用户4买入10BNB
    console.log("步骤5: 用户4买入10BNB");
    await tokenSwap.connect(user4).swapBNBForTokens({ value: parseEther("10") });
    await printState(tokenSwap, "用户4买入10BNB后");
    
    // 步骤6: 用户3买入6BNB
    console.log("步骤6: 用户3买入6BNB");
    try {
      await tokenSwap.connect(user3).swapBNBForTokens({ value: parseEther("6") });
      console.log("用户3买入6BNB成功");
    } catch (error: any) {
      console.error("用户3买入6BNB失败:", error.message);
    }
    
    // 检查BNB储备量和启动状态
    const { bnbInPool, launchStatus } = await printState(tokenSwap, "用户3买入6BNB后");
    
    // 步骤7: 用户2尝试买入2BNB
    console.log("步骤7: 用户2尝试买入2BNB");
    
    try {
      await tokenSwap.connect(user2).swapBNBForTokens({ value: parseEther("2") });
      console.log("用户2买入成功");
    } catch (error: any) {
      console.log("用户2买入失败:", error.message);
    }
    
    await printState(tokenSwap, "用户2尝试买入后");
    
    // 步骤8: 用户3尝试买入2BNB
    console.log("步骤8: 用户3尝试买入2BNB");
    
    try {
      await tokenSwap.connect(user3).swapBNBForTokens({ value: parseEther("2") });
      console.log("用户3买入成功");
    } catch (error: any) {
      console.log("用户3买入失败:", error.message);
    }
    
    await printState(tokenSwap, "最终状态");
  });

  // 测试场景2: 递增购买直到启动完成
  // 用户1部署合约并初始注入1BNB
  // 循环进行购买，每次买入1BNB
  // 每次购买后记录池中BNB数量
  // 当BNB达到25或启动状态变为true时停止
  it.skip("场景2: 递增购买直到启动完成", async function () {
    console.log("\n" + "*".repeat(100));
    console.log("场景2: 递增购买直到启动完成");
    console.log("*".repeat(100));
    
    // 用户1部署合约并买入1BNB
    console.log("用户1部署合约并买入1BNB");
    const tokenSwap = await deployContract(parseEther("1"));
    let { bnbInPool, launchStatus } = await printState(tokenSwap, "初始状态");
    
    // 循环购买，每次买入1BNB，直到启动状态变为true
    let buyCount = 1; // 已经买了1BNB
    console.log(`购买 #${buyCount}: BNB池子数量 = ${formatEther(bnbInPool)}`);
    
    while (!launchStatus && bnbInPool < parseEther("25")) {
      buyCount++;
      try {
        console.log(`购买 #${buyCount}: 尝试买入1BNB`);
        await tokenSwap.connect(user1).swapBNBForTokens({ value: parseEther("1") });
        
        // 更新状态
        const state = await printState(tokenSwap, `购买#${buyCount}后状态`);
        bnbInPool = state.bnbInPool;
        launchStatus = state.launchStatus;
        
        console.log(`购买 #${buyCount}: BNB池子数量 = ${formatEther(bnbInPool)}`);
        
        if (launchStatus) {
          console.log(`*** 启动已完成! 在第 ${buyCount} 次购买后，BNB达到 ${formatEther(bnbInPool)} ***`);
          break;
        }
      } catch (error: any) {
        console.log(`购买 #${buyCount} 失败:`, error.message);
        
        // 检查是否因为启动完成而失败
        const state = await printState(tokenSwap, `失败后状态`);
        if (state.launchStatus) {
          console.log(`*** 启动已完成! 在第 ${buyCount} 次购买尝试时，BNB达到 ${formatEther(state.bnbInPool)} ***`);
          break;
        }
      }
      
      // 安全检查，防止无限循环
      if (buyCount > 30) {
        console.log("达到最大购买次数，退出循环");
        break;
      }
    }
    
    // 总结
    await printState(tokenSwap, "场景2最终状态");
    console.log(`总计购买次数: ${buyCount}`);
    console.log(`最终BNB池子数量: ${formatEther(bnbInPool)}`);
    console.log(`启动状态: ${launchStatus ? "已完成" : "未完成"}`);
  });

  // 测试场景3: 买入卖出循环
  // 用户1部署合约并初始注入1BNB
  // 用户2买入1BNB
  // 用户2卖出所有代币
  // 用户2再次买入1BNB
  // 用户2再次卖出所有代币
  it("场景3: 买入卖出循环", async function () {
    console.log("\n" + "*".repeat(100));
    console.log("场景3: 买入卖出循环");
    console.log("*".repeat(100));
    
    // 用户1部署合约并买入1BNB
    console.log("用户1部署合约并买入1BNB");
    const tokenSwap = await deployContract(parseEther("1"));
    await printState(tokenSwap, "初始状态");
    
    // 用户2买入1BNB
    console.log("步骤1: 用户2买入1BNB");
    await tokenSwap.connect(user2).swapBNBForTokens({ value: parseEther("1") });
    await printState(tokenSwap, "用户2买入1BNB后");
    
    // 用户2卖出所有代币
    console.log("步骤2: 用户2卖出所有代币");
    const user2Balance1 = await tokenSwap.balanceOf(user2.address);
    console.log(`用户2当前代币余额: ${formatEther(user2Balance1)}`);
    
    if (user2Balance1 > 0n) {
      try {
        await tokenSwap.connect(user2).approve(tokenSwap, user2Balance1);
        await tokenSwap.connect(user2).swapTokensForBNB(user2Balance1);
        console.log("用户2卖出所有代币成功");
      } catch (error: any) {
        console.error("用户2卖出所有代币失败:", error.message);
      }
    } else {
      console.log("用户2没有代币可卖");
    }
    
    await printState(tokenSwap, "用户2卖出所有代币后");
    
    // 用户2再次买入1BNB
    console.log("步骤3: 用户2再次买入1BNB");
    try {
      await tokenSwap.connect(user2).swapBNBForTokens({ value: parseEther("1") });
      console.log("用户2再次买入1BNB成功");
    } catch (error: any) {
      console.error("用户2再次买入1BNB失败:", error.message);
    }
    
    await printState(tokenSwap, "用户2再次买入1BNB后");
    
    // 用户2再次卖出所有代币
    console.log("步骤4: 用户2再次卖出所有代币");
    const user2Balance2 = await tokenSwap.balanceOf(user2.address);
    console.log(`用户2当前代币余额: ${formatEther(user2Balance2)}`);
    
    if (user2Balance2 > 0n) {
      try {
        await tokenSwap.connect(user2).approve(tokenSwap, user2Balance2);
        await tokenSwap.connect(user2).swapTokensForBNB(user2Balance2);
        console.log("用户2再次卖出所有代币成功");
      } catch (error: any) {
        console.error("用户2再次卖出所有代币失败:", error.message);
      }
    } else {
      console.log("用户2没有代币可卖");
    }
    
    await printState(tokenSwap, "最终状态");
    
    // 检查用户2的最终代币余额，应该接近0
    const finalBalance = await tokenSwap.balanceOf(user2.address);
    console.log(`用户2最终代币余额: ${formatEther(finalBalance)}`);
    expect(finalBalance).to.be.lt(parseEther("0.0001")); // 应该接近0
  });
});