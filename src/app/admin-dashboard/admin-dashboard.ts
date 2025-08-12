import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet]
})
export class AdminDashboardComponent implements OnInit {
  
  activeRoute: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Track active route for highlighting active button
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.urlAfterRedirects;
    });
    
    // Set initial active route
    this.activeRoute = this.router.url;
  }

  // Check if current route is active
  isActive(route: string): boolean {
    return this.activeRoute.includes(route);
  }

  // Navigation methods for each component
  showAddProduct() {
    this.router.navigate(['/admin-dashboard/add-product']);
  }

  showUpdateProduct() {
    this.router.navigate(['/admin-dashboard/update-product']);
  }

  showDeleteProduct() {
    this.router.navigate(['/admin-dashboard/delete-product']);
  }

  viewAllProducts() {
    this.router.navigate(['/admin-dashboard/view-products']);
  }

  viewSalesReport() {
    this.router.navigate(['/admin-dashboard/sales-report']);
  }

  viewOrderStatus() { this.router.navigate(['/admin-dashboard/order-status']); }

  // Logout function
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
