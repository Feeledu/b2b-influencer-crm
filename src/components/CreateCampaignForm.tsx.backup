import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Save, Copy, Link, Users } from 'lucide-react';

interface CreateCampaignFormProps {
  onSave: (campaign: any) => void;
  onCancel: () => void;
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    goals: '',
    websiteUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: ''
  });

  const [assignedInfluencers, setAssignedInfluencers] = useState<string[]>([]);
  const [generatedUtm, setGeneratedUtm] = useState('');

  // Mock influencers for assignment
  const availableInfluencers = [
    { id: '1', name: 'John Doe', platform: 'LinkedIn', followers: '15K' },
    { id: '2', name: 'Sarah Chen', platform: 'Twitter', followers: '8.5K' },
    { id: '3', name: 'Mike Rodriguez', platform: 'Newsletter', followers: '12K' },
    { id: '4', name: 'Alex Kim', platform: 'Podcast', followers: '25K' },
    { id: '5', name: 'Emma Wilson', platform: 'LinkedIn', followers: '18K' },
    { id: '6', name: 'David Park', platform: 'Newsletter', followers: '9.5K' }
  ];

  const generateUtmLink = () => {
    if (!formData.websiteUrl || !formData.utmSource || !formData.utmMedium || !formData.utmCampaign) {
      return;
    }
    
    const baseUrl = formData.websiteUrl.includes('://') ? formData.websiteUrl : `https://${formData.websiteUrl}`;
    const utmParams = new URLSearchParams({
      utm_source: formData.utmSource,
      utm_medium: formData.utmMedium,
      utm_campaign: formData.utmCampaign,
      utm_content: formData.name.replace(/\s+/g, '_').toLowerCase()
    });
    
    const utmLink = `${baseUrl}?${utmParams.toString()}`;
    setGeneratedUtm(utmLink);
  };

  const copyUtmLink = () => {
    navigator.clipboard.writeText(generatedUtm);
  };

  const toggleInfluencer = (influencerId: string) => {
    setAssignedInfluencers(prev => 
      prev.includes(influencerId) 
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create campaign object
    const campaign = {
      id: Date.now(), // Simple ID generation
      name: formData.name,
      description: formData.description,
      status: "Planning",
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: `$${parseInt(formData.budget || '0').toLocaleString()}`,
      spent: "$0",
      influencers: assignedInfluencers.length,
      leads: 0,
      demos: 0,
      revenue: "$0",
      roi: "-",
      progress: 0,
      utmLink: generatedUtm,
      assignedInfluencers: assignedInfluencers.map(id => 
        availableInfluencers.find(inf => inf.id === id)
      ).filter(Boolean)
    };

    onSave(campaign);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Create New Campaign</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Campaign Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Q4 SaaS Podcast Outreach"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Budget</label>
            <Input
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="25000"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your campaign goals and strategy..."
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Start Date</label>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">End Date</label>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Audience</label>
            <Input
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              placeholder="e.g., SaaS founders, CTOs"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Goals</label>
            <Input
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="e.g., Brand awareness, Lead generation"
            />
          </div>
        </div>

        {/* UTM Link Generation */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <Link className="h-5 w-5" />
            UTM Link Generation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Website URL</label>
              <Input
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">UTM Source</label>
              <Input
                name="utmSource"
                value={formData.utmSource}
                onChange={handleChange}
                placeholder="e.g., influencer, newsletter"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">UTM Medium</label>
              <Input
                name="utmMedium"
                value={formData.utmMedium}
                onChange={handleChange}
                placeholder="e.g., social, email, podcast"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">UTM Campaign</label>
              <Input
                name="utmCampaign"
                value={formData.utmCampaign}
                onChange={handleChange}
                placeholder="e.g., q4-launch, brand-awareness"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={generateUtmLink} variant="outline">
              Generate UTM Link
            </Button>
            {generatedUtm && (
              <Button type="button" onClick={copyUtmLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
          {generatedUtm && (
            <div className="p-3 bg-white rounded border">
              <p className="text-sm text-gray-600 mb-2">Generated UTM Link:</p>
              <p className="text-xs font-mono break-all text-blue-600">{generatedUtm}</p>
            </div>
          )}
        </div>

        {/* Influencer Assignment */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Influencers ({assignedInfluencers.length} selected)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableInfluencers.map((influencer) => (
              <div
                key={influencer.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  assignedInfluencers.includes(influencer.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleInfluencer(influencer.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{influencer.name}</h5>
                    <p className="text-sm text-gray-600">{influencer.platform} • {influencer.followers}</p>
                  </div>
                  {assignedInfluencers.includes(influencer.id) && (
                    <Badge variant="default" className="text-xs">Selected</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
            <Save className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateCampaignForm;
