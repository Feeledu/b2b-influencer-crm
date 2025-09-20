import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useInfluencers, useInfluencerActions } from "@/hooks/useInfluencers";
import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Users, 
  Mic, 
  Mail,
  ExternalLink,
  Heart,
  Plus,
  Check
} from "lucide-react";

const DiscoverTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [minFollowers, setMinFollowers] = useState<number | null>(null);
  const [savedInfluencers, setSavedInfluencers] = useState<Set<string>>(new Set());

  const { influencers, loading, error, refetch } = useInfluencers({
    search: searchTerm || undefined,
    platform: selectedPlatform || undefined,
    industry: selectedIndustry || undefined,
    min_followers: minFollowers || undefined,
  });

  const { addToMyList, removeFromMyList } = useInfluencerActions();

  const platforms = ["LinkedIn", "Twitter", "YouTube", "Instagram", "Newsletter", "Podcast"];
  const industries = ["Technology", "Finance", "Healthcare", "Education", "Marketing", "Sales"];

  const handleSaveInfluencer = async (influencerId: string) => {
    try {
      if (savedInfluencers.has(influencerId)) {
        await removeFromMyList(influencerId);
        setSavedInfluencers(prev => {
          const newSet = new Set(prev);
          newSet.delete(influencerId);
          return newSet;
        });
      } else {
        await addToMyList(influencerId);
        setSavedInfluencers(prev => new Set(prev).add(influencerId));
      }
    } catch (error) {
      console.error("Error saving influencer:", error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Users className="h-4 w-4" />;
      case "twitter":
        return <Users className="h-4 w-4" />;
      case "youtube":
        return <Users className="h-4 w-4" />;
      case "podcast":
        return <Mic className="h-4 w-4" />;
      case "newsletter":
        return <Mail className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return "text-green-600";
    if (rate >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Discover Influencers</h2>
        <p className="text-gray-600">Find and connect with B2B influencers in your industry</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, industry, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={() => refetch()} className="bg-primary hover:bg-primary-dark">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select
              value={selectedPlatform || ""}
              onChange={(e) => setSelectedPlatform(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>

            <select
              value={selectedIndustry || ""}
              onChange={(e) => setSelectedIndustry(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            <Input
              type="number"
              placeholder="Min Followers"
              value={minFollowers || ""}
              onChange={(e) => setMinFollowers(e.target.value ? parseInt(e.target.value) : null)}
              className="w-32"
            />
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching for influencers...</p>
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
          {influencers.map((influencer) => (
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
                <Button
                  variant={savedInfluencers.has(influencer.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSaveInfluencer(influencer.id)}
                  className="flex items-center space-x-1"
                >
                  {savedInfluencers.has(influencer.id) ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Save</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(influencer.platform)}
                  <Badge variant="outline">{influencer.platform}</Badge>
                  {influencer.industry && (
                    <Badge variant="secondary">{influencer.industry}</Badge>
                  )}
                </div>

                {influencer.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{influencer.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Followers:</span>
                    <span className="ml-1 font-medium">
                      {influencer.audience_size?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Engagement:</span>
                    <span className={`ml-1 font-medium ${getEngagementColor(influencer.engagement_rate || 0)}`}>
                      {influencer.engagement_rate ? `${influencer.engagement_rate}%` : "N/A"}
                    </span>
                  </div>
                </div>

                {influencer.expertise_tags && influencer.expertise_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {influencer.expertise_tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {influencer.expertise_tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{influencer.expertise_tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  {influencer.linkedin_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={influencer.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {influencer.twitter_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={influencer.twitter_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Twitter
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {influencers.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No influencers found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more influencers.
          </p>
          <Button onClick={() => {
            setSearchTerm("");
            setSelectedPlatform(null);
            setSelectedIndustry(null);
            setMinFollowers(null);
          }}>
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DiscoverTab;
