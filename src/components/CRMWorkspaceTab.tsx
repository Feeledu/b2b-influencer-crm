import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyInfluencers, useInfluencerActions } from "@/hooks/useInfluencers";
import { useState } from "react";
import { 
  Search, 
  Filter, 
  Users, 
  Calendar,
  Star,
  TrendingUp,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Target,
  BarChart3
} from "lucide-react";

const CRMWorkspaceTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("influencers");

  const { influencers, loading, error, refetch } = useMyInfluencers();
  const { updateRelationshipStrength, setFollowUpDate } = useInfluencerActions();

  const handleUpdateStrength = async (influencerId: string, strength: number) => {
    try {
      await updateRelationshipStrength(influencerId, strength);
      refetch();
    } catch (error) {
      console.error("Error updating relationship strength:", error);
    }
  };

  const handleSetFollowUp = async (influencerId: string, date: string) => {
    try {
      await setFollowUpDate(influencerId, new Date(date));
      refetch();
    } catch (error) {
      console.error("Error setting follow-up date:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "saved":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "warm":
        return "bg-orange-100 text-orange-800";
      case "cold":
        return "bg-gray-100 text-gray-800";
      case "partnered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-600";
    if (strength >= 60) return "text-yellow-600";
    if (strength >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.handle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const selectedInfluencerData = selectedInfluencer 
    ? influencers.find(inf => inf.id === selectedInfluencer)
    : null;

  // Calculate stats
  const totalInfluencers = influencers.length;
  const warmInfluencers = influencers.filter(inf => inf.status === 'warm').length;
  const partneredInfluencers = influencers.filter(inf => inf.status === 'partnered').length;
  const avgStrength = influencers.length > 0 
    ? Math.round(influencers.reduce((sum, inf) => sum + (inf.relationship_strength || 0), 0) / influencers.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CRM Workspace</h2>
        <p className="text-gray-600">Manage your influencer relationships and track interactions</p>
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

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success flex items-center gap-2">
                <Star className="h-4 w-4" />
                Warm Leads
              </p>
              <p className="text-2xl font-bold">{warmInfluencers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning flex items-center gap-2">
                <Target className="h-4 w-4" />
                Partners
              </p>
              <p className="text-2xl font-bold">{partneredInfluencers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Strength
              </p>
              <p className="text-2xl font-bold">{avgStrength}%</p>
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
                Influencers
              </CardTitle>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredInfluencers.map((influencer) => (
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
                          <Badge className={getStatusColor(influencer.status)}>
                            {influencer.status}
                          </Badge>
                          <span className={`text-xs font-medium ${getStrengthColor(influencer.relationship_strength || 0)}`}>
                            {influencer.relationship_strength || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                      {selectedInfluencerData.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedInfluencerData.name}</h3>
                      <p className="text-gray-500">{selectedInfluencerData.handle}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedInfluencerData.status)}>
                    {selectedInfluencerData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="influencers">Details</TabsTrigger>
                    <TabsTrigger value="interactions">Interactions</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  </TabsList>

                  <TabsContent value="influencers" className="space-y-4">
                    <div className="space-y-4">
                      {selectedInfluencerData.bio && (
                        <div>
                          <h4 className="font-medium mb-2">Bio</h4>
                          <p className="text-sm text-gray-600">{selectedInfluencerData.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Platform</h4>
                          <Badge variant="outline">{selectedInfluencerData.platform}</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Industry</h4>
                          <p className="text-sm text-gray-600">{selectedInfluencerData.industry || 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Relationship Strength</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Current: {selectedInfluencerData.relationship_strength || 0}%</span>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStrength(selectedInfluencerData.id, Math.min((selectedInfluencerData.relationship_strength || 0) + 10, 100))}
                            >
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Strengthen
                            </Button>
                          </div>
                          <Progress value={selectedInfluencerData.relationship_strength || 0} className="h-2" />
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
                    </div>
                  </TabsContent>

                  <TabsContent value="interactions" className="space-y-4">
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No interactions yet</h3>
                      <p className="text-gray-600 mb-4">Start tracking your conversations and meetings.</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Interaction
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="campaigns" className="space-y-4">
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                      <p className="text-gray-600 mb-4">Include this influencer in your next campaign.</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Influencer</h3>
              <p className="text-gray-600">Choose an influencer from the list to view their details and manage your relationship.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMWorkspaceTab;
