import MainLayout from "@/components/MainLayout";
import DeveloperPanel from "@/components/DeveloperPanel";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { setPremiumMode, forceResetTrials, checkAITrialEligibility } from '@/lib/premiumAIService';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [addedInfluencers, setAddedInfluencers] = useState<Set<string>>(new Set());

  // Load added influencers from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('addedInfluencers');
    if (saved) {
      try {
        setAddedInfluencers(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Error loading added influencers:', error);
      }
    }
  }, []);

  // Save added influencers to localStorage whenever it changes
  useEffect(() => {
    const idsArray = Array.from(addedInfluencers);
    localStorage.setItem('addedInfluencers', JSON.stringify(idsArray));
    console.log('Saving to localStorage:', idsArray);
  }, [addedInfluencers]);

  const handleAddInfluencer = (influencerId: string, influencerName: string) => {
    setAddedInfluencers(prev => {
      const newSet = new Set([...prev, influencerId]);
      console.log('Adding influencer:', { influencerId, influencerName, newSet: Array.from(newSet) });
      return newSet;
    });
  };

  const handleRemoveInfluencer = (influencerId: string, influencerName: string) => {
    setAddedInfluencers(prev => {
      const newSet = new Set(prev);
      newSet.delete(influencerId);
      return newSet;
    });
  };

  const isInfluencerAdded = (influencerId: string) => {
    return addedInfluencers.has(influencerId);
  };

  // Mock data
  const mockInfluencers = [
    {
      id: '1',
      name: 'John Doe',
      platform: 'LinkedIn',
      followers: 15000,
      engagement_rate: 4.2,
      industry: 'Technology',
      bio: 'SaaS growth expert helping startups scale through content marketing.',
      topics: ['SaaS', 'Growth', 'Marketing'],
      location: 'San Francisco, CA',
      verified: true,
      intent_score: 95,
      recent_mentions: 12,
      buying_signals: ['Pricing inquiries', 'Demo requests', 'Competitor mentions'],
      content_themes: ['SaaS metrics', 'Growth hacking', 'Customer success'],
      audience_alignment: {
        job_titles: ['VP Marketing', 'CMO', 'Growth Manager'],
        industries: ['SaaS', 'Technology', 'Marketing'],
        company_size: '50-500 employees',
        alignment_score: 92
      }
    },
    {
      id: '2',
      name: 'Sarah Chen',
      platform: 'Twitter',
      followers: 8500,
      engagement_rate: 6.8,
      industry: 'Product',
      bio: 'Product manager turned content creator sharing insights on product development.',
      topics: ['Product Management', 'UX', 'Design'],
      location: 'New York, NY',
      verified: false,
      intent_score: 88,
      recent_mentions: 8,
      buying_signals: ['Tool comparisons', 'Implementation questions', 'ROI discussions'],
      content_themes: ['Product strategy', 'UX research', 'Design systems'],
      audience_alignment: {
        job_titles: ['Product Manager', 'UX Designer', 'Product Owner'],
        industries: ['Technology', 'Product', 'Design'],
        company_size: '10-100 employees',
        alignment_score: 78
      }
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      platform: 'Newsletter',
      followers: 12000,
      engagement_rate: 8.5,
      industry: 'Marketing',
      bio: 'B2B marketing strategist with 10+ years experience in demand generation.',
      topics: ['B2B Marketing', 'Demand Gen', 'Sales'],
      location: 'Austin, TX',
      verified: true,
      intent_score: 82,
      recent_mentions: 15,
      buying_signals: ['Marketing tool evaluations', 'Campaign optimization', 'Lead generation'],
      content_themes: ['Marketing automation', 'Lead scoring', 'Email marketing'],
      audience_alignment: {
        job_titles: ['Marketing Director', 'Demand Gen Manager', 'Marketing Manager'],
        industries: ['Marketing', 'SaaS', 'Technology'],
        company_size: '100-1000 employees',
        alignment_score: 85
      }
    },
    {
      id: '4',
      name: 'Alex Kim',
      platform: 'Podcast',
      followers: 25000,
      engagement_rate: 3.2,
      industry: 'Media',
      bio: 'Host of the Tech Leaders Podcast, interviewing successful entrepreneurs.',
      topics: ['Entrepreneurship', 'Leadership', 'Tech'],
      location: 'Seattle, WA',
      verified: true,
      intent_score: 75,
      recent_mentions: 6,
      buying_signals: ['Podcast sponsorship inquiries', 'Speaking opportunities', 'Content partnerships'],
      content_themes: ['Startup stories', 'Leadership insights', 'Tech trends'],
      audience_alignment: {
        job_titles: ['CEO', 'Founder', 'VP Engineering'],
        industries: ['Technology', 'Startups', 'Media'],
        company_size: '1-50 employees',
        alignment_score: 65
      }
    },
    {
      id: '5',
      name: 'Emma Wilson',
      platform: 'LinkedIn',
      followers: 18000,
      engagement_rate: 5.1,
      industry: 'Sales',
      bio: 'Sales enablement expert helping sales teams close more deals.',
      topics: ['Sales', 'Enablement', 'CRM'],
      location: 'Chicago, IL',
      verified: false,
      intent_score: 90,
      recent_mentions: 20,
      buying_signals: ['CRM evaluations', 'Sales process optimization', 'Team training needs'],
      content_themes: ['Sales methodology', 'CRM best practices', 'Sales training'],
      audience_alignment: {
        job_titles: ['Sales Director', 'VP Sales', 'Sales Manager'],
        industries: ['Sales', 'Technology', 'SaaS'],
        company_size: '50-500 employees',
        alignment_score: 88
      }
    },
    {
      id: '6',
      name: 'David Park',
      platform: 'Newsletter',
      followers: 9500,
      engagement_rate: 7.3,
      industry: 'SaaS',
      bio: 'SaaS founder sharing insights on product-market fit and scaling.',
      topics: ['SaaS', 'Product', 'Scaling'],
      location: 'San Francisco, CA',
      verified: true,
      intent_score: 92,
      recent_mentions: 18,
      buying_signals: ['Product feedback requests', 'Partnership discussions', 'Investment inquiries'],
      content_themes: ['Product development', 'Market research', 'Growth strategies'],
      audience_alignment: {
        job_titles: ['Founder', 'CEO', 'Product Manager'],
        industries: ['SaaS', 'Technology', 'Product'],
        company_size: '1-100 employees',
        alignment_score: 95
      }
    }
  ];

  // Filter influencers based on search and filters
  const filteredInfluencers = mockInfluencers.filter((influencer) => {
    // Search filter
    const matchesSearch = !searchTerm || 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.topics.some(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Quick filter badges and advanced filters
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.every(filter => {
      switch (filter) {
        // Industries
        case 'Technology':
          return influencer.industry === 'Technology';
        case 'Product':
          return influencer.industry === 'Product';
        case 'Marketing':
          return influencer.industry === 'Marketing';
        case 'Sales':
          return influencer.industry === 'Sales';
        case 'SaaS':
          return influencer.industry === 'SaaS';
        case 'Media':
          return influencer.industry === 'Media';
        
        // Platforms
        case 'LinkedIn':
          return influencer.platform === 'LinkedIn';
        case 'Twitter':
          return influencer.platform === 'Twitter';
        case 'Podcast':
          return influencer.platform === 'Podcast';
        case 'Newsletter':
          return influencer.platform === 'Newsletter';
        
        // Follower ranges
        case '1K+':
          return influencer.followers >= 1000;
        case '10K+ Followers':
        case '10K+':
          return influencer.followers >= 10000;
        case '50K+':
          return influencer.followers >= 50000;
        case '100K+':
          return influencer.followers >= 100000;
        
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  console.log('Discover page rendering', { 
    loading, 
    error, 
    mockInfluencers: mockInfluencers.length,
    filteredInfluencers: filteredInfluencers.length,
    searchTerm,
    selectedFilters
  });

  const platformIcons = {
    LinkedIn: Users,
    Twitter: Users,
    Podcast: Mic,
    Newsletter: Mail,
  };

  const platformConfig = {
    LinkedIn: {
      color: '#7C3AED',
      icon: Users,
    },
    Twitter: {
      color: '#7C3AED',
      icon: Users,
    },
    YouTube: {
      color: '#7C3AED',
      icon: Users,
    },
    Newsletter: {
      color: '#7C3AED',
      icon: Mail,
    },
    Podcast: {
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
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {['Technology', 'LinkedIn', 'Podcast', 'Newsletter', '10K+ Followers'].map((filter) => (
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
                    {['LinkedIn', 'Twitter', 'Podcast', 'Newsletter'].map((platform) => (
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
                    {['Technology', 'Product', 'Marketing', 'Sales', 'SaaS', 'Media'].map((industry) => (
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
              <h2 className="text-xl font-semibold">
                {filteredInfluencers.length} Influencers Found
              </h2>
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
                  <Button onClick={() => setError(null)} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && (
              <>
                {filteredInfluencers.length === 0 ? (
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
                ) : (
                  <div className={`grid gap-6 ${viewMode === "grid" ? "grid-view grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-fr" : "list-view grid-cols-1"}`}>
                    {filteredInfluencers.map((influencer) => {
                const platformInfo = platformConfig[influencer.platform as keyof typeof platformConfig];
                const PlatformIcon = platformInfo?.icon || Users;
                
                return (
                  <Card key={influencer.id} className={`influencer-card p-3 hover:shadow-lg transition-all duration-300 flex flex-col ${viewMode === 'grid' ? 'h-[350px]' : 'h-[300px]'}`}>
                    {/* Header with Name, Headline, and Action Buttons */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-lg">{influencer.name}</h3>
                          {influencer.verified && (
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons - Top Right */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            console.log('Heart clicked for:', influencer.name);
                          }}
                          className="hover:bg-red-50 hover:text-red-500 h-8 w-8"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        {isInfluencerAdded(influencer.id) ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveInfluencer(influencer.id, influencer.name)}
                            className="border-green-500 text-green-600 hover:bg-green-50 font-medium px-3 py-1 h-8"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Added
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleAddInfluencer(influencer.id, influencer.name)}
                            className="bg-primary hover:bg-primary/90 text-white font-medium px-3 py-1 h-8"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Bio Section - Narrow Width */}
                    <div className="mb-3 w-2/3">
                      <p className={`text-sm text-muted-foreground overflow-hidden ${viewMode === 'grid' ? 'h-[64px]' : 'h-[20px]'}`} style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical'
                      }}>{influencer.bio}</p>
                    </div>

                    {/* Followers + Engagement Stats Row */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 whitespace-nowrap">
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
                      <div className="flex items-center space-x-4">
                        <span className="ml-2">{influencer.followers.toLocaleString()} followers</span>
                        <span>{influencer.engagement_rate}% engagement</span>
                      </div>
                    </div>

                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-1 mb-0">
                      {influencer.topics?.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    {/* Spacer to push Audience Match to bottom */}
                    <div className="flex-1"></div>

                    {/* Audience Match Box - Bottom, Full Width */}
                    {influencer.audience_alignment && (
                      <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mt-0.5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-blue-900">🎯 Audience Match</h4>
                          <span className="text-xs text-blue-600 font-semibold">
                            {influencer.audience_alignment.alignment_score}% match
                          </span>
                        </div>
                        
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-500">Company Size: </span>
                            <span className="text-gray-700 font-medium">{influencer.audience_alignment.company_size}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-500 mb-2">Roles:</span>
                              <div className="flex flex-wrap gap-1">
                                {influencer.audience_alignment.job_titles.slice(0, 2).map((title, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                    {title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                      Discover influencers who are actively researching or discussing topics related to your industry, 
                      showing high purchase intent and engagement with relevant content.
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
                    Discover influencers who are actively researching or discussing topics related to your industry, 
                    showing high purchase intent and engagement with relevant content.
                  </p>
                </Card>

            {/* Intent Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {filteredInfluencers.length} High-Intent Influencers Found
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Sorted by intent score</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {filteredInfluencers
                  .sort((a, b) => b.intent_score - a.intent_score)
                  .map((influencer) => {
                    const platformInfo = platformConfig[influencer.platform as keyof typeof platformConfig];
                    const PlatformIcon = platformInfo?.icon || Users;
                    
                    return (
                      <Card key={influencer.id} className="pt-4 pb-6 px-6 hover:shadow-lg transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold">{influencer.name}</h3>
                                  {influencer.verified && (
                                    <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                      <div className="h-2 w-2 rounded-full bg-white" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground h-16 overflow-hidden mt-3" style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical'
                                }}>{influencer.bio}</p>
                                
                                <div className="mt-0.5 flex items-center justify-between text-sm text-muted-foreground whitespace-nowrap">
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
                                  <div className="flex items-center space-x-2">
                                    <span className="ml-2">{influencer.followers.toLocaleString()} followers</span>
                                    <span>{influencer.engagement_rate}% engagement</span>
                                  </div>
                                </div>
                            </div>
                          </div>

                          {/* Intent Score */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Intent Score</span>
                              <span className="text-sm font-bold text-primary">{influencer.intent_score}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${influencer.intent_score}%` }}
                              />
                            </div>
                          </div>

                          {/* Buying Signals */}
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Buying Signals</span>
                            <div className="flex flex-wrap gap-1">
                              {influencer.buying_signals?.map((signal) => (
                                <Badge key={signal} variant="secondary" className="text-xs">
                                  {signal}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Content Themes */}
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Content Themes</span>
                            <div className="flex flex-wrap gap-1">
                              {influencer.content_themes?.map((theme) => (
                                <Badge key={theme} variant="outline" className="text-xs">
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Audience Alignment */}
                          {influencer.audience_alignment && (
                            <div className="space-y-2">
                              <span className="text-sm font-medium">Audience Match</span>
                              <div className="p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-green-800">Audience Alignment</span>
                                  <span className="text-xs font-bold text-green-600">
                                    {influencer.audience_alignment.alignment_score}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  <div>Roles: {influencer.audience_alignment.job_titles.slice(0, 2).join(', ')}</div>
                                  <div>Size: {influencer.audience_alignment.company_size}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-muted-foreground">
                              {influencer.recent_mentions} recent mentions
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
                                  className="border-green-500 text-green-600 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Added
                                </Button>
                              ) : (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleAddInfluencer(influencer.id, influencer.name)}
                                  className="bg-primary hover:bg-primary/90 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
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
                  <div className="flex justify-between">
                    <span className="text-sm">LinkedIn</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Newsletter</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Podcast</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Engagement Trends</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">High Engagement (7%+)</span>
                    <span className="text-sm font-medium text-green-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Engagement (4-7%)</span>
                    <span className="text-sm font-medium text-yellow-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Engagement (under 4%)</span>
                    <span className="text-sm font-medium text-red-600">1</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Intent Scores</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">High Intent (90%+)</span>
                    <span className="text-sm font-medium text-green-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Intent (70-90%)</span>
                    <span className="text-sm font-medium text-yellow-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Intent (under 70%)</span>
                    <span className="text-sm font-medium text-red-600">1</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>

        <DeveloperPanel />
      </div>
    </MainLayout>
  );
};

export default Discover;