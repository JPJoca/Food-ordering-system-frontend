import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {User} from "../../model";
import {ApiService} from "../../service/api.service";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  user: User = {
    name: '',
    surname: '',
    email: '',
    password: '',
    permissions: [],
  };

  availablePermissions: string[] = ["can_create_users", "can_delete_users", "can_read_users", "can_update_users","can_search_order","can_search_order_all", "can_place_order", "can_cancel_order", "can_track_order", "can_schedule_order"
  ];
  constructor(private apiService:ApiService, private router:Router) {}

  addUser(form: NgForm) {
    if (form.valid) {
      this.apiService.createUser(this.user).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          alert('User has been added successfully!');
          form.resetForm()
          this.router.navigate(['/'])
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('An error occurred while creating the user.');
        },
      })

      console.log(this.user)
    }
  }
}

