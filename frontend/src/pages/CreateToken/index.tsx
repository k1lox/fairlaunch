// src/pages/CreateToken/index.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { Input } from '../../components/common/input';
import { useLanguage } from '../../i18n/LanguageContext';

// 导入图片资源作为模块
import logo1 from '../../assests/1.jpg';
import logo2 from '../../assests/2.jpg';
import logo3 from '../../assests/3.jpg';
import logo4 from '../../assests/4.jpg';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const FormCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

const FileInput = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border: 2px dashed ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
  }
  
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const UploadIcon = styled.div`
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UploadText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const StepDot = styled.div<{ active: boolean; completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  background-color: ${({ active, completed, theme }) => 
    active ? theme.colors.primary :
    completed ? theme.colors.primaryLight : 
    theme.colors.backgroundLight};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    width: ${({ theme }) => `calc(${theme.spacing.xl} * 2 - ${theme.spacing.sm} * 2)`};
    height: 2px;
    background-color: ${({ completed, theme }) => 
      completed ? theme.colors.primaryLight : theme.colors.backgroundLight};
    transform: translateY(-50%);
  }
  
  &:last-child::after {
    display: none;
  }
`;

const StepLabel = styled.div<{ active: boolean }>`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  width: 100px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular};
`;

const StepContent = styled.div<{ active: boolean }>`
  display: ${({ active }) => active ? 'block' : 'none'};
`;

const ReviewSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ReviewLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReviewValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const SuccessIcon = styled.div`
  font-size: 72px;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SuccessTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const LogoButton = styled.button`
  background: none; 
  border: none; 
  cursor: pointer; 
  padding: 5px; 
  border-radius: 4px;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

type Step = 'basicInfo' | 'tokenEconomics' | 'launchConfig' | 'review' | 'success';

const CreateTokenPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('basicInfo');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // 基本信息
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  
  // 代币经济
  const [totalSupply, setTotalSupply] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [teamAllocation, setTeamAllocation] = useState('');
  const [liquidityAllocation, setLiquidityAllocation] = useState('');
  
  // 发射配置
  const [launchDate, setLaunchDate] = useState('');
  const [softCap, setSoftCap] = useState('');
  const [hardCap, setHardCap] = useState('');
  const [minContribution, setMinContribution] = useState('');
  const [maxContribution, setMaxContribution] = useState('');
  
  const steps: Step[] = ['basicInfo', 'tokenEconomics', 'launchConfig', 'review', 'success'];
  
  // 使用导入的图片资源
  const logoOptions = [logo1, logo2, logo3, logo4];

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };
  
  const handlePrevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };
  
  const handleSubmit = async () => {
    try {
      // 调用API服务创建代币
      const tokenData = {
        name,
        symbol,
        description,
        website,
        socialLinks: {
          twitter,
          telegram
        },
        totalSupply: parseFloat(totalSupply),
        initialPrice: parseFloat(initialPrice),
        launchDate: new Date(launchDate).getTime(),
        logo: logoPreview || undefined
      };
      
      // 使用模拟API服务创建代币
      await apiService.createToken(tokenData);
      
      // 前往成功页面
      setCurrentStep('success');
    } catch (error) {
      console.error('Error creating token:', error);
      alert('There was an error creating your token. Please try again.');
    }
  };
  
  const handleViewToken = () => {
    // 在实际应用中，这里应该导航到新创建的代币页面
    navigate('/tokens');
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('createYourToken')}</PageTitle>
        <PageDescription>
          {t('launchSteps')}
        </PageDescription>
      </PageHeader>
      
      {currentStep !== 'success' && (
        <StepIndicator>
          {steps.slice(0, -1).map((step, index) => (
            <StepDot 
              key={step}
              active={currentStep === step}
              completed={steps.indexOf(currentStep) > index}
            >
              <StepLabel active={currentStep === step}>
                {t(step)}
              </StepLabel>
            </StepDot>
          ))}
        </StepIndicator>
      )}
      
      <FormCard>
        <CardContent>
          {/* Step 1: Basic Info */}
          <StepContent active={currentStep === 'basicInfo'}>
            <FormSection>
              <SectionTitle>{t('basicInformation')}</SectionTitle>
              <InputGrid>
                <Input
                  label={t('tokenName')}
                  placeholder="e.g. Ethereum"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <Input
                  label={t('tokenSymbol')}
                  placeholder="e.g. ETH"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  fullWidth
                />
              </InputGrid>
            </FormSection>
            
            <FormSection>
              <SectionTitle>{t('description')}</SectionTitle>
              <TextArea
                placeholder={t('description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>{t('tokenLogo')}</SectionTitle>
              <FileInput>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {logoPreview ? (
                  <ImagePreview>
                    <PreviewImage src={logoPreview} alt={t('tokenLogo')} />
                  </ImagePreview>
                ) : (
                  <>
                    <UploadIcon>🖼️</UploadIcon>
                    <UploadText>{t('uploadLogo')}</UploadText>
                  </>
                )}
              </FileInput>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <LogoButton onClick={() => setLogoPreview(logoOptions[0])}>
                  {t('useLogo')} 1
                </LogoButton>
                <LogoButton onClick={() => setLogoPreview(logoOptions[1])}>
                  {t('useLogo')} 2
                </LogoButton>
                <LogoButton onClick={() => setLogoPreview(logoOptions[2])}>
                  {t('useLogo')} 3
                </LogoButton>
                <LogoButton onClick={() => setLogoPreview(logoOptions[3])}>
                  {t('useLogo')} 4
                </LogoButton>
              </div>
            </FormSection>
            
            <FormSection>
              <SectionTitle>{t('links')}</SectionTitle>
              <Input
                label={t('website')}
                placeholder="https://"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                fullWidth
                startAdornment="🌐"
              />
              <InputGrid>
                <Input
                  label={t('twitter')}
                  placeholder="https://twitter.com/"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  fullWidth
                  startAdornment="🐦"
                />
                <Input
                  label={t('telegram')}
                  placeholder="https://t.me/"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  fullWidth
                  startAdornment="✈️"
                />
              </InputGrid>
            </FormSection>
            
            <FormActions>
              <div></div> {/* Empty div for flex alignment */}
              <Button onClick={handleNextStep}>{t('next')}</Button>
            </FormActions>
          </StepContent>
          
          {/* Step 2: Token Economics */}
          <StepContent active={currentStep === 'tokenEconomics'}>
            <FormSection>
              <SectionTitle>{t('tokenSupply')}</SectionTitle>
              <InputGrid>
                <Input
                  label={t('totalSupply')}
                  placeholder="e.g. 1000000"
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  fullWidth
                />
                <Input
                  label={t('initialPrice')}
                  placeholder="e.g. 0.01"
                  type="number"
                  step="0.0001"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                  fullWidth
                  startAdornment="$"
                />
              </InputGrid>
            </FormSection>
            
            <FormSection>
              <SectionTitle>{t('tokenAllocation')}</SectionTitle>
              <InputGrid>
                <Input
                  label={t('teamAllocation')}
                  placeholder="e.g. 10"
                  type="number"
                  min="0"
                  max="100"
                  value={teamAllocation}
                  onChange={(e) => setTeamAllocation(e.target.value)}
                  fullWidth
                  endAdornment="%"
                />
                <Input
                  label={t('liquidityAllocation')}
                  placeholder="e.g. 50"
                  type="number"
                  min="0"
                  max="100"
                  value={liquidityAllocation}
                  onChange={(e) => setLiquidityAllocation(e.target.value)}
                  fullWidth
                  endAdornment="%"
                />
              </InputGrid>
            </FormSection>
            
            <FormActions>
              <Button variant="outlined" onClick={handlePrevStep}>{t('back')}</Button>
              <Button onClick={handleNextStep}>{t('next')}</Button>
            </FormActions>
          </StepContent>
          
          {/* Step 3: Launch Config */}
          <StepContent active={currentStep === 'launchConfig'}>
            <FormSection>
              <SectionTitle>{t('launchSettings')}</SectionTitle>
              <Input
                label={t('launchDate')}
                type="datetime-local"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
                fullWidth
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>{t('fundingGoals')}</SectionTitle>
              <InputGrid>
                <Input
                  label={t('softCap')}
                  placeholder="e.g. 50"
                  type="number"
                  value={softCap}
                  onChange={(e) => setSoftCap(e.target.value)}
                  fullWidth
                />
                <Input
                  label={t('hardCap')}
                  placeholder="e.g. 100"
                  type="number"
                  value={hardCap}
                  onChange={(e) => setHardCap(e.target.value)}
                  fullWidth
                />
              </InputGrid>
            </FormSection>
            
            <FormSection>
              <SectionTitle>{t('contributionLimits')}</SectionTitle>
              <InputGrid>
                <Input
                  label={t('minContribution')}
                  placeholder="e.g. 0.1"
                  type="number"
                  step="0.01"
                  value={minContribution}
                  onChange={(e) => setMinContribution(e.target.value)}
                  fullWidth
                />
                <Input
                  label={t('maxContribution')}
                  placeholder="e.g. 5"
                  type="number"
                  step="0.01"
                  value={maxContribution}
                  onChange={(e) => setMaxContribution(e.target.value)}
                  fullWidth
                />
              </InputGrid>
            </FormSection>
            
            <FormActions>
              <Button variant="outlined" onClick={handlePrevStep}>{t('back')}</Button>
              <Button onClick={handleNextStep}>{t('review')}</Button>
            </FormActions>
          </StepContent>
          
          {/* Step 4: Review */}
          <StepContent active={currentStep === 'review'}>
            <FormSection>
              <SectionTitle>{t('review')}</SectionTitle>
              
              <ReviewGrid>
                <div>
                  <ReviewSection>
                    <ReviewLabel>{t('tokenName')}</ReviewLabel>
                    <ReviewValue>{name || '未指定'}</ReviewValue>
                    
                    <ReviewLabel>{t('tokenSymbol')}</ReviewLabel>
                    <ReviewValue>{symbol || '未指定'}</ReviewValue>
                    
                    <ReviewLabel>{t('totalSupply')}</ReviewLabel>
                    <ReviewValue>{totalSupply ? `${totalSupply} ${symbol}` : '未指定'}</ReviewValue>
                    
                    <ReviewLabel>{t('initialPrice')}</ReviewLabel>
                    <ReviewValue>{initialPrice ? `$${initialPrice}` : '未指定'}</ReviewValue>
                  </ReviewSection>
                </div>
                
                <div>
                  <ReviewSection>
                    <ReviewLabel>{t('launchDate')}</ReviewLabel>
                    <ReviewValue>
                      {launchDate ? new Date(launchDate).toLocaleString() : '未指定'}
                    </ReviewValue>
                    
                    <ReviewLabel>{t('softCap')} / {t('hardCap')}</ReviewLabel>
                    <ReviewValue>
                      {softCap && hardCap ? `${softCap} ETH / ${hardCap} ETH` : '未指定'}
                    </ReviewValue>
                    
                    <ReviewLabel>{t('contributionLimits')}</ReviewLabel>
                    <ReviewValue>
                      {minContribution && maxContribution 
                        ? `${minContribution} ETH - ${maxContribution} ETH` 
                        : '未指定'}
                    </ReviewValue>
                  </ReviewSection>
                </div>
              </ReviewGrid>
              
              <ReviewSection>
                <ReviewLabel>{t('description')}</ReviewLabel>
                <ReviewValue>{description || '未指定'}</ReviewValue>
              </ReviewSection>
              
              {logoPreview && (
                <ReviewSection>
                  <ReviewLabel>{t('tokenLogo')}</ReviewLabel>
                  <div style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '50%', margin: '8px 0' }}>
                    <img src={logoPreview} alt="代币图标" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </ReviewSection>
              )}
            </FormSection>
            
            <FormActions>
              <Button variant="outlined" onClick={handlePrevStep}>{t('back')}</Button>
              <Button onClick={handleSubmit}>{t('submit')}</Button>
            </FormActions>
          </StepContent>
          
          {/* Step 5: Success */}
          <StepContent active={currentStep === 'success'}>
            <SuccessContainer>
              <SuccessIcon>🎉</SuccessIcon>
              <SuccessTitle>{t('success')}</SuccessTitle>
              <SuccessMessage>
                {t('success')}
              </SuccessMessage>
              <Button size="large" onClick={handleViewToken}>{t('viewYourToken')}</Button>
            </SuccessContainer>
          </StepContent>
        </CardContent>
      </FormCard>
    </PageContainer>
  );
};

export default CreateTokenPage;