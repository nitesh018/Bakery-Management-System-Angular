import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="toast-wrapper" *ngIf="messages().length">
    <div class="toast" *ngFor="let m of messages()" [class]="'toast ' + m.type">
      <span>{{ m.text }}</span>
      <button (click)="dismiss(m.id)">×</button>
    </div>
  </div>
  `,
  styles: [`
    .toast-wrapper { position: fixed; top: 1rem; right: 1rem; display: flex; flex-direction: column; gap: .5rem; z-index: 1000; }
    .toast { min-width: 240px; max-width: 340px; padding: .75rem 1rem; border-radius: 4px; color: #fff; display: flex; justify-content: space-between; align-items: center; font-size: .875rem; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
    .toast.success { background: #2e7d32; }
    .toast.error { background: #c62828; }
    .toast.info { background: #1565c0; }
    .toast.warning { background: #ed6c02; }
    .toast button { background: transparent; border: none; color: #fff; font-size: 1rem; cursor: pointer; line-height: 1; }
    .toast button:hover { opacity: .8; }
  `]
})
export class ToastContainerComponent {
  messages = signal<any[]>([]);
  private sub?: Subscription;

  constructor(private notifications: NotificationService) {}

  ngOnInit() {
    this.sub = this.notifications.messages$.subscribe(list => this.messages.set(list));
  }
  ngOnDestroy() { this.sub?.unsubscribe(); }
  dismiss(id: number) { this.notifications.remove(id); }
}
