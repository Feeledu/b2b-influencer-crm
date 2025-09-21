import MainLayout from "@/components/MainLayout";
import DeveloperPanel from "@/components/DeveloperPanel";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkAITrialEligibility, generateAIMessageWithTrial, adminResetTrials, setPremiumMode, forceResetTrials, type AIGenerationRequest } from "@/lib/premiumAIService";
import { apiService } from "@/lib/api";
import type { Influencer } from "@/lib/api";
import { 
  ArrowLeft, 
  Send, 
  Mail, 
  Calendar, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  User,
  ExternalLink,
  Copy,
  Save,
  Sparkles,
  Loader2,
  MessageCircle
} from "lucide-react";

const ContactInfluencer = () => {
  const { influencerId } = useParams();
  const navigate = useNavigate();
  const { updateSubscription, isTrialActive, daysRemaining } = useSubscription();
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [trialInfo, setTrialInfo] = useState({ remainingTrials: 0, isPremium: false });
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load trial info on component mount
  useEffect(() => {
    const trial = checkAITrialEligibility();
    setTrialInfo(trial);
  }, []);

  // Fetch influencer data when component mounts or influencerId changes
  useEffect(() => {
    const fetchInfluencer = async () => {
      if (!influencerId) {
        setError("No influencer ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const influencerData = await apiService.getInfluencerById(influencerId);
        setInfluencer(influencerData);
      } catch (err) {
        console.error("Error fetching influencer:", err);
        setError(err instanceof Error ? err.message : "Failed to load influencer");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencer();
  }, [influencerId]);

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
    followUpDate: "",
    notes: ""
  });

  // Helper function to get display values with fallbacks
  const getDisplayValue = (value: any, fallback: string = "N/A") => {
    return value || fallback;
  };

  // Email templates
  const templates = [
    {
      id: "partnership",
      name: "Partnership Inquiry",
      subject: "Partnership Opportunity - {{influencerName}}",
      message: `Hi {{influencerName}},

I hope this message finds you well. I've been following your content on {{platform}} and I'm impressed by your insights on {{industry}}.

I'm reaching out because I believe there's a great opportunity for us to collaborate. We're looking to partner with thought leaders in the {{industry}} space, and your expertise would be a perfect fit.

Would you be interested in a brief call to discuss potential collaboration opportunities?

Best regards,
[Your Name]`
    },
    {
      id: "followup",
      name: "Follow-up",
      subject: "Following up on our conversation - {{influencerName}}",
      message: `Hi {{influencerName}},

I wanted to follow up on our previous conversation about potential collaboration opportunities.

I understand you're busy, but I'd love to continue the discussion when you have a moment. Would you be available for a quick call this week?

Looking forward to hearing from you.

Best regards,
[Your Name]`
    },
    {
      id: "content_collaboration",
      name: "Content Collaboration",
      subject: "Content Collaboration Opportunity - {{influencerName}}",
      message: `Hi {{influencerName}},

I've been following your excellent content on {{platform}} and I'm particularly impressed by your recent posts about {{industry}}.

We're working on some exciting projects in the {{industry}} space and would love to collaborate with you on content creation. This could include:

- Guest posts on our blog
- Joint webinars or podcasts
- Social media collaborations
- Speaking opportunities

Would you be interested in learning more about these opportunities?

Best regards,
[Your Name]`
    },
    {
      id: "event_invitation",
      name: "Event Invitation",
      subject: "Invitation to {{eventName}} - {{influencerName}}",
      message: `Hi {{influencerName}},

I hope you're doing well. I wanted to personally invite you to {{eventName}}, an exclusive event for {{industry}} professionals.

The event will feature:
- Keynote speakers from top {{industry}} companies
- Networking opportunities with industry leaders
- Panel discussions on the latest trends

Given your expertise in {{industry}}, I believe you would be a valuable addition to our community.

Would you be interested in attending? I'd be happy to provide more details.

Best regards,
[Your Name]`
    }
  ];

  // Conversation history (mock data)
  const conversationHistory = [
    {
      id: 1,
      type: "sent",
      subject: "Partnership Opportunity - John Doe",
      message: "Hi John, I hope this message finds you well...",
      date: "2024-01-15",
      status: "delivered",
      followUpDate: "2024-01-22"
    },
    {
      id: 2,
      type: "received",
      subject: "Re: Partnership Opportunity",
      message: "Hi [Your Name], thanks for reaching out. I'm interested in learning more...",
      date: "2024-01-16",
      status: "read"
    },
    {
      id: 3,
      type: "sent",
      subject: "Following up on our conversation",
      message: "Hi John, I wanted to follow up on our previous conversation...",
      date: "2024-01-20",
      status: "delivered",
      followUpDate: "2024-01-27"
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFormData(prev => ({
        ...prev,
        subject: template.subject.replace('{{influencerName}}', influencer.name),
        message: template.message
          .replace(/{{influencerName}}/g, influencer.name)
          .replace(/{{platform}}/g, influencer.platform)
          .replace(/{{industry}}/g, influencer.industry)
      }));
    }
  };

  const handleGenerateAIMessage = async () => {
    if (!aiPrompt.trim()) return;
    
    // Check trial eligibility
    if (!trialInfo.isPremium && trialInfo.remainingTrials <= 0) {
      alert('No AI trials remaining. Upgrade to premium for unlimited AI message generation.');
      return;
    }
    
    setIsGeneratingAI(true);
    
    try {
      const request: AIGenerationRequest = {
        prompt: aiPrompt,
        influencerName: influencer.name,
        platform: influencer.platform,
        industry: influencer.industry,
        context: `Influencer has ${influencer.followers.toLocaleString()} followers and ${influencer.engagement_rate}% engagement rate`
      };
      
      const aiResponse = await generateAIMessageWithTrial(request);
      
      setFormData(prev => ({
        ...prev,
        subject: aiResponse.subject,
        message: aiResponse.message
      }));
      
      // Update trial info
      if (aiResponse.trialInfo) {
        setTrialInfo(aiResponse.trialInfo);
      }
      
      setAiPrompt(""); // Clear the prompt
    } catch (error) {
      console.error('Error generating AI message:', error);
      alert('Failed to generate AI message. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };


  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log the conversation
    console.log('Sending message:', formData);
    
    setIsSending(false);
    setIsSaved(true);
    
    // Reset form
    setFormData({
      subject: "",
      message: "",
      priority: "medium",
      followUpDate: "",
      notes: ""
    });
    
    // Show success message
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveDraft = () => {
    // Save draft to localStorage or backend
    console.log('Saving draft:', formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could show a toast notification here
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
                    {daysRemaining} days remaining in your free trial. Upgrade to Fluencr Pro to unlock AI message generation and advanced features.
                  </p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                onClick={() => navigate('/billing')}
              >
                Upgrade Now
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading influencer details...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold text-destructive">Error Loading Influencer</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/influencers')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Influencers
              </Button>
            </div>
          </div>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!isLoading && !error && influencer && (
          <>
            {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/influencers')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Influencers
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <MessageCircle className="h-7 w-7 text-purple-600" />
                Contact {influencer.name}
              </h1>
              <p className="text-muted-foreground">
                {getDisplayValue(influencer.platform)} • {influencer.audience_size?.toLocaleString() || "N/A"} followers • {influencer.engagement_rate || "N/A"}% engagement
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Open influencer's platform profile in a new tab
                let profileUrl = '';
                const handle = influencer.handle?.replace('@', '') || '';
                
                switch (influencer.platform?.toLowerCase()) {
                  case 'linkedin':
                    profileUrl = influencer.linkedin_url || `https://linkedin.com/in/${handle}`;
                    break;
                  case 'twitter':
                    profileUrl = influencer.twitter_url || `https://twitter.com/${handle}`;
                    break;
                  case 'youtube':
                    profileUrl = `https://youtube.com/@${handle}`;
                    break;
                  case 'newsletter':
                    // For newsletters, try common platforms
                    if (handle.includes('substack')) {
                      profileUrl = `https://${handle}.substack.com`;
                    } else if (handle.includes('beehiiv')) {
                      profileUrl = `https://${handle}.beehiiv.com`;
                    } else {
                      profileUrl = `https://${handle}`;
                    }
                    break;
                  case 'podcast':
                    // For podcasts, try common platforms
                    if (handle.includes('spotify')) {
                      profileUrl = `https://open.spotify.com/show/${handle}`;
                    } else if (handle.includes('apple')) {
                      profileUrl = `https://podcasts.apple.com/podcast/${handle}`;
                    } else {
                      profileUrl = `https://${handle}`;
                    }
                    break;
                  default:
                    // Fallback to website if available
                    profileUrl = influencer.website_url || influencer.website || '#';
                }
                
                if (profileUrl !== '#') {
                  window.open(profileUrl, '_blank');
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </div>
        </div>

        {/* Influencer Info Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {influencer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{influencer.name}</h3>
                <p className="text-sm text-muted-foreground">{getDisplayValue(influencer.bio, "No bio available")}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>{getDisplayValue(influencer.handle, "No handle")}</span>
                  {influencer.email && (
                    <>
                      <span>•</span>
                      <span>{influencer.email}</span>
                    </>
                  )}
                  {(influencer.website_url || influencer.website) && (
                    <>
                      <span>•</span>
                      <span>{influencer.website_url || influencer.website}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Conversation History</TabsTrigger>
          </TabsList>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6">
            {/* AI Message Generation - Premium Feature */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="h-5 w-5" />
                  AI Message Generator
                  <Badge variant="secondary" className="ml-2">
                    {trialInfo.isPremium ? 'Premium' : `${trialInfo.remainingTrials} trials left`}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-purple-600">
                  Let AI craft professional, personalized messages for you. {trialInfo.isPremium ? 'Unlimited usage included.' : '5 free trials included.'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., I want to propose a content collaboration about SaaS growth strategies..."
                    className="flex-1"
                    disabled={!trialInfo.isPremium && trialInfo.remainingTrials <= 0}
                  />
                  <Button 
                    onClick={handleGenerateAIMessage}
                    disabled={!aiPrompt.trim() || isGeneratingAI || (!trialInfo.isPremium && trialInfo.remainingTrials <= 0)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-xs text-purple-600">
                  {trialInfo.isPremium ? (
                    '✨ Premium user - unlimited AI generation'
                  ) : trialInfo.remainingTrials > 0 ? (
                    `💡 ${trialInfo.remainingTrials} trials remaining. Upgrade for unlimited usage.`
                  ) : (
                    '🚀 No trials remaining. Upgrade to premium for unlimited AI generation.'
                  )}
                </div>
                {!trialInfo.isPremium && trialInfo.remainingTrials <= 0 && (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                      onClick={() => navigate('/billing')}
                    >
                      Upgrade Now
                    </Button>
                    {/* Secret admin reset button - only visible to admins */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs text-purple-500 hover:text-purple-700"
                      onClick={() => {
                        adminResetTrials();
                        // Refresh trial info
                        const trial = checkAITrialEligibility();
                        setTrialInfo(trial);
                      }}
                    >
                      🔄 Admin: Reset Trials
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Compose Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter subject line"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Write your message here..."
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Follow-up Date (Optional)</label>
                    <Input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <Input
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Internal notes about this message"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleSaveDraft}
                      disabled={!formData.subject || !formData.message}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    {isSaved && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Saved!
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => copyToClipboard(formData.message)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      onClick={handleSend}
                      disabled={!formData.subject || !formData.message || isSending}
                    >
                      {isSending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose a template to get started, then customize it for your needs.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline">Template</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {template.message.substring(0, 100)}...
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversation History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversationHistory.map((message) => (
                    <div 
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.type === 'sent' 
                          ? 'bg-blue-50 border-blue-200 ml-8' 
                          : 'bg-gray-50 border-gray-200 mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={message.type === 'sent' ? 'default' : 'secondary'}
                          >
                            {message.type === 'sent' ? 'Sent' : 'Received'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {message.status === 'delivered' && (
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Delivered
                            </div>
                          )}
                          {message.followUpDate && (
                            <div className="flex items-center text-orange-600 text-sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              Follow-up: {new Date(message.followUpDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{message.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {message.message.substring(0, 200)}...
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
          </>
        )}

        <DeveloperPanel />
      </div>
    </MainLayout>
  );
};

export default ContactInfluencer;
