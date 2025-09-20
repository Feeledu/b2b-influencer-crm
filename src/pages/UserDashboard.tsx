import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Search, 
  Users, 
  Target,
  Plus,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import DiscoverTab from '@/components/DiscoverTab';
import InfluencersTab from '@/components/InfluencersTab';
import CRMWorkspaceTab from '@/components/CRMWorkspaceTab';
import CampaignsTab from '@/components/CampaignsTab';

interface UserStats {
  totalInfluencers: number;
  activeCampaigns: number;
  totalLeads: number;
  pipelineValue: number;
  avgROI: number;
  recentInteractions: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab based on current URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/discover') return 'discover';
    if (path === '/influencers') return 'influencers';
    if (path === '/crm') return 'crm';
    if (path === '/campaigns') return 'campaigns';
    return 'overview'; // default for /dashboard
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [stats, setStats] = useState<UserStats>({
    totalInfluencers: 0,
    activeCampaigns: 0,
    totalLeads: 0,
    pipelineValue: 0,
    avgROI: 0,
    recentInteractions: 0
  });

  const [loading, setLoading] = useState(true);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  useEffect(() => {
    // TODO: Replace with real API calls
    setTimeout(() => {
      setStats({
        totalInfluencers: 47,
        activeCampaigns: 3,
        totalLeads: 73,
        pipelineValue: 127000,
        avgROI: 4.3,
        recentInteractions: 12
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      navigate('/dashboard');
    } else {
      navigate(`/${tab}`);
    }
  };

  const quickActions = [
    {
      title: "Discover Influencers",
      description: "Find new B2B influencers to partner with",
      icon: Search,
      action: () => handleTabChange('discover'),
      color: "bg-blue-500"
    },
    {
      title: "Add to My List",
      description: "Save influencers to your CRM workspace",
      icon: Plus,
      action: () => handleTabChange('influencers'),
      color: "bg-green-500"
    },
    {
      title: "Create Campaign",
      description: "Launch a new influencer campaign",
      icon: Target,
      action: () => handleTabChange('campaigns'),
      color: "bg-purple-500"
    },
    {
      title: "CRM Workspace",
      description: "Manage your influencer relationships",
      icon: Users,
      action: () => handleTabChange('crm'),
      color: "bg-orange-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "campaign",
      description: "Q4 SaaS Podcast Outreach campaign launched",
      timestamp: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "influencer",
      description: "Added Sarah Chen to your influencer list",
      timestamp: "4 hours ago",
      status: "success"
    },
    {
      id: 3,
      type: "interaction",
      description: "Scheduled follow-up call with Mike Rodriguez",
      timestamp: "6 hours ago",
      status: "info"
    }
  ];

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {getUserName()}!</h1>
              </div>
              <div className="hidden md:block">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Active User
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  My Influencers
                </p>
                <p className="text-2xl font-bold">{stats.totalInfluencers}</p>
                <div className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  <p className="text-xs text-success font-medium">+5 this month</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Active Campaigns
                </p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                <div className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  <p className="text-xs text-success font-medium">+1 this week</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Total Leads
                </p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
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
                  <DollarSign className="h-4 w-4" />
                  Pipeline Value
                </p>
                <p className="text-2xl font-bold">${(stats.pipelineValue / 1000).toFixed(0)}K</p>
                <div className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  <p className="text-xs text-success font-medium">+18% this quarter</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-lg border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="influencers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Influencers
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              CRM Workspace
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-start space-y-2"
                            onClick={action.action}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{action.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {action.description}
                                </div>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest actions and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-1 rounded-full ${
                            activity.status === 'success' ? 'bg-green-100' : 
                            activity.status === 'info' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <div className={`h-3 w-3 rounded-full ${
                              activity.status === 'success' ? 'bg-green-600' : 
                              activity.status === 'info' ? 'bg-blue-600' : 'bg-gray-600'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discover">
            <DiscoverTab />
          </TabsContent>

          <TabsContent value="influencers">
            <InfluencersTab />
          </TabsContent>

          <TabsContent value="crm">
            <CRMWorkspaceTab />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
