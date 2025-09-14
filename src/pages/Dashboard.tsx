import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      name: "Active Campaigns",
      value: "12",
      change: "+2.1%",
      changeType: "increase" as const,
      icon: BarChart3,
    },
    {
      name: "Total Influencers",
      value: "248",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Users,
    },
    {
      name: "Pipeline Generated",
      value: "$127K",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: DollarSign,
    },
    {
      name: "ROI",
      value: "4.2x",
      change: "-0.3%",
      changeType: "decrease" as const,
      icon: TrendingUp,
    },
  ];

  const recentCampaigns = [
    { name: "Q4 SaaS Podcast Outreach", status: "Active", roi: "3.8x", leads: 24 },
    { name: "LinkedIn Creator Partnership", status: "Planning", roi: "-", leads: 0 },
    { name: "Newsletter Sponsorship Series", status: "Completed", roi: "5.2x", leads: 18 },
  ];

  const topInfluencers = [
    { name: "Sarah Chen", platform: "LinkedIn", followers: "25K", engagement: "4.2%" },
    { name: "Tech Talk Podcast", platform: "Podcast", listeners: "15K", engagement: "8.1%" },
    { name: "SaaS Weekly", platform: "Newsletter", subscribers: "8K", engagement: "12.3%" },
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your influencer marketing performance and ROI
            </p>
          </div>
          <Button variant="hero">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
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
                  <span className="text-sm text-muted-foreground ml-1">
                    from last month
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
      </div>
    </Layout>
  );
};

export default Dashboard;