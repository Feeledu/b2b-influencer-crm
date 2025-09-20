import React, { createContext, useContext, useState, useEffect } from 'react';

interface Subscription {
  id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  current_period_end: Date;
  trial_end?: Date;
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
  };
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  canCreateCampaign: boolean;
  canAccessCRM: boolean;
  canAccessAdvancedFeatures: boolean;
  canAccessIntentDiscovery: boolean;
  updateSubscription: (subscription: Subscription | null) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock subscription data for demo
  useEffect(() => {
    // Check if user has a saved subscription state
    const savedSubscription = localStorage.getItem('fluencr_subscription');
    
    if (savedSubscription) {
      try {
        const parsed = JSON.parse(savedSubscription);
        // Convert date strings back to Date objects
        parsed.current_period_end = new Date(parsed.current_period_end);
        if (parsed.trial_end) {
          parsed.trial_end = new Date(parsed.trial_end);
        }
        // Update price if it's the old value
        if (parsed.plan && parsed.plan.price === 79) {
          parsed.plan.price = 80;
          localStorage.setItem('fluencr_subscription', JSON.stringify(parsed));
        }
        setSubscription(parsed);
      } catch (error) {
        console.error('Error parsing saved subscription:', error);
        // Fallback to trial mode
        initializeTrialMode();
      }
    } else {
      // Start with trial mode by default
      initializeTrialMode();
    }
    
    setLoading(false);
  }, []);

  // Update current time every minute for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const initializeTrialMode = () => {
    const mockSubscription: Subscription = {
      id: 'sub_demo_123',
      status: 'trialing',
      current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      plan: {
        id: 'fluencr_pro',
        name: 'Fluencr Pro',
        price: 80,
        currency: 'eur',
        interval: 'month'
      }
    };
    setSubscription(mockSubscription);
    // Save to localStorage
    localStorage.setItem('fluencr_subscription', JSON.stringify(mockSubscription));
  };

  const isTrialActive = subscription?.trial_end && new Date(subscription.trial_end) > currentTime;
  const isSubscriptionActive = subscription?.status === 'active' && !isTrialActive;
  
  // Debug logging
  console.log('Subscription Context Debug:', {
    subscription,
    isTrialActive,
    isSubscriptionActive,
    trialEnd: subscription?.trial_end,
    currentDate: new Date(),
    trialEndDate: subscription?.trial_end ? new Date(subscription.trial_end) : null
  });
  const isExpired = subscription?.current_period_end && new Date(subscription.current_period_end) < currentTime;

  const getDaysRemaining = () => {
    if (isTrialActive && subscription?.trial_end) {
      return Math.ceil((new Date(subscription.trial_end).getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));
    } else if (isSubscriptionActive && subscription?.current_period_end) {
      return Math.ceil((new Date(subscription.current_period_end).getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const daysRemaining = getDaysRemaining();

  // Feature access control
  const canCreateCampaign = isTrialActive || isSubscriptionActive;
  const canAccessCRM = isTrialActive || isSubscriptionActive;
  const canAccessAdvancedFeatures = isSubscriptionActive; // Only for paid subscribers
  const canAccessIntentDiscovery = isSubscriptionActive; // Only paid subscribers

  const updateSubscription = (newSubscription: Subscription | null) => {
    setSubscription(newSubscription);
    // Save to localStorage for persistence
    if (newSubscription) {
      localStorage.setItem('fluencr_subscription', JSON.stringify(newSubscription));
    } else {
      localStorage.removeItem('fluencr_subscription');
    }
  };

  const value = {
    subscription,
    loading,
    error,
    isTrialActive,
    isSubscriptionActive,
    isExpired,
    daysRemaining,
    canCreateCampaign,
    canAccessCRM,
    canAccessAdvancedFeatures,
    canAccessIntentDiscovery,
    updateSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
