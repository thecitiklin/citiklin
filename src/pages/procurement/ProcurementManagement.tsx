import { useState } from 'react';
import { Plus, Search, Filter, Building, Star, Phone, Mail, MoreVertical, Loader2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor, type Vendor } from '@/hooks/useVendors';
import { usePurchaseOrders, useCreatePurchaseOrder, type PurchaseOrder } from '@/hooks/usePurchaseOrders';
import { format } from 'date-fns';

export default function ProcurementManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Vendor form state
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    rating: '0',
    payment_terms: '',
    status: 'active',
  });

  // PO form state
  const [poForm, setPOForm] = useState({
    vendor_id: '',
    order_number: '',
    items: '',
    subtotal: '',
    tax: '',
    expected_delivery: '',
    notes: '',
  });

  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  const { data: purchaseOrders = [], isLoading: posLoading } = usePurchaseOrders();
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const deleteVendor = useDeleteVendor();
  const createPO = useCreatePurchaseOrder();

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeVendors = vendors.filter((v) => v.status === 'active').length;
  const totalSpent = vendors.reduce((sum, v) => sum + Number(v.total_spent || 0), 0);
  const avgRating = vendors.length > 0 
    ? (vendors.reduce((sum, v) => sum + Number(v.rating || 0), 0) / vendors.length).toFixed(1) 
    : '0.0';
  const totalOrders = purchaseOrders.length;

  const generatePONumber = () => {
    const prefix = 'PO';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const resetVendorForm = () => {
    setVendorForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      rating: '0',
      payment_terms: '',
      status: 'active',
    });
  };

  const resetPOForm = () => {
    setPOForm({
      vendor_id: '',
      order_number: generatePONumber(),
      items: '',
      subtotal: '',
      tax: '16',
      expected_delivery: '',
      notes: '',
    });
  };

  const handleCreateVendor = async () => {
    await createVendor.mutateAsync({
      name: vendorForm.name,
      email: vendorForm.email || null,
      phone: vendorForm.phone || null,
      address: vendorForm.address || null,
      category: vendorForm.category || null,
      rating: vendorForm.rating ? parseFloat(vendorForm.rating) : null,
      payment_terms: vendorForm.payment_terms || null,
      status: vendorForm.status,
      total_orders: 0,
      total_spent: 0,
    });
    setIsVendorDialogOpen(false);
    resetVendorForm();
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setVendorForm({
      name: vendor.name,
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      category: vendor.category || '',
      rating: vendor.rating ? String(vendor.rating) : '0',
      payment_terms: vendor.payment_terms || '',
      status: vendor.status,
    });
    setIsEditVendorOpen(true);
  };

  const handleUpdateVendor = async () => {
    if (!editingVendor) return;
    await updateVendor.mutateAsync({
      id: editingVendor.id,
      name: vendorForm.name,
      email: vendorForm.email || null,
      phone: vendorForm.phone || null,
      address: vendorForm.address || null,
      category: vendorForm.category || null,
      rating: vendorForm.rating ? parseFloat(vendorForm.rating) : null,
      payment_terms: vendorForm.payment_terms || null,
      status: vendorForm.status,
    });
    setIsEditVendorOpen(false);
    setEditingVendor(null);
    resetVendorForm();
  };

  const handleCreatePO = async () => {
    const subtotal = parseFloat(poForm.subtotal);
    const taxRate = parseFloat(poForm.tax || '0');
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    await createPO.mutateAsync({
      vendor_id: poForm.vendor_id || null,
      order_number: poForm.order_number,
      items: poForm.items ? JSON.parse(poForm.items) : [],
      subtotal: subtotal,
      tax: tax,
      total: total,
      status: 'pending',
      expected_delivery: poForm.expected_delivery || null,
      notes: poForm.notes || null,
    });
    setIsPODialogOpen(false);
    resetPOForm();
  };

  const VendorForm = ({ onSubmit, isSubmitting }: { onSubmit: () => void; isSubmitting: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Vendor Name *</Label>
        <Input
          id="name"
          value={vendorForm.name}
          onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
          placeholder="Company name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={vendorForm.email}
            onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
            placeholder="vendor@example.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={vendorForm.phone}
            onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
            placeholder="+254..."
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={vendorForm.address}
          onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
          placeholder="Full address"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={vendorForm.category} onValueChange={(v) => setVendorForm({ ...vendorForm, category: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaning-supplies">Cleaning Supplies</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="chemicals">Chemicals</SelectItem>
              <SelectItem value="uniforms">Uniforms</SelectItem>
              <SelectItem value="vehicles">Vehicles</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={vendorForm.rating}
            onChange={(e) => setVendorForm({ ...vendorForm, rating: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="payment_terms">Payment Terms</Label>
          <Select value={vendorForm.payment_terms} onValueChange={(v) => setVendorForm({ ...vendorForm, payment_terms: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net-7">Net 7</SelectItem>
              <SelectItem value="net-15">Net 15</SelectItem>
              <SelectItem value="net-30">Net 30</SelectItem>
              <SelectItem value="net-60">Net 60</SelectItem>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={vendorForm.status} onValueChange={(v) => setVendorForm({ ...vendorForm, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting || !vendorForm.name}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingVendor ? 'Update Vendor' : 'Add Vendor'}
        </Button>
      </DialogFooter>
    </div>
  );

  const POForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="order_number">PO Number</Label>
        <Input
          id="order_number"
          value={poForm.order_number}
          onChange={(e) => setPOForm({ ...poForm, order_number: e.target.value })}
          placeholder="PO-001"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vendor">Vendor</Label>
        <Select value={poForm.vendor_id} onValueChange={(v) => setPOForm({ ...poForm, vendor_id: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="subtotal">Subtotal (KES)</Label>
          <Input
            id="subtotal"
            type="number"
            value={poForm.subtotal}
            onChange={(e) => setPOForm({ ...poForm, subtotal: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tax">Tax (%)</Label>
          <Input
            id="tax"
            type="number"
            value={poForm.tax}
            onChange={(e) => setPOForm({ ...poForm, tax: e.target.value })}
            placeholder="16"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="expected_delivery">Expected Delivery</Label>
        <Input
          id="expected_delivery"
          type="date"
          value={poForm.expected_delivery}
          onChange={(e) => setPOForm({ ...poForm, expected_delivery: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={poForm.notes}
          onChange={(e) => setPOForm({ ...poForm, notes: e.target.value })}
          placeholder="Additional notes..."
        />
      </div>
      {poForm.subtotal && (
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>KES {parseFloat(poForm.subtotal || '0').toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax ({poForm.tax || '0'}%):</span>
            <span>KES {((parseFloat(poForm.subtotal || '0') * parseFloat(poForm.tax || '0')) / 100).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>KES {(parseFloat(poForm.subtotal || '0') * (1 + parseFloat(poForm.tax || '0') / 100)).toLocaleString()}</span>
          </div>
        </div>
      )}
      <DialogFooter>
        <Button onClick={handleCreatePO} disabled={createPO.isPending || !poForm.order_number || !poForm.subtotal}>
          {createPO.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Purchase Order
        </Button>
      </DialogFooter>
    </div>
  );

  if (vendorsLoading) {
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
          <h1 className="text-2xl font-bold text-foreground">Procurement</h1>
          <p className="text-muted-foreground">Manage vendors and purchase orders</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetVendorForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
                <DialogDescription>
                  Enter the vendor details below.
                </DialogDescription>
              </DialogHeader>
              <VendorForm onSubmit={handleCreateVendor} isSubmitting={createVendor.isPending} />
            </DialogContent>
          </Dialog>
          <Dialog open={isPODialogOpen} onOpenChange={setIsPODialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetPOForm}>
                <Plus className="mr-2 h-4 w-4" />
                Create PO
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
                <DialogDescription>
                  Enter the purchase order details.
                </DialogDescription>
              </DialogHeader>
              <POForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-2xl font-bold">{activeVendors}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">KES {(totalSpent / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{avgRating}</p>
                  <Star className="h-5 w-5 fill-warning text-warning" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredVendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No vendors found. Click "Add Vendor" to create one.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <p className="text-sm text-muted-foreground">{vendor.payment_terms || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.category || '-'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{vendor.email || '-'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{vendor.phone || '-'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{vendor.rating || 0}</span>
                            <Star className="h-4 w-4 fill-warning text-warning" />
                          </div>
                        </TableCell>
                        <TableCell>{vendor.total_orders || 0}</TableCell>
                        <TableCell>KES {Number(vendor.total_spent || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              vendor.status === 'active'
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditVendor(vendor)}>
                                Edit Vendor
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                resetPOForm();
                                setPOForm(prev => ({ ...prev, vendor_id: vendor.id }));
                                setIsPODialogOpen(true);
                              }}>
                                Create Order
                              </DropdownMenuItem>
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
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {purchaseOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No purchase orders yet. Click "Create PO" to create your first order.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-mono">{po.order_number}</TableCell>
                        <TableCell>{po.vendors?.name || '-'}</TableCell>
                        <TableCell className="font-medium">KES {Number(po.total || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={po.status === 'completed' ? 'default' : 'secondary'}>
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {po.expected_delivery ? format(new Date(po.expected_delivery), 'MMM dd, yyyy') : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(po.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditVendorOpen} onOpenChange={setIsEditVendorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Update the vendor details.
            </DialogDescription>
          </DialogHeader>
          <VendorForm onSubmit={handleUpdateVendor} isSubmitting={updateVendor.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
