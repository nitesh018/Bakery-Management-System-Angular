import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() removeItem = new EventEmitter<number>();
  @Output() increaseQuantity = new EventEmitter<number>();
  @Output() decreaseQuantity = new EventEmitter<number>();

  onRemoveItem() {
    this.removeItem.emit(this.item.id);
  }

  onIncreaseQuantity() {
    this.increaseQuantity.emit(this.item.id);
  }

  onDecreaseQuantity() {
    this.decreaseQuantity.emit(this.item.id);
  }
}
