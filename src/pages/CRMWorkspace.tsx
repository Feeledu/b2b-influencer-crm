import React, { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyInfluencers, useInfluencerActions } from "@/hooks/useInfluencers";
import { useNavigate } from "react-router-dom";
import { 
  STATUS_CONFIG, 
  getStatusProgression, 
  getStatusSuggestions,
  InfluencerStatus,
  InteractionType 
} from "@/lib/statusProgression";
import InteractionTracker from "@/components/InteractionTracker";
import { 
  Search, 
  Users, 
  ArrowLeft,
  Settings,
  Star,
  Target,
  TrendingUp,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Calendar,
  Trash2,
  Edit,
  Activity,
  Lightbulb,
  ArrowRight,
  Heart,
  BarChart3,
  Filter,
  SortAsc,
  MoreHorizontal,
  Tag,
  Flag,
  Clock
} from "lucide-react";

const CRMWorkspace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [interactions, setInteractions] = useState<Record<string, InteractionType[]>>({});
  
  const { myInfluencers, loading, error, refetch } = useMyInfluencers();
  const { updateInfluencer, removeFromMyList } = useInfluencerActions();

  // Handle status progression
  const handleStatusUpdate = async (influencerId: string, newStatus: InfluencerStatus) => {
    try {
      const success = await updateInfluencer(influencerId, { status: newStatus });
      if (success) {
        refetch();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle removing influencer
  const handleRemoveInfluencer = async (influencerId: string) => {
    if (window.confirm('Are you sure you want to remove this influencer from your list?')) {
      try {
        const success = await removeFromMyList(influencerId);
        if (success) {
          refetch();
          setSelectedInfluencer(null);
        }
      } catch (error) {
        console.error("Error removing influencer:", error);
      }
    }
  };

  // Handle adding interaction
  const handleAddInteraction = (influencerId: string, interaction: Omit<InteractionType, 'id' | 'timestamp'>) => {
    const newInteraction: InteractionType = {
      ...interaction,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setInteractions(prev => ({
      ...prev,
      [influencerId]: [...(prev[influencerId] || []), newInteraction]
    }));
  };

  // Handle updating interaction
  const handleUpdateInteraction = (influencerId: string, interactionId: string, updates: Partial<InteractionType>) => {
    setInteractions(prev => ({
      ...prev,
      [influencerId]: prev[influencerId]?.map(i => 
        i.id === interactionId ? { ...i, ...updates } : i
      ) || []
    }));
  };

  // Handle deleting interaction
  const handleDeleteInteraction = (influencerId: string, interactionId: string) => {
    setInteractions(prev => ({
      ...prev,
      [influencerId]: prev[influencerId]?.filter(i => i.id !== interactionId) || []
    }));
  };

  const getStatusColor = (status: string) => {
    const config = STATUS_CONFIG[status as InfluencerStatus];
    return config ? `${config.bgColor} ${config.textColor}` : 'bg-gray-100 text-gray-800';
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-600";
    if (strength >= 60) return "text-yellow-600";
    if (strength >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Filter and sort influencers
  const filteredInfluencers = myInfluencers
    .filter(userInfluencer => {
      const influencer = userInfluencer.influencer;
      const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           influencer.handle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || userInfluencer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.influencer.name.localeCompare(b.influencer.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "strength":
          return (b.relationship_strength || 0) - (a.relationship_strength || 0);
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const selectedInfluencerData = selectedInfluencer 
    ? myInfluencers.find(ui => ui.influencer.id === selectedInfluencer)
    : null;

  // Calculate stats
  const totalInfluencers = myInfluencers.length;
  const warmInfluencers = myInfluencers.filter(ui => ui.status === 'warm').length;
  const partneredInfluencers = myInfluencers.filter(ui => ui.status === 'partnered').length;
  const contactedInfluencers = myInfluencers.filter(ui => ui.status === 'contacted').length;
  const avgStrength = myInfluencers.length > 0 
    ? Math.round(myInfluencers.reduce((sum, ui) => sum + (ui.relationship_strength || 0), 0) / myInfluencers.length)
    : 0;

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/influencers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Influencers
            </Button>
            <div>
              <h1 className="text-3xl font-bold">CRM Workspace</h1>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/influencers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Influencers
            </Button>
            <div>
              <h1 className="text-3xl font-bold">CRM Workspace</h1>
              <p className="text-red-600">Error loading influencers: {error}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/influencers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Influencers
          </Button>
          <div>
            <h1 className="text-3xl font-bold">CRM Workspace</h1>
            <p className="text-muted-foreground">Manage your influencer relationships and track interactions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Influencers
                </p>
                <p className="text-2xl font-bold">{totalInfluencers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contacted
                </p>
                <p className="text-2xl font-bold">{contactedInfluencers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Warm Leads
                </p>
                <p className="text-2xl font-bold">{warmInfluencers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Partners
                </p>
                <p className="text-2xl font-bold">{partneredInfluencers}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Influencers List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Influencers ({filteredInfluencers.length})
                </CardTitle>
                
                {/* Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search influencers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="saved">Saved</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="cold">Cold</SelectItem>
                        <SelectItem value="partnered">Partnered</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="date">Date Added</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredInfluencers.map((userInfluencer) => {
                    const influencer = userInfluencer.influencer;
                    return (
                      <div
                        key={influencer.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedInfluencer === influencer.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                        }`}
                        onClick={() => setSelectedInfluencer(influencer.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                            {influencer.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{influencer.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{influencer.handle}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(userInfluencer.status)}>
                                {userInfluencer.status}
                              </Badge>
                              <span className={`text-xs font-medium ${getStrengthColor(userInfluencer.relationship_strength || 0)}`}>
                                {userInfluencer.relationship_strength || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Influencer Details */}
          <div className="lg:col-span-2">
            {selectedInfluencerData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {selectedInfluencerData.influencer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedInfluencerData.influencer.name}</h3>
                        <p className="text-gray-500">{selectedInfluencerData.influencer.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(selectedInfluencerData.status)}>
                        {selectedInfluencerData.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveInfluencer(selectedInfluencerData.influencer.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="interactions">Interactions</TabsTrigger>
                      <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="space-y-4">
                        {selectedInfluencerData.influencer.bio && (
                          <div>
                            <h4 className="font-medium mb-2">Bio</h4>
                            <p className="text-sm text-gray-600">{selectedInfluencerData.influencer.bio}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Platform</h4>
                            <Badge variant="outline">{selectedInfluencerData.influencer.platform}</Badge>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Industry</h4>
                            <p className="text-sm text-gray-600">{selectedInfluencerData.influencer.industry || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Audience Size</h4>
                            <p className="text-sm text-gray-600">{selectedInfluencerData.influencer.audience_size?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Engagement Rate</h4>
                            <p className="text-sm text-gray-600">{selectedInfluencerData.influencer.engagement_rate ? `${selectedInfluencerData.influencer.engagement_rate}%` : 'N/A'}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Relationship Strength</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Current: {selectedInfluencerData.relationship_strength || 0}%</span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  // Handle strength update
                                  console.log('Strengthen relationship');
                                }}
                              >
                                <TrendingUp className="h-4 w-4 mr-1" />
                                Strengthen
                              </Button>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${selectedInfluencerData.relationship_strength || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {selectedInfluencerData.follow_up_date && (
                          <div>
                            <h4 className="font-medium mb-2">Follow-up Date</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(selectedInfluencerData.follow_up_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}

                        {selectedInfluencerData.notes && (
                          <div>
                            <h4 className="font-medium mb-2">Notes</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedInfluencerData.notes}</p>
                          </div>
                        )}

                        {/* Status Progression Suggestions */}
                        {(() => {
                          const influencerInteractions = interactions[selectedInfluencerData.influencer.id] || [];
                          const progression = getStatusProgression(
                            selectedInfluencerData.status as InfluencerStatus,
                            influencerInteractions,
                            selectedInfluencerData.last_contacted_at
                          );
                          const suggestions = getStatusSuggestions(progression);
                          
                          return (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-medium mb-3 text-blue-900">Status Progression</h4>
                              
                              {progression.nextSuggestedStatus && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-blue-800">
                                      Suggested next step: {STATUS_CONFIG[progression.nextSuggestedStatus]?.label}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStatusUpdate(selectedInfluencerData.influencer.id, progression.nextSuggestedStatus!)}
                                      className="text-xs"
                                    >
                                      <ArrowRight className="h-3 w-3 mr-1" />
                                      Advance Status
                                    </Button>
                                  </div>
                                  <p className="text-xs text-blue-700">{progression.progressionReason}</p>
                                </div>
                              )}
                              
                              {suggestions.length > 0 && (
                                <div className="text-xs text-blue-700">
                                  💡 {suggestions[0]}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </TabsContent>

                    <TabsContent value="interactions" className="space-y-4">
                      <InteractionTracker
                        influencerId={selectedInfluencerData.influencer.id}
                        interactions={interactions[selectedInfluencerData.influencer.id] || []}
                        onAddInteraction={(interaction) => handleAddInteraction(selectedInfluencerData.influencer.id, interaction)}
                        onUpdateInteraction={(id, updates) => handleUpdateInteraction(selectedInfluencerData.influencer.id, id, updates)}
                        onDeleteInteraction={(id) => handleDeleteInteraction(selectedInfluencerData.influencer.id, id)}
                      />
                    </TabsContent>

                    <TabsContent value="campaigns" className="space-y-4">
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                        <p className="text-gray-600 mb-4">This influencer hasn't been assigned to any campaigns.</p>
                        <Button onClick={() => navigate('/campaigns')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Campaign
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Follow-up Date</h4>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="date"
                              className="flex-1"
                            />
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-1" />
                              Set
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Priority Level</h4>
                          <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">SaaS</Badge>
                            <Badge variant="outline">Podcast</Badge>
                            <Badge variant="outline">B2B</Badge>
                          </div>
                          <Input placeholder="Add new tag..." />
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Notes</h4>
                          <Textarea
                            className="w-full"
                            rows={4}
                            placeholder="Add notes about this influencer..."
                            defaultValue={selectedInfluencerData.notes || ''}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button>
                            <Edit className="h-4 w-4 mr-1" />
                            Save Changes
                          </Button>
                          <Button variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            More Settings
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Influencer</h3>
                  <p className="text-gray-600">Choose an influencer from the list to manage their details and interactions.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CRMWorkspace;