import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Truck, Wrench, MapPin, MoreVertical, AlertTriangle, Loader2 } from 'lucide-react';
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
import { useVehicles, useCreateVehicle, useDeleteVehicle } from '@/hooks/useVehicles';

const statusColors: Record<string, string> = {
  available: 'bg-accent text-accent-foreground',
  in_use: 'bg-primary text-primary-foreground',
  maintenance: 'bg-warning text-warning-foreground',
  retired: 'bg-destructive text-destructive-foreground',
};

const typeIcons: Record<string, string> = {
  van: '🚐',
  truck: '🚛',
  car: '🚗',
  motorcycle: '🏍️',
};

export default function FleetOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: '', license_plate: '', vehicle_type: 'van', fuel_type: '' });

  const { data: vehicles = [], isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.vehicle_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const availableCount = vehicles.filter((v) => v.status === 'available').length;
  const inUseCount = vehicles.filter((v) => v.status === 'in_use').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance').length;
  const needsMaintenance = vehicles.filter((v) => {
    if (!v.next_maintenance) return false;
    const nextMaintenance = new Date(v.next_maintenance);
    const today = new Date();
    const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7;
  }).length;

  const handleCreateVehicle = async () => {
    await createVehicle.mutateAsync({
      name: newVehicle.name,
      license_plate: newVehicle.license_plate,
      vehicle_type: newVehicle.vehicle_type,
      status: 'available',
      fuel_type: newVehicle.fuel_type || null,
      mileage: 0,
      last_maintenance: null,
      next_maintenance: null,
      assigned_driver: null,
      notes: null,
    });
    setNewVehicle({ name: '', license_plate: '', vehicle_type: 'van', fuel_type: '' });
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
          <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground">Monitor and manage your vehicle fleet</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Vehicle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Vehicle</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name *</Label>
                <Input id="name" value={newVehicle.name} onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_plate">License Plate *</Label>
                <Input id="license_plate" value={newVehicle.license_plate} onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select value={newVehicle.vehicle_type} onValueChange={(v) => setNewVehicle({ ...newVehicle, vehicle_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Input id="fuel_type" value={newVehicle.fuel_type} onChange={(e) => setNewVehicle({ ...newVehicle, fuel_type: e.target.value })} placeholder="Petrol, Diesel, Electric..." />
              </div>
              <Button onClick={handleCreateVehicle} disabled={!newVehicle.name || !newVehicle.license_plate || createVehicle.isPending} className="w-full">
                {createVehicle.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Vehicle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{availableCount}</p>
              </div>
              <div className="rounded-full bg-accent/10 p-3"><Truck className="h-5 w-5 text-accent" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Use</p>
                <p className="text-2xl font-bold">{inUseCount}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3"><Truck className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Maintenance</p>
                <p className="text-2xl font-bold">{maintenanceCount}</p>
              </div>
              <div className="rounded-full bg-warning/10 p-3"><Wrench className="h-5 w-5 text-warning" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due for Service</p>
                <p className="text-2xl font-bold">{needsMaintenance}</p>
              </div>
              <div className="rounded-full bg-destructive/10 p-3"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
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
              <Input placeholder="Search vehicles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeIcons[vehicle.vehicle_type] || '🚗'}</span>
                  <div>
                    <Link to={`/fleet/${vehicle.id}`}>
                      <CardTitle className="text-base hover:text-primary transition-colors">{vehicle.name}</CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground">{vehicle.license_plate}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to={`/fleet/${vehicle.id}`}>View Details</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteVehicle.mutate(vehicle.id)} className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className={statusColors[vehicle.status]}>{vehicle.status.replace('_', ' ')}</Badge>
              {vehicle.profiles?.name && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Driver:</span>
                  <span className="font-medium">{vehicle.profiles.name}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t">
                <div>
                  <span className="text-muted-foreground">Mileage: </span>
                  <span className="font-medium">{(vehicle.mileage || 0).toLocaleString()} km</span>
                </div>
              </div>
              {vehicle.next_maintenance && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wrench className="h-3 w-3" />
                  <span>Next service: {vehicle.next_maintenance}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground">No vehicles found. Add your first vehicle to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
