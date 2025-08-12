import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { SalesReportSummary } from '../../../models/sales-report.model';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.html',
  styleUrls: ['./sales-report.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesReportComponent implements OnInit {

  // Loading state
  isLoading: boolean = false;

  // Sales report data
  salesData: SalesReportSummary = { sales: [], totalSales: 0, totalOrders: 0, totalProducts: 0 };

  constructor(private productService: ProductService, private notify: NotificationService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadSalesReport();
  }

  // Show sales report
  async loadSalesReport() {
    this.isLoading = true;
    this.cdr.markForCheck(); // Trigger change detection for loading state

    try {
      this.salesData = await this.productService.getSalesReport();
    } catch (error) {
      this.notify.error('Load sales report failed');
      this.salesData = {
        sales: [],
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0
      };
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck(); // Trigger change detection for final state
    }
  }

  // Format date for display
  formatDate(dateString: string): string {

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }

    catch {
      return dateString;
    }
  }
}
