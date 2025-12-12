import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CreditCard, Star, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const upcomingBookings = [
  { id: 1, service: 'Regular Home Cleaning', date: 'Dec 15, 2024', time: '10:00 AM', status: 'confirmed' },
  { id: 2, service: 'Deep Kitchen Clean', date: 'Dec 22, 2024', time: '2:00 PM', status: 'pending' },
];

const recentPayments = [
  { id: 1, amount: 'KES 5,500', date: 'Dec 8, 2024', status: 'completed' },
  { id: 2, amount: 'KES 3,200', date: 'Nov 25, 2024', status: 'completed' },
  { id: 3, amount: 'KES 8,000', date: 'Nov 10, 2024', status: 'completed' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your cleaning services</p>
        </div>
        <Button>Book New Service</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 45,200</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Services Used
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Support Tickets
            </CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
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
                  <Badge
                    variant="secondary"
                    className={
                      booking.status === 'confirmed'
                        ? 'bg-success text-success-foreground'
                        : 'bg-warning text-warning-foreground'
                    }
                  >
                    {booking.status}
                  </Badge>
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
                  <Badge variant="secondary" className="bg-success text-success-foreground">
                    {payment.status}
                  </Badge>
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
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <Calendar className="h-5 w-5" />
              <span>Book Service</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <CreditCard className="h-5 w-5" />
              <span>Make Payment</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <Star className="h-5 w-5" />
              <span>Leave Review</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <Headphones className="h-5 w-5" />
              <span>Get Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
