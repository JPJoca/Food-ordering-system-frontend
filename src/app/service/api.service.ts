import {Injectable} from "@angular/core";
import {api} from "../api/api";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {JWT, User} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private readonly apiUrl = api.postApi

  constructor(private httpClient: HttpClient) {
  }



  login(email: string, password: string) {
    const body = {
      email: email,
      password: password
    };

    return this.httpClient.request<JWT>('POST', `${this.apiUrl}auth/login`, { body });
  }

  getAllUsers(): Observable<HttpResponse<User[]>> {
    const token = localStorage.getItem('token');
    console.log("GET Request Sent");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.request<User[]>('GET', `${this.apiUrl}api/user/all`, {
      headers,
      observe: 'response'
    })
  }

  deleteUser(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.delete(`${this.apiUrl}api/user/${id}`, {
      headers,
      observe: 'response'
    })
  }

  getUserByID(id: number){
    const token = localStorage.getItem('token');
    console.log("GET Request Sent");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.request<User>('GET', `${this.apiUrl}api/user/${id}`, {
      headers,
      observe: 'response'
    })
  }

  createUser(user: User) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.post<User>(`${this.apiUrl}api/user/add`, user, { headers });
  }

  updateUser(id: number, user: User): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.put<User>(`${this.apiUrl}api/user/${id}`, user, { headers });
  }
}
