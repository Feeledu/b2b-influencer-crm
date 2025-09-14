import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, BarChart3, Target } from "lucide-react";
import heroImage from "@/assets/hero-network.jpg";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="relative px-6 py-24 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            B2B Influencer CRM
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            Discover, track, and measure ROI from LinkedIn creators, podcast hosts, and newsletter writers. 
            Turn dark social into measurable pipeline growth.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="text-base px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Card className="p-6 text-center border-0 bg-card/50 backdrop-blur hover:bg-card-hover transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Discovery</h3>
            <p className="text-muted-foreground">
              Find the right B2B influencers across LinkedIn, podcasts, and newsletters with AI-powered search.
            </p>
          </Card>

          <Card className="p-6 text-center border-0 bg-card/50 backdrop-blur hover:bg-card-hover transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Relationship Management</h3>
            <p className="text-muted-foreground">
              Track interactions, manage partnerships, and nurture relationships in one centralized workspace.
            </p>
          </Card>

          <Card className="p-6 text-center border-0 bg-card/50 backdrop-blur hover:bg-card-hover transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">ROI Tracking</h3>
            <p className="text-muted-foreground">
              Measure campaign performance, track attribution, and prove the impact of influencer partnerships.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;