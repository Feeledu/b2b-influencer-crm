import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Users, 
  Mic, 
  Mail,
  ExternalLink,
  Heart,
  Plus
} from "lucide-react";

const Discover = () => {
  const influencers = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "VP of Marketing at TechScale",
      platform: "LinkedIn",
      followers: "25.4K",
      engagement: "4.2%",
      industry: "SaaS",
      expertise: ["Growth Marketing", "B2B Strategy", "Product Marketing"],
      avatar: "SC",
      verified: true,
    },
    {
      id: 2,
      name: "The SaaS Show",
      title: "Weekly B2B Software Podcast",
      platform: "Podcast",
      followers: "15K",
      engagement: "8.1%",
      industry: "Technology",
      expertise: ["SaaS", "Entrepreneurship", "Product Development"],
      avatar: "TS",
      verified: true,
    },
    {
      id: 3,
      name: "Marketing Mix Weekly",
      title: "B2B Marketing Newsletter",
      platform: "Newsletter",
      followers: "12.8K",
      engagement: "15.3%",
      industry: "Marketing",
      expertise: ["B2B Marketing", "Lead Generation", "Marketing Automation"],
      avatar: "MM",
      verified: false,
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      title: "Founder & Growth Strategist",
      platform: "LinkedIn",
      followers: "18.2K",
      engagement: "6.7%",
      industry: "Consulting",
      expertise: ["Growth Hacking", "Startup Strategy", "B2B Sales"],
      avatar: "AR",
      verified: true,
    },
  ];

  const platformIcons = {
    LinkedIn: Users,
    Podcast: Mic,
    Newsletter: Mail,
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Discover Influencers</h1>
          <p className="text-muted-foreground">
            Find the perfect B2B influencers for your campaigns
          </p>
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
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">SaaS</Badge>
            <Badge variant="outline">LinkedIn</Badge>
            <Badge variant="outline">Podcast</Badge>
            <Badge variant="outline">Newsletter</Badge>
            <Badge variant="outline">10K+ Followers</Badge>
          </div>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {influencers.map((influencer) => {
            const PlatformIcon = platformIcons[influencer.platform as keyof typeof platformIcons];
            
            return (
              <Card key={influencer.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {influencer.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{influencer.name}</h3>
                        {influencer.verified && (
                          <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{influencer.title}</p>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <PlatformIcon className="h-4 w-4" />
                          <span>{influencer.platform}</span>
                        </div>
                        <span>{influencer.followers} followers</span>
                        <span>{influencer.engagement} engagement</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {influencer.expertise.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="sm">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;