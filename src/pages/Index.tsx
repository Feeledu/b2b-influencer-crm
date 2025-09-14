import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation for Landing */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary"></div>
            <span className="font-bold text-xl">InfluenceHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />
    </div>
  );
};

export default Index;
