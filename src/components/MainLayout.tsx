import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart3,
  Search,
  Target,
  Users,
  LogOut,
  User,
  Settings,
  Shield,
  Mic,
  Mail,
  Calendar,
  CreditCard,
  Menu,
  HelpCircle,
  Crown,
  Home,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Discover", href: "/discover", icon: Search },
    { name: "My Influencers", href: "/influencers", icon: UserPlus },
    { name: "Campaigns", href: "/campaigns", icon: Target },
    { name: "Billing", href: "/billing", icon: CreditCard },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleMenuClick = (action: () => void) => {
    action();
    setIsUserMenuOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.role === 'admin';
  
  // Debug: Log user object to see role structure
  console.log('🔍 MainLayout Debug:');
  console.log('User object:', user);
  console.log('User metadata:', user?.user_metadata);
  console.log('User role:', user?.role);
  console.log('User metadata role:', user?.user_metadata?.role);
  console.log('Is admin:', isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"></div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Fluencr</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.name || user?.email} />
                    <AvatarFallback>
                      {user?.user_metadata?.name ? getUserInitials(user.user_metadata.name) : user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-md border border-gray-200 rounded-md z-20 max-w-[calc(100vw-2rem)] sm:max-w-none">
                      {/* User Email */}
                      <div className="px-4 py-3">
                        <p className="text-xs text-gray-500">
                          {user?.email}
                        </p>
                      </div>

                      <div className="border-t border-gray-200" />

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => handleMenuClick(() => navigate('/profile'))}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </button>
                        
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => handleMenuClick(() => navigate('/settings'))}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </button>

                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => handleMenuClick(() => navigate('/billing'))}
                        >
                          <Crown className="mr-3 h-4 w-4" />
                          Upgrade Plan
                        </button>

                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => handleMenuClick(() => navigate('/help'))}
                        >
                          <HelpCircle className="mr-3 h-4 w-4" />
                          Help & Support
                        </button>

                        <div className="border-t border-gray-200 my-1" />
                        
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          onClick={() => handleMenuClick(handleSignOut)}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-purple-100 text-purple-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-purple-500" : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </Link>
                );
              })}
              
              {/* Admin Section - Only visible to admins */}
              {isAdmin && (
                <>
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="px-2 py-1">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Admin
                      </h3>
                    </div>
                    <Link
                      to="/admin"
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        location.pathname === "/admin"
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Shield
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          location.pathname === "/admin" ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">Admin Panel</div>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none pt-16 md:pt-0">
            <div className="min-h-screen">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
