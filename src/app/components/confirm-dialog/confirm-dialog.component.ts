import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .cdk-overlay { position: fixed; inset:0; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .dialog { background:#fff; padding:1.25rem 1.5rem; border-radius:8px; width:90%; max-width:380px; box-shadow:0 10px 25px -5px rgba(0,0,0,.2); animation:pop .2s ease; }
    .title { margin:0 0 .5rem; font-size:1.1rem; font-weight:600; }
    .message { margin:0 0 1rem; line-height:1.4; font-size:.95rem; }
    .actions { display:flex; gap:.75rem; justify-content:flex-end; }
    .btn { cursor:pointer; border:none; border-radius:4px; padding:.55rem 1rem; font-size:.85rem; font-weight:500; letter-spacing:.3px; }
    .btn.cancel { background:#f1f3f5; color:#333; }
    .btn.cancel:hover { background:#e2e6ea; }
    .btn.confirm { background:#d6336c; color:#fff; }
    .btn.confirm:hover { background:#c2255c; }
    @keyframes pop { from { transform:scale(.92); opacity:0; } to { transform:scale(1); opacity:1; } }
  `],
  template: `
  <div class="cdk-overlay" *ngIf="state()" (click)="onBackdrop($event)">
    <div class="dialog" (click)="$event.stopPropagation()">
      <h3 class="title">{{ state()?.title }}</h3>
      <p class="message">{{ state()?.message }}</p>
      <div class="actions">
        <button type="button" class="btn cancel" (click)="cancel()">{{ state()?.cancelText }}</button>
        <button type="button" class="btn confirm" (click)="confirm()">{{ state()?.confirmText }}</button>
      </div>
    </div>
  </div>
  `
})
export class ConfirmDialogComponent {
  state = signal<ReturnType<ConfirmDialogService['show']> extends Promise<infer _> ? any : any>(null);
  private sub: any;
  constructor(private dialogService: ConfirmDialogService) {}
  ngOnInit() { this.state.set(this.dialogService['stateSubject'].value); this.sub = this.dialogService.state$.subscribe(s => this.state.set(s)); }
  confirm() { this.dialogService.confirm(); }
  cancel() { this.dialogService.cancel(); }
  onBackdrop(evt: MouseEvent) { this.dialogService.dismiss(); }
  @HostListener('document:keydown.escape') onEsc() { this.dialogService.dismiss(); }
  ngOnDestroy() { if (this.sub) this.sub.unsubscribe(); }
}
