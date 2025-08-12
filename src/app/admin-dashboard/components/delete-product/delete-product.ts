import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.html',
  styleUrls: ['./delete-product.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class DeleteProductComponent {
  isLoading = false;
  form: FormGroup;

  constructor(private productService: ProductService, private notify: NotificationService, fb: FormBuilder, private confirmDialog: ConfirmDialogService) {
    this.form = fb.group({ name: ['', [Validators.required]] });
  }
  get f() { return this.form.controls; }

  async deleteExistingProduct() {
    if (this.form.invalid) { this.form.markAllAsTouched(); this.notify.warning('Enter product name'); return; }
    const ok = await this.confirmDialog.show({ message: `Delete "${this.f['name'].value}"?`, confirmText: 'Delete', cancelText: 'Cancel' });
    if (!ok) { return; }
    this.isLoading = true;
    try {
      const result = await this.productService.deleteProduct(this.f['name'].value);
      if (result.success) { this.notify.success('Product deleted'); this.clearDeleteForm(); }
      else { this.notify.error(result.message || 'Delete failed'); }
    } catch { this.notify.error('Delete error'); } finally { this.isLoading = false; }
  }

  clearDeleteForm() { this.form.reset({ name: '' }); }
}
