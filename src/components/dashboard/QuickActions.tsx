import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAction {
  label: string;
  description?: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  title?: string;
  description?: string;
  actions: QuickAction[];
  variant?: 'list' | 'grid';
  className?: string;
}

export function QuickActions({
  title = 'Quick Actions',
  description = 'Common tasks and shortcuts',
  actions,
  variant = 'list',
  className,
}: QuickActionsProps) {
  const ActionWrapper = ({ action, children }: { action: QuickAction; children: React.ReactNode }) => {
    const baseClasses = cn(
      'flex items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted cursor-pointer',
      variant === 'grid' && 'flex-col gap-2 text-center'
    );

    if (action.href) {
      return (
        <Link to={action.href} className={baseClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button onClick={action.onClick} className={baseClasses}>
        {children}
      </button>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className={cn('gap-3', variant === 'grid' ? 'grid md:grid-cols-4' : 'grid')}>
          {actions.map((action, index) => (
            <ActionWrapper key={index} action={action}>
              {variant === 'grid' ? (
                <>
                  {action.icon && <action.icon className="h-5 w-5 text-muted-foreground" />}
                  <span className="text-sm font-medium">{action.label}</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {action.icon && <action.icon className="h-4 w-4 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-medium">{action.label}</p>
                      {action.description && (
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </ActionWrapper>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
