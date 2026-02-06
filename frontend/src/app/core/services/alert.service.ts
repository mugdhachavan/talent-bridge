import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'danger';

export interface Alert {
  message: string;
  type: AlertType;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

  success(message: string, duration: number = 3000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 3000) {
    this.show(message, 'danger', duration);
  }

  private show(message: string, type: AlertType, duration: number) {
    this.alertSubject.next({ message, type });

    setTimeout(() => {
      this.clear();
    }, duration);
  }

  clear() {
    this.alertSubject.next(null);
  }
}
