import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Target, 
  Users, 
  TrendingUp, 
  Shield,
  X,
  Check
} from 'lucide-react';

interface IntentSearchFiltersProps {
  onFiltersChange: (filters: IntentFilters) => void;
  onSearch: (query: string) => void;
}

export interface IntentFilters {
  minAlignmentScore: number;
  minTrustScore: number;
  minEngagementQuality: number;
  platforms: string[];
  audienceSize: {
    min: number;
    max: number;
  };
  verifiedOnly: boolean;
  highIntentOnly: boolean;
}

const IntentSearchFilters: React.FC<IntentSearchFiltersProps> = ({ 
  onFiltersChange, 
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<IntentFilters>({
    minAlignmentScore: 0.7,
    minTrustScore: 0.6,
    minEngagementQuality: 0.5,
    platforms: ['linkedin', 'twitter', 'newsletter', 'podcast'],
    audienceSize: { min: 1000, max: 1000000 },
    verifiedOnly: false,
    highIntentOnly: true
  });

  const platformOptions = [
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'newsletter', label: 'Newsletter', icon: '📧' },
    { value: 'podcast', label: 'Podcast', icon: '🎧' }
  ];

  const handleFilterChange = (key: keyof IntentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    handleFilterChange('platforms', newPlatforms);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const clearFilters = () => {
    const defaultFilters: IntentFilters = {
      minAlignmentScore: 0.7,
      minTrustScore: 0.6,
      minEngagementQuality: 0.5,
      platforms: ['linkedin', 'twitter', 'newsletter', 'podcast'],
      audienceSize: { min: 1000, max: 1000000 },
      verifiedOnly: false,
      highIntentOnly: true
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search influencers by name, topic, or audience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="bg-gradient-to-r from-primary to-secondary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.verifiedOnly ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('verifiedOnly', !filters.verifiedOnly)}
          >
            <Shield className="h-3 w-3 mr-1" />
            Verified Only
          </Button>
          <Button
            variant={filters.highIntentOnly ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('highIntentOnly', !filters.highIntentOnly)}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            High Intent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-3 w-3 mr-1" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t border-border">
            {/* Buyer Alignment Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Buyer Alignment Score
                </Label>
                <Badge variant="secondary">
                  {Math.round(filters.minAlignmentScore * 100)}%
                </Badge>
              </div>
              <Slider
                value={[filters.minAlignmentScore]}
                onValueChange={([value]) => handleFilterChange('minAlignmentScore', value)}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0% (Low)</span>
                <span>100% (High)</span>
              </div>
            </div>

            {/* Trust Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Trust Score
                </Label>
                <Badge variant="secondary">
                  {Math.round(filters.minTrustScore * 100)}%
                </Badge>
              </div>
              <Slider
                value={[filters.minTrustScore]}
                onValueChange={([value]) => handleFilterChange('minTrustScore', value)}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0% (Low)</span>
                <span>100% (High)</span>
              </div>
            </div>

            {/* Engagement Quality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Engagement Quality
                </Label>
                <Badge variant="secondary">
                  {Math.round(filters.minEngagementQuality * 100)}%
                </Badge>
              </div>
              <Slider
                value={[filters.minEngagementQuality]}
                onValueChange={([value]) => handleFilterChange('minEngagementQuality', value)}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0% (Low)</span>
                <span>100% (High)</span>
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Platforms
              </Label>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((platform) => (
                  <Button
                    key={platform.value}
                    variant={filters.platforms.includes(platform.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePlatformToggle(platform.value)}
                    className="flex items-center gap-2"
                  >
                    <span>{platform.icon}</span>
                    {platform.label}
                    {filters.platforms.includes(platform.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Audience Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Audience Size Range</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Min Followers</Label>
                  <Input
                    type="number"
                    value={filters.audienceSize.min}
                    onChange={(e) => handleFilterChange('audienceSize', {
                      ...filters.audienceSize,
                      min: parseInt(e.target.value) || 0
                    })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Followers</Label>
                  <Input
                    type="number"
                    value={filters.audienceSize.max}
                    onChange={(e) => handleFilterChange('audienceSize', {
                      ...filters.audienceSize,
                      max: parseInt(e.target.value) || 1000000
                    })}
                    placeholder="1000000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default IntentSearchFilters;
