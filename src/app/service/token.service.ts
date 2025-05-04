import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TokenService{

  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('authToken'));
  private isInitialLoad = true;
  constructor(private router: Router) {
    this.tokenSubject.subscribe(token => {
      if (!token && !this.isInitialLoad) {
        this.router.navigate(['/login']);
      }
      this.isInitialLoad = false;
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {

    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  removeToken(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.tokenSubject.next(null);

  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {

      const payload = JSON.parse(atob(token.split('.')[1]));

      console.log("Dekodiran token payload:", payload);

      // Izvuci `userID` iz payload-a
      return payload.userID || null;
    } catch (error) {
      console.error("Greška pri dekodiranju tokena:", error);
      return null;
    }
  }

  getUserPermissions(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.permissions || [];
    } catch (error) {
      console.error('Invalid token format', error);
      return [];
    }
  }

}
