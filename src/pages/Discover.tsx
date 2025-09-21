import MainLayout from "@/components/MainLayout";
import DeveloperPanel from "@/components/DeveloperPanel";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { setPremiumMode, forceResetTrials, checkAITrialEligibility } from '@/lib/premiumAIService';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useMemo } from "react";
import { useInfluencers, useMyInfluencers, useInfluencerActions } from "@/hooks/useInfluencers";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Users, 
  Mic, 
  Mail,
  Heart,
  Plus,
  Check,
  Target,
  TrendingUp,
  Brain,
  BarChart3,
  Grid3X3,
  List,
  AlertCircle,
  X,
  Clock,
  Search as SearchIcon
} from "lucide-react";

const Discover = () => {
  const { canAccessIntentDiscovery, updateSubscription, isTrialActive, daysRemaining } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Use real API hooks
  const { 
    influencers, 
    loading, 
    error, 
    pagination,
    refetch: refetchInfluencers 
  } = useInfluencers({
    page: currentPage,
    limit: 20,
    search: searchTerm || undefined,
    platform: selectedFilters.find(f => ['LinkedIn', 'Podcast', 'Newsletter'].includes(f))?.toLowerCase() || undefined,
    industry: selectedFilters.find(f => ['AI/ML', 'Cybersecurity', 'DevTools'].includes(f)) || undefined,
  });

  const { 
    myInfluencers, 
    refetch: refetchMyInfluencers 
  } = useMyInfluencers();

  const { 
    addToMyList, 
    removeFromMyList 
  } = useInfluencerActions();

  // Get added influencer IDs from my influencers
  const addedInfluencerIds = new Set(myInfluencers.map(ui => ui.influencer_id));

  const handleAddInfluencer = async (influencerId: string, influencerName: string) => {
    const success = await addToMyList(influencerId, '', 0, []);

    if (success) {
      toast({
        title: "Success",
        description: `${influencerName} added to your list`,
      });
      refetchInfluencers();
      refetchMyInfluencers();
    } else {
      toast({
        title: "Error",
        description: "Failed to add influencer",
        variant: "destructive",
      });
    }
  };

  const handleRemoveInfluencer = async (influencerId: string, influencerName: string) => {
    const success = await removeFromMyList(influencerId);

    if (success) {
      toast({
        title: "Success",
        description: `${influencerName} removed from your list`,
      });
      refetchInfluencers();
      refetchMyInfluencers();
    } else {
      toast({
        title: "Error",
        description: "Failed to remove influencer",
        variant: "destructive",
      });
    }
  };


  const isInfluencerAdded = (influencerId: string) => {
    return addedInfluencerIds.has(influencerId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (displayPagination.has_prev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (displayPagination.has_next) {
      setCurrentPage(currentPage + 1);
    }
  };


  // Reset to page 1 when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters]);

  // Apply frontend-only filters (backend handles search and platform/industry filters)
  const availableInfluencers = useMemo(() => {
    return influencers.filter(influencer => {
      // Apply frontend-only filters that backend doesn't handle
      if (selectedFilters.length > 0) {
        const matchesFilters = selectedFilters.some(filter => {
          const filterLower = filter.toLowerCase();
          
          // Check follower count filter (backend doesn't handle this)
          if (filterLower === '10k+ followers' && influencer.audience_size && influencer.audience_size >= 10000) {
            return true;
          }
          
          // Check high engagement filter (backend doesn't handle this)
          if (filterLower === 'high engagement' && influencer.engagement_rate && influencer.engagement_rate >= 5) {
            return true;
          }
          
          return false;
        });
        
        // If we have filters but none match, exclude this influencer
        if (selectedFilters.some(f => ['10K+ Followers', 'High Engagement'].includes(f)) && !matchesFilters) {
          return false;
        }
      }

      return true;
    });
  }, [influencers, selectedFilters]);

  // Use original pagination since we're no longer filtering out added influencers
  const displayPagination = pagination;

  console.log('📊 Final counts:', {
    totalInfluencers: influencers.length,
    availableInfluencers: availableInfluencers.length,
    addedCount: addedInfluencerIds.size
  });

  console.log('Discover page rendering', { 
    loading, 
    error, 
    influencers: influencers.length,
    availableInfluencers: availableInfluencers.length,
    addedInfluencerIds: Array.from(addedInfluencerIds),
    searchTerm,
    selectedFilters,
    pagination
  });

  const platformIcons = {
    linkedin: Users,
    twitter: Users,
    podcast: Mic,
    newsletter: Mail,
  };

  const platformConfig = {
    linkedin: {
      color: '#7C3AED',
      icon: Users,
    },
    twitter: {
      color: '#7C3AED',
      icon: Users,
    },
    youtube: {
      color: '#7C3AED',
      icon: Users,
    },
    newsletter: {
      color: '#7C3AED',
      icon: Mail,
    },
    podcast: {
      color: '#7C3AED',
      icon: Mic,
    },
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
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
                    {daysRemaining} days remaining in your free trial. Upgrade to Fluencr Pro to access intent discovery and add unlimited influencers.
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

        {/* Header with Search/Intent Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <SearchIcon className="h-8 w-8 text-purple-600" />
              Discover Influencers
            </h1>
            <p className="text-muted-foreground">
              Find the perfect B2B influencers for your campaigns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={activeTab === "discover" ? "default" : "outline"}
              onClick={() => setActiveTab("discover")}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Basic Search
            </Button>
            <Button 
              variant={activeTab === "intent" ? "default" : "outline"}
              onClick={() => setActiveTab("intent")}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Intent Discovery
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, industry, or expertise..."
                  className="pl-10 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100"
                    onClick={() => setSearchTerm("")}
                  >
                    <span className="text-gray-400">×</span>
                  </Button>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Quick Filters - Dynamic from database */}
          <div className="mt-4 flex flex-wrap gap-2">
            {['AI/ML', 'Cybersecurity', 'DevTools', 'SaaS', 'MarTech', 'LinkedIn', 'Podcast', 'Newsletter', '10K+ Followers', 'High Engagement'].map((filter) => (
              <Badge 
                key={filter}
                variant={selectedFilters.includes(filter) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
                {selectedFilters.includes(filter) && " ✓"}
              </Badge>
            ))}
          </div>

          {/* Active Filters Display */}
          {selectedFilters.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {selectedFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedFilters([])}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Platform</label>
                  <div className="space-y-2">
                    {['LinkedIn', 'Podcast', 'Newsletter'].map((platform) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(platform)}
                          onChange={() => toggleFilter(platform)}
                          className="rounded"
                        />
                        <span className="text-sm">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <div className="space-y-2">
                    {['AI/ML', 'Cybersecurity', 'DevTools', 'SaaS', 'MarTech', 'Fintech', 'EdTech', 'HRTech', 'Healthcare'].map((industry) => (
                      <label key={industry} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(industry)}
                          onChange={() => toggleFilter(industry)}
                          className="rounded"
                        />
                        <span className="text-sm">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Followers</label>
                  <div className="space-y-2">
                    {['1K+', '10K+', '50K+', '100K+'].map((followerRange) => (
                      <label key={followerRange} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(followerRange)}
                          onChange={() => toggleFilter(followerRange)}
                          className="rounded"
                        />
                        <span className="text-sm">{followerRange} Followers</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedFilters([])}
                >
                  Clear All
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="intent">Intent Discovery</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {displayPagination.total} Influencers Found
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {((displayPagination.page - 1) * displayPagination.limit) + 1}-{Math.min(displayPagination.page * displayPagination.limit, displayPagination.total)} of {displayPagination.total} results
                </p>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3 h-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3 h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Discovering influencers...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && (
              <>
                {availableInfluencers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search terms or filters to find more influencers.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedFilters([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {availableInfluencers.map((influencer) => {
                      const platformInfo = platformConfig[influencer.platform as keyof typeof platformConfig];
                      const PlatformIcon = platformInfo?.icon || Users;
                      
                      // Use real audience demographics from database
                      const audienceMatch = influencer.audience_alignment?.alignment_score 
                        ? Math.round(influencer.audience_alignment.alignment_score) 
                        : 0; // No fallback - show 0 if missing
                      // Handle both array and object formats for job_titles
                      let roles: string[] = [];
                      if (influencer.audience_demographics?.job_titles) {
                        if (Array.isArray(influencer.audience_demographics.job_titles)) {
                          // If it's an array, use it directly
                          roles = influencer.audience_demographics.job_titles;
                        } else if (typeof influencer.audience_demographics.job_titles === 'object') {
                          // If it's an object, get the keys (role names)
                          roles = Object.keys(influencer.audience_demographics.job_titles);
                        }
                      }
                      const companySize = influencer.audience_alignment?.company_size || '';
                      
                      return (
                        <Card key={influencer.id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-[380px]">
                          <div className="space-y-3">
                            {/* Header with Name and Add Button */}
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-lg text-gray-900">{influencer.name}</h3>
                              {isInfluencerAdded(influencer.id) ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-green-500 text-green-600 bg-green-50 hover:bg-green-100 text-xs px-3 py-1 h-7 rounded-full"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Added
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAddInfluencer(influencer.id, influencer.name)}
                                  className="border-primary text-primary hover:bg-primary hover:text-white text-xs px-3 py-1 h-7 rounded-full"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>

                            {/* Bio/Description */}
                            <div className="w-4/5">
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                {influencer.bio || 'No bio available'}
                              </p>
                            </div>
                            
                            {/* Social Platform, Followers, Engagement */}
                            <div className="flex items-center justify-between text-xs text-gray-500 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                <PlatformIcon 
                                  className="h-4 w-4" 
                                  style={{ color: platformInfo?.color || '#6B7280' }}
                                />
                                <span 
                                  className="font-medium"
                                  style={{ color: platformInfo?.color || '#6B7280' }}
                                >
                                  {influencer.platform}
                                </span>
                              </div>
                              <span>{influencer.audience_size?.toLocaleString() || '0'} followers</span>
                              <span>{influencer.engagement_rate || '0'}% engagement</span>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {influencer.expertise_tags?.slice(0, 3).map((tag) => (
                                <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Audience Match Section */}
                          <div className="bg-blue-50 rounded-xl p-3 mt-3 border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-1">
                                <span className="text-lg">🎯</span>
                                <span className="text-sm font-bold text-black">Audience Match</span>
                              </div>
                              <span className="text-sm font-bold text-blue-600">{audienceMatch}% match</span>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-black">
                                <span className="font-medium">Company Size:</span> {companySize}
                              </div>
                              <div className="text-xs text-black">
                                <span className="font-medium">Roles:</span> 
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {roles.slice(0, 2).map((role) => (
                                    <span key={role} className="rounded-full bg-blue-600 text-white px-2 py-1 text-xs">
                                      {role}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableInfluencers.map((influencer) => {
                      const platformInfo = platformConfig[influencer.platform as keyof typeof platformConfig];
                      const PlatformIcon = platformInfo?.icon || Users;
                      
                      // Use real audience demographics from database
                      const audienceMatch = influencer.audience_alignment?.alignment_score 
                        ? Math.round(influencer.audience_alignment.alignment_score) 
                        : 0; // No fallback - show 0 if missing
                      // Handle both array and object formats for job_titles
                      let roles: string[] = [];
                      if (influencer.audience_demographics?.job_titles) {
                        if (Array.isArray(influencer.audience_demographics.job_titles)) {
                          // If it's an array, use it directly
                          roles = influencer.audience_demographics.job_titles;
                        } else if (typeof influencer.audience_demographics.job_titles === 'object') {
                          // If it's an object, get the keys (role names)
                          roles = Object.keys(influencer.audience_demographics.job_titles);
                        }
                      }
                      const companySize = influencer.audience_alignment?.company_size || '';
                      
                      return (
                        <Card key={influencer.id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300 h-[320px]">
                          <div className="flex h-full">
                            {/* Left side - Main content */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                {/* Header with Name and Add Button */}
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-lg text-gray-900">{influencer.name}</h3>
                                  {isInfluencerAdded(influencer.id) ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="border-green-500 text-green-600 bg-green-50 hover:bg-green-100 text-xs px-3 py-1 h-7 rounded-full"
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Added
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleAddInfluencer(influencer.id, influencer.name)}
                                      className="border-primary text-primary hover:bg-primary hover:text-white text-xs px-3 py-1 h-7 rounded-full"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add
                                    </Button>
                                  )}
                                </div>

                                {/* Bio/Description */}
                                <div className="w-4/5">
                                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                    {influencer.bio || 'No bio available'}
                                  </p>
                                </div>
                                
                                {/* Social Platform, Followers, Engagement */}
                                <div className="flex items-center justify-between text-xs text-gray-500 whitespace-nowrap">
                                  <div className="flex items-center space-x-1">
                                    <PlatformIcon 
                                      className="h-4 w-4" 
                                      style={{ color: platformInfo?.color || '#6B7280' }}
                                    />
                                    <span 
                                      className="font-medium"
                                      style={{ color: platformInfo?.color || '#6B7280' }}
                                    >
                                      {influencer.platform}
                                    </span>
                                  </div>
                                  <span>{influencer.audience_size?.toLocaleString() || '0'} followers</span>
                                  <span>{influencer.engagement_rate || '0'}% engagement</span>
                                </div>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1">
                                  {influencer.expertise_tags?.slice(0, 3).map((tag) => (
                                    <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Audience Match Section */}
                              <div className="bg-blue-50 rounded-xl p-3 mt-3 border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-lg">🎯</span>
                                    <span className="text-sm font-bold text-black">Audience Match</span>
                                  </div>
                                  <span className="text-sm font-bold text-blue-600">{audienceMatch}% match</span>
                                </div>
                                <div className="space-y-1">
                              <div className="text-xs text-black">
                                <span className="font-medium">Company Size:</span> {companySize}
                              </div>
                              <div className="text-xs text-black">
                                <span className="font-medium">Roles:</span> 
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {roles.slice(0, 2).map((role) => (
                                        <span key={role} className="rounded-full bg-blue-600 text-white px-2 py-1 text-xs">
                                          {role}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Intent Discovery Tab */}
          <TabsContent value="intent" className="space-y-6">
            {!canAccessIntentDiscovery ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">AI-Powered Intent Discovery</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Discover influencers whose audiences match your target market, showing high purchase intent 
                      and engagement with relevant content. Find the perfect influencers for your campaigns.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.location.href = '/billing'}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                    >
                      Upgrade to Premium
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to access AI-Powered Intent Discovery
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">AI-Powered Intent Discovery</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Discover influencers whose audiences match your target market, showing high purchase intent 
                    and engagement with relevant content. Find the perfect influencers for your campaigns.
                  </p>
                </Card>

            {/* Intent Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {displayPagination.total} Influencers Found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Influencers with high audience alignment and purchase intent signals
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing {((displayPagination.page - 1) * displayPagination.limit) + 1}-{Math.min(displayPagination.page * displayPagination.limit, displayPagination.total)} of {displayPagination.total} results
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Sorted by intent score</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {availableInfluencers
                  .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
                  .map((influencer) => {
                    const platformInfo = platformConfig[influencer.platform as keyof typeof platformConfig];
                    const PlatformIcon = platformInfo?.icon || Users;
                    
                    // Use real data from database - no fallbacks
                    const intentScore = influencer.intent_score || 0;
                    const audienceAlignment = influencer.audience_alignment?.alignment_score 
                      ? Math.round(influencer.audience_alignment.alignment_score) 
                      : 0;
                    const recentMentions = influencer.recent_mentions || 0;
                    
                    // Use real data from database - no fallbacks
                    const selectedBuyingSignals = influencer.buying_signals?.slice(0, 3) || [];
                    const selectedContentThemes = influencer.content_themes?.slice(0, 3) || [];
                    // Handle both array and object formats for job_titles
                    let selectedRoles: string[] = [];
                    if (influencer.audience_demographics?.job_titles) {
                      if (Array.isArray(influencer.audience_demographics.job_titles)) {
                        // If it's an array, use it directly
                        selectedRoles = influencer.audience_demographics.job_titles.slice(0, 2);
                      } else if (typeof influencer.audience_demographics.job_titles === 'object') {
                        // If it's an object, get the keys (role names)
                        selectedRoles = Object.keys(influencer.audience_demographics.job_titles).slice(0, 2);
                      }
                    }
                    const selectedCompanySize = influencer.audience_alignment?.company_size || '';
                    
                    return (
                      <Card key={influencer.id} className="p-6 hover:shadow-lg transition-all duration-300">
                        <div className="space-y-4">
                          {/* Header with Name and Platform */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg">{influencer.name}</h3>
                                {influencer.is_verified && (
                                  <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 h-[90px] overflow-hidden">
                                {influencer.bio || 'No bio available'}
                              </p>
                              
                              <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <PlatformIcon 
                                    className="h-3 w-3" 
                                    style={{ color: platformInfo?.color || '#6B7280' }}
                                  />
                                  <span 
                                    className="font-medium"
                                    style={{ color: platformInfo?.color || '#6B7280' }}
                                  >
                                    {influencer.platform}
                                  </span>
                                </div>
                                <span>{influencer.audience_size?.toLocaleString() || '0'} followers</span>
                                <span>{influencer.engagement_rate || '0'}% engagement</span>
                              </div>
                            </div>
                          </div>

                          {/* Intent Score */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Intent Score</span>
                              <span className="text-sm font-semibold text-primary">{intentScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${intentScore}%` }}
                              />
                            </div>
                          </div>

                          {/* Buying Signals */}
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Buying Signals</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedBuyingSignals.map((signal) => (
                                <Badge key={signal} variant="default" className="text-xs bg-blue-100 text-blue-800">
                                  {signal}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Content Themes */}
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Content Themes</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedContentThemes.map((theme) => (
                                <Badge key={theme} variant="outline" className="text-xs">
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Audience Match */}
                          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Audience Alignment</span>
                              <span className="text-sm font-semibold text-green-600">{audienceAlignment}%</span>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Roles:</span> {selectedRoles.join(', ')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Size:</span> {selectedCompanySize}
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-muted-foreground">
                              {recentMentions} recent mentions
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  console.log('Heart clicked for:', influencer.name);
                                }}
                                className="hover:bg-red-50 hover:text-red-500"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              {isInfluencerAdded(influencer.id) ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRemoveInfluencer(influencer.id, influencer.name)}
                                  className="border-green-500 text-green-600 bg-green-50 hover:bg-green-100 text-xs px-3 py-1 h-7 rounded-full"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Added
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAddInfluencer(influencer.id, influencer.name)}
                                  className="border-primary text-primary hover:bg-primary hover:text-white text-xs px-3 py-1 h-7 rounded-full"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>

                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>

            {/* Pagination Controls for Intent Discovery */}
            {displayPagination.total_pages > 1 && (
              <div className="flex justify-center items-center space-x-2 py-6 bg-gray-50 rounded-lg px-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!displayPagination.has_prev}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = [];
                    const currentPage = displayPagination.page;
                    const totalPages = displayPagination.total_pages;
                    
                    // Always show first page
                    if (currentPage > 3) {
                      pages.push(
                        <Button
                          key={1}
                          variant={currentPage === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </Button>
                      );
                      if (currentPage > 4) {
                        pages.push(<span key="ellipsis1" className="px-2">...</span>);
                      }
                    }
                    
                    // Show pages around current page
                    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
                      if (i !== 1 || currentPage <= 3) { // Don't duplicate first page
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </Button>
                        );
                      }
                    }
                    
                    // Always show last page
                    if (currentPage < totalPages - 2) {
                      if (currentPage < totalPages - 3) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!displayPagination.has_next}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            )}
              </>
            )}
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Influencer Analysis</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Comprehensive analytics and insights about your discovered influencers
              </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Platform Distribution</h3>
                <div className="space-y-2">
                  {(() => {
                    const platformCounts = availableInfluencers.reduce((acc, inf) => {
                      acc[inf.platform] = (acc[inf.platform] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    
                    const total = availableInfluencers.length;
                    return Object.entries(platformCounts).map(([platform, count]) => {
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={platform}>
                          <div className="flex justify-between">
                            <span className="text-sm capitalize">{platform}</span>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Engagement Trends</h3>
                <div className="space-y-2">
                  {(() => {
                    const highEngagement = availableInfluencers.filter(inf => (inf.engagement_rate || 0) >= 7).length;
                    const mediumEngagement = availableInfluencers.filter(inf => (inf.engagement_rate || 0) >= 4 && (inf.engagement_rate || 0) < 7).length;
                    const lowEngagement = availableInfluencers.filter(inf => (inf.engagement_rate || 0) < 4).length;
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">High Engagement (7%+)</span>
                          <span className="text-sm font-medium text-green-600">{highEngagement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Medium Engagement (4-7%)</span>
                          <span className="text-sm font-medium text-yellow-600">{mediumEngagement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Low Engagement (under 4%)</span>
                          <span className="text-sm font-medium text-red-600">{lowEngagement}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Audience Alignment</h3>
                <div className="space-y-2">
                  {(() => {
                    const highAlignment = availableInfluencers.filter(inf => (inf.audience_alignment?.alignment_score || 0) >= 90).length;
                    const mediumAlignment = availableInfluencers.filter(inf => (inf.audience_alignment?.alignment_score || 0) >= 70 && (inf.audience_alignment?.alignment_score || 0) < 90).length;
                    const lowAlignment = availableInfluencers.filter(inf => (inf.audience_alignment?.alignment_score || 0) < 70).length;
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">High Alignment (90%+)</span>
                          <span className="text-sm font-medium text-green-600">{highAlignment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Medium Alignment (70-90%)</span>
                          <span className="text-sm font-medium text-yellow-600">{mediumAlignment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Low Alignment (under 70%)</span>
                          <span className="text-sm font-medium text-red-600">{lowAlignment}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination Controls */}
        {displayPagination.total_pages > 1 && (
          <div className="flex justify-center items-center space-x-2 py-6 bg-gray-50 rounded-lg px-4">
            <Button 
              variant="outline" 
              size="sm"
              disabled={!displayPagination.has_prev}
              onClick={handlePreviousPage}
            >
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {(() => {
                const pages = [];
                const currentPage = displayPagination.page;
                const totalPages = displayPagination.total_pages;
                
                // Show more page numbers around current page
                const showPages = 5; // Number of page numbers to show
                let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                let endPage = Math.min(totalPages, startPage + showPages - 1);
                
                // Adjust start if we're near the end
                if (endPage - startPage < showPages - 1) {
                  startPage = Math.max(1, endPage - showPages + 1);
                }
                
                // Show first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <Button
                      key={1}
                      variant={currentPage === 1 ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </Button>
                  );
                  
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis1" className="px-2 text-muted-foreground">...</span>
                    );
                  }
                }
                
                // Show page numbers around current page
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8"
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </Button>
                  );
                }
                
                // Show ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis2" className="px-2 text-muted-foreground">...</span>
                    );
                  }
                  
                  pages.push(
                    <Button
                      key={totalPages}
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  );
                }
                
                return pages;
              })()}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              disabled={!displayPagination.has_next}
              onClick={handleNextPage}
            >
              Next
            </Button>
            
          </div>
        )}

        <DeveloperPanel />
      </div>
    </MainLayout>
  );
};

export default Discover;