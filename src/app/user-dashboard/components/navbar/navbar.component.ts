import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent {
  @Input() cartCount: number = 0;
  @Output() cartToggle = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  onCartToggle() {
    this.cartToggle.emit();
  }

  onLogout() {
    this.logoutClick.emit();
  }
}
