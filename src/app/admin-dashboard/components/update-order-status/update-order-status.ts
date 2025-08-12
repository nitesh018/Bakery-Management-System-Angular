import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-update-order-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-order-status.html',
  styleUrls: ['./update-order-status.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateOrderStatusComponent {
  orderId: number | null = null;
  status: string = '';
  loading = false;

  constructor(private productService: ProductService, private notify: NotificationService) {}

  async submit() {
    if (!this.orderId || !this.status) { this.notify.error('Enter order id & status'); return; }
    this.loading = true;
    try {
      const result = await this.productService.updateOrderStatus(this.orderId, this.status);
      if (result.success) { this.notify.success('Status updated'); this.clear(); } else { this.notify.error(result.message); }
    } catch { this.notify.error('Update failed'); }
    finally { this.loading = false; }
  }

  clear() { this.orderId = null; this.status = ''; }
}
