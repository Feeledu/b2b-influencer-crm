import MainLayout from "@/components/MainLayout";
import DeveloperPanel from "@/components/DeveloperPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  PlayCircle,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Edit,
  Save,
  Copy,
  BarChart3,
  Activity,
  Settings,
  UserPlus,
  Trash2
} from "lucide-react";
import CreateCampaignForm from "@/components/CreateCampaignForm";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddInfluencer, setShowAddInfluencer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [availableInfluencers, setAvailableInfluencers] = useState([
    { id: 1, name: "Sarah Chen", platform: "LinkedIn", followers: 15000, engagement: 4.2, bio: "SaaS marketing expert" },
    { id: 2, name: "Mike Rodriguez", platform: "Twitter", followers: 8500, engagement: 3.8, bio: "B2B growth specialist" },
    { id: 3, name: "Emma Wilson", platform: "Newsletter", followers: 12000, engagement: 5.1, bio: "Content marketing strategist" },
    { id: 4, name: "Alex Johnson", platform: "YouTube", followers: 25000, engagement: 2.9, bio: "Tech reviewer and educator" },
    { id: 5, name: "David Park", platform: "Podcast", followers: 18000, engagement: 4.7, bio: "Startup advisor and investor" }
  ]);
  const { canCreateCampaign, isTrialActive, daysRemaining } = useSubscription();
  const navigate = useNavigate();
  
  // Mock data for development
  const mockCampaigns = [
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
      assignedInfluencers: [
        { name: "Sarah Chen", platform: "Podcast" },
        { name: "Mike Rodriguez", platform: "LinkedIn" }
      ],
      utmLink: "https://fluencr.com/campaign/q4-podcast?utm_source=influencer&utm_medium=podcast&utm_campaign=q4-saas"
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
      assignedInfluencers: [],
      utmLink: null
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
      assignedInfluencers: [
        { name: "David Park", platform: "Newsletter" },
        { name: "Emma Wilson", platform: "Newsletter" }
      ],
      utmLink: "https://fluencr.com/campaign/newsletter-series?utm_source=influencer&utm_medium=newsletter&utm_campaign=sponsorship"
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
      assignedInfluencers: [
        { name: "Alex Johnson", platform: "YouTube" }
      ],
      utmLink: "https://fluencr.com/campaign/conference-speakers?utm_source=influencer&utm_medium=youtube&utm_campaign=conference"
    }
  ];

  // Use mock data
  const campaigns = mockCampaigns;

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "Active":
        return {
          color: "bg-success text-success-foreground",
          icon: PlayCircle
        };
      case "Planning":
        return {
          color: "bg-warning text-warning-foreground", 
          icon: Clock
        };
      case "Completed":
        return {
          color: "bg-primary text-primary-foreground",
          icon: CheckCircle2
        };
      case "Paused":
        return {
          color: "bg-muted text-muted-foreground",
          icon: AlertCircle
        };
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: Clock
        };
    }
  };

  const handleCreateCampaign = (newCampaign: any) => {
    // TODO: Implement API call to create campaign
    setShowCreateForm(false);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handleViewDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setEditForm(campaign);
    setIsEditing(false);
    setActiveTab('Overview');
  };

  const handleCloseDetails = () => {
    setSelectedCampaign(null);
    setIsEditing(false);
    setEditForm({});
  };

  const handleEdit = () => {
    setEditForm({ ...selectedCampaign });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // TODO: Implement API call to update campaign
    // For now, just update the local state
    setSelectedCampaign({ ...selectedCampaign, ...editForm });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm(selectedCampaign);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCopyUTM = async () => {
    if (selectedCampaign.utmLink) {
      try {
        await navigator.clipboard.writeText(selectedCampaign.utmLink);
        // You could add a toast notification here
        console.log('UTM link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy UTM link:', err);
      }
    }
  };

  const handleAddInfluencer = () => {
    setShowAddInfluencer(true);
  };

  const handleAddInfluencerToCampaign = (influencer: any) => {
    // TODO: Implement API call to add influencer to campaign
    const updatedInfluencers = [...(selectedCampaign.assignedInfluencers || []), influencer];
    const updatedCampaign = { ...selectedCampaign, assignedInfluencers: updatedInfluencers };
    setSelectedCampaign(updatedCampaign);
    setShowAddInfluencer(false);
  };

  const handleCloseAddInfluencer = () => {
    setShowAddInfluencer(false);
  };

  // Get influencers not already assigned to this campaign
  const getAvailableInfluencers = () => {
    const assignedIds = selectedCampaign.assignedInfluencers?.map((inf: any) => inf.id) || [];
    return availableInfluencers.filter(inf => !assignedIds.includes(inf.id));
  };

  const handleRemoveInfluencer = (influencerIndex: number) => {
    // Only allow removal from Planning or Paused campaigns
    if (selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed') {
      alert('Cannot remove influencers from active or completed campaigns. Please pause the campaign first.');
      return;
    }
    
    if (window.confirm('Are you sure you want to remove this influencer from the campaign?')) {
      // TODO: Implement API call to remove influencer from campaign
      const updatedInfluencers = selectedCampaign.assignedInfluencers.filter((_: any, idx: number) => idx !== influencerIndex);
      const updatedCampaign = { ...selectedCampaign, assignedInfluencers: updatedInfluencers };
      setSelectedCampaign(updatedCampaign);
    }
  };

  const handleViewInfluencerProfile = (influencer: any) => {
    // Navigate to influencer profile or contact page
    navigate(`/contact/${influencer.id || 'unknown'}`);
  };

  const handleDeleteCampaign = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCampaign = () => {
    // TODO: Implement API call to delete campaign
    handleCloseDetails();
    setShowDeleteConfirm(false);
  };

  const cancelDeleteCampaign = () => {
    setShowDeleteConfirm(false);
  };


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
                    {daysRemaining} days remaining in your free trial. Upgrade to Fluencr Pro to continue creating campaigns.
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
              <Target className="h-8 w-8 text-primary" />
              Campaigns & ROI Tracking
            </h1>
            <p className="text-muted-foreground">
              Create, manage, and track the performance of your influencer campaigns
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark shadow-lg hover:shadow-xl"
            onClick={() => setShowCreateForm(true)}
            disabled={!canCreateCampaign}
          >
            <Plus className="h-4 w-4" />
            {!canCreateCampaign ? 'Upgrade to Create Campaigns' : 'New Campaign'}
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
                <p className="text-2xl font-bold">4</p>
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
                  ROI
                </p>
                <p className="text-2xl font-bold">4.3x</p>
                <div className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  <p className="text-xs text-success font-medium">+0.2x this quarter</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Pipeline
                </p>
                <p className="text-2xl font-bold">$127K</p>
                <div className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  <p className="text-xs text-success font-medium">+18% this month</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Influencers
                </p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Active partnerships</p>
                <div className="flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  <p className="text-xs text-success font-medium">+12 this month</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && (
          <CreateCampaignForm
            onSave={handleCreateCampaign}
            onCancel={handleCancelCreate}
          />
        )}

        {/* Campaign Cards */}
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const statusConfig = getStatusConfig(campaign.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={campaign.id} className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card-glow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <StatusIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">{campaign.name}</h3>
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {campaign.status}
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

                {/* Assigned Influencers */}
                {campaign.assignedInfluencers && campaign.assignedInfluencers.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assigned Influencers ({campaign.assignedInfluencers.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.assignedInfluencers.map((influencer: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {influencer.name} ({influencer.platform})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Budget
                    </div>
                    <div className="font-bold">{campaign.budget}</div>
                    <div className="text-xs text-muted-foreground">Spent: {campaign.spent}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Target className="h-3 w-3" />
                      Leads
                    </div>
                    <div className="font-bold text-2xl">{campaign.leads}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <PlayCircle className="h-3 w-3" />
                      Demos
                    </div>
                    <div className="font-bold text-2xl">{campaign.demos}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Revenue
                    </div>
                    <div className="font-bold">{campaign.revenue}</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/10 border border-success/20">
                    <div className="text-sm text-success mb-1 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      ROI
                    </div>
                    <div className="font-bold text-2xl text-success">{campaign.roi}</div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                      onClick={() => handleViewDetails(campaign)}
                    >
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
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ready to Scale Your Influence?
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your next campaign or explore our influencer database to find new partnership opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/discover')}
              >
                <Users className="h-4 w-4 mr-2" />
                Browse Influencers
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Campaign Management Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      {isEditing ? (
                        <Input
                          value={editForm.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-2xl font-bold border-none p-0 h-auto"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold">{selectedCampaign.name}</h2>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusConfig(selectedCampaign.status).color}>
                          {selectedCampaign.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {selectedCampaign.startDate} - {selectedCampaign.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleCloseDetails}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 border-b">
                  {['Overview', 'Influencers', 'Analytics', 'Settings'].map((tab) => (
                    <Button
                      key={tab}
                      variant="ghost"
                      onClick={() => handleTabChange(tab)}
                      className={`rounded-none border-b-2 ${
                        activeTab === tab 
                          ? 'border-primary text-primary' 
                          : 'border-transparent hover:border-primary'
                      }`}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Overview Tab */}
                  {activeTab === 'Overview' && (
                    <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Description
                        </h3>
                        {isEditing ? (
                          <Textarea
                            value={editForm.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="min-h-[100px]"
                          />
                        ) : (
                          <p className="text-muted-foreground">{selectedCampaign.description}</p>
                        )}
                      </div>

                      {/* Progress & Status */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Progress
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Campaign Progress</span>
                              <span className="text-sm text-muted-foreground">{selectedCampaign.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                                style={{ width: `${selectedCampaign.progress}%` }}
                              />
                            </div>
                          </div>
                          
                          {isEditing && (
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <Select 
                                value={editForm.status || selectedCampaign.status} 
                                onValueChange={(value) => handleInputChange('status', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Planning">Planning</SelectItem>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Paused">Paused</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Budget & Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Budget</span>
                        </div>
                        {isEditing ? (
                          <Input
                            value={editForm.budget || selectedCampaign.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                            className="text-xl font-bold border-none p-0 h-auto"
                          />
                        ) : (
                          <p className="text-xl font-bold">{selectedCampaign.budget}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Spent: {selectedCampaign.spent}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="h-4 w-4 text-success" />
                          <span className="text-xs text-muted-foreground">Influencers</span>
                        </div>
                        <p className="text-xl font-bold">{selectedCampaign.influencers}</p>
                        <p className="text-xs text-muted-foreground">Active partnerships</p>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
                        <div className="flex items-center justify-between mb-2">
                          <Target className="h-4 w-4 text-warning" />
                          <span className="text-xs text-muted-foreground">Leads</span>
                        </div>
                        <p className="text-xl font-bold">{selectedCampaign.leads}</p>
                        <p className="text-xs text-muted-foreground">Generated</p>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingUp className="h-4 w-4 text-secondary" />
                          <span className="text-xs text-muted-foreground">ROI</span>
                        </div>
                        <p className="text-xl font-bold text-success">{selectedCampaign.roi}</p>
                        <p className="text-xs text-muted-foreground">Return on investment</p>
                      </div>
                    </div>

                    {/* UTM Link Management */}
                    {(selectedCampaign.utmLink || isEditing) && (
                      <div className="p-4 rounded-lg bg-muted/30 border">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          UTM Tracking Link
                        </h3>
                        <div className="flex items-center space-x-2">
                          {isEditing ? (
                            <Input
                              value={editForm.utmLink ?? ''}
                              onChange={(e) => handleInputChange('utmLink', e.target.value)}
                              className="flex-1 font-mono text-sm text-blue-600"
                              placeholder="Enter UTM tracking link..."
                            />
                          ) : (
                            <div className="flex-1 p-3 bg-background rounded border">
                              <p className="text-sm font-mono text-blue-600 break-all">
                                {selectedCampaign.utmLink || 'No UTM link set'}
                              </p>
                            </div>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleCopyUTM}
                            disabled={!selectedCampaign.utmLink}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Clicks: 1,247 • Conversions: 23 • CTR: 1.8%
                        </div>
                        {isEditing && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            💡 Tip: Include utm_source, utm_medium, utm_campaign parameters for better tracking
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assigned Influencers */}
                    {selectedCampaign.assignedInfluencers && selectedCampaign.assignedInfluencers.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Assigned Influencers ({selectedCampaign.assignedInfluencers.length})
                          </h3>
                          <Button size="sm" variant="outline" onClick={handleAddInfluencer}>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add Influencer
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCampaign.assignedInfluencers.map((influencer: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-medium">
                                  {influencer.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium">{influencer.name}</p>
                                  <p className="text-sm text-muted-foreground">{influencer.platform}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleViewInfluencerProfile(influencer)}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className={`text-destructive ${
                                    selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed' 
                                      ? 'opacity-50 cursor-not-allowed' 
                                      : ''
                                  }`}
                                  onClick={() => handleRemoveInfluencer(idx)}
                                  disabled={selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'}
                                  title={
                                    selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'
                                      ? 'Cannot remove from active/completed campaigns'
                                      : 'Remove influencer'
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  )}

                  {/* Influencers Tab */}
                  {activeTab === 'Influencers' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Campaign Influencers
                        </h3>
                        <Button onClick={handleAddInfluencer}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Influencer
                        </Button>
                      </div>
                      
                      {selectedCampaign.assignedInfluencers && selectedCampaign.assignedInfluencers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedCampaign.assignedInfluencers.map((influencer: any, idx: number) => (
                            <Card key={idx} className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                                  {influencer.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{influencer.name}</h4>
                                  <p className="text-sm text-muted-foreground">{influencer.platform}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Performance:</span>
                                  <span className="font-medium">Good</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Leads Generated:</span>
                                  <span className="font-medium">{Math.floor(Math.random() * 10) + 1}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Last Contact:</span>
                                  <span className="font-medium">2 days ago</span>
                                </div>
                              </div>
                              <div className="flex space-x-2 mt-4">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => handleViewInfluencerProfile(influencer)}
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className={`text-destructive ${
                                    selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed' 
                                      ? 'opacity-50 cursor-not-allowed' 
                                      : ''
                                  }`}
                                  onClick={() => handleRemoveInfluencer(idx)}
                                  disabled={selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'}
                                  title={
                                    selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'
                                      ? 'Cannot remove from active/completed campaigns'
                                      : 'Remove influencer'
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Influencers Assigned</h3>
                          <p className="text-muted-foreground mb-4">
                            Add influencers to this campaign to start tracking performance.
                          </p>
                          <Button onClick={handleAddInfluencer}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Your First Influencer
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Analytics Tab */}
                  {activeTab === 'Analytics' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Campaign Analytics
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card className="p-6">
                          <h4 className="font-semibold mb-4">Performance Overview</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span>Total Clicks</span>
                              <span className="font-bold">1,247</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Conversions</span>
                              <span className="font-bold text-success">23</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Conversion Rate</span>
                              <span className="font-bold text-success">1.8%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cost per Click</span>
                              <span className="font-bold">$2.15</span>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-6">
                          <h4 className="font-semibold mb-4">Revenue Breakdown</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span>Total Revenue</span>
                              <span className="font-bold text-success">${selectedCampaign.revenue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Campaign Cost</span>
                              <span className="font-bold">${selectedCampaign.spent}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Net Profit</span>
                              <span className="font-bold text-success">
                                ${parseInt(selectedCampaign.revenue.replace(/[$,]/g, '')) - parseInt(selectedCampaign.spent.replace(/[$,]/g, ''))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>ROI</span>
                              <span className="font-bold text-success">{selectedCampaign.roi}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      
                      <Card className="p-6">
                        <h4 className="font-semibold mb-4">Top Performing Influencers</h4>
                        <div className="space-y-3">
                          {selectedCampaign.assignedInfluencers?.slice(0, 3).map((influencer: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm">
                                  {influencer.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium">{influencer.name}</p>
                                  <p className="text-sm text-muted-foreground">{influencer.platform}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-success">{Math.floor(Math.random() * 5) + 1} leads</p>
                                <p className="text-sm text-muted-foreground">${Math.floor(Math.random() * 5000) + 1000} revenue</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'Settings' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Campaign Settings
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                          <h4 className="font-semibold mb-4">Basic Information</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Campaign Name</label>
                              {isEditing ? (
                                <Input
                                  value={editForm.name || ''}
                                  onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                              ) : (
                                <p className="text-muted-foreground">{selectedCampaign.name}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Description</label>
                              {isEditing ? (
                                <Textarea
                                  value={editForm.description || ''}
                                  onChange={(e) => handleInputChange('description', e.target.value)}
                                  className="min-h-[100px]"
                                />
                              ) : (
                                <p className="text-muted-foreground">{selectedCampaign.description}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Status</label>
                              {isEditing ? (
                                <Select 
                                  value={editForm.status || selectedCampaign.status} 
                                  onValueChange={(value) => handleInputChange('status', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Paused">Paused</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge className={getStatusConfig(selectedCampaign.status).color}>
                                  {selectedCampaign.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-6">
                          <h4 className="font-semibold mb-4">Budget & Timeline</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Budget</label>
                              {isEditing ? (
                                <Input
                                  value={editForm.budget || selectedCampaign.budget}
                                  onChange={(e) => handleInputChange('budget', e.target.value)}
                                />
                              ) : (
                                <p className="text-muted-foreground">{selectedCampaign.budget}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Start Date</label>
                              <p className="text-muted-foreground">{selectedCampaign.startDate}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">End Date</label>
                              <p className="text-muted-foreground">{selectedCampaign.endDate}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Progress</label>
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                                    style={{ width: `${selectedCampaign.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">{selectedCampaign.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-6">
                          <h4 className="font-semibold mb-4">Tracking & Analytics</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">UTM Tracking Link</label>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editForm.utmLink || selectedCampaign.utmLink}
                                    onChange={(e) => handleInputChange('utmLink', e.target.value)}
                                    placeholder="https://example.com?utm_source=influencer&utm_medium=social&utm_campaign=campaign_name"
                                    className="font-mono text-sm"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    💡 Include utm_source, utm_medium, utm_campaign for better tracking
                                  </p>
                                </div>
                              ) : (
                                <div className="p-3 bg-muted rounded border">
                                  <p className="text-sm font-mono text-blue-600 break-all">
                                    {selectedCampaign.utmLink}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Tracking Metrics</label>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="font-bold">1,247</div>
                                  <div className="text-muted-foreground">Clicks</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="font-bold text-success">23</div>
                                  <div className="text-muted-foreground">Conversions</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="font-bold text-success">1.8%</div>
                                  <div className="text-muted-foreground">CTR</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                      
                      <Card className="p-6 mt-6">
                        <h4 className="font-semibold mb-4">Danger Zone</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Delete Campaign</p>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete this campaign and all associated data.
                            </p>
                          </div>
                          <Button variant="destructive" onClick={handleDeleteCampaign}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Campaign
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add Influencer Modal */}
        {showAddInfluencer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <UserPlus className="h-6 w-6" />
                    Add Influencer to Campaign
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleCloseAddInfluencer}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <p className="text-muted-foreground">
                    Select an influencer to add to "{selectedCampaign.name}"
                  </p>
                </div>

                {getAvailableInfluencers().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getAvailableInfluencers().map((influencer) => (
                      <Card key={influencer.id} className="p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => handleAddInfluencerToCampaign(influencer)}>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                            {influencer.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{influencer.name}</h4>
                            <p className="text-sm text-muted-foreground">{influencer.platform}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{influencer.bio}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Followers:</span>
                            <span className="font-medium">{influencer.followers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Engagement:</span>
                            <span className="font-medium">{influencer.engagement}%</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <Button className="w-full" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add to Campaign
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All Influencers Assigned</h3>
                    <p className="text-muted-foreground mb-4">
                      All available influencers are already assigned to this campaign.
                    </p>
                    <Button variant="outline" onClick={() => navigate('/discover')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Browse More Influencers
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        
        <DeveloperPanel />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCampaign?.name}"? This action cannot be undone and will permanently remove the campaign and all its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteCampaign}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCampaign}>
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Campaigns;