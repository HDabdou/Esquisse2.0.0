import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('isLoggedin')) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
  /* canActivate() {
        if (JSON.parse(sessionStorage.getItem('currentUser')).accessLevel==5 ) {
            // logged in so return true
           return true;
        }

        sessionStorage.removeItem('currentUser') ;
        sessionStorage.clear();

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
   }*/
}