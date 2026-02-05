import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ data.username }}</h2>

    <div mat-dialog-content class="dialog-content">
      <div class="profile-info">

        <!-- ProfilePhoto -->
          <img
            [src]="getProfileImage(profile.profilePhoto)"
            width="120"
            height="120"
            class="profile-img"
          />

        <div class="info-row">
          <span class="label">Skills:</span>
          <span class="value">{{ data.skills || '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">Degree:</span>
          <span class="value">{{ data.degree || '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">Graduation Year:</span>
          <span class="value">{{data.graduationYear || '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">{{ data.email || '-' }}</span>
        </div>

        <div class="info-row">
          <span class="label">Institute:</span>
          <span class="value">{{ data.institute || '-' }}</span>
        </div>

        <!-- Resume -->
        <div class="info-row" *ngIf="hasResume">
          <span class="label">Resume:</span>
          <span class="value">
            <button mat-button color="primary" (click)="viewResume()">View</button>
            <button mat-button color="accent" (click)="downloadResume()">Download</button>
          </span>
        </div>

      </div>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    .dialog-title {
      text-align: center;
      font-size: 1.8rem;
    }

    .dialog-content {
      font-size: 1.05rem;
      max-width: 380px;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .label {
      min-width: 130px;
      font-weight: 600;
    }

    .value {
      font-weight: 500;
    }
  `]
})
export class ProfileDialogComponent implements OnInit {

  private readonly RESUME_API = 'http://localhost:5000/api/profile/me/resume';
  IMAGE_BASE_URL = 'http://localhost:5000';
  profile: any;
  hasResume = true;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.profile = data; }
  ngOnInit(): void {
    console.log(this.data);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  /** 👁 View resume in new tab */
  viewResume(): void {
    this.http.get(`${this.RESUME_API}/${this.data.id}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  /** ⬇ Download resume */
  downloadResume(): void {
    this.http.get(`${this.RESUME_API}/${this.data.id}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  getProfileImage(photo: string | null | undefined): string {
    return this.IMAGE_BASE_URL + '/' + photo?.replace(/\\/g, '/');
  }

  close(): void {
    this.dialogRef.close();
  }
}
