import MainLayout from "@/components/MainLayout";
import DeveloperPanel from "@/components/DeveloperPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Home
} from "lucide-react";

const Dashboard = () => {
  const { isTrialActive, daysRemaining } = useSubscription();
  const stats = [
    {
      name: "Total Influencers",
      value: "47",
      change: "+5 this month",
      changeType: "increase" as const,
      icon: Users,
      color: "primary",
    },
    {
      name: "Total Interactions",
      value: "156",
      change: "-8 this week",
      changeType: "decrease" as const,
      icon: BarChart3,
      color: "warning",
    },
    {
      name: "Pipeline Generated",
      value: "$127K",
      change: "+18% this month",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "secondary",
    },
    {
      name: "Overall ROI",
      value: "4.3x",
      change: "-0.1x this quarter",
      changeType: "decrease" as const,
      icon: TrendingUp,
      color: "success",
    },
  ];

  const recentCampaigns = [
    { name: "Q4 SaaS Podcast Outreach", status: "Active", roi: "3.8x", leads: 24 },
    { name: "LinkedIn Creator Partnership", status: "Planning", roi: "-", leads: 0 },
    { name: "Newsletter Sponsorship Series", status: "Completed", roi: "5.2x", leads: 18 },
  ];

  const topInfluencers = [
    { name: "Sarah Chen", platform: "LinkedIn", engagement: "4.2%", followers: "25K" },
    { name: "Tech Talk Podcast", platform: "Podcast", engagement: "8.1%", followers: "12K" },
    { name: "SaaS Weekly", platform: "Newsletter", engagement: "12.3%", followers: "8K" },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Trial Reminder Banner */}
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
                    {daysRemaining} days remaining in your free trial. Upgrade to Fluencr Pro to continue creating campaigns and unlock advanced features.
                  </p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                onClick={() => window.location.href = '/billing'}
              >
                Upgrade Now
              </Button>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Home className="h-8 w-8 text-purple-600" />
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Fluencr lets you find B2B influencers across LinkedIn, podcasts, YouTube, and newsletters with audiences that match yours, connect you with them, and measure ROI from every campaign.
            </p>
          </div>
          <Button 
            variant="hero"
            onClick={() => window.location.href = '/campaigns'}
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              primary: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
              warning: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20",
              secondary: "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20",
              success: "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
            };
            const textColorClasses = {
              primary: "text-primary",
              warning: "text-warning",
              secondary: "text-secondary",
              success: "text-success",
            };
            
            return (
              <Card key={stat.name} className={`p-6 hover:shadow-lg transition-all ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium flex items-center gap-2 ${textColorClasses[stat.color as keyof typeof textColorClasses]}`}>
                      <Icon className="h-4 w-4" />
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === "increase" ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "increase"
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Campaigns</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{campaign.roi}</p>
                    <p className="text-sm text-muted-foreground">{campaign.leads} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Influencers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Influencers</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {topInfluencers.map((influencer, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{influencer.name}</p>
                    <p className="text-sm text-muted-foreground">{influencer.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{influencer.followers}</p>
                    <p className="text-sm text-muted-foreground">{influencer.engagement} engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <DeveloperPanel />
      </div>
    </MainLayout>
  );
};

export default Dashboard;