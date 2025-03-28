/**
 * RainbowKit钱包连接组件 - 使用RainbowKit提供真实的钱包连接功能
 * RainbowKit Wallet Connection Component - Provides real wallet connection using RainbowKit
 */
import React from 'react';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * 自定义钱包容器样式
 * Custom wallet container style
 */
const WalletContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing.sm};
  
  .rk-connect-button {
    font-family: ${({ theme }) => theme.typography.fontFamily};
  }
`;

/**
 * 自定义按钮样式
 * Custom button style
 */
const CustomButtonWrapper = styled.div`
  button {
    background: linear-gradient(90deg, #7B1FA2, #9C27B0) !important;
    border: none !important;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(90deg, #9C27B0, #7B1FA2) !important;
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }
`;

/**
 * 钱包信息容器样式
 * Wallet info container style
 */
const WalletInfoContainer = styled.div`
  .rk-account-button {
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition: all 0.3s ease;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.backgroundLight};
      transform: translateY(-1px);
    }
  }
`;

/**
 * RainbowKit钱包连接组件
 * RainbowKit wallet connection component
 */
const RainbowKitConnect: React.FC = () => {
  const { t } = useLanguage();

  return (
    <WalletContainer>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <CustomButtonWrapper>
                      <button onClick={openConnectModal} type="button" className="rk-connect-button">
                        {t('connectWallet')}
                      </button>
                    </CustomButtonWrapper>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button">
                      ⚠️ {t('wrongNetwork')}
                    </button>
                  );
                }

                return (
                  <WalletInfoContainer>
                    <div className="rk-account-button" onClick={openAccountModal}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div>
                          {account.displayName}
                        </div>
                        <div style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%' }}></div>
                      </div>
                    </div>
                  </WalletInfoContainer>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </WalletContainer>
  );
};

export default RainbowKitConnect;
