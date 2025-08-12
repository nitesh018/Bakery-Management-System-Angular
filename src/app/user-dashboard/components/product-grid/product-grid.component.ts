import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../services/product.service';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../shared/error-message/error-message.component';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent, LoadingSpinnerComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() selectedQuantities: { [productId: number]: number } = {};
  @Output() addToCart = new EventEmitter<Product>();
  @Output() retryLoad = new EventEmitter<void>();
  @Output() quantityChange = new EventEmitter<{productId: number, quantity: number}>();

  onAddToCart(event: {product: Product, quantity: number}) {
    this.addToCart.emit(event.product);
  }

  onRetryLoad() {
    this.retryLoad.emit();
  }

  onQuantityChange(event: {productId: number, quantity: number}) {
    this.quantityChange.emit(event);
  }

  getSelectedQuantity(productId: number | undefined): number {
    return productId ? (this.selectedQuantities[productId] || 0) : 0;  // Default to 0
  }

  trackById(index: number, item: Product) { return item.id ?? index; }
}
