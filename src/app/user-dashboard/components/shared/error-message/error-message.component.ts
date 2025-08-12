import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ErrorMessageComponent {
  @Input() error: string | null = null;
  @Output() retry = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }
}
