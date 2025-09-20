import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCampaigns, useCreateCampaign, Campaign } from "@/hooks/useCampaigns";
import { useState } from "react";
import { 
  Search, 
  Filter, 
  Target,
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const CampaignsTab = () => {
  const { data: campaigns = [], isLoading, error } = useCampaigns();
  const createCampaignMutation = useCreateCampaign();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration - will be replaced with real API data
  const mockCampaigns = [
    {
      id: "1",
      name: "Q4 SaaS Podcast Outreach",
      description: "Target top SaaS podcasts for product launch awareness",
      status: "active",
      start_date: "2024-10-15",
      end_date: "2024-12-31",
      budget: 25000,
      spent: 12450,
      influencers: 8,
      leads: 24,
      demos: 12,
      revenue: 48600,
      roi: 3.9,
      progress: 65
    },
    {
      id: "2",
      name: "LinkedIn Creator Partnership",
      description: "Collaborate with B2B marketing thought leaders",
      status: "planning",
      start_date: "2024-11-01",
      end_date: "2025-01-31",
      budget: 15000,
      spent: 0,
      influencers: 5,
      leads: 0,
      demos: 0,
      revenue: 0,
      roi: 0,
      progress: 15
    },
    {
      id: "3",
      name: "Newsletter Sponsorship Series",
      description: "Strategic placements in top B2B newsletters",
      status: "completed",
      start_date: "2024-08-01",
      end_date: "2024-09-30",
      budget: 18000,
      spent: 17250,
      influencers: 6,
      leads: 31,
      demos: 18,
      revenue: 89400,
      roi: 5.2,
      progress: 100
    }
  ];

  // Use mock data for now, will switch to real API data when available
  const displayCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;

  const getStatusConfig = (status: string) => {
    switch(status.toLowerCase()) {
      case "active":
        return {
          color: "bg-success text-success-foreground",
          icon: PlayCircle,
          label: "Active"
        };
      case "planning":
        return {
          color: "bg-warning text-warning-foreground", 
          icon: Clock,
          label: "Planning"
        };
      case "completed":
        return {
          color: "bg-primary text-primary-foreground",
          icon: CheckCircle2,
          label: "Completed"
        };
      case "cancelled":
        return {
          color: "bg-muted text-muted-foreground",
          icon: AlertCircle,
          label: "Cancelled"
        };
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: Clock,
          label: "Unknown"
        };
    }
  };

  // Filter campaigns based on search and status
  const filteredCampaigns = displayCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats from real data
  const activeCampaigns = displayCampaigns.filter(c => c.status === 'active').length;
  const totalBudget = displayCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = displayCampaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalRevenue = displayCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const avgROI = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(1) : '0.0';
  const totalLeads = displayCampaigns.reduce((sum, c) => sum + (c.leads || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaigns & ROI Tracking</h2>
          <p className="text-gray-600">Create, manage, and track the performance of your influencer campaigns</p>
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
              <p className="text-sm font-medium text-primary flex items-center gap-2">
                <Target className="h-4 w-4" />
                Active Campaigns
              </p>
              <p className="text-2xl font-bold">{activeCampaigns}</p>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                <p className="text-xs text-success font-medium">+1 from last month</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Avg ROI
              </p>
              <p className="text-2xl font-bold">{avgROI}x</p>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                <p className="text-xs text-success font-medium">+0.2x this quarter</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Leads
              </p>
              <p className="text-2xl font-bold">{totalLeads}</p>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                <p className="text-xs text-success font-medium">+12 this month</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Revenue
              </p>
              <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(1)}K</p>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                <p className="text-xs text-success font-medium">+18% this quarter</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Campaign Cards */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading campaigns...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Failed to load campaigns</p>
          </Card>
        ) : filteredCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-4">Create your first campaign to get started.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => {
            const statusConfig = getStatusConfig(campaign.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={campaign.id} className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card-glow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${statusConfig.color} flex items-center justify-center`}>
                      <StatusIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">{campaign.name}</h3>
                        <Badge className={`text-xs ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{campaign.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'TBD'} - 
                            {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'TBD'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{campaign.influencers || 0} influencers</span>
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
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Budget
                    </div>
                    <div className="font-bold">${(campaign.budget || 0).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Spent: ${(campaign.spent || 0).toLocaleString()}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Target className="h-3 w-3" />
                      Leads
                    </div>
                    <div className="font-bold text-2xl">{campaign.leads || 0}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <PlayCircle className="h-3 w-3" />
                      Demos
                    </div>
                    <div className="font-bold text-2xl">{campaign.demos || 0}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Revenue
                    </div>
                    <div className="font-bold">${(campaign.revenue || 0).toLocaleString()}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/10 border border-success/20">
                    <div className="text-sm text-success mb-1 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      ROI
                    </div>
                    <div className="font-bold text-2xl text-success">{(campaign.roi || 0).toFixed(1)}x</div>
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
          })
        )}
      </div>
    </div>
  );
};

export default CampaignsTab;
