import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { SyncStatus } from './SyncStatus';
import { 
  Menu, 
  LayoutDashboard, 
  Bell, 
  Users, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Plus,
  BarChart3,
  Trophy,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
  user?: any;
  notificationCount?: number;
}

export function Navigation({
  isDarkMode,
  onToggleDarkMode,
  currentView,
  onViewChange,
  onSignOut,
  user,
  notificationCount = 0
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'View your habits'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: notificationCount > 0 ? notificationCount : null,
      description: 'Manage alerts'
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      badge: null,
      description: 'Share & compete'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: BarChart3,
      badge: null,
      description: 'AI analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      description: 'Account settings'
    }
  ];

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (user: any) => {
    if (!user) return 'U';
    const name = user.user_metadata?.name || user.email || 'User';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = (user: any) => {
    if (!user) return 'User';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Habitual
                </span>
              </div>

              {/* Desktop Navigation Items */}
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleViewChange(item.id)}
                      className={`relative flex items-center gap-2 ${
                        isActive ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 text-xs rounded-full p-0 flex items-center justify-center"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Sync Status */}
              <div className="hidden sm:block">
                <SyncStatus />
              </div>

              {/* Theme Toggle */}
              <div className="hidden sm:flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onToggleDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-sm">
                      {getUserInitials(user)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserDisplayName(user)}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Mobile-only sync status */}
                  <div className="sm:hidden px-2 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sync Status</span>
                      <SyncStatus showText />
                    </div>
                  </div>
                  
                  {/* Mobile-only theme toggle */}
                  <div className="sm:hidden px-2 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Dark Mode</span>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={onToggleDarkMode}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="space-y-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">H</span>
                      </div>
                      <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Habitual
                      </span>
                    </div>

                    <div className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        
                        return (
                          <Button
                            key={item.id}
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start relative ${
                              isActive ? 'bg-primary/10 text-primary' : ''
                            }`}
                            onClick={() => handleViewChange(item.id)}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <span>{item.label}</span>
                                {item.badge && (
                                  <Badge variant="destructive" className="ml-2">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Only show on dashboard */}
      {currentView === 'dashboard' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border safe-area-pb z-40">
          <div className="flex items-center justify-around py-2">
            {navigationItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewChange(item.id)}
                  className={`flex-col h-16 w-16 p-1 relative ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-1 right-3 h-4 w-4 text-xs rounded-full p-0 flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                    />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Floating Action Button for Add Habit */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Button
              size="lg"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                // This would trigger the Add Habit modal
                // We'll need to pass this up to the parent component
              }}
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}