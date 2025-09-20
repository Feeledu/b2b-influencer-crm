import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Influencer {
  id: string;
  name: string;
  platform: string;
  handle: string;
  bio: string;
  avatar_url: string;
  industry: string;
  audience_size: number;
  engagement_rate: number;
  is_verified: boolean;
  verified_at: string | null;
  data_quality_score: number;
  created_at: string;
}

const AdminInfluencers = () => {
  const navigate = useNavigate();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call
    setTimeout(() => {
      setInfluencers([
        {
          id: '1',
          name: 'Sarah Chen',
          platform: 'LinkedIn',
          handle: '@sarahchen',
          bio: 'B2B Marketing Expert | SaaS Growth',
          avatar_url: '',
          industry: 'Technology',
          audience_size: 15000,
          engagement_rate: 4.2,
          is_verified: true,
          verified_at: '2024-01-15T10:30:00Z',
          data_quality_score: 95,
          created_at: '2024-01-10T08:00:00Z'
        },
        {
          id: '2',
          name: 'Mike Rodriguez',
          platform: 'Twitter',
          handle: '@mikerodriguez',
          bio: 'Startup Founder | Tech Investor',
          avatar_url: '',
          industry: 'Finance',
          audience_size: 8500,
          engagement_rate: 3.8,
          is_verified: false,
          verified_at: null,
          data_quality_score: 78,
          created_at: '2024-01-12T14:20:00Z'
        },
        {
          id: '3',
          name: 'Emily Watson',
          platform: 'LinkedIn',
          handle: '@emilywatson',
          bio: 'Product Manager | UX Designer',
          avatar_url: '',
          industry: 'Design',
          audience_size: 22000,
          engagement_rate: 5.1,
          is_verified: true,
          verified_at: '2024-01-14T16:45:00Z',
          data_quality_score: 92,
          created_at: '2024-01-08T11:15:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === 'all' || influencer.platform === filterPlatform;
    
    const matchesVerification = filterVerification === 'all' || 
                               (filterVerification === 'verified' && influencer.is_verified) ||
                               (filterVerification === 'pending' && !influencer.is_verified);
    
    return matchesSearch && matchesPlatform && matchesVerification;
  });

  const handleSelectInfluencer = (id: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedInfluencers.length === filteredInfluencers.length) {
      setSelectedInfluencers([]);
    } else {
      setSelectedInfluencers(filteredInfluencers.map(inf => inf.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on influencers:`, selectedInfluencers);
    // TODO: Implement bulk actions
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading influencers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Influencer Management</h1>
          <p className="text-gray-600">Manage and verify influencer database</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/admin/influencers/add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Influencer
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search influencers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
              </select>
              <select
                value={filterVerification}
                onChange={(e) => setFilterVerification(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedInfluencers.length > 0 && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-900">
                  {selectedInfluencers.length} influencer{selectedInfluencers.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('verify')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verify
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Influencers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Influencers ({filteredInfluencers.length})</CardTitle>
          <CardDescription>
            Manage influencer profiles and verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <input
                      type="checkbox"
                      checked={selectedInfluencers.length === filteredInfluencers.length && filteredInfluencers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-3 font-medium">Influencer</th>
                  <th className="text-left p-3 font-medium">Platform</th>
                  <th className="text-left p-3 font-medium">Audience</th>
                  <th className="text-left p-3 font-medium">Engagement</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Quality</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInfluencers.map((influencer) => (
                  <tr key={influencer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedInfluencers.includes(influencer.id)}
                        onChange={() => handleSelectInfluencer(influencer.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{influencer.name}</div>
                          <div className="text-sm text-gray-500">{influencer.handle}</div>
                          <div className="text-xs text-gray-400 truncate max-w-xs">
                            {influencer.bio}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{influencer.platform}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {influencer.audience_size.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {influencer.engagement_rate}%
                      </div>
                    </td>
                    <td className="p-3">
                      {influencer.is_verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${influencer.data_quality_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {influencer.data_quality_score}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInfluencers;
