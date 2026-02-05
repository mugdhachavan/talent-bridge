import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // ngModel support
import { ProfileDialogComponent } from './profile-dialog.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatDialogModule, FormsModule, MatSelectModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = true;
  errorMessage = '';

  // Search/Filter properties
  searchQuery = '';
  filterType: 'all' | 'name' | 'education' | 'skills' = 'all';
  selectedEducation: string = '';  // Added for mat-select

  IMAGE_BASE_URL = 'http://localhost:5000';
  profile: any;

  constructor(private http: HttpClient, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchProfiles();
  }

  fetchProfiles(): void {
    this.errorMessage = '';
    const token = localStorage.getItem('token');
    const apiUrl = token
      ? 'http://localhost:5000/api/home/profiles'
      : 'http://localhost:5000/api/public/profiles';
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (res) => {
        console.log(res);
        this.users = res.data;
        this.filteredUsers = [...this.users];
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load profiles';
        this.loading = false;
      }
    });
  }

  // ===== FILTER METHODS =====
  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (this.filterType === 'education' && this.selectedEducation) {
      const selected = this.selectedEducation.toLowerCase();
      this.filteredUsers = this.users.filter(user => {
        const degree = (user.degree || '').toLowerCase();
        const institute = (user.institute || '').toLowerCase();
        const gradYear = (user.graduationYear || '').toString().toLowerCase();
        return degree.includes(selected) || institute.includes(selected) || gradYear.includes(selected);
      });
      return;
    }

    if (!query) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => {
      switch (this.filterType) {
        case 'name':
          return this.matchesName(user, query);
        case 'skills':
          return this.matchesSkills(user, query);
        case 'all':
        default:
          return this.matchesName(user, query) ||
                 this.matchesSkills(user, query) ||
                 this.matchesEducation(user, query);
      }
    });
  }

  private matchesName(user: any, query: string): boolean {
    const username = (user.username || '').toLowerCase();
    return username.includes(query);
  }

  private matchesEducation(user: any, query: string): boolean {
    const degree = (user.degree || '').toLowerCase();
    const institute = (user.institute || '').toLowerCase();
    const gradYear = (user.graduationYear || '').toString().toLowerCase();
    return degree.includes(query) || institute.includes(query) || gradYear.includes(query);
  }

  private matchesSkills(user: any, query: string): boolean {
    const skills = (user.skills || '').toLowerCase();
    return skills.includes(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedEducation = '';
    this.filterType = 'all';
    this.filteredUsers = [...this.users];
  }

  // ===== EXISTING METHODS =====
  trackByUserId(index: number, user: any): string {
    return user._id || user.id || index.toString();
  }

  getProfileImage(photo: string | null | undefined): string {
    return this.IMAGE_BASE_URL + '/' + photo?.replace(/\\/g, '/');
  }

  openProfileDialog(user: any): void {
    this.dialog.open(ProfileDialogComponent, {
      width: '400px',
      data: user
    });
  }
}
