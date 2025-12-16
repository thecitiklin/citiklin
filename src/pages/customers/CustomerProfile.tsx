import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  FileText,
  MessageSquare,
  DollarSign,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockCustomers, mockServiceHistory, mockProjects } from '@/data/mockData';
import type { CustomerStatus } from '@/types/customer';

const statusColors: Record<CustomerStatus, string> = {
  active: 'bg-accent text-accent-foreground',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-warning text-warning-foreground',
};

export default function CustomerProfile() {
  const { id } = useParams();
  const customer = mockCustomers.find((c) => c.id === id);
  const serviceHistory = mockServiceHistory.filter((s) => s.customerId === id);
  const customerProjects = mockProjects.filter((p) => p.customerId === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Customer not found</h2>
        <p className="text-muted-foreground mb-4">The customer you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/customers">Back to Customers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {customer.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{customer.name}</h1>
            {customer.company && (
              <p className="text-muted-foreground">{customer.company}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <Badge className={statusColors[customer.status]}>{customer.status}</Badge>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-xl font-bold">{customer.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-accent/10 p-3">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">KES {customer.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-secondary/10 p-3">
                <Calendar className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer Since</p>
                <p className="text-xl font-bold">{customer.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-warning/10 p-3">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Service</p>
                <p className="text-xl font-bold">{customer.lastServiceDate || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {customerProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Dates</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Link
                            to={`/projects/${project.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {project.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{project.status}</Badge>
                        </TableCell>
                        <TableCell>{project.progress}%</TableCell>
                        <TableCell>KES {project.budget.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {project.startDate} - {project.endDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No projects yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service History</CardTitle>
            </CardHeader>
            <CardContent>
              {serviceHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceHistory.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.projectName}</TableCell>
                        <TableCell>{service.serviceType}</TableCell>
                        <TableCell>{service.date}</TableCell>
                        <TableCell>KES {service.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              service.status === 'completed'
                                ? 'bg-accent text-accent-foreground'
                                : service.status === 'cancelled'
                                ? 'bg-destructive text-destructive-foreground'
                                : 'bg-warning text-warning-foreground'
                            }
                          >
                            {service.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No service history</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.notes ? (
                <p className="text-muted-foreground">{customer.notes}</p>
              ) : (
                <p className="text-center text-muted-foreground py-8">No notes added yet</p>
              )}
              <div className="mt-4">
                <Button variant="outline">Add Note</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
