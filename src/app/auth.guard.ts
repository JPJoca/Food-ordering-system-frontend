import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanDeactivate<unknown> {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredPermissions = route.data['permissions'] as string[] | undefined;
    if (requiredPermissions && !this.hasPermissions(token, requiredPermissions)) {
     this.router.navigate(['']);
      return false;
    }

    return true;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Invalid JWT token:', error);
      return null;
    }
  }

  private hasPermissions(token: string, requiredPermissions: string[]): boolean {
    const decoded = this.decodeToken(token);

    if (!decoded || !decoded.permissions) {
      console.error('Permissions not found in JWT token');
      return false;
    }

    const userPermissions: string[] = decoded.permissions; // Pretpostavlja da je `permissions` lista stringova
    return requiredPermissions.every((perm) => userPermissions.includes(perm)); // Provera svih potrebnih permisija
  }
  canDeactivate(component: unknown, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
