import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  title?: string;
  description?: string;
  onMarkAsRead?: (id: string | number) => void;
  onDismiss?: (id: string | number) => void;
  onMarkAllAsRead?: () => void;
  className?: string;
}

const typeConfig = {
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
  success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  error: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function NotificationCenter({
  notifications,
  title = 'Notifications',
  description,
  onMarkAsRead,
  onDismiss,
  onMarkAllAsRead,
  className,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            <Check className="mr-1 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border border-border p-3 transition-colors',
                    !notification.read && 'bg-muted/30'
                  )}
                >
                  <div className={cn('rounded-full p-2', config.bg)}>
                    <Icon className={cn('h-4 w-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm font-medium', !notification.read && 'font-semibold')}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && onMarkAsRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDismiss(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
