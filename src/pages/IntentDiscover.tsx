import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import IntentSearchFilters, { IntentFilters } from '@/components/IntentSearchFilters';
import IntentInfluencerCard from '@/components/IntentInfluencerCard';
import TrustGraph from '@/components/TrustGraph';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Target, 
  Users, 
  TrendingUp, 
  Shield,
  Network,
  BarChart3,
  Eye,
  Plus
} from 'lucide-react';

const IntentDiscover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IntentFilters>({
    minAlignmentScore: 0.7,
    minTrustScore: 0.6,
    minEngagementQuality: 0.5,
    platforms: ['linkedin', 'twitter', 'newsletter', 'podcast'],
    audienceSize: { min: 1000, max: 1000000 },
    verifiedOnly: false,
    highIntentOnly: true
  });
  const [activeTab, setActiveTab] = useState('discover');
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null);

  // Mock data with intent information
  const mockInfluencers = [
    {
      id: '1',
      name: 'John Doe',
      platform: 'LinkedIn',
      followers: 15000,
      engagement_rate: 4.2,
      buyer_alignment_score: 0.85,
      trust_score: 0.92,
      engagement_quality: 0.78,
      audience_overlap: 75,
      trust_indicators: ['verified', 'high_engagement', 'influential'],
      intent_signals: 12,
      verified: true,
      bio: 'SaaS growth expert helping startups scale through content marketing and community building.',
      topics: ['SaaS', 'Growth', 'Marketing', 'Startups'],
      location: 'San Francisco, CA',
      company: 'GrowthLab'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      platform: 'Twitter',
      followers: 8500,
      engagement_rate: 6.8,
      buyer_alignment_score: 0.72,
      trust_score: 0.68,
      engagement_quality: 0.85,
      audience_overlap: 68,
      trust_indicators: ['high_engagement'],
      intent_signals: 8,
      verified: false,
      bio: 'Product manager turned content creator sharing insights on product development and user experience.',
      topics: ['Product Management', 'UX', 'Design', 'Tech'],
      location: 'New York, NY',
      company: 'ProductCo'
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      platform: 'Newsletter',
      followers: 12000,
      engagement_rate: 8.5,
      buyer_alignment_score: 0.91,
      trust_score: 0.88,
      engagement_quality: 0.92,
      audience_overlap: 82,
      trust_indicators: ['verified', 'influential'],
      intent_signals: 15,
      verified: true,
      bio: 'B2B marketing strategist with 10+ years experience in demand generation and lead nurturing.',
      topics: ['B2B Marketing', 'Demand Gen', 'Sales', 'CRM'],
      location: 'Austin, TX',
      company: 'MarketingPro'
    },
    {
      id: '4',
      name: 'Alex Kim',
      platform: 'Podcast',
      followers: 25000,
      engagement_rate: 3.2,
      buyer_alignment_score: 0.65,
      trust_score: 0.74,
      engagement_quality: 0.68,
      audience_overlap: 58,
      trust_indicators: ['verified'],
      intent_signals: 6,
      verified: true,
      bio: 'Host of the Tech Leaders Podcast, interviewing successful entrepreneurs and tech executives.',
      topics: ['Entrepreneurship', 'Leadership', 'Tech', 'Startups'],
      location: 'Seattle, WA',
      company: 'TechLeaders'
    },
    {
      id: '5',
      name: 'Emma Wilson',
      platform: 'LinkedIn',
      followers: 18000,
      engagement_rate: 5.1,
      buyer_alignment_score: 0.78,
      trust_score: 0.81,
      engagement_quality: 0.75,
      audience_overlap: 71,
      trust_indicators: ['high_engagement', 'influential'],
      intent_signals: 10,
      verified: false,
      bio: 'Sales enablement expert helping sales teams close more deals through better processes and tools.',
      topics: ['Sales', 'Enablement', 'CRM', 'Process'],
      location: 'Chicago, IL',
      company: 'SalesBoost'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setInfluencers(mockInfluencers);
      setIsLoading(false);
    }, 1000);
  }, [filters, searchQuery]);

  const handleFiltersChange = (newFilters: IntentFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToList = (influencerId: string) => {
    // Mock add to list functionality
    console.log('Adding influencer to list:', influencerId);
  };

  const handleViewDetails = (influencerId: string) => {
    setSelectedInfluencer(influencerId);
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  const filteredInfluencers = influencers.filter(influencer => {
    // Apply filters
    if (filters.verifiedOnly && !influencer.verified) return false;
    if (filters.highIntentOnly && influencer.buyer_alignment_score < 0.7) return false;
    if (influencer.buyer_alignment_score < filters.minAlignmentScore) return false;
    if (influencer.trust_score < filters.minTrustScore) return false;
    if (influencer.engagement_quality < filters.minEngagementQuality) return false;
    if (!filters.platforms.includes(influencer.platform.toLowerCase())) return false;
    if (influencer.followers < filters.audienceSize.min || influencer.followers > filters.audienceSize.max) return false;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        influencer.name.toLowerCase().includes(query) ||
        influencer.bio.toLowerCase().includes(query) ||
        influencer.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Intent-Led Discovery</h1>
            <p className="text-muted-foreground">
              Discover influencers your target audience already follows and trusts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Trust Graph
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Create Audience Segment
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <IntentSearchFilters
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="trust-graph" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Trust Graph
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {filteredInfluencers.length} Influencers Found
                </h2>
                <Badge variant="secondary">
                  {influencers.length - filteredInfluencers.length} filtered out
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Sort by Alignment
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Sort by Trust
                </Button>
              </div>
            </div>

            {/* Influencer Cards */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 bg-muted rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredInfluencers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInfluencers.map((influencer) => (
                  <IntentInfluencerCard
                    key={influencer.id}
                    influencer={influencer}
                    onAddToList={handleAddToList}
                    onViewDetails={handleViewDetails}
                    isAdded={false}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No influencers found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms to find more influencers.
                </p>
                <Button variant="outline" onClick={() => setFilters({
                  minAlignmentScore: 0.7,
                  minTrustScore: 0.6,
                  minEngagementQuality: 0.5,
                  platforms: ['linkedin', 'twitter', 'newsletter', 'podcast'],
                  audienceSize: { min: 1000, max: 1000000 },
                  verifiedOnly: false,
                  highIntentOnly: true
                })}>
                  Reset Filters
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trust-graph">
            <TrustGraph
              data={{
                nodes: [
                  {
                    id: 'influencer_1',
                    type: 'influencer',
                    name: 'John Doe',
                    platform: 'LinkedIn',
                    followers: 15000,
                    trust_score: 0.85,
                    x: 200,
                    y: 150
                  },
                  {
                    id: 'customer_1',
                    type: 'customer',
                    name: 'Jane Smith',
                    company: 'TechCorp',
                    relationship_strength: 0.92,
                    x: 400,
                    y: 100
                  },
                  {
                    id: 'customer_2',
                    type: 'customer',
                    name: 'Mike Johnson',
                    company: 'StartupXYZ',
                    relationship_strength: 0.78,
                    x: 400,
                    y: 200
                  },
                  {
                    id: 'customer_3',
                    type: 'customer',
                    name: 'Sarah Wilson',
                    company: 'InnovateLab',
                    relationship_strength: 0.65,
                    x: 400,
                    y: 300
                  }
                ],
                edges: [
                  {
                    source: 'influencer_1',
                    target: 'customer_1',
                    relationship_type: 'follows',
                    platform: 'LinkedIn',
                    strength: 0.92
                  },
                  {
                    source: 'influencer_1',
                    target: 'customer_2',
                    relationship_type: 'engages',
                    platform: 'LinkedIn',
                    strength: 0.78
                  },
                  {
                    source: 'influencer_1',
                    target: 'customer_3',
                    relationship_type: 'interacts',
                    platform: 'LinkedIn',
                    strength: 0.65
                  }
                ]
              }}
              onNodeClick={handleNodeClick}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Total Influencers</p>
                    <p className="text-2xl font-bold">{influencers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-success">High Alignment</p>
                    <p className="text-2xl font-bold">
                      {influencers.filter(i => i.buyer_alignment_score >= 0.8).length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-success" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-warning">Verified</p>
                    <p className="text-2xl font-bold">
                      {influencers.filter(i => i.verified).length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-warning" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary">Avg Trust Score</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        influencers.reduce((sum, i) => sum + (i.trust_score || 0), 0) / 
                        influencers.length * 100
                      )}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IntentDiscover;
