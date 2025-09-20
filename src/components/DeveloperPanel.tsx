import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { setPremiumMode, forceResetTrials } from "@/lib/premiumAIService";

const DeveloperPanel = () => {
  const { subscription, updateSubscription } = useSubscription();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleSetPremium = () => {
    setPremiumMode(true);
    updateSubscription({
      id: 'sub_premium_dev',
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        plan: {
          id: 'fluencr_pro',
          name: 'Fluencr Pro',
          price: 80,
          currency: 'eur',
          interval: 'month'
        }
    });
  };

  const handleSetTrial = () => {
    updateSubscription({
      id: 'sub_trial_dev',
      status: 'trialing',
      current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        plan: {
          id: 'fluencr_pro',
          name: 'Fluencr Pro',
          price: 80,
          currency: 'eur',
          interval: 'month'
        }
    });
  };

  const handleForceReset = () => {
    forceResetTrials();
    handleSetTrial();
  };

  const handleSetFree = () => {
    updateSubscription(null);
  };

  const handleDebugInfo = () => {
    console.log('=== DEVELOPER DEBUG INFO ===');
    console.log('Subscription:', subscription);
    console.log('Local Storage AI Trials:', localStorage.getItem('aiTrialInfo'));
    console.log('Environment:', process.env.NODE_ENV);
    console.log('========================');
  };

  const getCurrentStatus = () => {
    if (!subscription) return "Free - Campaigns: Blocked, Intent Discovery: Blocked";
    if (subscription.status === 'active') return "Premium - All Features: Allowed";
    if (subscription.status === 'trialing') return "Trial - Campaigns: Allowed, Intent Discovery: Blocked";
    return "Unknown - Features: Blocked";
  };

  return (
    <Card className="mt-8 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-700 text-sm">🛠️ Developer Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSetPremium}
            className="text-xs"
          >
            🚀 Set Premium Mode
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSetTrial}
            className="text-xs"
          >
            🧪 Set Trial Mode
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleForceReset}
            className="text-xs"
          >
            🔄 Force Reset
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSetFree}
            className="text-xs"
          >
            🚫 Set Free Mode
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDebugInfo}
            className="text-xs"
          >
            📊 Debug Info
          </Button>
        </div>
        
        <div className="text-orange-700 text-xs font-medium">
          Current: {getCurrentStatus()}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeveloperPanel;
