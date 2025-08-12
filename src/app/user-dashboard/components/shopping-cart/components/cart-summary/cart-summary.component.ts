import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartSummaryComponent {
  @Input() totalAmount: number = 0;
  @Input() hasItems: boolean = false;
  @Output() updateCart = new EventEmitter<void>();
  @Output() checkout = new EventEmitter<void>();

  onUpdateCart() {
    this.updateCart.emit();
  }

  onCheckout() {
    this.checkout.emit();
  }
}
