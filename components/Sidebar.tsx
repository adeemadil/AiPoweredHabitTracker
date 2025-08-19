import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { CheckCircle, Circle, XCircle, Sparkles, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  habitStats: {
    total: number;
    completed: number;
    missed: number;
  };
}

export function Sidebar({ activeFilter, onFilterChange, habitStats }: SidebarProps) {
  const filters = [
    {
      id: 'all',
      label: 'All Habits',
      icon: Circle,
      count: habitStats.total,
      color: 'default'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: habitStats.completed,
      color: 'secondary'
    },
    {
      id: 'missed',
      label: 'Missed',
      icon: XCircle,
      count: habitStats.missed,
      color: 'destructive'
    }
  ];

  return (
    <aside className="w-80 h-[calc(100vh-5rem)] overflow-y-auto border-r border-border bg-card">
      <div className="p-6 space-y-6">
        {/* Quick Filters */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Quick Filters
          </h3>
          <div className="space-y-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'ghost'}
                  className="w-full justify-between h-auto py-3"
                  onClick={() => onFilterChange(filter.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </div>
                  <Badge
                    variant={activeFilter === filter.id ? 'secondary' : 'outline'}
                    className="ml-auto"
                  >
                    {filter.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </Card>

        <Separator />

        {/* AI Insights Section */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Insights
          </h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onFilterChange('insights')}
          >
            View Weekly Insights
          </Button>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Today's Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium">
                {habitStats.total > 0 
                  ? Math.round((habitStats.completed / habitStats.total) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${habitStats.total > 0 
                    ? (habitStats.completed / habitStats.total) * 100 
                    : 0}%`
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
}