import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';


@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {

  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('resumeInput') resumeInput!: ElementRef<HTMLInputElement>;

  editingSection: 'education' | 'skills' | 'about' | null = null;
  isEditing = false;
  profileData: any = {
    name: '',
    email: '',
    skills: '',
    degree: '',
    institute: '',
    graduationYear: '',
    profilePhoto: null,
    resume: null
  };

  editEducation = {
    degree: '',
    institute: '',
    graduationYear: ''
  };

  editSkills = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  /* ================= FETCH PROFILE ================= */


fetchProfile() {
  const loggedInEmail = localStorage.getItem('email'); // saved at login

  this.profileService.getProfile().subscribe({
    next: (res: any) => {
      const user = res.data.find(
        (u: any) => u.email === loggedInEmail
      );

      if (!user) {
        alert('User profile not found');
        return;
      }

      // ✅ Signup data
      this.profileData = {
        id: user.id,
        name: user.username,
        email: user.email,
        skills: user.skills || '',
        degree: user.degree || '',
        institute: user.institute || '',
        graduationYear: user.year || '',
        profilePhoto: user.profilePhoto,
        resume: user.resume
      };

      // Editable copies
      this.editEducation = {
        degree: this.profileData.degree,
        institute: this.profileData.institute,
        graduationYear: this.profileData.graduationYear
      };

      this.editSkills = this.profileData.skills;
    },
    error: err => {
      console.error('Profile fetch failed', err);
    }
  });
}



saveProfile() {
  const payload = {
    skills: this.editSkills,
    degree: this.editEducation.degree,
    institute: this.editEducation.institute,
    year: this.editEducation.graduationYear
  };

  this.profileService.updateProfile(payload)
    .subscribe({
      next: () => {
        alert('Profile updated successfully');
        this.isEditing = false;
        this.fetchProfile();
      },
      error: () => alert('Update failed')
    });
}
  /* ================= EDIT ================= */

  editSection(section: 'education' | 'skills' | 'about') {
    this.editingSection = section;

    if (section === 'education') {
      this.editEducation = {
        degree: this.profileData.degree,
        institute: this.profileData.institute,
        graduationYear: this.profileData.graduationYear
      };
    }

    if (section === 'skills') {
      this.editSkills = this.profileData.skills;
    }
  }

  saveEducation() {
    Object.assign(this.profileData, this.editEducation);
    this.editingSection = null;
  }

  saveSkills() {
    this.profileData.skills = this.editSkills;
    this.editingSection = null;
  }

    cancelEdit() {
    this.isEditing = false;
    this.editSkills = this.profileData.skills;
    this.editEducation = {
      degree: this.profileData.degree,
      institute: this.profileData.institute,
      graduationYear: this.profileData.graduationYear
    };
  }

  /* ================= PHOTO ================= */

  getProfileImageUrl() {
    return this.profileData.profilePhoto;
  }

  getInitials(): string {
    return this.profileData.name
      ? this.profileData.name.split(' ').map((n: string) => n[0]).join('')
      : 'U';
  }

  openPhotoUpload() {
    this.photoInput?.nativeElement.click();
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileData.profilePhoto = URL.createObjectURL(file);
    }
  }

  /* ================= SKILLS ================= */

  getSkillsArray(): string[] {
    return this.profileData.skills
      ? this.profileData.skills.split(',').map((s: string) => s.trim())
      : [];
  }

  trackBySkill(index: number, skill: string) {
    return skill;
  }

  /* ================= RESUME ================= */

  uploadResume(): void {
    this.resumeInput.nativeElement.click();
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF or Word document');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Resume size should be less than 10MB');
        return;
      }

      // Store file name
      this.profileData.resume = file.name;
      localStorage.setItem('resume', file.name);
      console.log('Resume uploaded:', file.name);

      // TODO: Implement actual upload to backend
      // this.uploadResumeToBackend(file);
    }
  }

  getResumeFileName(): string {
    if (!this.profileData.resume) return 'Resume.pdf';
    return this.profileData.resume;
  }

  getResumeSize(): string {
    // This would typically come from the backend
    return '245 KB';
  }

  downloadResume(): void {
    // TODO: Implement download from backend
    console.log('Downloading resume:', this.profileData.resume);
    alert('Resume download feature - connect to backend');
  }

  viewResume(): void {
    // TODO: Implement view in new tab
    console.log('Viewing resume:', this.profileData.resume);
    alert('Resume preview feature - connect to backend');
  }

  /* ================= PROFILE STATS ================= */

 getProfileCompleteness(): number {
    const totalFields = this.getTotalFields();
    const completedFields = this.getCompletedFields();
    return Math.round((completedFields / totalFields) * 100);
  }

  getTotalFields(): number {
    return 8; // profilePhoto, name, email, institute, degree, graduationYear, skills, resume
  }

  getCompletedFields(): number {
    let completed = 0;
    
    if (this.profileData.profilePhoto) completed++;
    if (this.profileData.name) completed++;
    if (this.profileData.email) completed++;
    if (this.profileData.institute) completed++;
    if (this.profileData.degree) completed++;
    if (this.profileData.graduationYear) completed++;
    if (this.getSkillsArray().length > 0) completed++;
    if (this.profileData.resume) completed++;
    
    return completed;
  }

  /* ================= EXTRA ================= */

  navigateToEdit() {
    alert('Navigate to edit page');
  }

  shareProfile(): void {
    // Create shareable profile link
    const profileUrl = `${window.location.origin}/profile/${localStorage.getItem('userId') || 'user'}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${this.profileData.name}'s Profile`,
        text: `Check out my profile on TalentBridge`,
        url: profileUrl
      }).catch(() => {
        this.copyProfileLink(profileUrl);
      });
    } else {
      this.copyProfileLink(profileUrl);
    }
  }

  copyProfileLink(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      alert('Profile link copied to clipboard!');
    }).catch(() => {
      alert(`Profile URL: ${url}`);
    });
  }

  private showSuccess(message: string): void {
    alert(message);
  }
}
