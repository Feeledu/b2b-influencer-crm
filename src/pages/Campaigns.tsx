import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Calendar,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle
} from "lucide-react";

const Campaigns = () => {
  const campaigns = [
    {
      id: 1,
      name: "Q4 SaaS Podcast Outreach",
      description: "Target top SaaS podcasts for product launch awareness",
      status: "Active",
      startDate: "Oct 15, 2024",
      endDate: "Dec 31, 2024",
      budget: "$25,000",
      spent: "$12,450",
      influencers: 8,
      leads: 24,
      demos: 12,
      revenue: "$48,600",
      roi: "3.9x",
      progress: 65,
      emoji: "🎧"
    },
    {
      id: 2,
      name: "LinkedIn Creator Partnership",
      description: "Collaborate with B2B marketing thought leaders",
      status: "Planning",
      startDate: "Nov 1, 2024",
      endDate: "Jan 31, 2025",
      budget: "$15,000",
      spent: "$0",
      influencers: 5,
      leads: 0,
      demos: 0,
      revenue: "$0",
      roi: "-",
      progress: 15,
      emoji: "💼"
    },
    {
      id: 3,
      name: "Newsletter Sponsorship Series",
      description: "Strategic placements in top B2B newsletters",
      status: "Completed",
      startDate: "Aug 1, 2024",
      endDate: "Sep 30, 2024",
      budget: "$18,000",
      spent: "$17,250",
      influencers: 6,
      leads: 31,
      demos: 18,
      revenue: "$89,400",
      roi: "5.2x",
      progress: 100,
      emoji: "📧"
    },
    {
      id: 4,
      name: "Industry Conference Speakers",
      description: "Partner with conference speakers for post-event content",
      status: "Paused",
      startDate: "Sep 15, 2024",
      endDate: "Nov 15, 2024",
      budget: "$12,000",
      spent: "$3,200",
      influencers: 4,
      leads: 7,
      demos: 3,
      revenue: "$12,900",
      roi: "4.0x",
      progress: 25,
      emoji: "🎤"
    }
  ];

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "Active":
        return {
          color: "bg-success text-success-foreground",
          icon: PlayCircle,
          emoji: "🔥"
        };
      case "Planning":
        return {
          color: "bg-warning text-warning-foreground", 
          icon: Clock,
          emoji: "📋"
        };
      case "Completed":
        return {
          color: "bg-primary text-primary-foreground",
          icon: CheckCircle2,
          emoji: "✅"
        };
      case "Paused":
        return {
          color: "bg-muted text-muted-foreground",
          icon: AlertCircle,
          emoji: "⏸️"
        };
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: Clock,
          emoji: "📝"
        };
    }
  };

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              🎯 Campaigns & ROI Tracking
            </h1>
            <p className="text-muted-foreground">
              Create, manage, and track the performance of your influencer campaigns
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">🎯 Active Campaigns</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">💰 Total ROI</p>
                <p className="text-2xl font-bold">4.3x</p>
                <p className="text-xs text-muted-foreground">+0.2x this quarter</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">📈 Pipeline</p>
                <p className="text-2xl font-bold">$127K</p>
                <p className="text-xs text-muted-foreground">+18% this month</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">👥 Influencers</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Active partnerships</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </Card>
        </div>

        {/* Campaign Cards */}
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const statusConfig = getStatusConfig(campaign.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={campaign.id} className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card-glow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-lg">
                      {campaign.emoji}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">{campaign.name}</h3>
                        <Badge className={`text-xs ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.emoji} {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{campaign.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{campaign.startDate} - {campaign.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{campaign.influencers} influencers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Campaign Progress</span>
                    <span className="text-sm text-muted-foreground">{campaign.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">💰 Budget</div>
                    <div className="font-bold">{campaign.budget}</div>
                    <div className="text-xs text-muted-foreground">Spent: {campaign.spent}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">🎯 Leads</div>
                    <div className="font-bold text-2xl">{campaign.leads}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">🎬 Demos</div>
                    <div className="font-bold text-2xl">{campaign.demos}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">💵 Revenue</div>
                    <div className="font-bold">{campaign.revenue}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/10 border border-success/20">
                    <div className="text-sm text-success mb-1">📊 ROI</div>
                    <div className="font-bold text-2xl text-success">{campaign.roi}</div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">🚀 Ready to Scale Your Influence?</h3>
            <p className="text-muted-foreground mb-4">
              Create your next campaign or explore our influencer database to find new partnership opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark">
                <Plus className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Browse Influencers
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Campaigns;