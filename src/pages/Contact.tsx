import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  Send,
  Calendar,
  Users,
  Target,
  TrendingUp,
  HelpCircle,
  Star,
  ArrowRight,
  Zap,
  Shield,
  HeadphonesIcon
} from "lucide-react";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isSubscriptionActive, isTrialActive } = useSubscription();
  const [activeTab, setActiveTab] = useState("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Set initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['contact', 'demo', 'support', 'enterprise'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Pre-fill form for enterprise users
  useEffect(() => {
    if (activeTab === 'enterprise') {
      setFormData(prev => ({
        ...prev,
        useCase: 'Enterprise Solutions',
        budget: '€25,000+/month',
        timeline: 'Within 1 month',
        interestedFeatures: [
          'Team Collaboration',
          'API Access',
          'Advanced Analytics',
          'Unlimited AI Credits'
        ]
      }));
    }
  }, [activeTab]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    companySize: "",
    industry: "",
    useCase: "",
    message: "",
    budget: "",
    timeline: "",
    preferredContact: "email",
    interestedFeatures: [] as string[]
  });

  const companySizes = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-1000 employees",
    "1000+ employees"
  ];

  const industries = [
    "SaaS",
    "E-commerce",
    "Fintech",
    "Healthcare",
    "Education",
    "Real Estate",
    "Marketing Agency",
    "Consulting",
    "Other"
  ];

  const useCases = [
    "B2B Influencer Marketing",
    "Lead Generation",
    "Brand Awareness",
    "Content Marketing",
    "Partnership Development",
    "Sales Enablement",
    "Market Research",
    "Other"
  ];

  const budgets = [
    "Under €1,000/month",
    "€1,000 - €5,000/month",
    "€5,000 - €10,000/month",
    "€10,000 - €25,000/month",
    "€25,000+/month",
    "Not sure yet"
  ];

  const timelines = [
    "Immediately",
    "Within 1 month",
    "Within 3 months",
    "Within 6 months",
    "Just exploring"
  ];

  const features = [
    "Influencer Discovery",
    "CRM Workspace",
    "Campaign Management",
    "ROI Tracking",
    "AI Message Generation",
    "Team Collaboration",
    "API Access",
    "Advanced Analytics"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      interestedFeatures: prev.interestedFeatures.includes(feature)
        ? prev.interestedFeatures.filter(f => f !== feature)
        : [...prev.interestedFeatures, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form submitted:', formData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        role: "",
        phone: "",
        companySize: "",
        industry: "",
        useCase: "",
        message: "",
        budget: "",
        timeline: "",
        preferredContact: "email",
        interestedFeatures: []
      });
    }, 3000);
  };

  const handleScheduleDemo = () => {
    // In a real app, this would open a calendar booking widget
    window.open('https://calendly.com/fluencr/demo', '_blank');
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <MessageSquare className="h-10 w-10 text-purple-600" />
            {activeTab === 'enterprise' ? 'Enterprise Solutions' : 'Get in Touch'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {activeTab === 'enterprise' 
              ? 'Ready for enterprise-grade influencer marketing? Let\'s discuss custom solutions for your large team or agency.'
              : user 
                ? (isSubscriptionActive 
                    ? 'Need help with your Fluencr Pro account? We\'re here to support you.'
                    : isTrialActive
                      ? 'Questions about your free trial? Let us help you get the most out of Fluencr.'
                      : 'Ready to upgrade? Let\'s discuss the best plan for your needs.'
                  )
                : 'Ready to transform your B2B influencer marketing? Let\'s discuss how Fluencr can help you find, connect with, and measure ROI from the right influencers.'
            }
          </p>
        </div>

        {/* Enterprise Banner */}
        {activeTab === 'enterprise' && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900">Enterprise Solutions</h3>
                    <p className="text-purple-700">
                      Custom pricing, dedicated support, and advanced features for large teams and agencies.
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
                  Starting at €220/month
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Find the Right Influencers</h3>
            <p className="text-sm text-muted-foreground">
              Discover B2B influencers across LinkedIn, podcasts, YouTube, and newsletters with audiences that match yours.
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Build Relationships</h3>
            <p className="text-sm text-muted-foreground">
              Manage your influencer relationships with our CRM workspace and track every interaction.
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Measure ROI</h3>
            <p className="text-sm text-muted-foreground">
              Track leads, demos, and revenue from every campaign with detailed ROI analytics.
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${user ? 'grid-cols-3' : 'grid-cols-4'}`}>
            <TabsTrigger value="contact">
              {user ? 'Contact Us' : 'Get Started'}
            </TabsTrigger>
            <TabsTrigger value="demo">Schedule Demo</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            {!user && <TabsTrigger value="enterprise">Enterprise</TabsTrigger>}
          </TabsList>

          {/* Contact Form Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for your message. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name *</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email *</label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Company *</label>
                          <Input
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Your company name"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Role</label>
                          <Input
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            placeholder="e.g., Marketing Manager"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <Input
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Company Size</label>
                          <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizes.map((size) => (
                                <SelectItem key={size} value={size}>{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Industry</label>
                          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Primary Use Case</label>
                          <Select value={formData.useCase} onValueChange={(value) => handleInputChange('useCase', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select use case" />
                            </SelectTrigger>
                            <SelectContent>
                              {useCases.map((useCase) => (
                                <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Budget Range</label>
                          <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgets.map((budget) => (
                                <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Timeline</label>
                          <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              {timelines.map((timeline) => (
                                <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Interested Features</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {features.map((feature) => (
                            <div
                              key={feature}
                              className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                                formData.interestedFeatures.includes(feature)
                                  ? 'bg-purple-50 border-purple-200'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                              onClick={() => handleFeatureToggle(feature)}
                            >
                              <input
                                type="checkbox"
                                checked={formData.interestedFeatures.includes(feature)}
                                onChange={() => handleFeatureToggle(feature)}
                                className="rounded"
                              />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Message *</label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell us about your influencer marketing goals and how we can help..."
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Preferred Contact Method</label>
                        <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="video">Video Call</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.company || !formData.message}
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

              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">hello@fluencr.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-sm text-muted-foreground">Within 24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Why Choose Fluencr?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">AI-Powered Discovery</p>
                        <p className="text-xs text-muted-foreground">Find the perfect influencers with our advanced matching algorithm</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Enterprise Security</p>
                        <p className="text-xs text-muted-foreground">SOC 2 compliant with enterprise-grade security</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <HeadphonesIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Dedicated Support</p>
                        <p className="text-xs text-muted-foreground">24/7 support with dedicated account managers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule a Demo
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Book a personalized demo to see how Fluencr can transform your influencer marketing.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">What you'll see:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Live influencer discovery and filtering
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        CRM workspace and relationship management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Campaign creation and ROI tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        AI-powered message generation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Advanced analytics and reporting
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={handleScheduleDemo}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Demo Now
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Demo takes 30 minutes • No commitment required
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demo Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">Monday - Friday</p>
                        <p className="text-sm text-green-700">9:00 AM - 6:00 PM CET</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Weekends</p>
                        <p className="text-sm text-gray-700">By appointment only</p>
                      </div>
                      <Badge variant="secondary">Limited</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Demo Format</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Live screen sharing via Zoom/Teams</p>
                      <p>• Interactive Q&A throughout</p>
                      <p>• Customized to your use case</p>
                      <p>• Follow-up resources provided</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Help Center
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">Getting Started Guide</h4>
                      <p className="text-sm text-muted-foreground">Learn how to set up your first campaign</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">Finding Influencers</h4>
                      <p className="text-sm text-muted-foreground">Tips for discovering the right influencers</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">ROI Tracking</h4>
                      <p className="text-sm text-muted-foreground">How to measure campaign success</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">API Documentation</h4>
                      <p className="text-sm text-muted-foreground">Integrate Fluencr with your tools</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Support Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email Support</p>
                          <p className="text-sm text-muted-foreground">support@fluencr.com</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">24/7</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Live Chat</p>
                          <p className="text-sm text-muted-foreground">Available in app</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Mon-Fri</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone Support</p>
                          <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enterprise Tab */}
          <TabsContent value="enterprise" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Shield className="h-6 w-6" />
                  Enterprise Solutions
                </CardTitle>
                <p className="text-purple-600">
                  Custom solutions for large teams and agencies with advanced security, compliance, and support.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Enterprise Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Unlimited AI credits
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Multi-user collaboration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Advanced analytics & forecasting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        API access & integrations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Dedicated account manager
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Custom onboarding & training
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Security & Compliance</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        SOC 2 Type II certified
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        GDPR compliant
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        SSO integration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Data encryption at rest & in transit
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Audit logs & compliance reporting
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleScheduleDemo}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Enterprise Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open('mailto:enterprise@fluencr.com', '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Sales
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Starting at €220/month • Custom pricing available for large teams
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Contact;
