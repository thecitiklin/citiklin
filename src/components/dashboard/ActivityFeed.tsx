import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Activity {
  id: string | number;
  action: string;
  detail: string;
  time: string;
  type?: 'default' | 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  title?: string;
  description?: string;
  activities: Activity[];
  className?: string;
  maxItems?: number;
}

const dotColors = {
  default: 'bg-muted-foreground',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
};

export function ActivityFeed({
  title = 'Recent Activity',
  description = 'Latest updates',
  activities,
  className,
  maxItems = 5,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-3',
                index !== displayedActivities.length - 1 && 'border-b border-border pb-3'
              )}
            >
              <div
                className={cn(
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  dotColors[activity.type || 'default']
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
