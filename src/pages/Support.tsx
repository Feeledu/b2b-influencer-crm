import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  Send,
  Search,
  BookOpen,
  Video,
  FileText
} from "lucide-react";

const Support = () => {
  const { user } = useAuth();
  const { isSubscriptionActive, isTrialActive } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [supportData, setSupportData] = useState({
    subject: "",
    message: "",
    priority: "medium",
    category: ""
  });

  const supportCategories = [
    "Account & Billing",
    "Getting Started",
    "Finding Influencers",
    "Campaign Management",
    "ROI Tracking",
    "Technical Issues",
    "Feature Requests",
    "Other"
  ];

  const faqItems = [
    {
      category: "Getting Started",
      question: "How do I find influencers that match my target audience?",
      answer: "Use our discovery filters to search by platform, industry, audience size, and engagement rate. Our AI-powered matching helps you find influencers whose audiences align with your ideal customers."
    },
    {
      category: "Campaign Management",
      question: "How do I create and track a campaign?",
      answer: "Go to the Campaigns page, click 'Create Campaign', add your influencers, and generate UTM links. Track performance through our ROI dashboard with real-time metrics."
    },
    {
      category: "Account & Billing",
      question: "What's included in the free trial?",
      answer: "The 7-day free trial includes unlimited influencer discovery, ability to add up to 5 influencers, create 1 campaign, and access to basic ROI tracking."
    },
    {
      category: "Technical Issues",
      question: "I'm having trouble logging in. What should I do?",
      answer: "Try resetting your password or using Google OAuth. If issues persist, contact our support team with your email address and we'll help you resolve it quickly."
    },
    {
      category: "ROI Tracking",
      question: "How accurate is the ROI tracking?",
      answer: "Our ROI tracking uses UTM parameters and conversion tracking to provide accurate attribution. You can also manually log leads and revenue for comprehensive reporting."
    },
    {
      category: "Feature Requests",
      question: "Can I request new features?",
      answer: "Absolutely! We love hearing from our users. Submit feature requests through this support form or email us directly at feedback@fluencr.com."
    }
  ];

  const filteredFaqs = faqItems.filter(item => 
    searchQuery === "" || 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Support ticket submitted:', supportData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSupportData({
        subject: "",
        message: "",
        priority: "medium",
        category: ""
      });
    }, 3000);
  };

  const getSupportLevel = () => {
    if (isSubscriptionActive) {
      return { level: "Pro", color: "bg-green-100 text-green-800", responseTime: "2-4 hours" };
    } else if (isTrialActive) {
      return { level: "Trial", color: "bg-blue-100 text-blue-800", responseTime: "24 hours" };
    } else {
      return { level: "Free", color: "bg-gray-100 text-gray-800", responseTime: "48 hours" };
    }
  };

  const supportLevel = getSupportLevel();

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <HelpCircle className="h-10 w-10 text-purple-600" />
            Help & Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {user 
              ? `Need help with Fluencr? We're here to support you with your ${isSubscriptionActive ? 'Pro' : isTrialActive ? 'trial' : 'free'} account.`
              : 'Get help with Fluencr and learn how to make the most of our influencer marketing platform.'
            }
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className={supportLevel.color}>
              {supportLevel.level} Support
            </Badge>
            <span className="text-sm text-muted-foreground">
              Response time: {supportLevel.responseTime}
            </span>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search help articles and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{item.question}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="text-sm text-muted-foreground">Try different keywords or browse all FAQs</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Send us a message and we'll get back to you.
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you within {supportLevel.responseTime}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Subject *</label>
                      <Input
                        value={supportData.subject}
                        onChange={(e) => setSupportData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={supportData.category}
                        onChange={(e) => setSupportData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select a category</option>
                        {supportCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select
                        value={supportData.priority}
                        onChange={(e) => setSupportData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need help with feature</option>
                        <option value="high">High - Issue affecting usage</option>
                        <option value="urgent">Urgent - Cannot use the platform</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Message *</label>
                      <Textarea
                        value={supportData.message}
                        onChange={(e) => setSupportData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Please describe your issue in detail..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting || !supportData.subject || !supportData.message}
                    >
                      {isSubmitting ? (
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
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Support Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Get Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@fluencr.com</p>
                    </div>
                  </div>
                  <Badge className={supportLevel.color}>{supportLevel.responseTime}</Badge>
                </div>

                {isSubscriptionActive && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Pro Only</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Video Tutorials</p>
                      <p className="text-sm text-muted-foreground">Learn with step-by-step guides</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Support;
