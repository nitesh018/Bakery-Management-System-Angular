import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../services/cart.service';

@Component({
  selector: 'app-cart-update-modal',
  templateUrl: './cart-update-modal.component.html',
  styleUrls: ['./cart-update-modal.component.css'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartUpdateModalComponent {
  @Input() showModal: boolean = false;
  @Input() cartItems: CartItem[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateCart = new EventEmitter<CartItem[]>();
  @Output() increaseQuantity = new EventEmitter<number>();
  @Output() decreaseQuantity = new EventEmitter<number>();

  onCloseModal() {
    this.closeModal.emit();
  }

  onIncreaseQuantity(productId: number) {
    this.increaseQuantity.emit(productId);
  }

  onDecreaseQuantity(productId: number) {
    this.decreaseQuantity.emit(productId);
  }

  onUpdateCart() {
    this.updateCart.emit(this.cartItems);
  }

  onModalClick(event: Event) {
    event.stopPropagation();
  }

  trackById(index: number, item: CartItem) {
    return item.id;
  }
}
