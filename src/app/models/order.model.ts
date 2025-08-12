export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id?: number;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string; // ISO string
  status?: string;
}
