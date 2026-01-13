import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, CreditCard, Smartphone, Globe, Banknote, MoreVertical, Download, Plus, Loader2 } from 'lucide-react';
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
import { usePayments, useCreatePayment, useUpdatePayment, useDeletePayment, type Payment } from '@/hooks/usePayments';
import { useCustomers } from '@/hooks/useCustomers';
import { useInvoices } from '@/hooks/useInvoices';
import { format } from 'date-fns';

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type PaymentMethod = 'mpesa' | 'card' | 'paypal' | 'cash' | 'bank_transfer';

const statusColors: Record<PaymentStatus, string> = {
  pending: 'bg-warning text-warning-foreground',
  completed: 'bg-accent text-accent-foreground',
  failed: 'bg-destructive text-destructive-foreground',
  refunded: 'bg-secondary text-secondary-foreground',
};

const methodIcons: Record<PaymentMethod, React.ReactNode> = {
  mpesa: <Smartphone className="h-4 w-4" />,
  card: <CreditCard className="h-4 w-4" />,
  paypal: <Globe className="h-4 w-4" />,
  bank_transfer: <Banknote className="h-4 w-4" />,
  cash: <Banknote className="h-4 w-4" />,
};

const methodLabels: Record<PaymentMethod, string> = {
  mpesa: 'M-Pesa',
  card: 'Credit/Debit Card',
  paypal: 'PayPal',
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_id: '',
    amount: '',
    payment_method: 'mpesa' as PaymentMethod,
    status: 'pending' as PaymentStatus,
    transaction_id: '',
    notes: '',
  });

  const { data: payments = [], isLoading } = usePayments();
  const { data: customers = [] } = useCustomers();
  const { data: invoices = [] } = useInvoices();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();

  const filteredPayments = payments.filter((payment) => {
    const customerName = payment.customers?.name || '';
    const transactionId = payment.transaction_id || '';
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.payment_method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalReceived = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const refundedAmount = payments
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const resetForm = () => {
    setFormData({
      customer_id: '',
      invoice_id: '',
      amount: '',
      payment_method: 'mpesa',
      status: 'pending',
      transaction_id: '',
      notes: '',
    });
  };

  const handleCreate = async () => {
    await createPayment.mutateAsync({
      customer_id: formData.customer_id || null,
      invoice_id: formData.invoice_id || null,
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      status: formData.status,
      transaction_id: formData.transaction_id || null,
      notes: formData.notes || null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      customer_id: payment.customer_id || '',
      invoice_id: payment.invoice_id || '',
      amount: String(payment.amount),
      payment_method: payment.payment_method,
      status: payment.status,
      transaction_id: payment.transaction_id || '',
      notes: payment.notes || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPayment) return;
    await updatePayment.mutateAsync({
      id: editingPayment.id,
      customer_id: formData.customer_id || null,
      invoice_id: formData.invoice_id || null,
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      status: formData.status,
      transaction_id: formData.transaction_id || null,
      notes: formData.notes || null,
    });
    setIsEditOpen(false);
    setEditingPayment(null);
    resetForm();
  };

  const handleRefund = async (payment: Payment) => {
    await updatePayment.mutateAsync({
      id: payment.id,
      status: 'refunded',
    });
  };

  const PaymentForm = ({ onSubmit, isSubmitting }: { onSubmit: () => void; isSubmitting: boolean }) => (
    <div className="grid gap-4 py-4">
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
        <Label htmlFor="invoice">Invoice (Optional)</Label>
        <Select value={formData.invoice_id} onValueChange={(v) => setFormData({ ...formData, invoice_id: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select invoice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No Invoice</SelectItem>
            {invoices.map((invoice) => (
              <SelectItem key={invoice.id} value={invoice.id}>{invoice.invoice_number}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
        <Label htmlFor="method">Payment Method</Label>
        <Select value={formData.payment_method} onValueChange={(v) => setFormData({ ...formData, payment_method: v as PaymentMethod })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mpesa">M-Pesa</SelectItem>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as PaymentStatus })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="transaction_id">Transaction ID</Label>
        <Input
          id="transaction_id"
          value={formData.transaction_id}
          onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
          placeholder="e.g., MPX12345678"
        />
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
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting || !formData.amount}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingPayment ? 'Update Payment' : 'Record Payment'}
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
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track and manage payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Enter the payment details below.
                </DialogDescription>
              </DialogHeader>
              <PaymentForm onSubmit={handleCreate} isSubmitting={createPayment.isPending} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-2xl font-bold text-accent">KES {totalReceived.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">KES {pendingAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Refunded</p>
              <p className="text-2xl font-bold">KES {refundedAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{payments.length}</p>
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
                placeholder="Search by customer or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments found. Click "Record Payment" to add one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.transaction_id || '-'}</TableCell>
                    <TableCell>
                      {payment.customer_id ? (
                        <Link
                          to={`/customers/${payment.customer_id}`}
                          className="font-medium hover:text-primary"
                        >
                          {payment.customers?.name || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.invoices?.invoice_number || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {methodIcons[payment.payment_method]}
                        <span>{methodLabels[payment.payment_method]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">KES {Number(payment.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[payment.status]}>{payment.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(payment)}>
                            Edit Payment
                          </DropdownMenuItem>
                          {payment.status === 'completed' && (
                            <DropdownMenuItem onClick={() => handleRefund(payment)}>
                              Issue Refund
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
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
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>
              Update the payment details.
            </DialogDescription>
          </DialogHeader>
          <PaymentForm onSubmit={handleUpdate} isSubmitting={updatePayment.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
