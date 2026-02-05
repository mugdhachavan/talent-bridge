import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  profilePhoto?: string;
  skills?: string;
  degree?: string;
  institute?: string;
  graduationYear?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly API_URL = 'http://localhost:5000/api/users';
  readonly IMAGE_BASE_URL = 'http://localhost:5000/public/uploads/profiles/';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
