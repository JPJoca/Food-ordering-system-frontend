import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {User} from "../../model";
import {ApiService} from "../../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenService} from "../../service/token.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit{
  currEmail: string = '';
  userId!: number;
  flag: boolean = true;
  user: User = {
    name: '',
    surname: '',
    email: '',
    password: '',
    permissions: [],
  };

  availablePermissions: string[] = ["can_create_users", "can_delete_users", "can_read_users", "can_update_users","can_search_order","can_search_order_all", "can_place_order", "can_cancel_order", "can_track_order", "can_schedule_order"
  ];

  constructor(private apiService:ApiService,private router: Router, private route:ActivatedRoute, private tokenService :TokenService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!
    this.userId = Number(id)
    this.getUserByID(this.userId)
    this.currEmail = this.user.email

  }

  isCurrUser(email: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const subject: string[] = payload.sub;
    return subject.includes(email);
  }

  editUser(form: NgForm) {

    if (form.valid) {
      this.apiService.updateUser(this.userId, this.user).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);

        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('An error occurred while updating the user.');
        },
      })

    }

    if(this.isCurrUser(this.currEmail)){
      this.user.password = ""
      this.flag = false
      return
    }
    else{
      alert('User has been updated successfully!');
      this.router.navigate(['/']).then();
    }


  }

  private getUserByID(id: number) {
    this.apiService.getUserByID(this.userId).subscribe({
      next: (response) => {
        console.log('User details:', response.body);
        if (response.body) {
          this.user = response.body
        }

      },
      error: (error) => {
        console.error('Error fetching user details:', error);

      },
    })
  }

  confirmAction(form: NgForm){
    console.log(this.user.email)
    this.apiService.login(this.user.email,this.user.password).subscribe(
      result => {
        this.tokenService.setToken(result.token)
        alert('User has been updated successfully!');
        this.router.navigate(['/'])
      },
      error => {
        console.error("Došlo je do greške ", error);
        alert("Došlo je do greške. Pokušajte ponovo. ");
      }
    );
  }
}

