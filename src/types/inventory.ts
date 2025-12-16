export type ItemCategory = 'cleaning-supplies' | 'equipment' | 'safety-gear' | 'consumables' | 'chemicals';
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
export type POStatus = 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: ItemCategory;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  status: StockStatus;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  paymentTerms: string;
  status: 'active' | 'inactive';
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  items: POItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: POStatus;
  orderDate: string;
  expectedDelivery?: string;
  notes?: string;
}

export interface POItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
