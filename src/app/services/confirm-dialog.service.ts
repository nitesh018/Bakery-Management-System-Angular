import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  dismissible?: boolean; // allow click outside / ESC
}

interface InternalState extends ConfirmDialogOptions {
  resolve?: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private stateSubject = new BehaviorSubject<InternalState | null>(null);
  state$ = this.stateSubject.asObservable();

  show(options: ConfirmDialogOptions): Promise<boolean> {
    // Close any existing dialog first
    if (this.stateSubject.value?.resolve) {
      this.stateSubject.value.resolve(false);
    }
    return new Promise<boolean>(resolve => {
      this.stateSubject.next({
        title: options.title || 'Please Confirm',
        message: options.message,
        confirmText: options.confirmText || 'OK',
        cancelText: options.cancelText || 'Cancel',
        dismissible: options.dismissible !== false,
        resolve
      });
    });
  }

  confirm() {
    const current = this.stateSubject.value;
    if (current?.resolve) current.resolve(true);
    this.stateSubject.next(null);
  }

  cancel() {
    const current = this.stateSubject.value;
    if (current?.resolve) current.resolve(false);
    this.stateSubject.next(null);
  }

  dismiss() { // same as cancel but only if dismissible
    const current = this.stateSubject.value;
    if (!current) return;
    if (current.dismissible !== false) {
      this.cancel();
    }
  }
}
