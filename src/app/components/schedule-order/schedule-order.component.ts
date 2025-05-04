import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Dish} from "../../model";

@Component({
  selector: 'app-schedule-order',
  templateUrl: './schedule-order.component.html',
  styleUrls: ['./schedule-order.component.css']
})
export class ScheduleOrderComponent {
  @Input() selectedDishes: number[] = [];
  @Input() allDishes: Dish[] = [];

  @Output() dateTimeSelected = new EventEmitter<boolean>(); // <-- ovde emitujemo true/false
  @Output() selectedDateAndTime = new EventEmitter<string>();
  selectedDateTime: string = '';

  onDateTimeChange(event: any) {
    this.selectedDateTime = event.target.value;

    if (this.selectedDateTime) {
      this.dateTimeSelected.emit(true);
      this.selectedDateAndTime.emit(this.selectedDateTime);
    } else {
      this.dateTimeSelected.emit(false);
    }
  }

  getSelectedDishNames(): string[] {
    return this.selectedDishes
      .map(dishId => this.allDishes.find(d => d.id === dishId))
      .filter(dish => dish !== undefined)
      .map(dish => dish!.name);
  }
}
