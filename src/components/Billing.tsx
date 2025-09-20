import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Crown,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

interface BillingProps {
  user: any;
  onSubscriptionUpdate?: (subscription: any) => void;
}

const Billing: React.FC<BillingProps> = ({ user, onSubscriptionUpdate }) => {
  const { subscription, isTrialActive, isSubscriptionActive, daysRemaining, updateSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would redirect to Stripe Checkout
      // For demo purposes, we'll simulate a successful subscription
      setTimeout(() => {
        const newSubscription = {
          id: 'sub_demo_123',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          trial_end: null,
          plan: {
            id: 'fluencr_pro',
            name: 'Fluencr Pro',
            price: 80,
            currency: 'eur',
            interval: 'month'
          }
        };
        updateSubscription(newSubscription);
        onSubscriptionUpdate?.(newSubscription);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to start subscription. Please try again.');
      setLoading(false);
    }
  };

  const handleManageSubscription = () => {
    // In a real app, this would redirect to Stripe Customer Portal
    window.open('https://billing.stripe.com/p/login/test_demo', '_blank');
  };

  const handleDowngrade = () => {
    // Set to free trial mode
    updateSubscription({
      id: 'sub_trial_demo',
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

  const getStatusBadge = () => {
    if (isTrialActive) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Trial Active
        </Badge>
      );
    } else if (isSubscriptionActive) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          No Subscription
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Free Trial Banner */}
      {isTrialActive && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Free Trial Active</h3>
                <p className="text-sm text-blue-700">
                  {daysRemaining} days remaining in your free trial. Choose a plan below to continue after your trial ends.
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Clock className="h-3 w-3 mr-1" />
              Trial Active
            </Badge>
          </div>
        </Card>
      )}

      {/* Current Subscription Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Subscription Status</h2>
              <p className="text-muted-foreground">
                {isTrialActive ? 'Free trial in progress' : 
                 isSubscriptionActive ? 'Pro subscription active' : 
                 'No active subscription'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {subscription && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Plan</h3>
              <p className="text-2xl font-bold">{subscription.plan.name}</p>
              <p className="text-sm text-muted-foreground">
                €{subscription.plan.price}/{subscription.plan.interval}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">
                {isTrialActive ? 'Trial Ends' : 'Next Billing'}
              </h3>
              <p className="text-2xl font-bold">{daysRemaining}</p>
              <p className="text-sm text-muted-foreground">days remaining</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="text-2xl font-bold capitalize">{subscription.status}</p>
              <p className="text-sm text-muted-foreground">
                {isTrialActive ? 'Trial period' : 'Billing active'}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pro Plan */}
        <Card className={`p-6 ${isSubscriptionActive ? 'ring-2 ring-primary' : ''}`}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Pro</h3>
            </div>
            <div className="text-3xl font-bold mb-4">
              €80<span className="text-lg text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-6">Everything you need to scale</p>
            
            <ul className="space-y-3 mb-6 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited campaigns</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Discovery (basic + intent-led)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>AI-guided outreach (200 AI credits/month)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>CRM workspace</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>ROI & revenue tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>1 user</span>
              </li>
            </ul>

            {isSubscriptionActive ? (
              <div className="space-y-2">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                  disabled
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Current Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleManageSubscription}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Enterprise Plan */}
        <Card className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-purple-600" />
              <h3 className="text-xl font-bold">Enterprise</h3>
              <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>
            </div>
            <div className="text-3xl font-bold mb-4">
              €220<span className="text-lg text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-6">For large teams & agencies</p>
            
            <ul className="space-y-3 mb-6 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited AI credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Team collaboration (multi-user, approval workflows)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced analytics (pipeline forecasting, predictive ROI)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Integrations + API access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Dedicated support & onboarding</span>
              </li>
            </ul>

            <Button 
              variant="outline" 
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => window.open('mailto:sales@fluencr.com?subject=Enterprise Plan Inquiry', '_blank')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Contact Sales
            </Button>
          </div>
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Features</th>
                <th className="text-center py-3">Pro</th>
                <th className="text-center py-3">Enterprise</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b">
                <td className="py-3 font-medium">Campaigns</td>
                <td className="text-center py-3">Unlimited</td>
                <td className="text-center py-3">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Discovery</td>
                <td className="text-center py-3">Basic + Intent-led</td>
                <td className="text-center py-3">Basic + Intent-led</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">AI Credits</td>
                <td className="text-center py-3">200/month</td>
                <td className="text-center py-3">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Users</td>
                <td className="text-center py-3">1 user</td>
                <td className="text-center py-3">Multi-user</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Team Collaboration</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3">✅ (approval workflows)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Analytics</td>
                <td className="text-center py-3">ROI & revenue tracking</td>
                <td className="text-center py-3">Advanced (pipeline forecasting, predictive ROI)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">API Access</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Integrations</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Support</td>
                <td className="text-center py-3">Priority</td>
                <td className="text-center py-3">Dedicated & onboarding</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Billing;
