import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from "../../service/api.service";
import {User} from "../../model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None // Dodaj ovo
})
export class UsersComponent implements OnInit {
  users: User[] = []
  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    this.ucitajTabelu()

  }

  hasPermission(permission: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const permissions: string[] = payload.permissions || [];
    return permissions.includes(permission);
  }

  private ucitajTabelu() {
    this.apiService.getAllUsers().subscribe(
      response  => {
        console.log("Status Code:", response.status);
        this.users = response.body || [];
      },
      error => {
        if (error.status === 403) {
          console.error("Nemate pristup korisnicima.");
          alert("Nemate dozvolu za pristup korisnicima. Kontaktirajte administratora.");
        } else {
          console.error("Došlo je do greške:", error);
          alert("Došlo je do greške. Pokušajte ponovo.");
        }
      }
    );
  }

  onDelete(id: number | undefined) {
    if(id == undefined) return;
    if(!confirm("Da li ste sigurni da želite da obrišete korisnika?")) return;
    this.apiService.deleteUser(id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.log("User deleted successfully");
          this.users = this.users.filter(user => user.id !== id);
        }
      },
      error: (error) => {
        console.error("Error deleting user:", error);
        alert("Doslo je do greske prilikom brisanja korisnika.")
      }
    })
  }
}
