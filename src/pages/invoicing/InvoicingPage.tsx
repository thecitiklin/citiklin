import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Send, Download, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvoices, useCreateInvoice, useUpdateInvoice, type Invoice } from '@/hooks/useInvoices';
import { useCustomers } from '@/hooks/useCustomers';
import { useProjects } from '@/hooks/useProjects';
import { format } from 'date-fns';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  sent: 'bg-primary text-primary-foreground',
  paid: 'bg-accent text-accent-foreground',
  overdue: 'bg-destructive text-destructive-foreground',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function InvoicingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    project_id: '',
    amount: '',
    tax: '',
    due_date: '',
    status: 'draft' as InvoiceStatus,
    notes: '',
  });

  const { data: invoices = [], isLoading } = useInvoices();
  const { data: customers = [] } = useCustomers();
  const { data: projects = [] } = useProjects();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();

  const filteredInvoices = invoices.filter((invoice) => {
    const customerName = invoice.customers?.name || '';
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.total || 0), 0);
  const paidAmount = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.total || 0), 0);
  const overdueAmount = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((sum, i) => sum + Number(i.total || 0), 0);
  const pendingAmount = invoices
    .filter((i) => i.status === 'sent')
    .reduce((sum, i) => sum + Number(i.total || 0), 0);

  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const resetForm = () => {
    setFormData({
      invoice_number: generateInvoiceNumber(),
      customer_id: '',
      project_id: '',
      amount: '',
      tax: '16',
      due_date: '',
      status: 'draft',
      notes: '',
    });
  };

  const handleCreate = async () => {
    const amount = parseFloat(formData.amount);
    const tax = parseFloat(formData.tax || '0');
    const taxAmount = (amount * tax) / 100;
    const total = amount + taxAmount;

    await createInvoice.mutateAsync({
      invoice_number: formData.invoice_number,
      customer_id: formData.customer_id || null,
      project_id: formData.project_id || null,
      amount: amount,
      tax: taxAmount,
      total: total,
      due_date: formData.due_date || null,
      status: formData.status,
      notes: formData.notes || null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id || '',
      project_id: invoice.project_id || '',
      amount: String(invoice.amount),
      tax: invoice.tax ? String((Number(invoice.tax) / Number(invoice.amount)) * 100) : '0',
      due_date: invoice.due_date || '',
      status: invoice.status as InvoiceStatus,
      notes: invoice.notes || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingInvoice) return;
    const amount = parseFloat(formData.amount);
    const tax = parseFloat(formData.tax || '0');
    const taxAmount = (amount * tax) / 100;
    const total = amount + taxAmount;

    await updateInvoice.mutateAsync({
      id: editingInvoice.id,
      invoice_number: formData.invoice_number,
      customer_id: formData.customer_id || null,
      project_id: formData.project_id || null,
      amount: amount,
      tax: taxAmount,
      total: total,
      due_date: formData.due_date || null,
      status: formData.status,
      notes: formData.notes || null,
    });
    setIsEditOpen(false);
    setEditingInvoice(null);
    resetForm();
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    await updateInvoice.mutateAsync({
      id: invoice.id,
      status: 'paid',
    });
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    await updateInvoice.mutateAsync({
      id: invoice.id,
      status: 'sent',
    });
  };

  const InvoiceForm = ({ onSubmit, isSubmitting }: { onSubmit: () => void; isSubmitting: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="invoice_number">Invoice Number</Label>
        <Input
          id="invoice_number"
          value={formData.invoice_number}
          onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
          placeholder="INV-001"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="customer">Customer</Label>
        <Select value={formData.customer_id} onValueChange={(v) => setFormData({ ...formData, customer_id: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="project">Project (Optional)</Label>
        <Select value={formData.project_id} onValueChange={(v) => setFormData({ ...formData, project_id: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No Project</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount (KES)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tax">Tax (%)</Label>
          <Input
            id="tax"
            type="number"
            value={formData.tax}
            onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
            placeholder="16"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Input
          id="due_date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as InvoiceStatus })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
        />
      </div>
      {formData.amount && (
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>KES {parseFloat(formData.amount || '0').toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax ({formData.tax || '0'}%):</span>
            <span>KES {((parseFloat(formData.amount || '0') * parseFloat(formData.tax || '0')) / 100).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>KES {(parseFloat(formData.amount || '0') * (1 + parseFloat(formData.tax || '0') / 100)).toLocaleString()}</span>
          </div>
        </div>
      )}
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting || !formData.invoice_number || !formData.amount}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </DialogFooter>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoicing</h1>
          <p className="text-muted-foreground">Create and manage invoices</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
              <DialogDescription>
                Enter the invoice details below.
              </DialogDescription>
            </DialogHeader>
            <InvoiceForm onSubmit={handleCreate} isSubmitting={createInvoice.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Invoiced</p>
              <p className="text-2xl font-bold">KES {totalInvoiced.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-accent">KES {paidAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-primary">KES {pendingAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-destructive">KES {overdueAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found. Click "Create Invoice" to add one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {invoice.invoice_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      {invoice.customer_id ? (
                        <Link
                          to={`/customers/${invoice.customer_id}`}
                          className="font-medium hover:text-primary"
                        >
                          {invoice.customers?.name || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.projects?.name || '-'}
                    </TableCell>
                    <TableCell className="font-medium">KES {Number(invoice.total || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[invoice.status as InvoiceStatus] || statusColors.draft}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Edit Invoice
                          </DropdownMenuItem>
                          {invoice.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Invoice
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          {invoice.status !== 'paid' && (
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update the invoice details.
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm onSubmit={handleUpdate} isSubmitting={updateInvoice.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
