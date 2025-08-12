import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartCount = 0;
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private authOptions() {
    return { headers: this.authService.getAuthHeaders(), withCredentials: true };
  }

  // Add item to local cart (for fallback or testing)
  addToCart(product: any): void {
    if (!product.id) return;

    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        totalPrice: product.price
      };
      this.cartItems.push(newItem);
    }

    this.updateCartCount();
    this.pushState();
  }

  // Remove item from cart
  removeFromCart(productId: number): void {
    const index = this.cartItems.findIndex(item => item.id === productId);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.updateCartCount();
      this.pushState();
    }
  }

  // Update quantity of item
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.price;
        this.updateCartCount();
        this.pushState();
      }
    }
  }

  // Get all items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Get total item count
  getCartCount(): number {
    return this.cartCount;
  }

  // Get total amount
  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  // Clear cart
  clearCart(): void {
    this.cartItems = [];
    this.cartCount = 0;
    this.pushState();
  }

  // Update total quantity in cart
  private updateCartCount(): void {
    this.cartCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
  private pushState() { this.itemsSubject.next([...this.cartItems]); this.countSubject.next(this.cartCount); }

  // Add to backend cart
  async addToCartBackend(userEmail: string, itemName: string, quantity: number): Promise<any> {
    const payload = { user_email: userEmail, item_name: itemName, quantity };
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cartAdd}`;
    return firstValueFrom(this.http.post(url, payload, this.authOptions()));
  }

  // Get cart from backend (backend expects JSON body with user_email)
  async getCartFromBackend(userEmail: string): Promise<any> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cartView || API_CONFIG.endpoints.cart}`;
      const payload = { user_email: userEmail };
      const resp: any = await firstValueFrom(this.http.post(url, payload, this.authOptions()));
      // If backend returns an array directly, wrap it
      if (Array.isArray(resp)) {
        return { cart_items: resp.map(r => ({ item_name: r.item_name || r.name, quantity: r.quantity || 0 })) };
      }
      // If backend returns object with items property
      if (resp && Array.isArray(resp.cart_items)) return resp;
      if (resp && Array.isArray(resp.items)) return { cart_items: resp.items };
      return { cart_items: [] };
    } catch (e: any) {
      if (e?.status === 400 || e?.status === 404) return { cart_items: [] };
      return { cart_items: [] };
    }
  }

  // Sync backend cart with frontend
  async syncCartWithBackend(userEmail: string, products: any[]): Promise<void> {
    try {
      const backendCart = await this.getCartFromBackend(userEmail);

      // Clear local cart
      this.cartItems = [];

      // Add backend items to local cart
      if (backendCart.cart_items && Array.isArray(backendCart.cart_items)) {
        for (const backendItem of backendCart.cart_items) {
          const product = products.find(p => p.name === backendItem.item_name);
          if (product) {
            const cartItem: CartItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: backendItem.quantity,
              totalPrice: product.price * backendItem.quantity
            };
            this.cartItems.push(cartItem);
          }
        }
      }

      this.updateCartCount();
      this.pushState();
    } catch {
      // Ignore sync error - use local cache
    }
  }

  async checkoutCart(userEmail: string): Promise<any> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cartCheckout}`;
    const payload = { user_email: userEmail };
    return firstValueFrom(this.http.post(url, payload, this.authOptions()));
  }

  async updateCartBackend(userEmail: string, item: { item_name: string; quantity: number }): Promise<any> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cartUpdate}`;
    const payload = { user_email: userEmail, item_name: item.item_name, quantity: item.quantity };
    return firstValueFrom(this.http.post(url, payload, this.authOptions()));
  }
}
