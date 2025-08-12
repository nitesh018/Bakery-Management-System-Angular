import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.html',
  styleUrls: ['./update-product.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UpdateProductComponent {
  // Loading state
  isLoading = false;

  // Reactive form for updating product
  form: FormGroup;

  constructor(private productService: ProductService, private notify: NotificationService, fb: FormBuilder) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Get form controls for easy access
  get f() { return this.form.controls; }

  // Update existing product
  async updateExistingProduct() {
    if (this.form.invalid) { this.form.markAllAsTouched(); this.notify.error('Fix errors'); return; }

    this.isLoading = true;

    try {
      const result = await this.productService.updateProduct(this.form.value);

      if (result.success) { 
        this.notify.success('Product updated'); 
        this.clearUpdateForm(); 
      }
      else { 
        this.notify.error(result.message || 'Update failed'); 
      }
    } catch { 
      this.notify.error('Update error'); 
    } finally { 
      this.isLoading = false; 
    }
  }

  // Clear form functions
  clearUpdateForm() { 
    this.form.reset({ name: '', price: 0, quantity: 0 }); 
  }
}
