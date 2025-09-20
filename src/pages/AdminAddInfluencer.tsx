import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Save, 
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InfluencerFormData {
  name: string;
  platform: string;
  handle: string;
  bio: string;
  website_url: string;
  email: string;
  linkedin_url: string;
  twitter_url: string;
  industry: string;
  audience_size: string;
  engagement_rate: string;
  location: string;
  expertise_tags: string[];
  is_verified: boolean;
}

const AdminAddInfluencer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InfluencerFormData>({
    name: '',
    platform: 'LinkedIn',
    handle: '',
    bio: '',
    website_url: '',
    email: '',
    linkedin_url: '',
    twitter_url: '',
    industry: '',
    audience_size: '',
    engagement_rate: '',
    location: '',
    expertise_tags: [],
    is_verified: false
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const platforms = ['LinkedIn', 'Twitter', 'YouTube', 'Instagram', 'TikTok', 'Newsletter', 'Podcast'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Sales', 'Design', 'Other'];

  const handleInputChange = (field: keyof InfluencerFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.expertise_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise_tags: [...prev.expertise_tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      expertise_tags: prev.expertise_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.platform) {
      newErrors.platform = 'Platform is required';
    }

    if (!formData.handle.trim()) {
      newErrors.handle = 'Handle is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.audience_size && isNaN(Number(formData.audience_size))) {
      newErrors.audience_size = 'Audience size must be a number';
    }

    if (formData.engagement_rate && (isNaN(Number(formData.engagement_rate)) || Number(formData.engagement_rate) < 0 || Number(formData.engagement_rate) > 100)) {
      newErrors.engagement_rate = 'Engagement rate must be a number between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/admin/influencers');
      }, 2000);
    } catch (error) {
      console.error('Error creating influencer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-900 mb-2">Influencer Added Successfully!</h2>
              <p className="text-green-700 mb-4">
                The influencer has been added to the database and is ready for verification.
              </p>
              <Button onClick={() => navigate('/admin/influencers')}>
                View All Influencers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/influencers')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Influencers
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Influencer</h1>
            <p className="text-gray-600">Manually add a new influencer to the database</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential details about the influencer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="platform">Platform *</Label>
                  <select
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  {errors.platform && (
                    <p className="text-sm text-red-600 mt-1">{errors.platform}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="handle">Handle *</Label>
                  <Input
                    id="handle"
                    value={formData.handle}
                    onChange={(e) => handleInputChange('handle', e.target.value)}
                    placeholder="@username or handle"
                    className={errors.handle ? 'border-red-500' : ''}
                  />
                  {errors.handle && (
                    <p className="text-sm text-red-600 mt-1">{errors.handle}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Brief description or bio"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact & Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Metrics</CardTitle>
                <CardDescription>
                  Contact information and audience metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website_url">Website</Label>
                  <Input
                    id="website_url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_url">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audience_size">Audience Size</Label>
                    <Input
                      id="audience_size"
                      type="number"
                      value={formData.audience_size}
                      onChange={(e) => handleInputChange('audience_size', e.target.value)}
                      placeholder="10000"
                      className={errors.audience_size ? 'border-red-500' : ''}
                    />
                    {errors.audience_size && (
                      <p className="text-sm text-red-600 mt-1">{errors.audience_size}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="engagement_rate">Engagement Rate (%)</Label>
                    <Input
                      id="engagement_rate"
                      type="number"
                      step="0.1"
                      value={formData.engagement_rate}
                      onChange={(e) => handleInputChange('engagement_rate', e.target.value)}
                      placeholder="4.5"
                      className={errors.engagement_rate ? 'border-red-500' : ''}
                    />
                    {errors.engagement_rate && (
                      <p className="text-sm text-red-600 mt-1">{errors.engagement_rate}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expertise Tags */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Expertise Tags</CardTitle>
              <CardDescription>
                Add relevant tags to categorize the influencer's expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add expertise tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.expertise_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise_tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Set the initial verification status for this influencer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={formData.is_verified}
                  onChange={(e) => handleInputChange('is_verified', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="is_verified">Mark as verified</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/influencers')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Influencer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddInfluencer;
