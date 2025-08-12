import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../services/product.service';
import { QuantitySelectorComponent } from '../../../shared/quantity-selector/quantity-selector.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [CommonModule, QuantitySelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() selectedQuantity: number = 0;  // Start with 0
  @Output() addToCart = new EventEmitter<{product: Product, quantity: number}>();
  @Output() quantityChange = new EventEmitter<{productId: number, quantity: number}>();

  onQuantityChange(quantity: number) {
    if (this.product.id) {
      this.quantityChange.emit({productId: this.product.id, quantity});
    }
  }

  onAddToCart() {
    if (this.selectedQuantity > 0) {  // Only add if quantity > 0
      this.addToCart.emit({product: this.product, quantity: this.selectedQuantity});
    }
  }
}
