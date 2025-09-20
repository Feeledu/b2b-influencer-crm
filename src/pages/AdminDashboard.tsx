import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
  totalInfluencers: number;
  verifiedInfluencers: number;
  pendingVerification: number;
  recentImports: number;
  dataQualityScore: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalInfluencers: 0,
    verifiedInfluencers: 0,
    pendingVerification: 0,
    recentImports: 0,
    dataQualityScore: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call
    setTimeout(() => {
      setStats({
        totalInfluencers: 247,
        verifiedInfluencers: 189,
        pendingVerification: 58,
        recentImports: 3,
        dataQualityScore: 87
      });
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: "Add Influencer",
      description: "Manually add a new influencer",
      icon: Plus,
      action: () => navigate('/admin/influencers/add'),
      color: "bg-blue-500"
    },
    {
      title: "Bulk Import",
      description: "Upload CSV file with multiple influencers",
      icon: Upload,
      action: () => navigate('/admin/import'),
      color: "bg-green-500"
    },
    {
      title: "Verify Influencers",
      description: "Review and verify pending influencers",
      icon: CheckCircle,
      action: () => navigate('/admin/influencers?filter=pending'),
      color: "bg-yellow-500"
    },
    {
      title: "Data Quality",
      description: "Review data quality and completeness",
      icon: BarChart3,
      action: () => navigate('/admin/quality'),
      color: "bg-purple-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "import",
      description: "CSV import completed: 25 influencers added",
      timestamp: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "verification",
      description: "15 influencers verified by admin",
      timestamp: "4 hours ago",
      status: "success"
    },
    {
      id: 3,
      type: "error",
      description: "Import failed: Invalid CSV format",
      timestamp: "6 hours ago",
      status: "error"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage influencers and maintain data quality</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Settings className="h-3 w-3 mr-1" />
                Admin Mode
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInfluencers}</div>
              <p className="text-xs text-muted-foreground">
                +12 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.verifiedInfluencers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.verifiedInfluencers / stats.totalInfluencers) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</div>
              <p className="text-xs text-muted-foreground">
                Needs review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.dataQualityScore}%</div>
              <p className="text-xs text-muted-foreground">
                Overall completeness
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common admin tasks and operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start space-y-2"
                        onClick={action.action}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {action.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest admin actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {activity.status === 'success' ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
