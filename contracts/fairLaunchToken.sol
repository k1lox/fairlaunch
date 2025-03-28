// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSwap is ERC20, Ownable {
    // 常量定义
    uint256 public constant MAX_BNB = 25 ether;  // 最大BNB容量 (25个BNB)
    uint256 public constant INITIAL_SUPPLY = 10_000_000_000 * 10**18;  // 100亿代币
    uint256 public constant MIN_TOKEN_RESERVE = 2_000_000_000 * 10**18;   // 最小代币储备 (2e9)
    uint256 public constant MAX_TOKEN_RESERVE = 10_000_000_000 * 10**18;  // 最大代币储备 (1e10)
    
    // 储备变量
    uint256 private _bnbReserve;  // 储备的BNB数量
    
    // 状态变量 - 表示是否达到最大BNB容量
    bool public launchCompleted = false;  // 一旦BNB储备达到25，状态变为true并永久保持
    
    // 事件
    event Buy(address indexed user, uint256 bnbIn, uint256 tokensOut);
    event Sell(address indexed user, uint256 tokensIn, uint256 bnbOut);
    event LaunchCompleted(uint256 timestamp);
    
    /**
     * @dev 构造函数，允许自定义代币名称和符号
     * @param name_ 代币名称
     * @param symbol_ 代币符号
     */
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender) payable{
        _mint(address(this), INITIAL_SUPPLY);
        if(msg.value > 0){
            swapBNBForTokens();
        }
    }
    
    // 允许合约接收BNB
    receive() external payable {
        swapBNBForTokens();
    }
    
    /**
     * @notice 使用BNB交换代币 (Buy)
     */
    function swapBNBForTokens() public payable {
        // 检查是否已完成启动阶段
        require(!launchCompleted, "Launch completed, trading moved to Coinfair");
        require(msg.value > 0, "Need to send BNB");
        
        uint256 bnbToSwap = msg.value;
        uint256 refundBnb = 0;
        uint256 currentBnbReserve = _bnbReserve;
        
        // 检查是否超过最大BNB容量并处理
        if (currentBnbReserve + bnbToSwap > MAX_BNB) {
            if (currentBnbReserve < MAX_BNB) {
                uint256 acceptableBnb = MAX_BNB - currentBnbReserve;
                refundBnb = bnbToSwap - acceptableBnb;
                bnbToSwap = acceptableBnb;
                
                payable(msg.sender).transfer(refundBnb);
            } else {
                revert("Already Move To Coinfair");
            }
        }
        
        // 计算可以获得的代币数量
        uint256 tokenReserve = balanceOf(address(this));
        uint256 tokensToReceive = calculateBNBToTokenAmount(bnbToSwap, currentBnbReserve, tokenReserve);
        
        // 确保代币储备在允许范围内
        uint256 newTokenReserve = tokenReserve - tokensToReceive;
        require(newTokenReserve >= MIN_TOKEN_RESERVE, "Token reserve would be below minimum");
        require(newTokenReserve <= MAX_TOKEN_RESERVE, "Token reserve would exceed maximum");
        
        // 更新BNB储备 - 只增加实际接受的BNB数量
        _bnbReserve = currentBnbReserve + bnbToSwap;
        
        // 如果达到最大BNB容量，标记启动阶段已完成
        if (_bnbReserve == MAX_BNB) {
            launchCompleted = true;
            emit LaunchCompleted(block.timestamp);
        }
        
        // 转移代币给用户
        _transfer(address(this), msg.sender, tokensToReceive);
        
        emit Buy(msg.sender, bnbToSwap, tokensToReceive);
    }
    
    /**
     * @notice 使用代币交换BNB (Sell)
     * @param tokenAmount 要交换的代币数量
     */
    function swapTokensForBNB(uint256 tokenAmount) public {
        // 检查是否已完成启动阶段
        require(!launchCompleted, "Launch completed, trading moved to Coinfair");
        require(tokenAmount > 0, "Need to send tokens");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");
        
        uint256 tokenReserve = balanceOf(address(this));
        uint256 currentBnbReserve = _bnbReserve;
        uint256 bnbToReceive = calculateTokenToBNBAmount(tokenAmount, tokenReserve, currentBnbReserve);
        
        require(bnbToReceive <= currentBnbReserve, "Insufficient BNB reserve");
        
        // 确保代币储备在允许范围内
        uint256 newTokenReserve = tokenReserve + tokenAmount;
        require(newTokenReserve >= MIN_TOKEN_RESERVE, "Token reserve would be below minimum");
        require(newTokenReserve <= MAX_TOKEN_RESERVE, "Token reserve would exceed maximum");
        
        // 更新BNB储备
        _bnbReserve = currentBnbReserve - bnbToReceive;
        
        // 先获取代币
        _transfer(msg.sender, address(this), tokenAmount);
        
        // 转BNB给用户
        payable(msg.sender).transfer(bnbToReceive);
        
        emit Sell(msg.sender, tokenAmount, bnbToReceive);
    }
    
    /**
     * @notice 重写transfer函数，限制用户在启动阶段只能向合约转移代币
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        // 如果启动未完成且发送者不是合约且接收者不是合约，则拒绝转账
        if (!launchCompleted && msg.sender != address(this) && to != address(this)) {
            revert("During launch phase, tokens can only be transferred to this contract");
        }
        
        return super.transfer(to, amount);
    }
    
    /**
     * @notice 重写transferFrom函数，限制用户在启动阶段只能向合约转移代币
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        // 如果启动未完成且转出地址不是合约且接收地址不是合约，则拒绝转账
        if (!launchCompleted && from != address(this) && to != address(this)) {
            revert("During launch phase, tokens can only be transferred to this contract");
        }
        
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @notice 计算存入BNB可以获得的代币数量
     * @dev 实现公式: deltax = x - 6250000000000/(100y+100deltay+625)
     * @param bnbIn 存入的BNB数量
     * @param currentBnbReserve 当前BNB储备
     * @param currentTokenReserve 当前代币储备
     * @return 可获得的代币数量
     */
    function calculateBNBToTokenAmount(
        uint256 bnbIn, 
        uint256 currentBnbReserve, 
        uint256 currentTokenReserve
    ) public pure returns (uint256) {
        uint256 y = currentBnbReserve; 
        uint256 deltaY = bnbIn;
        uint256 x = currentTokenReserve;
        
        uint256 deltax = x - 625e44/(y + deltaY + 625e16);
        
        return deltax;
    }
    
    /**
     * @notice 计算存入代币可以获得的BNB数量
     * @dev 实现公式: deltay = y - (5250000000000/(x+deltax)-625)/100
     * @param tokenIn 存入的代币数量
     * @param currentTokenReserve 当前代币储备
     * @param currentBnbReserve 当前BNB储备
     * @return 可获得的BNB数量
     */
    function calculateTokenToBNBAmount(
        uint256 tokenIn, 
        uint256 currentTokenReserve, 
        uint256 currentBnbReserve
    ) public pure returns (uint256) {
        uint256 x = currentTokenReserve;
        uint256 deltaX = tokenIn;
        uint256 y = currentBnbReserve;
        
        uint256 deltaY = y + 625e16 - 625e44/(x + deltaX) ;
        
        return deltaY;
    }
    
    /**
     * @notice 获取合约中的BNB储备
     * @return 当前BNB储备量
     */
    function getBnbReserve() public view returns (uint256) {
        return _bnbReserve;
    }
    
    /**
     * @notice 获取合约中的代币储备
     * @return 当前代币储备量
     */
    function getTokenReserve() public view returns (uint256) {
        return balanceOf(address(this));
    }
    
    /**
     * @notice 获取合约当前状态
     * @return 当前启动状态（false = 启动阶段，true = 已完成启动）
     */
    function getLaunchStatus() public view returns (bool) {
        return launchCompleted;
    }
}