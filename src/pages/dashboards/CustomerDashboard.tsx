import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CreditCard, Star, Headphones, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  KPICard,
  StatusBadge,
  getStatusType,
  QuickActions,
} from '@/components/dashboard';
import { useProjects } from '@/hooks/useProjects';
import { usePayments } from '@/hooks/usePayments';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { format, parseISO } from 'date-fns';

const quickActions = [
  { label: 'Book Service', icon: Calendar, href: '/book-service' },
  { label: 'Make Payment', icon: CreditCard, href: '/payments' },
  { label: 'Leave Review', icon: Star, href: '/reviews' },
  { label: 'Get Support', icon: Headphones, href: '/support' },
];

export default function CustomerDashboard() {
  const { profile } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: tickets = [], isLoading: ticketsLoading } = useSupportTickets();

  const isLoading = projectsLoading || paymentsLoading || ticketsLoading;

  // Calculate real stats
  const activeBookings = projects.filter(p => p.status === 'active' || p.status === 'planning').length;
  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const completedServices = projects.filter(p => p.status === 'completed').length;
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'pending').length;

  // Get upcoming bookings (active projects)
  const upcomingBookings = projects
    .filter(p => p.status === 'active' || p.status === 'planning')
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      service: p.name,
      date: p.start_date ? format(parseISO(p.start_date), 'MMM d, yyyy') : 'TBD',
      time: 'Scheduled',
      status: p.status === 'active' ? 'confirmed' : 'pending',
    }));

  // Get recent payments
  const recentPayments = payments
    .filter(p => p.status === 'completed')
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      amount: `KES ${p.amount.toLocaleString()}`,
      date: format(parseISO(p.created_at), 'MMM d, yyyy'),
      status: 'completed',
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome, {profile?.name}</h1>
          <p className="text-muted-foreground">Manage your cleaning services</p>
        </div>
        <Button>Book New Service</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Active Bookings" value={String(activeBookings)} icon={Calendar} />
        <KPICard title="Total Spent" value={`KES ${(totalSpent / 1000).toFixed(0)}K`} icon={CreditCard} />
        <KPICard title="Services Used" value={String(completedServices)} icon={Star} />
        <KPICard title="Support Tickets" value={String(openTickets)} icon={Headphones} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled cleaning services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="font-medium">{booking.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} - {booking.time}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} type={getStatusType(booking.status)} />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No upcoming bookings</p>
              )}
              <Button variant="outline" className="w-full">
                View All Bookings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{payment.amount}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                    <StatusBadge status={payment.status} type={getStatusType(payment.status)} />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No payment history</p>
              )}
              <Button variant="outline" className="w-full">
                View Payment History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions
        title="Quick Actions"
        actions={quickActions}
        variant="grid"
      />
    </div>
  );
}
