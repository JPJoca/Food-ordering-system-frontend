import {Component, OnInit} from '@angular/core';
import {Dish, OrderRequest} from "../../model";
import {OrderApiService} from "../../service/order.api.service";
import {TokenService} from "../../service/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-order-place',
  templateUrl: './order-place.component.html',
  styleUrls: ['./order-place.component.css']
})
export class OrderPlaceComponent implements OnInit {
  dishes: Dish[] = [];
  selectedDishes: number[] = [];
  userId: number = 0;
  isDateTimeSelected: boolean = false; // <- ovde čuvaš status
  selectedDateTime: string = '';
  errorMessage: string | null = null;

  constructor(private orderApiService: OrderApiService, private tokenService: TokenService, private router:Router) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserIdFromToken() || 0;


    this.orderApiService.getAllDishes().subscribe({
      next: (data) => this.dishes = data,
      error: (error) => console.error("Greška pri dohvatanju jela:", error)
    });
  }


  onDateTimeSelected(selected: boolean) {
    this.isDateTimeSelected = selected;
  }

  // Selektovanje/deselektovanje jela
  toggleDishSelection(dishId: number): void {
    const index = this.selectedDishes.indexOf(dishId);
    if (index > -1) {
      this.selectedDishes.splice(index, 1); // Uklanja ako je već selektovan
    } else {
      this.selectedDishes.push(dishId); // Dodaje ako nije selektovan
    }
  }

  // Slanje narudžbine
  placeOrder(): void {
    if (this.selectedDishes.length === 0) return;

    const orderRequest: OrderRequest = {
      userId: this.userId,
      dishIDs: this.selectedDishes
    };

    this.orderApiService.placeOrder(orderRequest).subscribe({
      next: (response) => {
        console.log("Narudžbina uspešno kreirana:", response);
        this.router.navigate(['/orders']).then(() => this.selectedDishes = []);
      },
      error: (error) => {
        this.errorMessage  = error?.error?.message || 'Došlo je do greške. Pokušajte ponovo.';


        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2000);
      }
    });
  }
  hasPermission(permission: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const permissions: string[] = payload.permissions || [];
    return permissions.includes(permission);
  }

  scheduleOrder(): void {
    if (this.selectedDishes.length === 0 || !this.isDateTimeSelected) return;

    const orderScheduleRequest: OrderRequest = {
      userId: this.userId,
      dishIDs: this.selectedDishes,
      scheduledTime: this.selectedDateTime
    };

    this.orderApiService.scheduleOrder(orderScheduleRequest).subscribe({
      next: (response) => {
        console.log("Narudžbina uspešno zakazana:", response);
        this.router.navigate(['/orders']).then(() => this.selectedDishes = []);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Došlo je do greške pri zakazivanju. Pokušajte ponovo.';

        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2000);
      }
    });
  }


  onDateTime(dateTime: string) {
    this.selectedDateTime = dateTime;
  }
}
