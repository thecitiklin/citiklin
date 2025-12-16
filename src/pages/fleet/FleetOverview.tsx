import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Truck,
  Fuel,
  Wrench,
  MapPin,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { mockVehicles } from '@/data/mockData';
import type { VehicleStatus, VehicleType } from '@/types/fleet';

const statusColors: Record<VehicleStatus, string> = {
  available: 'bg-accent text-accent-foreground',
  'in-use': 'bg-primary text-primary-foreground',
  maintenance: 'bg-warning text-warning-foreground',
  'out-of-service': 'bg-destructive text-destructive-foreground',
};

const typeIcons: Record<VehicleType, string> = {
  van: '🚐',
  truck: '🚛',
  car: '🚗',
  motorcycle: '🏍️',
};

export default function FleetOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const availableCount = mockVehicles.filter((v) => v.status === 'available').length;
  const inUseCount = mockVehicles.filter((v) => v.status === 'in-use').length;
  const maintenanceCount = mockVehicles.filter((v) => v.status === 'maintenance').length;
  const needsMaintenance = mockVehicles.filter((v) => {
    const nextMaintenance = new Date(v.nextMaintenanceDate);
    const today = new Date();
    const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground">Monitor and manage your vehicle fleet</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
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
              <div className="rounded-full bg-accent/10 p-3">
                <Truck className="h-5 w-5 text-accent" />
              </div>
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
              <div className="rounded-full bg-primary/10 p-3">
                <Truck className="h-5 w-5 text-primary" />
              </div>
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
              <div className="rounded-full bg-warning/10 p-3">
                <Wrench className="h-5 w-5 text-warning" />
              </div>
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
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
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
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out-of-service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
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
                  <span className="text-2xl">{typeIcons[vehicle.type]}</span>
                  <div>
                    <Link to={`/fleet/${vehicle.id}`}>
                      <CardTitle className="text-base hover:text-primary transition-colors">
                        {vehicle.name}
                      </CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground">{vehicle.plateNumber}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/fleet/${vehicle.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                    <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className={statusColors[vehicle.status]}>
                {vehicle.status.replace('-', ' ')}
              </Badge>

              {/* Fuel Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fuel Level</span>
                  </div>
                  <span className="font-medium">{vehicle.fuelLevel}%</span>
                </div>
                <Progress
                  value={vehicle.fuelLevel}
                  className={`h-2 ${vehicle.fuelLevel < 25 ? '[&>div]:bg-destructive' : ''}`}
                />
              </div>

              {/* Driver & Location */}
              {vehicle.currentDriverName && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Driver:</span>
                  <span className="font-medium">{vehicle.currentDriverName}</span>
                </div>
              )}

              {vehicle.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{vehicle.location}</span>
                </div>
              )}

              {/* Mileage & Maintenance */}
              <div className="flex justify-between text-sm pt-2 border-t">
                <div>
                  <span className="text-muted-foreground">Mileage: </span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wrench className="h-3 w-3" />
                <span>Next service: {vehicle.nextMaintenanceDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground">No vehicles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
