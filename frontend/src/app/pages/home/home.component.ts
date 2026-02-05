import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface Step {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  steps: Step[] = [
    {
      title: 'Create Your Profile',
      description: 'Sign up in seconds and start building your professional identity with your skills, education, and experience.'
    },
    {
      title: 'Upload Your Resume',
      description: 'Add your resume and let your qualifications speak for themselves. Keep everything in one accessible place.'
    },
    {
      title: 'Get Discovered',
      description: 'Your profile becomes instantly searchable. Connect with recruiters, collaborators, and opportunities.'
    }
  ];
  constructor(private router: Router) {}

  navigateToFeed() {
    this.router.navigate(['/feed']);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}