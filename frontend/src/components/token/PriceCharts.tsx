import React, { useState } from 'react';
import styled from 'styled-components';
import { TokenPrice } from '../../types/tokens';

// 更新props接口以包含data
interface PriceChartProps {
  data?: TokenPrice[];  // 添加data属性，但我们不会实际使用它
  timespan?: '1D' | '1W' | '1M' | '3M' | 'ALL';
}

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
`;

const TimeControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TimeButton = styled.button<{ active: boolean }>`
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.backgroundLight};
  color: ${({ active, theme }) => active ? theme.colors.background : theme.colors.textSecondary};
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.backgroundLight};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-left: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

const StaticChartSVG = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`;

export const PriceChart: React.FC<PriceChartProps> = ({ 
  data = [], // 我们接受data参数，但实际上不会使用它
  timespan = '1D' 
}) => {
  const [activeTimespan, setActiveTimespan] = useState<'1D' | '1W' | '1M' | '3M' | 'ALL'>(timespan);
  
  // 生成静态波浪形SVG点
  const generateWavyPoints = (width: number, height: number): string => {
    const points = [];
    const segments = 20;
    const segmentWidth = width / segments;
    
    // 起点
    points.push(`0,${height * 0.7}`);
    
    // 生成随机高度的波浪形态
    for (let i = 1; i < segments; i++) {
      const x = i * segmentWidth;
      const randomFactor = Math.sin(i * 0.5) * 0.2 + 0.5; // 生成0.3到0.7之间的波浪值
      const y = height * (0.8 - randomFactor * 0.5);
      points.push(`${x},${y}`);
    }
    
    // 终点
    points.push(`${width},${height * 0.4}`);
    
    // 闭合路径，添加底部边界点
    points.push(`${width},${height}`);
    points.push(`0,${height}`);
    
    return points.join(' ');
  };
  
  return (
    <>
      <TimeControls>
        {(['1D', '1W', '1M', '3M', 'ALL'] as const).map(span => (
          <TimeButton
            key={span}
            active={activeTimespan === span}
            onClick={() => setActiveTimespan(span)}
          >
            {span}
          </TimeButton>
        ))}
      </TimeControls>
      <ChartContainer>
        <StaticChartSVG viewBox="0 0 500 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7B1FA2" stopOpacity="0.6"/>
              <stop offset="90%" stopColor="#7B1FA2" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* 背景网格线 */}
          <g stroke="#DDDDDD" strokeWidth="1" opacity="0.5">
            <line x1="0" y1="75" x2="500" y2="75" />
            <line x1="0" y1="150" x2="500" y2="150" />
            <line x1="0" y1="225" x2="500" y2="225" />
            
            <line x1="100" y1="0" x2="100" y2="300" />
            <line x1="200" y1="0" x2="200" y2="300" />
            <line x1="300" y1="0" x2="300" y2="300" />
            <line x1="400" y1="0" x2="400" y2="300" />
          </g>
          
          {/* 填充区域 */}
          <polygon 
            fill="url(#chartGradient)" 
            points={generateWavyPoints(500, 300)}
          />
          
          {/* 线条 */}
          <polyline 
            fill="none" 
            stroke="#9C27B0" 
            strokeWidth="2"
            points={generateWavyPoints(500, 300).split(' ').slice(0, -2).join(' ')}
          />
          
          {/* 指示点 */}
          <circle 
            cx="400" 
            cy="90" 
            r="4" 
            fill="#FFFFFF" 
            stroke="#9C27B0" 
            strokeWidth="2"
          />
        </StaticChartSVG>
      </ChartContainer>
    </>
  );
};
