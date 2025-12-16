import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CreditCard, Star, Headphones } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  KPICard,
  StatusBadge,
  getStatusType,
  QuickActions,
} from '@/components/dashboard';

const upcomingBookings = [
  { id: 1, service: 'Regular Home Cleaning', date: 'Dec 15, 2024', time: '10:00 AM', status: 'confirmed' },
  { id: 2, service: 'Deep Kitchen Clean', date: 'Dec 22, 2024', time: '2:00 PM', status: 'pending' },
];

const recentPayments = [
  { id: 1, amount: 'KES 5,500', date: 'Dec 8, 2024', status: 'completed' },
  { id: 2, amount: 'KES 3,200', date: 'Nov 25, 2024', status: 'completed' },
  { id: 3, amount: 'KES 8,000', date: 'Nov 10, 2024', status: 'completed' },
];

const quickActions = [
  { label: 'Book Service', icon: Calendar, href: '/book-service' },
  { label: 'Make Payment', icon: CreditCard, href: '/payments' },
  { label: 'Leave Review', icon: Star, href: '/reviews' },
  { label: 'Get Support', icon: Headphones, href: '/support' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your cleaning services</p>
        </div>
        <Button>Book New Service</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Active Bookings" value="2" icon={Calendar} />
        <KPICard title="Total Spent" value="KES 45,200" icon={CreditCard} />
        <KPICard title="Services Used" value="12" icon={Star} />
        <KPICard title="Support Tickets" value="0" icon={Headphones} />
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
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{booking.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} type={getStatusType(booking.status)} />
                </div>
              ))}
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
              {recentPayments.map((payment) => (
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
              ))}
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
