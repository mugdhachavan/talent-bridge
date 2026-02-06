import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../core/services/alert.service';
import { Observable } from 'rxjs';
import { Alert } from '../../core/services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  alert$!: Observable<Alert | null>;

  constructor(private alertService: AlertService) {
    this.alert$ = this.alertService.alert$;
  }
}
