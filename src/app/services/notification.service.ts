import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private idCounter = 0;
  private defaultTimeout = 4000;

  private push(type: ToastMessage['type'], text: string, timeout = this.defaultTimeout) {
    const id = ++this.idCounter;
    const msg: ToastMessage = { id, type, text, timeout };
    const list = [...this.messagesSubject.value, msg];
    this.messagesSubject.next(list);
    if (timeout > 0) {
      setTimeout(() => this.remove(id), timeout);
    }
  }
  success(text: string, timeout?: number) { this.push('success', text, timeout); }
  error(text: string, timeout?: number) { this.push('error', text, timeout); }
  info(text: string, timeout?: number) { this.push('info', text, timeout); }
  warning(text: string, timeout?: number) { this.push('warning', text, timeout); }
  remove(id: number) { this.messagesSubject.next(this.messagesSubject.value.filter(m => m.id !== id)); }
  clear() { this.messagesSubject.next([]); }
}
