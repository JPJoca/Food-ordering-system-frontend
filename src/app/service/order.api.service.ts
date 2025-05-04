import {Injectable} from "@angular/core";
import {api} from "../api/api";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {Dish, JWT, Order, OrderRequest, StatusRequest, User} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class OrderApiService {
  private readonly apiUrl = api.postApi

  constructor(private httpClient: HttpClient) {
  }
  getAllDishes(): Observable<Dish[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get<Dish[]>(`${this.apiUrl}api/dishes/all`, { headers });
  }

  getOrdersByUser(userId?: number): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    let params = new HttpParams();

    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId.toString());
    }

    return this.httpClient.get<Order[]>(`${this.apiUrl}api/order/user-search`, { headers, params });
  }



  getOrdersByStatus(request: StatusRequest): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post<Order[]>(`${this.apiUrl}api/order/status-search`, request, { headers });
  }

  placeOrder(orderRequest: OrderRequest): Observable<Order> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post<Order>(`${this.apiUrl}api/order/place-order`, orderRequest, { headers });
  }

  scheduleOrder(orderRequest: OrderRequest): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post<{ message: string }>(
      `${this.apiUrl}api/order/schedule-order`,
      orderRequest,
      { headers }
    );
  }

  cancelOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.put(`${this.apiUrl}api/order/cancel-order`, { orderID: orderId }, { headers });
  }

}
