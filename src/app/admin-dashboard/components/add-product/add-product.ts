import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AddProductComponent {
  // UI loading state - button disable aur spinner ke liye
  isLoading = false;

  // Main form structure - sabhi input fields ka group
  form: FormGroup;

  constructor(private productService: ProductService, private notify: NotificationService, fb: FormBuilder) {
    // Form setup with validation rules - har field ke rules define kiye
    this.form = fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], // Name mandatory, min 2 chars
      price: [0, [Validators.required, Validators.min(0.01)]], // Price > 0 hona chahiye
      quantity: [0, [Validators.required, Validators.min(0)]] // Quantity negative nahi ho sakti
    });
  }

  // Template me easy access ke liye shortcut - f.name.errors instead of form.controls.name.errors
  get f() { return this.form.controls; }

  // Main business logic - product add karne ka process
  async addNewProduct() {
    // Pehle form validate karo - agar galat hai to proceed mat karo
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); // Sare fields ko touch karo taaki errors show ho sake
      this.notify.error('Fix errors'); 
      return; // Yaha se exit kar jao
    }

    // Loading start - button disable ho jayega aur spinner dikhega
    this.isLoading = true;

    try {
      // Backend API call - form ka data bhejenge service ke through
      const result = await this.productService.addProduct(this.form.value);
      
      // Success case - product successfully add ho gaya
      if (result.success) { 
        this.notify.success('Product added'); // Success message dikhao
        this.clearAddForm(); // Form ko clear kar do next product ke liye
      }
      // Failure case - API se error aya but call successful thi
      else { 
        this.notify.error(result.message || 'Add failed'); 
      }
    } 
    // Network ya unexpected error case - complete failure
    catch {
      this.notify.error('Add error'); 
    } 
    // Cleanup - success ho ya failure, loading band karna hai
    finally {
      this.isLoading = false; // Button enable kar do wapas
    }
  }

  // Form reset utility - successful add ke baad form ko default state me kar deta hai
  clearAddForm() { 
    this.form.reset({ name: '', price: 0, quantity: 0 }); // Default values set kar do
  }
}
