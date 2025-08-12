import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Order } from '../models/order.model';
import { SalesReportSummary, SalesReportEntry } from '../models/sales-report.model';

export interface Product { id?: number; name: string; price: number; quantity: number; }
export interface SimpleResponse { success: boolean; message: string; data?: any; }

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  // Central auth options (always send credentials + token header if present)
  private authOptions() {
    return { headers: this.authService.getAuthHeaders(), withCredentials: true };
  }

  private buildUrl(endpoint: string): string {
    const base = (API_CONFIG.baseUrl || '').trim();
    if (!base) return endpoint; // dev proxy
    if (/^https?:\/\//i.test(endpoint)) return endpoint;
    const b = base.endsWith('/') ? base.slice(0,-1) : base;
    const e = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return b + e;
  }

  async addProduct(product: Product): Promise<SimpleResponse> {
    try {
      const outbound = { ...product, name: product.name?.trim() };
      const url = this.buildUrl(API_CONFIG.endpoints.addProduct);
      const result = await firstValueFrom(this.http.post(url, outbound, this.authOptions()));
      return { success: true, message: 'Product added successfully!', data: result };
    } catch { return { success: false, message: 'Failed to add product' }; }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const url = this.buildUrl(API_CONFIG.endpoints.productsAdmin);
      const products = await firstValueFrom(this.http.get<Product[]>(url, this.authOptions()));
      return products || [];
    } catch { return []; }
  }

  async updateProduct(product: Product): Promise<SimpleResponse> {
    try {
      const outbound = { ...product, name: product.name?.trim() };
      const url = this.buildUrl(API_CONFIG.endpoints.updateProduct);
      const result = await firstValueFrom(this.http.post(url, outbound, this.authOptions()));
      return { success: true, message: 'Product updated successfully!', data: result };
    } catch { return { success: false, message: 'Failed to update product' }; }
  }

  async deleteProduct(productName: string): Promise<SimpleResponse> {
    try {
      const url = this.buildUrl(API_CONFIG.endpoints.deleteProductByName);
      const result = await firstValueFrom(this.http.request('delete', url, { body: { name: productName }, ...this.authOptions() }));
      return { success: true, message: 'Product deleted successfully!', data: result };
    } catch { return { success: false, message: 'Failed to delete product' }; }
  }

  async getSalesReport(): Promise<SalesReportSummary> {
    try {
      const url = this.buildUrl(API_CONFIG.endpoints.salesReport);
      console.log('Fetching sales report from:', url);
      console.log('Auth headers:', this.authService.getAuthHeaders());
      console.log('User logged in:', this.authService.isLoggedIn());
      console.log('User role:', this.authService.getUserRole());
      
      const salesData: any = await firstValueFrom(this.http.get(url, this.authOptions()));
      
      console.log('Sales data received:', salesData);
      const rawList = salesData?.sales_report || [];
      console.log('Raw sales list:', rawList);
      const sales: SalesReportEntry[] = rawList.map((r: any) => ({
        order_id: r.order_id || r.id,
        item_name: r.item_name || r.productName || r.name || 'Unknown Item',
        quantity: r.quantity || 1,
        total_price: parseFloat((r.total_price || r.totalPrice || 0).toString()),
        created_at: r.created_at || r.orderDate || new Date().toISOString(),
        user_email: r.user_email || r.email || '',
        status: r.status || r.order_status || 'PENDING'
      }));
      const totalSales = Math.round(sales.reduce((sum, s) => sum + (s.total_price || 0), 0) * 100) / 100;
      return { sales, totalSales, totalOrders: sales.length, totalProducts: sales.length };
    } catch (error) {
      console.error('Sales report error:', error);
      return { sales: [], totalSales: 0, totalOrders: 0, totalProducts: 0 }; 
    }
  }

  // Normalize status to backend expected values 'Pending' or 'Done'
  private normalizeStatus(status: string): string {
    const s = (status || '').trim().toLowerCase();
    if (s === 'pending') return 'Pending';
    if (s === 'done') return 'Done';
    return status; // fallback
  }

  async updateOrderStatus(orderId: number, status: string): Promise<SimpleResponse> {
    try {
      const data = { order_id: orderId, status: this.normalizeStatus(status) };
      const url = this.buildUrl(API_CONFIG.endpoints.updateOrderStatus);
      const result = await firstValueFrom(this.http.post(url, data, this.authOptions()));
      return { success: true, message: 'Order status updated successfully!', data: result };
    } catch { return { success: false, message: 'Failed to update order status' }; }
  }

  async getUserProducts(): Promise<Product[]> {
    try {
      const url = this.buildUrl(API_CONFIG.endpoints.userProducts);
      const products = await firstValueFrom(this.http.get<Product[]>(url, this.authOptions()));
      return products || [];
    } catch { return []; }
  }

  async placeOrder(orderData: any): Promise<SimpleResponse> {
    try {
      const url = this.buildUrl(API_CONFIG.endpoints.userOrder);
      const result = await firstValueFrom(this.http.post(url, orderData, this.authOptions()));
      return { success: true, message: 'Order placed successfully!', data: result };
    } catch { return { success: false, message: 'Failed to place order' }; }
  }

  async getUserOrders(): Promise<Order[]> {
    try {
      const url = this.buildUrl(API_CONFIG.endpoints.userOrders);
      const orders = await firstValueFrom(this.http.get<any[]>(url, this.authOptions()));
      return (orders || []).map(o => ({
        id: o.id || o.order_id,
        userEmail: o.userEmail || o.user_email || '',
        items: (o.items || o.orderItems || []).map((it: any) => ({
          productName: it.productName || it.item_name || '',
          quantity: it.quantity || 0,
          price: it.price || 0,
          totalPrice: it.totalPrice || it.total_price || ((it.price || 0) * (it.quantity || 0))
        })),
        totalAmount: o.totalAmount || o.total_amount || 0,
        orderDate: o.orderDate || o.created_at || new Date().toISOString(),
        status: o.status || 'PENDING'
      }));
    } catch { return []; }
  }

  async getProducts(): Promise<Product[]> {
    return this.authService.getUserRole() === 'admin' ? this.getAllProducts() : this.getUserProducts();
  }
}
