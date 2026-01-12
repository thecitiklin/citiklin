import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { score, passed } = useMemo(() => {
    const passedReqs = requirements.map((req) => req.test(password));
    const passedCount = passedReqs.filter(Boolean).length;
    return { score: passedCount, passed: passedReqs };
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (score === 0) return { text: '', color: '' };
    if (score <= 2) return { text: 'Weak', color: 'bg-destructive' };
    if (score <= 3) return { text: 'Fair', color: 'bg-warning' };
    if (score <= 4) return { text: 'Good', color: 'bg-primary' };
    return { text: 'Strong', color: 'bg-success' };
  }, [score]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2 p-3 rounded-lg bg-muted/50 border border-border/50">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn(
            "font-medium",
            score <= 2 && "text-destructive",
            score === 3 && "text-warning",
            score === 4 && "text-primary",
            score === 5 && "text-success"
          )}>
            {strengthLabel.text}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full transition-colors duration-300",
                i < score
                  ? score <= 2 ? "bg-destructive" 
                    : score <= 3 ? "bg-warning"
                    : score <= 4 ? "bg-primary"
                    : "bg-success"
                  : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements list */}
      <ul className="space-y-1 text-xs">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {passed[index] ? (
              <Check className="h-3.5 w-3.5 text-success shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={cn(
              "transition-colors",
              passed[index] ? "text-foreground" : "text-muted-foreground"
            )}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function getPasswordStrength(password: string): number {
  return requirements.filter((req) => req.test(password)).length;
}
