import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { PasswordStrengthIndicator, getPasswordStrength } from '@/components/auth/PasswordStrengthIndicator';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated, isLoading: authLoading, getDashboardRoute, role } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Redirect authenticated users when role is loaded
  useEffect(() => {
    if (isAuthenticated && !authLoading && role) {
      const from = (location.state as any)?.from?.pathname || getDashboardRoute();
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, role, navigate, location, getDashboardRoute]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsLoading(true);
    const result = await login(loginEmail, loginPassword);
    setIsLoading(false);

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.error || 'Unable to sign in',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      // Navigation handled by useEffect when role is loaded
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = signupSchema.safeParse({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
    });
    
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: validation.error.errors[0].message,
      });
      return;
    }
    // Ensure password meets strength requirements
    if (getPasswordStrength(signupPassword) < 5) {
      toast({
        variant: 'destructive',
        title: 'Weak Password',
        description: 'Please create a stronger password meeting all requirements.',
      });
      return;
    }

    setIsLoading(true);
    
    // Check if email is authorized for registration (admin emails or invitations)
    const [adminEmailResult, invitationResult] = await Promise.all([
      supabase
        .from('admin_emails')
        .select('email, used')
        .eq('email', signupEmail.toLowerCase())
        .maybeSingle(),
      supabase
        .from('user_invitations')
        .select('email, used, expires_at, role')
        .eq('email', signupEmail.toLowerCase())
        .maybeSingle()
    ]);
    
    if (adminEmailResult.error || invitationResult.error) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to verify registration eligibility.',
      });
      return;
    }
    
    const adminEmail = adminEmailResult.data;
    const invitation = invitationResult.data;
    
    // Check if already used
    if (adminEmail?.used) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Already Registered',
        description: 'This email has already been registered. Please sign in instead.',
      });
      setActiveTab('login');
      setLoginEmail(signupEmail);
      return;
    }
    
    if (invitation?.used) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Already Registered',
        description: 'This invitation has been used. Please sign in instead.',
      });
      setActiveTab('login');
      setLoginEmail(signupEmail);
      return;
    }
    
    // Check if invitation is expired
    if (invitation && new Date(invitation.expires_at) < new Date()) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Invitation Expired',
        description: 'This invitation has expired. Please contact an administrator for a new one.',
      });
      return;
    }
    
    // If neither admin email nor valid invitation found
    if (!adminEmail && !invitation) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Registration Restricted',
        description: 'You need an invitation to register. Contact your system administrator.',
      });
      return;
    }

    const result = await signup(signupEmail, signupPassword, signupName);
    setIsLoading(false);

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: result.error || 'Unable to create account',
      });
    } else {
      const roleMessage = adminEmail 
        ? 'You have been registered as an administrator.' 
        : `You have been registered as ${invitation?.role}.`;
      toast({
        title: 'Account Created!',
        description: `Welcome to Citi Klin. ${roleMessage}`,
      });
      // Navigation handled by useEffect when role is loaded
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Citi Klin</span>
          </div>
          <p className="text-muted-foreground">Professional Cleaning Services</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login' 
                ? 'Sign in to access your dashboard' 
                : 'Administrator registration only'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">
                  <ShieldCheck className="mr-1 h-4 w-4" />
                  Admin Setup
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 pt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm text-muted-foreground"
                    onClick={() => navigate('/reset-password')}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 pt-4">
                <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  <ShieldCheck className="mb-1 inline h-4 w-4 text-primary" />
                  {' '}Registration requires an administrator invitation or pre-authorization.
                </div>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="admin@company.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <PasswordStrengthIndicator password={signupPassword} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating admin account...
                      </>
                    ) : (
                      'Create Admin Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
