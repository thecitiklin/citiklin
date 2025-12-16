export type VehicleStatus = 'available' | 'in-use' | 'maintenance' | 'out-of-service';
export type VehicleType = 'van' | 'truck' | 'car' | 'motorcycle';

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  type: VehicleType;
  status: VehicleStatus;
  currentDriverId?: string;
  currentDriverName?: string;
  fuelLevel: number;
  mileage: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  insuranceExpiry: string;
  capacity: string;
  location?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  cost: number;
  date: string;
  performedBy: string;
  notes?: string;
}

export interface DriverAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  startDate: string;
  endDate?: string;
  projectId?: string;
}
