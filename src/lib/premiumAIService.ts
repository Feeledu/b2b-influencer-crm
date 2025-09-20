// Premium AI Service with trial tracking
// This will be implemented when we add the premium features

export interface AITrialInfo {
  remainingTrials: number;
  isPremium: boolean;
  lastUsed?: Date;
}

export interface AIGenerationRequest {
  prompt: string;
  influencerName: string;
  platform: string;
  industry: string;
  context?: string;
}

export interface AIGenerationResponse {
  subject: string;
  message: string;
  suggestions?: string[];
  trialInfo?: AITrialInfo;
}

// Mock trial tracking (in real app, this would be stored in database)
const getTrialInfo = (): AITrialInfo => {
  const stored = localStorage.getItem('aiTrialInfo');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Check if this is the admin user (demo@fluencr.com)
  const isAdmin = window.location.href.includes('demo@fluencr.com') || 
                  localStorage.getItem('userEmail') === 'demo@fluencr.com' ||
                  localStorage.getItem('isAdmin') === 'true';
  
  // Admin gets premium, new users get 5 trials
  const trialInfo: AITrialInfo = {
    remainingTrials: isAdmin ? 999 : 5,
    isPremium: isAdmin,
    lastUsed: undefined
  };
  
  localStorage.setItem('aiTrialInfo', JSON.stringify(trialInfo));
  return trialInfo;
};

const updateTrialInfo = (trialInfo: AITrialInfo) => {
  localStorage.setItem('aiTrialInfo', JSON.stringify(trialInfo));
};

export const checkAITrialEligibility = (): AITrialInfo => {
  return getTrialInfo();
};

export const generateAIMessageWithTrial = async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
  const trialInfo = getTrialInfo();
  
  // Check if user has trials remaining or is premium
  if (!trialInfo.isPremium && trialInfo.remainingTrials <= 0) {
    throw new Error('No AI trials remaining. Upgrade to premium for unlimited AI message generation.');
  }
  
  // For now, return a mock response since we disabled the real AI
  const mockResponse = generateMockAIResponse(request);
  
  // Update trial count if not premium
  if (!trialInfo.isPremium) {
    trialInfo.remainingTrials -= 1;
    trialInfo.lastUsed = new Date();
    updateTrialInfo(trialInfo);
  }
  
  return {
    ...mockResponse,
    trialInfo
  };
};

const generateMockAIResponse = (request: AIGenerationRequest): Omit<AIGenerationResponse, 'trialInfo'> => {
  const { prompt, influencerName, platform, industry } = request;
  
  // Enhanced mock responses that don't include the raw prompt
  const responses = [
    {
      subject: `Partnership Opportunity - ${influencerName}`,
      message: `Hi ${influencerName},

I hope this message finds you well. I've been following your excellent content on ${platform} and I'm particularly impressed by your insights on ${industry}.

I believe there's a great opportunity for us to collaborate and create something valuable for both our audiences. Your expertise in ${industry} would be a perfect complement to what we're building.

Would you be interested in a brief call to discuss this further? I'd love to learn more about your current projects and see how we might work together.

Best regards,
[Your Name]`,
      suggestions: [
        "Mention specific content they've created that impressed you",
        "Include a clear call-to-action",
        "Keep it concise but personal"
      ]
    },
    {
      subject: `Collaboration Inquiry - ${influencerName}`,
      message: `Hi ${influencerName},

I hope you're doing well. I've been following your work in ${industry} and I'm impressed by your expertise and unique perspective.

I'd love to explore how we might work together on content creation. This could include guest posts, joint webinars, social media collaborations, or other creative partnerships that would benefit both our audiences.

Would you be open to a quick conversation to discuss the possibilities?

Looking forward to hearing from you.

Best regards,
[Your Name]`,
      suggestions: [
        "Be specific about the type of collaboration",
        "Mention mutual benefits",
        "Offer flexible options"
      ]
    }
  ];
  
  // Return a random response (in real app, this would be the AI response)
  return responses[Math.floor(Math.random() * responses.length)];
};

// Premium upgrade functions (for future implementation)
export const upgradeToPremium = async (): Promise<boolean> => {
  // This would integrate with your billing system
  console.log('Upgrading to premium...');
  return true;
};

export const resetTrials = (): void => {
  const trialInfo: AITrialInfo = {
    remainingTrials: 5,
    isPremium: false,
    lastUsed: undefined
  };
  updateTrialInfo(trialInfo);
  console.log('✅ AI trials reset! You now have 5 fresh trials.');
};

// Admin function to reset trials (for testing)
export const adminResetTrials = (): void => {
  resetTrials();
  alert('🎉 AI trials reset! You now have 5 fresh trials to test the feature.');
};

// Developer mode functions for testing
export const setPremiumMode = (isPremium: boolean): void => {
  const trialInfo: AITrialInfo = {
    remainingTrials: isPremium ? 999 : 5,
    isPremium: isPremium,
    lastUsed: undefined
  };
  updateTrialInfo(trialInfo);
  console.log(`✅ Switched to ${isPremium ? 'Premium' : 'Trial'} mode`);
};

export const forceResetTrials = (): void => {
  localStorage.removeItem('aiTrialInfo');
  const trialInfo = getTrialInfo();
  console.log('🔄 Forced reset - new trial info:', trialInfo);
};
