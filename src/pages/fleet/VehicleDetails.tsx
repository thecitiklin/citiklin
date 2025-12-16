import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Fuel,
  Wrench,
  Calendar,
  MapPin,
  User,
  FileText,
  Edit,
  AlertCircle,
  Shield,
  Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockVehicles, mockMaintenanceRecords } from '@/data/mockData';
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

export default function VehicleDetails() {
  const { id } = useParams();
  const vehicle = mockVehicles.find((v) => v.id === id);
  const maintenanceRecords = mockMaintenanceRecords.filter((m) => m.vehicleId === id);

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Vehicle not found</h2>
        <p className="text-muted-foreground mb-4">The vehicle you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/fleet">Back to Fleet</Link>
        </Button>
      </div>
    );
  }

  const daysUntilMaintenance = Math.ceil(
    (new Date(vehicle.nextMaintenanceDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const daysUntilInsurance = Math.ceil(
    (new Date(vehicle.insuranceExpiry).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-4xl">{typeIcons[vehicle.type]}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{vehicle.name}</h1>
            <p className="text-muted-foreground">{vehicle.plateNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Wrench className="mr-2 h-4 w-4" />
            Schedule Maintenance
          </Button>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <Badge className={statusColors[vehicle.status]}>
        {vehicle.status.replace('-', ' ')}
      </Badge>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="text-xl font-bold">{vehicle.mileage.toLocaleString()} km</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-accent/10 p-3">
                <Fuel className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Level</p>
                <p className="text-xl font-bold">{vehicle.fuelLevel}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-3 ${
                  daysUntilMaintenance <= 7 ? 'bg-destructive/10' : 'bg-warning/10'
                }`}
              >
                <Wrench
                  className={`h-5 w-5 ${
                    daysUntilMaintenance <= 7 ? 'text-destructive' : 'text-warning'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Service</p>
                <p className="text-xl font-bold">{daysUntilMaintenance} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-3 ${
                  daysUntilInsurance <= 30 ? 'bg-destructive/10' : 'bg-secondary/10'
                }`}
              >
                <Shield
                  className={`h-5 w-5 ${
                    daysUntilInsurance <= 30 ? 'text-destructive' : 'text-secondary-foreground'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Insurance Expires</p>
                <p className="text-xl font-bold">{daysUntilInsurance} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{vehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plate Number</p>
                    <p className="font-medium">{vehicle.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{vehicle.capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fuel Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span>Fuel Level</span>
                    </div>
                    <span className="font-medium">{vehicle.fuelLevel}%</span>
                  </div>
                  <Progress
                    value={vehicle.fuelLevel}
                    className={`h-3 ${vehicle.fuelLevel < 25 ? '[&>div]:bg-destructive' : ''}`}
                  />
                </div>

                {vehicle.currentDriverName && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Current Driver</p>
                      <p className="font-medium">{vehicle.currentDriverName}</p>
                    </div>
                  </div>
                )}

                {vehicle.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{vehicle.location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Maintenance</p>
                    <p className="font-medium">{vehicle.lastMaintenanceDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Next Maintenance</p>
                    <p className="font-medium">{vehicle.nextMaintenanceDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Insurance Expiry</p>
                    <p className="font-medium">{vehicle.insuranceExpiry}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Maintenance History</CardTitle>
              <Button>Add Record</Button>
            </CardHeader>
            <CardContent>
              {maintenanceRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.performedBy}</TableCell>
                        <TableCell>KES {record.cost.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No maintenance records</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Driver Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                No assignment history available
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No documents uploaded yet</p>
              <div className="flex justify-center">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
