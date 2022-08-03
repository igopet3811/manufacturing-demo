import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 
const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';
 
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private roles: Array<string> = [];
  constructor(
    private router: Router
  ) { }
 
  public saveToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }
 
  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLoggedIn() {
    return this.getToken() !== null;
  }

  public isAdmin() {
    return true;
  }
 
  public saveUsername(username: string) {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.setItem(USERNAME_KEY, username);
  }
 
  public getUsername(): string {
    return localStorage.getItem(USERNAME_KEY);
  }

  public logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
 
  public saveAuthorities(authorities: string[]) {
    localStorage.removeItem(AUTHORITIES_KEY);
    localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }
 
  public getAuthorities(): string[] {
    this.roles = [];
 
    if (localStorage.getItem(TOKEN_KEY)) {
      JSON.parse(localStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
 
    return this.roles;
  }
}