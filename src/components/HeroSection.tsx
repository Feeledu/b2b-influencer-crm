import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, BarChart3, Target, Sparkles, Zap, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-network.jpg";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,transparent_50%)] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--secondary)_0%,transparent_50%)] opacity-10" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '-1s' }} />
      <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-success/20 rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      
      <div className="relative px-6 py-32 mx-auto max-w-7xl">
        <div className="text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">✨ The Future of B2B Influencer Marketing</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              B2B Influencer CRM
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto mb-4">
            🎯 Discover LinkedIn creators, podcast hosts, and newsletter writers. 
            Track ROI from dark social channels with zero guesswork.
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            No more spreadsheets 📊 No more agencies 🚫 Just clear attribution and measurable growth 📈
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              🚀 Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-2 hover:border-primary hover:bg-primary/5 shadow-lg hover:shadow-xl transition-all duration-300">
              🎬 Watch Demo
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">248+</div>
              <div className="text-sm text-muted-foreground">Verified Influencers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">4.2x</div>
              <div className="text-sm text-muted-foreground">Average ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">$2.1M</div>
              <div className="text-sm text-muted-foreground">Pipeline Generated</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center border-0 bg-gradient-to-br from-card via-card-glow to-muted/30 backdrop-blur hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-6 group-hover:animate-glow">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              🔍 Smart Discovery
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              AI-powered search across LinkedIn, podcasts, and newsletters. Find your perfect influencer match in seconds, not hours.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 bg-gradient-to-br from-card via-card-glow to-muted/30 backdrop-blur hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center mb-6 group-hover:animate-glow">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              🤝 CRM Workspace
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Track every interaction, manage partnerships, and nurture relationships. Your influencer pipeline, perfectly organized.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 bg-gradient-to-br from-card via-card-glow to-muted/30 backdrop-blur hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-success to-success-light flex items-center justify-center mb-6 group-hover:animate-glow">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              📊 ROI Tracking
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Measure campaign performance and prove impact. Turn dark social into clear, attributable revenue streams.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;