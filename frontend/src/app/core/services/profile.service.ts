import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private API = 'http://localhost:5000/api/profile';

  constructor(private http: HttpClient) {}

  getProfile() {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.API}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateProfile(payload: any) {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${this.API}/me`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}
