import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Target, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Star,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';

interface IntentInfluencerCardProps {
  influencer: {
    id: string;
    name: string;
    platform: string;
    followers: number;
    engagement_rate: number;
    // Intent data
    buyer_alignment_score?: number;
    trust_score?: number;
    engagement_quality?: number;
    audience_overlap?: number;
    trust_indicators?: string[];
    intent_signals?: number;
    verified?: boolean;
    // Additional data
    bio?: string;
    topics?: string[];
    location?: string;
    company?: string;
  };
  onAddToList: (influencerId: string) => void;
  onViewDetails: (influencerId: string) => void;
  isAdded?: boolean;
}

const IntentInfluencerCard: React.FC<IntentInfluencerCardProps> = ({
  influencer,
  onAddToList,
  onViewDetails,
  isAdded = false
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-success';
    if (score >= 0.6) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-success/10 border-success/20';
    if (score >= 0.6) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  const getTrustIndicatorIcon = (indicator: string) => {
    switch (indicator) {
      case 'verified': return <CheckCircle2 className="h-3 w-3" />;
      case 'high_engagement': return <TrendingUp className="h-3 w-3" />;
      case 'influential': return <Star className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getTrustIndicatorColor = (indicator: string) => {
    switch (indicator) {
      case 'verified': return 'text-success';
      case 'high_engagement': return 'text-warning';
      case 'influential': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card-glow border-border/50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-bold">{influencer.name}</h3>
              {influencer.verified && (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {influencer.platform} • {influencer.location} • {influencer.company}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {influencer.bio}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(influencer.id)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant={isAdded ? "secondary" : "default"}
              size="sm"
              onClick={() => onAddToList(influencer.id)}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Intent Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Buyer Alignment Score */}
          {influencer.buyer_alignment_score !== undefined && (
            <div className={`p-3 rounded-lg border ${getScoreBgColor(influencer.buyer_alignment_score)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Buyer Alignment</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(influencer.buyer_alignment_score)}`}>
                  {Math.round(influencer.buyer_alignment_score * 100)}%
                </span>
              </div>
              <Progress 
                value={influencer.buyer_alignment_score * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Trust Score */}
          {influencer.trust_score !== undefined && (
            <div className={`p-3 rounded-lg border ${getScoreBgColor(influencer.trust_score)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Trust Score</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(influencer.trust_score)}`}>
                  {Math.round(influencer.trust_score * 100)}%
                </span>
              </div>
              <Progress 
                value={influencer.trust_score * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Engagement Quality */}
          {influencer.engagement_quality !== undefined && (
            <div className={`p-3 rounded-lg border ${getScoreBgColor(influencer.engagement_quality)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Engagement Quality</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(influencer.engagement_quality)}`}>
                  {Math.round(influencer.engagement_quality * 100)}%
                </span>
              </div>
              <Progress 
                value={influencer.engagement_quality * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Audience Overlap */}
          {influencer.audience_overlap !== undefined && (
            <div className="p-3 rounded-lg border bg-primary/10 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Audience Overlap</span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {Math.round(influencer.audience_overlap)}%
                </span>
              </div>
              <Progress 
                value={influencer.audience_overlap} 
                className="h-2"
              />
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        {influencer.trust_indicators && influencer.trust_indicators.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Trust Indicators</span>
            <div className="flex flex-wrap gap-2">
              {influencer.trust_indicators.map((indicator, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`flex items-center gap-1 ${getTrustIndicatorColor(indicator)}`}
                >
                  {getTrustIndicatorIcon(indicator)}
                  {indicator.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {influencer.topics && influencer.topics.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Topics</span>
            <div className="flex flex-wrap gap-1">
              {influencer.topics.slice(0, 5).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {influencer.topics.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{influencer.topics.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground w-full whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-medium text-purple-600">{influencer.platform}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{formatNumber(influencer.followers)} followers</span>
              <span>{influencer.engagement_rate}% engagement</span>
              {influencer.intent_signals && (
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {influencer.intent_signals} signals
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IntentInfluencerCard;
