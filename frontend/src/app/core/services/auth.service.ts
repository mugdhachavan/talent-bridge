import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth'; // define base URL

  private loggedIn$ = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );

  constructor(private http: HttpClient) {}

  // Signup method
  signup(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, formData);
  }

  // Login method
  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, data);
  }

  setLoggedIn(status: boolean) {
    this.loggedIn$.next(status);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.setLoggedIn(false);
  }
  getUserById(id: string) {
  return this.http.get(`http://localhost:5000/api/users/${id}`);
}

deleteUser(id: string) {
  return this.http.delete(`http://localhost:5000/api/users/${id}`);
}

}
