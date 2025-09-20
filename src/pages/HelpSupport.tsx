import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  BookOpen, 
  Video, 
  FileText, 
  Search,
  Send,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqItems = [
    {
      question: "How do I add influencers to my list?",
      answer: "Navigate to the Discover page, search for influencers, and click the 'Add' button on any influencer card. They'll be added to your 'My Influencers' list.",
      category: "Getting Started"
    },
    {
      question: "How do I create a new campaign?",
      answer: "Go to the Campaigns page and click 'New Campaign'. Fill in the campaign details, assign influencers, and set your budget and timeline.",
      category: "Campaigns"
    },
    {
      question: "How do I track campaign performance?",
      answer: "Visit the Campaigns page to see detailed metrics including reach, engagement, and ROI. Each campaign shows real-time performance data.",
      category: "Analytics"
    },
    {
      question: "Can I export my data?",
      answer: "Yes! Go to Settings > Account Actions and click 'Export Data' to download your influencer lists, campaigns, and reports.",
      category: "Data"
    },
    {
      question: "How do I upgrade my subscription?",
      answer: "Visit the Billing page to view your current plan and upgrade options. You can change your subscription at any time.",
      category: "Billing"
    },
    {
      question: "What is audience alignment?",
      answer: "Audience alignment shows how well an influencer's audience matches your target customers based on job titles, industries, and company size.",
      category: "Features"
    }
  ];

  const supportChannels = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      action: "support@fluencr.com",
      responseTime: "24 hours"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: MessageCircle,
      action: "Start Chat",
      responseTime: "5 minutes"
    },
    {
      title: "Documentation",
      description: "Browse our comprehensive guides",
      icon: BookOpen,
      action: "View Docs",
      responseTime: "Instant"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      action: "Watch Videos",
      responseTime: "Instant"
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement contact form submission
      console.log('Contact form submitted:', contactForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContactForm({ subject: '', message: '', priority: 'medium' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const filteredFaqs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-3">
                  <channel.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{channel.title}</h3>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 mr-2"
                    onClick={() => {
                      if (channel.title === "Email Support") {
                        window.open('mailto:support@fluencr.com', '_blank');
                      } else if (channel.title === "Live Chat") {
                        // Live chat is coming soon! For now, please use email support.
                      } else if (channel.title === "Documentation") {
                        window.open('https://docs.fluencr.com', '_blank');
                      } else if (channel.title === "Video Tutorials") {
                        window.open('https://youtube.com/fluencr', '_blank');
                      }
                    }}
                  >
                    {channel.action}
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    {channel.responseTime}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFaqs.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{item.question}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Feature request</option>
                    <option value="high">High - Bug or urgent issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe your issue or question in detail..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Access helpful resources and documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start"
                onClick={() => window.open('https://docs.fluencr.com/user-guide', '_blank')}
              >
                <FileText className="h-5 w-5 mb-2" />
                <span className="font-medium">User Guide</span>
                <span className="text-xs text-muted-foreground">Complete platform guide</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start"
                onClick={() => window.open('https://youtube.com/fluencr', '_blank')}
              >
                <Video className="h-5 w-5 mb-2" />
                <span className="font-medium">Video Tutorials</span>
                <span className="text-xs text-muted-foreground">Step-by-step videos</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start"
                onClick={() => window.open('https://docs.fluencr.com/api', '_blank')}
              >
                <ExternalLink className="h-5 w-5 mb-2" />
                <span className="font-medium">API Documentation</span>
                <span className="text-xs text-muted-foreground">Developer resources</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HelpSupport;
