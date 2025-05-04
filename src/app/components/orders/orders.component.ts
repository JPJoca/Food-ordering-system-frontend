import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../service/api.service";
import {OrderApiService} from "../../service/order.api.service";
import {Order, StatusRequest} from "../../model";
import {TokenService} from "../../service/token.service";
import {WebsocketService} from "../../service/websocket.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  filterForm: FormGroup;
  userId: number | undefined;

  statuses = ['Ordered', 'Preparing','In_delivery' ,'Delivered', 'Canceled'];

  constructor(private fb: FormBuilder , private orderApiService: OrderApiService, private tokenService:TokenService, private websocketService: WebsocketService) {
    this.filterForm = this.fb.group({
      selectedStatuses: this.fb.array([])
    });


  }

  hasPermission(permission: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const permissions: string[] = payload.permissions || [];
    return permissions.includes(permission);
  }
  ngOnInit() {
    this.userId = this.tokenService.getUserIdFromToken() || 0

    if (this.hasPermission('can_search_order_all')) {
      this.orderApiService.getOrdersByUser().subscribe(data => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
      });
    } else {
      this.orderApiService.getOrdersByUser(this.userId).subscribe(data => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
      });
    }

    this.websocketService.getOrderUpdates().subscribe((updatedOrder) => {
      if (!updatedOrder) return;

      const index = this.orders.findIndex(o => o.id === updatedOrder.id);
      if (index !== -1) {
        // Ako postoji, samo update status
        this.orders[index].status = updatedOrder.status;
        this.orders[index].active = updatedOrder.active;
      } else {
        // Ako ne postoji, dodaj novi order
        this.orders.push(updatedOrder);
      }

      this.filterLocally(); // primeni filter
    });

  }

  private filterLocally(): void {
    const selectedStatuses = this.filterForm.value.selectedStatuses;

    if (selectedStatuses.length === 0) {
      this.filteredOrders = [...this.orders];
    } else {
      const selectedUpper = selectedStatuses.map((status: string) => status.toUpperCase());
      this.filteredOrders = this.orders.filter(order =>
        selectedUpper.includes(order.status)
      );
    }
  }

  onCheckboxChange(event: any) {
    const selectedStatuses = this.filterForm.controls['selectedStatuses'] as FormArray;
    if (event.target.checked) {
      selectedStatuses.push(this.fb.control(event.target.value)); // Dodaj u selektovane
    } else {
      const index = selectedStatuses.controls.findIndex(x => x.value === event.target.value);
      selectedStatuses.removeAt(index); // Ukloni iz selektovanih
    }
  }

  applyFilter() {
    const selectedStatuses = this.filterForm.value.selectedStatuses;

    if (selectedStatuses.length === 0) {
      this.filteredOrders = this.orders;  // Ako nema filtera, prikazi sve lokalne
    } else {
      let request: StatusRequest
      if(this.hasPermission('can_search_order_all'))
         request = { statuses: selectedStatuses.map((status: string) => status.toUpperCase()) };
      else
         request = { statuses: selectedStatuses.map((status: string) => status.toUpperCase()) , userID: this.userId };

      this.orderApiService.getOrdersByStatus(request).subscribe({
        next: (data) => {
          console.log("Filtrirane narudžbine:", data);
          this.filteredOrders = data;
        },
        error: (error) => console.error("Greška pri filtriranju narudžbina:", error)
      });
    }
  }

  cancelOrder(orderId: number): void {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    this.orderApiService.cancelOrder(orderId).subscribe({
      next: () => {
        console.log(`Order ${orderId} canceled successfully`);
        //this.loadOrders(); // Ponovo učitaj narudžbine nakon otkazivanja
      },
      error: (error) => console.error("Error canceling order:", error)
    });
  }

}
