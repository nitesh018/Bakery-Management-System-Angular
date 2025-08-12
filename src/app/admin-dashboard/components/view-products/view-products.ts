import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.html',
  styleUrls: ['./view-products.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ViewProductsComponent implements OnInit {
  
  // Loading state
  isLoading: boolean = false;
  
  // Products data
  productsList: Product[] = [];

  constructor(private productService: ProductService, private notify: NotificationService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  // Show all products
  async loadAllProducts() {
    this.isLoading = true;

    try {
      this.productsList = await this.productService.getAllProducts();
    } catch (error) {
      this.notify.error('Load products failed');
      this.productsList = [];
    } finally {
      this.isLoading = false;
    }
  }

  trackById(index: number, item: Product) { return item.id ?? index; }
}
