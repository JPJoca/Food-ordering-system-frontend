// src/app/service/websocket.service.ts

import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private orderUpdatesSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // <-- Ako koristiš WebSocket native server
      reconnectDelay: 5000,
      debug: (str) => {

        console.log('[WebSocket] ' + str);
      },
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/orders', (message: IMessage) => {
        const orderUpdate = JSON.parse(message.body);
        this.orderUpdatesSubject.next(orderUpdate);
      });
    };

    this.client.activate();
  }

  getOrderUpdates() {
    return this.orderUpdatesSubject.asObservable();
  }
}
