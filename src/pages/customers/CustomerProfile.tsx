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
  Loader2,
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
import { useCustomers } from '@/hooks/useCustomers';
import { useProjects } from '@/hooks/useProjects';
import { useInvoices } from '@/hooks/useInvoices';

const statusColors: Record<string, string> = {
  active: 'bg-accent text-accent-foreground',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-warning text-warning-foreground',
};

export default function CustomerProfile() {
  const { id } = useParams();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();

  const customer = customers.find((c) => c.id === id);
  const customerProjects = projects.filter((p) => p.customer_id === id);
  const customerInvoices = invoices.filter((i) => i.customer_id === id);

  const isLoading = customersLoading || projectsLoading || invoicesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

  const totalSpent = customerInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + (i.total || 0), 0);

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
      <Badge className={statusColors[customer.status] || statusColors.active}>
        {customer.status}
      </Badge>

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
                <p className="text-xl font-bold">{customerProjects.length}</p>
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
                <p className="text-xl font-bold">KES {totalSpent.toLocaleString()}</p>
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
                <p className="text-xl font-bold">
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-warning/10 p-3">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-xl font-bold">{customerInvoices.length}</p>
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
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
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
                    <p className="font-medium">{customer.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{customer.address || 'Not provided'}</p>
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
                      <TableHead>Priority</TableHead>
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
                        <TableCell>
                          <Badge variant="outline">{project.priority}</Badge>
                        </TableCell>
                        <TableCell>KES {(project.budget || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {project.start_date || 'TBD'} - {project.end_date || 'TBD'}
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

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {customerInvoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>KES {(invoice.total || 0).toLocaleString()}</TableCell>
                        <TableCell>{invoice.due_date || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              invoice.status === 'paid'
                                ? 'bg-accent text-accent-foreground'
                                : invoice.status === 'overdue'
                                ? 'bg-destructive text-destructive-foreground'
                                : 'bg-warning text-warning-foreground'
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No invoices yet</p>
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
