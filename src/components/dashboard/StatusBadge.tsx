import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-success text-success-foreground hover:bg-success/90',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  error: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  info: 'bg-primary text-primary-foreground hover:bg-primary/90',
  default: 'bg-muted text-muted-foreground hover:bg-muted/90',
};

export function StatusBadge({ status, type = 'default', className }: StatusBadgeProps) {
  return (
    <Badge className={cn(statusStyles[type], className)} variant="secondary">
      {status}
    </Badge>
  );
}

// Helper function to determine status type from common status strings
export function getStatusType(status: string): StatusType {
  const statusLower = status.toLowerCase();
  
  if (['completed', 'confirmed', 'active', 'paid', 'success', 'approved'].includes(statusLower)) {
    return 'success';
  }
  if (['pending', 'in progress', 'in-progress', 'processing', 'review'].includes(statusLower)) {
    return 'warning';
  }
  if (['failed', 'cancelled', 'error', 'rejected', 'overdue'].includes(statusLower)) {
    return 'error';
  }
  if (['new', 'scheduled', 'upcoming'].includes(statusLower)) {
    return 'info';
  }
  return 'default';
}
