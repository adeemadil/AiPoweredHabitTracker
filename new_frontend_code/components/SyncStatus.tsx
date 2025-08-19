import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RotateCcw, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';

interface SyncStatusProps {
  className?: string;
  showText?: boolean;
}

export function SyncStatus({ className = '', showText = false }: SyncStatusProps) {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Simulate sync status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Update last sync time every 30 seconds when synced
      if (syncStatus === 'synced') {
        setLastSyncTime(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [syncStatus]);

  const formatSyncTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'syncing':
        return <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'offline':
        return <CloudOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'synced':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'syncing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'offline':
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getSyncMessage = () => {
    switch (syncStatus) {
      case 'synced':
        return 'Your habits are securely stored with Supabase';
      case 'syncing':
        return 'Syncing your habits...';
      case 'offline':
        return 'Offline - changes will sync when connected';
    }
  };

  const getSyncLabel = () => {
    switch (syncStatus) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing';
      case 'offline':
        return 'Offline';
    }
  };

  if (showText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`${getSyncColor()} ${className} cursor-help transition-colors`}
            >
              {getSyncIcon()}
              <span className="ml-1.5 text-sm font-medium">{getSyncLabel()}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">{getSyncMessage()}</p>
              {syncStatus === 'synced' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last synced: {formatSyncTime(lastSyncTime)}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={`p-2 rounded-lg hover:bg-accent transition-colors ${className}`}>
            {getSyncIcon()}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">{getSyncMessage()}</p>
            {syncStatus === 'synced' && (
              <p className="text-xs text-muted-foreground mt-1">
                Last synced: {formatSyncTime(lastSyncTime)}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}