import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  TrendingUp
} from "lucide-react";

const Influencers = () => {
  const influencers = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "VP of Marketing at TechScale",
      platform: "LinkedIn",
      followers: "25.4K",
      engagement: "4.2%",
      industry: "SaaS",
      location: "San Francisco, CA",
      expertise: ["Growth Marketing", "B2B Strategy", "Product Marketing"],
      status: "Partnered",
      lastInteraction: "2 days ago",
      avatar: "SC",
      verified: true,
      rating: 4.8,
      campaigns: 3,
    },
    {
      id: 2,
      name: "The SaaS Show",
      title: "Weekly B2B Software Podcast",
      platform: "Podcast",
      followers: "15K",
      engagement: "8.1%",
      industry: "Technology",
      location: "Remote",
      expertise: ["SaaS", "Entrepreneurship", "Product Development"],
      status: "Active",
      lastInteraction: "1 week ago",
      avatar: "TS",
      verified: true,
      rating: 4.6,
      campaigns: 2,
    },
    {
      id: 3,
      name: "Marketing Mix Weekly",
      title: "B2B Marketing Newsletter",
      platform: "Newsletter",
      followers: "12.8K",
      engagement: "15.3%",
      industry: "Marketing",
      location: "New York, NY",
      expertise: ["B2B Marketing", "Lead Generation", "Marketing Automation"],
      status: "Warm",
      lastInteraction: "3 weeks ago",
      avatar: "MM",
      verified: false,
      rating: 4.4,
      campaigns: 1,
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      title: "Founder & Growth Strategist",
      platform: "LinkedIn",
      followers: "18.2K",
      engagement: "6.7%",
      industry: "Consulting",
      location: "Austin, TX",
      expertise: ["Growth Hacking", "Startup Strategy", "B2B Sales"],
      status: "Cold",
      lastInteraction: "Never",
      avatar: "AR",
      verified: true,
      rating: 4.2,
      campaigns: 0,
    },
  ];

  const platformIcons = {
    LinkedIn: Users,
    Podcast: Mic,
    Newsletter: Mail,
  };

  const statusColors = {
    "Partnered": "bg-success text-success-foreground",
    "Active": "bg-primary text-primary-foreground",
    "Warm": "bg-warning text-warning-foreground",
    "Cold": "bg-muted text-muted-foreground",
  };

  const getStatusEmoji = (status: string) => {
    switch(status) {
      case "Partnered": return "🤝";
      case "Active": return "🔥";
      case "Warm": return "☀️";
      case "Cold": return "❄️";
      default: return "📝";
    }
  };

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              👥 My Influencers
            </h1>
            <p className="text-muted-foreground">
              Manage your influencer relationships and track partnership status
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            Add Influencer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">🤝 Partnered</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="text-3xl">🤝</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">🔥 Active</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">☀️ Warm</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <div className="text-3xl">☀️</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-muted/10 to-muted/5 border-muted/20 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">❄️ Cold</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <div className="text-3xl">❄️</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-gradient-to-r from-card to-card-glow">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">🔍 Search Influencers</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, industry, or expertise..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:w-auto">
              <div>
                <label className="text-sm font-medium mb-2 block">📊 Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="partnered">🤝 Partnered</SelectItem>
                    <SelectItem value="active">🔥 Active</SelectItem>
                    <SelectItem value="warm">☀️ Warm</SelectItem>
                    <SelectItem value="cold">❄️ Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">📱 Platform</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">🏭 Industry</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Influencer Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {influencers.map((influencer) => {
            const PlatformIcon = platformIcons[influencer.platform as keyof typeof platformIcons];
            const statusColor = statusColors[influencer.status as keyof typeof statusColors];
            
            return (
              <Card key={influencer.id} className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card-glow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {influencer.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-lg">{influencer.name}</h3>
                        {influencer.verified && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{influencer.title}</p>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        <Badge className={`text-xs ${statusColor}`}>
                          {getStatusEmoji(influencer.status)} {influencer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <PlatformIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{influencer.platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{influencer.followers}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{influencer.engagement}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{influencer.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {influencer.expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span>{influencer.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{influencer.campaigns} campaigns</span>
                    <span>•</span>
                    <span>Last: {influencer.lastInteraction}</span>
                  </div>
                  
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark">
                    View Profile
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Influencers;