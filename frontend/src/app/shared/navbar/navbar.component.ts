import { Component, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  hasNotifications = true; // Set to true to show notification badge

  constructor(private router: Router,private alertService: AlertService) {}

  // ===========================
  // LOGIN STATE
  // ===========================
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ===========================
  // USER INFORMATION
  // ===========================
  get currentUser() {
    return {
      name: localStorage.getItem('username') || localStorage.getItem('name') || 'User',
      email: localStorage.getItem('email') || 'user@example.com',
      profilePhoto: localStorage.getItem('profilePhoto'),
      institute: localStorage.getItem('institute'),
      degree: localStorage.getItem('degree'),
      graduationYear: localStorage.getItem('graduationYear'),
      skills: localStorage.getItem('skills')
    };
  }

  // ===========================
  // PROFILE IMAGE HANDLING
  // ===========================
  getUserProfileImage(): string | null {
    const photo = localStorage.getItem('profilePhoto');
    if (!photo) return null;
    
    // If the photo is already a full URL, return it as is
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    
    // Otherwise, construct the URL with your backend path
    return `http://localhost:5000/public/uploads/profiles/${photo}`;
  }

  // ===========================
  // USER INITIALS FOR AVATAR
  // ===========================
  getUserInitials(): string {
    const name = this.currentUser.name;
    
    // Split name and get first letter of each word
    const nameParts = name.split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) return 'U';
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    
    // Get first letter of first and last name
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }

  // ===========================
  // DROPDOWN TOGGLE
  // ===========================
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // ===========================
  // MOBILE MENU TOGGLE
  // ===========================
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // ===========================
  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  // ===========================
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.user-dropdown');
    
    // Close dropdown if clicking outside
    if (dropdown && !dropdown.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  // ===========================
  // NAVIGATION FUNCTIONS
  // ===========================
  navigateToProfile(): void {
    this.router.navigate(['/my-profile']);
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/my-profile/edit']);
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }

  // ===========================
  // LOGOUT FUNCTIONALITY
  // ===========================
  logout(): void {
    // 🔐 Clear session
    localStorage.removeItem('token');

    // ✅ Custom alert
    this.alertService.success('You have been logged out successfully', 3000);

    // 🚀 Redirect after alert
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }
  // ===========================
  // NOTIFICATION HANDLING
  // ===========================
  getNotificationCount(): number {
    // This would typically come from a service
    // For now, returning a mock value
    return 3;
  }

  clearNotifications(): void {
    this.hasNotifications = false;
  }
}