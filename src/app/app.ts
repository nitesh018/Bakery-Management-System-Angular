import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { GlobalLoadingComponent } from './components/global-loading/global-loading.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, GlobalLoadingComponent, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Bakery Management System';
}
