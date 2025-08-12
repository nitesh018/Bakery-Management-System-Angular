import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  templateUrl: './quantity-selector.component.html',
  styleUrls: ['./quantity-selector.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class QuantitySelectorComponent {
  @Input() quantity: number = 0;
  @Input() maxQuantity: number = 100;
  @Output() quantityChange = new EventEmitter<number>();

  increaseQuantity() {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  decreaseQuantity() {
    if (this.quantity > 0) {  // Allow going down to 0
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}
