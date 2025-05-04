import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  private apiUrl = 'http://localhost:8080/api/errors'; // prilagodi ako treba

  constructor(private http: HttpClient) {}

  getErrors(page: number = 0, size: number = 20): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`, { headers });
  }
}
