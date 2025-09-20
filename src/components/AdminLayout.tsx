import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Upload, 
  CheckCircle, 
  BarChart3,
  Settings,
  Shield,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const adminNavigation = [
    { 
      name: "Dashboard", 
      href: "/admin", 
      icon: BarChart3,
      description: "Overview and quick actions"
    },
    { 
      name: "Influencers", 
      href: "/admin/influencers", 
      icon: Users,
      description: "Manage influencer database"
    },
    { 
      name: "Bulk Import", 
      href: "/admin/import", 
      icon: Upload,
      description: "CSV upload and bulk operations"
    },
    { 
      name: "Verification", 
      href: "/admin/verification", 
      icon: CheckCircle,
      description: "Review and verify influencers"
    },
    { 
      name: "Data Quality", 
      href: "/admin/quality", 
      icon: FileText,
      description: "Data completeness and validation"
    },
    { 
      name: "Settings", 
      href: "/admin/settings", 
      icon: Settings,
      description: "Admin configuration"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <div className="hidden md:block">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Admin Access
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Main App
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <nav className="flex-1 px-2 space-y-1">
              {adminNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
