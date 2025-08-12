import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../services/cart.service';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingCartComponent {
  @Input() showCart: boolean = false;
  @Input() cartItems: CartItem[] = [];
  @Input() cartLoading: boolean = false;
  @Input() totalAmount: number = 0;
  @Output() closeCart = new EventEmitter<void>();
  @Output() removeFromCart = new EventEmitter<number>();
  @Output() increaseQuantity = new EventEmitter<number>();
  @Output() decreaseQuantity = new EventEmitter<number>();
  @Output() proceedToBuy = new EventEmitter<void>();
  @Output() updateCart = new EventEmitter<void>();
  @Output() checkout = new EventEmitter<void>();

  onCloseCart() {
    this.closeCart.emit();
  }

  onRemoveFromCart(productId: number) {
    this.removeFromCart.emit(productId);
  }

  onIncreaseQuantity(productId: number) {
    this.increaseQuantity.emit(productId);
  }

  onDecreaseQuantity(productId: number) {
    this.decreaseQuantity.emit(productId);
  }

  onProceedToBuy() {
    this.proceedToBuy.emit();
  }

  onUpdateCart() { this.updateCart.emit(); }
  onCheckout() { this.checkout.emit(); }

  onModalClick(event: Event) {
    event.stopPropagation();
  }

  trackById(index: number, item: CartItem) { return item.id; }
}
