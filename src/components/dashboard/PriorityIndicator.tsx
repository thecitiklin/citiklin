import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

interface PriorityIndicatorProps {
  priority: PriorityLevel | string;
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<PriorityLevel, { color: string; icon: typeof ArrowUp }> = {
  critical: { color: 'bg-destructive text-destructive-foreground', icon: AlertTriangle },
  high: { color: 'bg-destructive/80 text-destructive-foreground', icon: ArrowUp },
  medium: { color: 'bg-warning text-warning-foreground', icon: Minus },
  low: { color: 'bg-muted text-muted-foreground', icon: ArrowDown },
};

export function PriorityIndicator({ priority, showIcon = true, className }: PriorityIndicatorProps) {
  const normalizedPriority = priority.toLowerCase() as PriorityLevel;
  const config = priorityConfig[normalizedPriority] || priorityConfig.medium;
  const Icon = config.icon;

  return (
    <Badge className={cn(config.color, 'gap-1', className)} variant="secondary">
      {showIcon && <Icon className="h-3 w-3" />}
      <span className="capitalize">{priority}</span>
    </Badge>
  );
}
