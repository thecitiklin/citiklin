import { useState } from 'react';
import { Plus, Search, Filter, Package, AlertTriangle, TrendingDown, MoreVertical, Loader2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInventory, useCreateInventoryItem, useDeleteInventoryItem } from '@/hooks/useInventory';

const statusColors: Record<string, string> = {
  in_stock: 'bg-accent text-accent-foreground',
  low_stock: 'bg-warning text-warning-foreground',
  out_of_stock: 'bg-destructive text-destructive-foreground',
};

export default function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', sku: '', category: 'cleaning-supplies', quantity: '', min_quantity: '10', unit_price: '', supplier: '' });

  const { data: items = [], isLoading } = useInventory();
  const createItem = useCreateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const inStockCount = items.filter((i) => i.status === 'in_stock').length;
  const lowStockCount = items.filter((i) => i.status === 'low_stock').length;
  const outOfStockCount = items.filter((i) => i.status === 'out_of_stock').length;
  const totalValue = items.reduce((sum, item) => sum + item.quantity * (item.unit_price || 0), 0);

  const handleCreateItem = async () => {
    const quantity = parseInt(newItem.quantity) || 0;
    const minQuantity = parseInt(newItem.min_quantity) || 10;
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (quantity === 0) status = 'out_of_stock';
    else if (quantity < minQuantity) status = 'low_stock';

    await createItem.mutateAsync({
      name: newItem.name,
      sku: newItem.sku || null,
      category: newItem.category,
      quantity,
      min_quantity: minQuantity,
      unit: 'unit',
      unit_price: newItem.unit_price ? parseFloat(newItem.unit_price) : null,
      supplier: newItem.supplier || null,
      location: null,
      status,
    });
    setNewItem({ name: '', sku: '', category: 'cleaning-supplies', quantity: '', min_quantity: '10', unit_price: '', supplier: '' });
    setIsDialogOpen(false);
  };

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
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Track and manage your stock levels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input id="name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning-supplies">Cleaning Supplies</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="safety-gear">Safety Gear</SelectItem>
                      <SelectItem value="chemicals">Chemicals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_quantity">Min Quantity</Label>
                  <Input id="min_quantity" type="number" value={newItem.min_quantity} onChange={(e) => setNewItem({ ...newItem, min_quantity: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_price">Unit Price (KES)</Label>
                  <Input id="unit_price" type="number" value={newItem.unit_price} onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleCreateItem} disabled={!newItem.name || !newItem.category || createItem.isPending} className="w-full">
                {createItem.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold text-accent">{inStockCount}</p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-warning">{lowStockCount}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Inventory Value</p>
              <p className="text-3xl font-bold">KES {totalValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search items or SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cleaning-supplies">Cleaning Supplies</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="safety-gear">Safety Gear</SelectItem>
                  <SelectItem value="chemicals">Chemicals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader><CardTitle>Inventory Items</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.sku || '-'}</TableCell>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span>{item.quantity} / {item.min_quantity}</span>
                      <Progress
                        value={item.min_quantity ? (item.quantity / item.min_quantity) * 100 : 100}
                        className={`h-1.5 ${item.quantity === 0 ? '[&>div]:bg-destructive' : item.quantity < (item.min_quantity || 0) ? '[&>div]:bg-warning' : ''}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell><Badge className={statusColors[item.status]}>{item.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell>{item.unit_price ? `KES ${item.unit_price.toLocaleString()}` : '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{item.supplier || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Item</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteItem.mutate(item.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredItems.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground">No inventory items found. Add your first item to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
