import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMyInfluencers, useInfluencerActions } from "@/hooks/useInfluencers";
import { useState } from "react";
import { 
  Search, 
  Filter, 
  Users, 
  Heart,
  Trash2,
  Edit,
  MoreHorizontal,
  Calendar,
  Star,
  TrendingUp
} from "lucide-react";

const InfluencersTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  const { influencers, loading, error, refetch } = useMyInfluencers();
  const { removeFromMyList, updateRelationshipStrength } = useInfluencerActions();

  const handleRemoveInfluencer = async (influencerId: string) => {
    try {
      await removeFromMyList(influencerId);
      refetch();
    } catch (error) {
      console.error("Error removing influencer:", error);
    }
  };

  const handleUpdateStrength = async (influencerId: string, strength: number) => {
    try {
      await updateRelationshipStrength(influencerId, strength);
      refetch();
    } catch (error) {
      console.error("Error updating relationship strength:", error);
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
    const matchesStatus = statusFilter === "all" || influencer.status === statusFilter;
    const matchesPlatform = platformFilter === "all" || influencer.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Influencers</h2>
        <p className="text-gray-600">Manage your saved influencers and track relationships</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search influencers..."
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
                <option value="saved">Saved</option>
                <option value="contacted">Contacted</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
                <option value="partnered">Partnered</option>
              </select>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="Newsletter">Newsletter</option>
                <option value="Podcast">Podcast</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Influencers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your influencers...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-destructive">Failed to load influencers. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => (
            <Card key={influencer.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {influencer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{influencer.name}</h3>
                    <p className="text-sm text-gray-500">{influencer.handle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{influencer.platform}</Badge>
                  <Badge className={getStatusColor(influencer.status)}>
                    {influencer.status}
                  </Badge>
                </div>

                {influencer.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{influencer.bio}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Relationship Strength</span>
                    <span className={`text-sm font-medium ${getStrengthColor(influencer.relationship_strength || 0)}`}>
                      {influencer.relationship_strength || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${influencer.relationship_strength || 0}%` }}
                    />
                  </div>
                </div>

                {influencer.follow_up_date && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Follow up: {new Date(influencer.follow_up_date).toLocaleDateString()}</span>
                  </div>
                )}

                {influencer.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Notes:</strong> {influencer.notes}
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStrength(influencer.id, Math.min((influencer.relationship_strength || 0) + 10, 100))}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Strengthen
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveInfluencer(influencer.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredInfluencers.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No influencers found</h3>
          <p className="text-gray-600 mb-4">
            {influencers.length === 0 
              ? "You haven't saved any influencers yet. Start by discovering some!"
              : "Try adjusting your search criteria or filters."
            }
          </p>
          <Button onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setPlatformFilter("all");
          }}>
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default InfluencersTab;
