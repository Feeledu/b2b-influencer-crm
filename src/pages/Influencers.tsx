import MainLayout from "@/components/MainLayout";
import DeveloperPanel from "@/components/DeveloperPanel";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { setPremiumMode, forceResetTrials, checkAITrialEligibility } from '@/lib/premiumAIService';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyInfluencers, useInfluencerActions } from "@/hooks/useInfluencers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Users, 
  Mic, 
  Mail,
  ExternalLink,
  Heart,
  Plus,
  Star,
  MapPin,
  TrendingUp,
  Grid3X3,
  List,
  Calendar,
  Target,
  BarChart3,
  UserPlus,
  Clock
} from "lucide-react";

const Influencers = () => {
  const navigate = useNavigate();
  const { updateSubscription, isTrialActive, daysRemaining } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [addedInfluencerIds, setAddedInfluencerIds] = useState<Set<string>>(new Set());
  
  // Use real API hook for my influencers
  const { 
    myInfluencers, 
    loading, 
    error, 
    pagination,
    refetch: refetchMyInfluencers 
  } = useMyInfluencers({
    page: 1,
    limit: 50
  });

  // Use real data from API
  const displayInfluencers = myInfluencers || [];

  const platformIcons = {
    linkedin: Users,
    podcast: Mic,
    newsletter: Mail,
  };

  const statusColors = {
    "partnered": "bg-green-100 text-green-800 border-green-200",
    "contacted": "bg-blue-100 text-blue-800 border-blue-200",
    "warm": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "cold": "bg-gray-100 text-gray-800 border-gray-200",
    "saved": "bg-purple-100 text-purple-800 border-purple-200",
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "partnered": return "🤝";
      case "contacted": return "📞";
      case "warm": return "🔥";
      case "cold": return "❄️";
      case "saved": return "💾";
      default: return "📝";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "partnered": return "Partnered";
      case "contacted": return "Contacted";
      case "warm": return "Warm";
      case "cold": return "Cold";
      case "saved": return "Saved";
      default: return "Saved";
    }
  };

  // Filter influencers based on search and filters
  const filteredInfluencers = displayInfluencers.filter((userInfluencer) => {
    const influencer = userInfluencer.influencer;
    if (!influencer) return false;

    const matchesSearch = !searchTerm || 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.expertise_tags?.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesPlatform = !selectedPlatform || selectedPlatform === "all" || influencer.platform === selectedPlatform;
    const matchesIndustry = !selectedIndustry || selectedIndustry === "all" || influencer.industry === selectedIndustry;

    return matchesSearch && matchesPlatform && matchesIndustry;
  });

  // Calculate stats
  const stats = {
    partnered: displayInfluencers.filter(ui => ui.status === 'partnered').length,
    contacted: displayInfluencers.filter(ui => ui.status === 'contacted').length,
    warm: displayInfluencers.filter(ui => ui.status === 'warm').length,
    cold: displayInfluencers.filter(ui => ui.status === 'cold').length,
  };

  // CRM-style metrics
  const crmMetrics = {
    totalInfluencers: displayInfluencers.length,
    activeCampaigns: 0, // This would come from campaigns data
    totalInteractions: 0, // This would come from interactions data
    partnered: stats.partnered,
  };

  // Group influencers by status for list view
  const groupedInfluencers = {
    active: filteredInfluencers.filter(inf => inf.status === 'partnered' || inf.status === 'contacted'),
    warm: filteredInfluencers.filter(inf => inf.status === 'warm'),
    cold: filteredInfluencers.filter(inf => inf.status === 'cold' || inf.status === 'saved')
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
                    {daysRemaining} days remaining in your free trial. Upgrade to Fluencr Pro to add unlimited influencers and unlock advanced CRM features.
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
              <UserPlus className="h-8 w-8 text-purple-600" />
              My Influencers
            </h1>
            <p className="text-muted-foreground">
              Manage your influencer relationships, track interactions, and monitor partnership status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="h-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => {
                console.log('Add Influencer clicked');
                navigate('/discover');
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
            Add Influencer
          </Button>
          </div>
        </div>

        {/* CRM-style Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Influencers</p>
                <p className="text-2xl font-bold text-gray-900">{crmMetrics.totalInfluencers}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{crmMetrics.activeCampaigns}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                <p className="text-2xl font-bold text-gray-900">{crmMetrics.totalInteractions}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Partnered</p>
                <p className="text-2xl font-bold text-gray-900">{crmMetrics.partnered}</p>
              </div>
            </div>
          </Card>
        </div>


        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, industry, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus || "all"} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="partnered">Partnered</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="saved">Saved</SelectItem>
                  </SelectContent>
                </Select>
              <Select value={selectedPlatform || "all"} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              <Select value={selectedIndustry || "all"} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="DevTools">DevTools</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="MarTech">MarTech</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                    <SelectItem value="HRTech">HRTech</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="h-16 w-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Failed to fetch user influencers.</p>
            </div>
            <Button onClick={() => refetchMyInfluencers()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Influencers Content */}
        {!loading && !error && (
          <>
            {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredInfluencers.map((userInfluencer) => {
              const influencer = userInfluencer.influencer;
                  const PlatformIcon = platformIcons[influencer.platform as keyof typeof platformIcons] || Users;
              
              return (
                    <Card key={userInfluencer.id} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                        {influencer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{influencer.name}</h3>
                          {influencer.is_verified && (
                                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                            <p className="text-sm text-muted-foreground mb-2">{influencer.bio}</p>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <PlatformIcon className="h-4 w-4" />
                                <span>{influencer.platform}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span>{influencer.audience_size?.toLocaleString()} followers</span>
                                <span>{influencer.engagement_rate}% engagement</span>
                        </div>
                      </div>
                    </div>
                    </div>
                    <div className="flex items-center space-x-2">
                          <Badge className={`${statusColors[userInfluencer.status as keyof typeof statusColors]} flex items-center gap-1`}>
                            <span>{getStatusEmoji(userInfluencer.status)}</span>
                            <span>{getStatusLabel(userInfluencer.status)}</span>
                          </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                        {influencer.expertise_tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                      </Badge>
                    ))}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{influencer.location}</span>
                        </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{userInfluencer.relationship_strength}% relationship</span>
                        </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              console.log('View clicked for:', userInfluencer.influencer.name);
                              // Open influencer's profile based on platform
                              const platform = userInfluencer.influencer.platform.toLowerCase();
                              const handle = userInfluencer.influencer.handle || '';
                              
                              let url = '';
                              switch (platform) {
                                case 'linkedin':
                                  url = `https://linkedin.com/in/${handle.replace('@', '')}`;
                                  break;
                                case 'twitter':
                                  url = `https://twitter.com/${handle.replace('@', '')}`;
                                  break;
                                case 'youtube':
                                  url = `https://youtube.com/@${handle.replace('@', '')}`;
                                  break;
                                case 'newsletter':
                                  url = userInfluencer.influencer.website_url || '#';
                                  break;
                                case 'podcast':
                                  url = userInfluencer.influencer.website_url || '#';
                                  break;
                                default:
                                  url = userInfluencer.influencer.website_url || '#';
                              }
                              
                              window.open(url, '_blank');
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              console.log('Contact clicked for:', userInfluencer.influencer.name);
                              // Navigate to a contact form or open contact modal
                              // This would be a proper in-app contact system
                              navigate(`/contact/${userInfluencer.influencer.id}`);
                            }}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Influencers */}
                {groupedInfluencers.active.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active ({groupedInfluencers.active.length})
                    </h3>
                    <div className="space-y-3">
                      {groupedInfluencers.active.map((userInfluencer) => {
                        const influencer = userInfluencer.influencer;
                        const PlatformIcon = platformIcons[influencer.platform as keyof typeof platformIcons] || Users;
                        return (
                          <Card key={userInfluencer.id} className="p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                  {influencer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold">{influencer.name}</h4>
                                    <Badge className={`${statusColors[userInfluencer.status as keyof typeof statusColors]} flex items-center gap-1`}>
                                      <span>{getStatusEmoji(userInfluencer.status)}</span>
                                      <span>{getStatusLabel(userInfluencer.status)}</span>
                              </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {influencer.platform} • {influencer.industry}
                                  </p>
                          </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>{userInfluencer.relationship_strength}%</span>
                                </div>
                                {userInfluencer.follow_up_date && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(userInfluencer.follow_up_date).toLocaleDateString()}</span>
                        </div>
                      )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('View clicked for:', userInfluencer.influencer.name);
                                    // Open influencer's profile based on platform
                                    const platform = userInfluencer.influencer.platform.toLowerCase();
                                    const handle = userInfluencer.influencer.handle || '';
                                    
                                    let url = '';
                                    switch (platform) {
                                      case 'linkedin':
                                        url = `https://linkedin.com/in/${handle.replace('@', '')}`;
                                        break;
                                      case 'twitter':
                                        url = `https://twitter.com/${handle.replace('@', '')}`;
                                        break;
                                      case 'youtube':
                                        url = `https://youtube.com/@${handle.replace('@', '')}`;
                                        break;
                                      case 'newsletter':
                                        url = userInfluencer.influencer.website_url || '#';
                                        break;
                                      case 'podcast':
                                        url = userInfluencer.influencer.website_url || '#';
                                        break;
                                      default:
                                        url = userInfluencer.influencer.website_url || '#';
                                    }
                                    
                                    window.open(url, '_blank');
                                  }}
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                    </div>
                  )}

                {/* Warm Influencers */}
                {groupedInfluencers.warm.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Warm ({groupedInfluencers.warm.length})
                    </h3>
                    <div className="space-y-3">
                      {groupedInfluencers.warm.map((userInfluencer) => {
                        const influencer = userInfluencer.influencer;
                        const PlatformIcon = platformIcons[influencer.platform as keyof typeof platformIcons] || Users;
                        return (
                          <Card key={userInfluencer.id} className="p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                  {influencer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold">{influencer.name}</h4>
                                    <Badge className={`${statusColors[userInfluencer.status as keyof typeof statusColors]} flex items-center gap-1`}>
                                      <span>{getStatusEmoji(userInfluencer.status)}</span>
                                      <span>{getStatusLabel(userInfluencer.status)}</span>
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {influencer.platform} • {influencer.industry}
                                  </p>
                                </div>
                              </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>{userInfluencer.relationship_strength}%</span>
                                </div>
                                {userInfluencer.follow_up_date && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(userInfluencer.follow_up_date).toLocaleDateString()}</span>
                      </div>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('View clicked for:', userInfluencer.influencer.name);
                                    // Open influencer's profile based on platform
                                    const platform = userInfluencer.influencer.platform.toLowerCase();
                                    const handle = userInfluencer.influencer.handle || '';
                                    
                                    let url = '';
                                    switch (platform) {
                                      case 'linkedin':
                                        url = `https://linkedin.com/in/${handle.replace('@', '')}`;
                                        break;
                                      case 'twitter':
                                        url = `https://twitter.com/${handle.replace('@', '')}`;
                                        break;
                                      case 'youtube':
                                        url = `https://youtube.com/@${handle.replace('@', '')}`;
                                        break;
                                      case 'newsletter':
                                        url = userInfluencer.influencer.website_url || '#';
                                        break;
                                      case 'podcast':
                                        url = userInfluencer.influencer.website_url || '#';
                                        break;
                                      default:
                                        url = userInfluencer.influencer.website_url || '#';
                                    }
                                    
                                    window.open(url, '_blank');
                                  }}
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Cold Influencers */}
                {groupedInfluencers.cold.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Cold ({groupedInfluencers.cold.length})
                    </h3>
                    <div className="space-y-3">
                      {groupedInfluencers.cold.map((userInfluencer) => {
                        const influencer = userInfluencer.influencer;
                        const PlatformIcon = platformIcons[influencer.platform as keyof typeof platformIcons] || Users;
                        return (
                          <Card key={userInfluencer.id} className="p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                  {influencer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold">{influencer.name}</h4>
                                    <Badge className={`${statusColors[userInfluencer.status as keyof typeof statusColors]} flex items-center gap-1`}>
                                      <span>{getStatusEmoji(userInfluencer.status)}</span>
                                      <span>{getStatusLabel(userInfluencer.status)}</span>
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {influencer.platform} • {influencer.industry}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>{userInfluencer.relationship_strength}%</span>
                                </div>
                                {userInfluencer.follow_up_date && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(userInfluencer.follow_up_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('View clicked for:', userInfluencer.influencer.name);
                                    // Open influencer's profile based on platform
                                    const platform = userInfluencer.influencer.platform.toLowerCase();
                                    const handle = userInfluencer.influencer.handle || '';
                                    
                                    let url = '';
                                    switch (platform) {
                                      case 'linkedin':
                                        url = `https://linkedin.com/in/${handle.replace('@', '')}`;
                                        break;
                                      case 'twitter':
                                        url = `https://twitter.com/${handle.replace('@', '')}`;
                                        break;
                                      case 'youtube':
                                        url = `https://youtube.com/@${handle.replace('@', '')}`;
                                        break;
                                      case 'newsletter':
                                        url = userInfluencer.influencer.website_url || '#';
                                        break;
                                      case 'podcast':
                                        url = userInfluencer.influencer.website_url || '#';
                                        break;
                                      default:
                                        url = userInfluencer.influencer.website_url || '#';
                                    }
                                    
                                    window.open(url, '_blank');
                                  }}
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                    </Button>
                              </div>
                  </div>
                </Card>
              );
            })}
          </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredInfluencers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedStatus || selectedPlatform || selectedIndustry
                ? "Try adjusting your filters to see more results."
                : "Start by discovering influencers and adding them to your list."}
            </p>
            <Button
              onClick={() => {
                console.log('Add Influencer clicked from empty state');
                navigate('/discover');
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Influencer
                </Button>
          </div>
        )}

        <DeveloperPanel />
      </div>
    </MainLayout>
  );
};

export default Influencers;