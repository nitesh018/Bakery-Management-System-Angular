import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ProductService, Product } from '../services/product.service';
import { CartService, CartItem } from '../services/cart.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CartUpdateModalComponent } from './components/shared/cart-update-modal/cart-update-modal.component';
import { API_CONFIG } from '../config/api.config';
import { NotificationService } from '../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css'],
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ProductGridComponent,
    ShoppingCartComponent,
    CartUpdateModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItems: CartItem[] = [];

  loading = false;
  cartLoading = false;

  error: string | null = null;
  showCart = false;
  cartCount = 0;
  showUpdateModal = false;

  selectedQuantities: { [productId: number]: number } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private notify: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts(); // Page load pe products laao
    // subscribe to reactive cart state
    this.cartService.items$.pipe(takeUntil(this.destroy$)).subscribe(items => { this.cartItems = items; this.cdr.markForCheck(); }); // Cart items ko real-time sync karo
    this.cartService.count$.pipe(takeUntil(this.destroy$)).subscribe(count => { this.cartCount = count; this.cdr.markForCheck(); }); // Cart count ko real-time update karo
  }

  async loadProducts() {
    this.loading = true; // Loading spinner start karo
    this.error = null;
    this.products = [];
    this.cdr.markForCheck(); // Trigger change detection for loading state

    try {
      const backendProducts = await this.productService.getUserProducts(); // API se products fetch karo

      if (Array.isArray(backendProducts)) {
        this.products = backendProducts.filter(product =>
          product &&
          product.name &&
          typeof product.price === 'number' &&
          typeof product.quantity === 'number' &&
          product.quantity >= 0
        ); // Valid products ko filter karo
      }

      this.selectedQuantities = {};
      this.products.forEach(product => {
        if (product.id) {
          this.selectedQuantities[product.id] = 0; // Start with 0 instead of 1
        }
      }); // Har product ke liye default quantity 0 set karo

      if (this.products.length === 0) {
        this.error = 'No products found. Admin needs to add products first.'; // Agar koi product nahi mila
      } else {
        await this.loadCartFromBackend(); // Cart data load karo
      }

    } catch (error) {
      this.error = 'Unable to load products. Please check internet connection.'; // Network error handling
    } finally {
      this.loading = false; // Loading band karo
      this.cdr.markForCheck(); // Trigger change detection for final state
    }
  }

  async loadCartFromBackend() {
    const userEmail = this.authService.getUserEmail();
    if (userEmail && this.products.length > 0) {
      this.cartLoading = true;
      this.cdr.markForCheck();
      try {
        await this.cartService.syncCartWithBackend(userEmail, this.products);
        this.updateCartData();
      } catch (error) {
        // fallback to local cart
      } finally {
        this.cartLoading = false;
        this.cdr.markForCheck();
      }
    }
  }

  async toggleCart() {
    this.showCart = !this.showCart; // Cart modal show/hide toggle karo
    this.cdr.markForCheck();
    if (this.showCart) {
      await this.loadCartFromBackend(); // Cart khulne pe fresh data load karo
    }
    this.updateCartData();
  }

  onCartUpdateRequested() {
    this.showUpdateModal = true;
    this.showCart = false; // Close the shopping cart modal
    this.cdr.markForCheck();
  }

  onCloseUpdateModal() {
    this.showUpdateModal = false;
    this.cdr.markForCheck();
  }

  onModalIncreaseQuantity(productId: number) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
      this.cdr.markForCheck();
    }
  }

  onModalDecreaseQuantity(productId: number) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
      this.cdr.markForCheck();
    }
  }

  async onModalUpdateCart() {
    this.showUpdateModal = false;
    this.cdr.markForCheck();
    
    const email = this.authService.getUserEmail();
    if (!email) { this.notify.error('Login again'); return; }
    if (this.cartItems.length === 0) { this.notify.info('Cart empty'); return; }
    
    try {
      for (const ci of this.cartItems) {
        await this.cartService.updateCartBackend(email, { item_name: ci.name, quantity: ci.quantity });
      }
      this.notify.success('Cart updated');
      await this.loadCartFromBackend();
    } catch {
      this.notify.error('Update cart failed');
    }
  }

  onCheckoutRequested() {
    this.checkoutCart();
  }

  private async checkoutCart() {
    const email = this.authService.getUserEmail();
    if (!email) { this.notify.error('Login again'); return; }
    if (this.cartItems.length === 0) { this.notify.info('Cart empty'); return; }
    try {
      await this.cartService.checkoutCart(email); // Backend pe order place karo
      this.notify.success('Checkout successful'); // Success message
      this.cartService.clearCart(); // Local cart clear kar do
      this.updateCartData();
      this.showCart = false;
      this.cdr.markForCheck();
      
      // Reload the page to refresh all data
      setTimeout(() => {
        window.location.reload(); // Page reload kar do fresh data ke liye
      }, 1000); // Wait 1 second to show the success message before reloading
      
    } catch {
      this.notify.error('Checkout failed'); // Error case handling
    }
  }

  closeCart() {
    this.showCart = false;
  }

  updateCartData() {
    // kept for backward compatibility if called; assignments now handled by subscriptions
    this.cartItems = this.cartService.getCartItems();
    this.cartCount = this.cartService.getCartCount();
  }

  async addToCart(product: Product) {
    if (!product.id) {
      this.notify.error('Invalid product - cannot add to cart');
      return;
    }

    if (product.quantity > 0) { // Check agar product stock mein hai
      const selectedQty = this.selectedQuantities[product.id] || 1;
      const userEmail = this.authService.getUserEmail();

      if (!userEmail) { this.notify.error('Login again. Email missing'); return; }
      try {
        const payloadQty = selectedQty;
        await this.cartService.addToCartBackend(userEmail, product.name, payloadQty); // Backend me cart update karo
        await this.loadCartFromBackend(); // Fresh cart data load karo
        this.selectedQuantities[product.id] = 1; // Quantity reset kar do
        this.notify.success(`${product.name} added to cart`); // Success message dikhao
      } catch { this.notify.error('Add to cart failed'); } // Error handling
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.updateCartData();
  }

  increaseQuantity(productId: number) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1); // Quantity badhao
      this.updateCartData();
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item && item.quantity > 1) { // Minimum 1 quantity honi chahiye
      this.cartService.updateQuantity(productId, item.quantity - 1); // Quantity ghatao
      this.updateCartData();
    }
  }

  onQuantityChange(event: { productId: number, quantity: number }) {
    this.selectedQuantities[event.productId] = event.quantity;
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0); // Cart ka total amount calculate karo
  }

  async proceedToBuy() {
    if (this.cartItems.length === 0) { this.notify.info('Cart is empty'); return; }
    await this.placeUserOrder(); // direct without confirmation dialog // Directly order place kar do
  }

  async placeUserOrder() {
    this.notify.info('Order placed successfully (simulated)'); // Demo order placement
    this.cartService.clearCart(); // Cart empty kar do
    this.updateCartData();
  }

  logout() {
    this.authService.logout(); // User ko logout kar do
    this.router.navigate(['/login']); // Login page pe redirect karo
  }

  trackByProductId(index: number, item: Product) { return item.id ?? index; }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
