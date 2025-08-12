import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="backdrop" *ngIf="loading()">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.25); display: flex; align-items: center; justify-content: center; z-index: 999; }
    .spinner { width: 48px; height: 48px; border: 5px solid #fff; border-top-color: #2196f3; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class GlobalLoadingComponent {
  private loadingService = inject(LoadingService);
  loading = computed(() => this.loadingService['loadingSubject'].value);
}
