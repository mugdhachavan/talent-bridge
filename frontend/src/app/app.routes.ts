import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { FeedComponent } from './pages/feed/feed.component';
import { MyProfileComponent } from './pages/profile/myprofile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'feed', component: FeedComponent ,runGuardsAndResolvers: 'always'},
  { path: 'myprofile', component: MyProfileComponent },
  //{ path: 'profile/edit', component: EditProfileComponent },
];
