import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KEY_STORAGE } from '../class/constant';
import { User } from '../class/user.model';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
      private router: Router,
      private http: HttpClient,
      private storageService: StorageService
  ) {
      const user = JSON.parse(this.storageService.getItem(KEY_STORAGE.User_Login) || 'null');
      this.userSubject = new BehaviorSubject<User>(user);
      this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
      return this.userSubject.value;
  }

  login(username: string, password: string) {
      return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
          .pipe(
            map(user =>  {
              console.log(user);
              this.storageService.setItem(KEY_STORAGE.User_Login, JSON.stringify(user));
              this.userSubject.next(user);
              return user;
          }));
  }

  logout() {
      this.storageService.removeItem(KEY_STORAGE.User_Login);
      this.userSubject.next(JSON.parse(this.storageService.getItem(KEY_STORAGE.User_Login) || 'null'));
      this.router.navigate(['/login']);
  }

  register(user: User) {
      return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  getAll() {
      return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string) {
      return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id: string, params: any) {
      return this.http.put(`${environment.apiUrl}/users/${id}`, params)
          .pipe((x => {
              if (id == this.userValue.id) {
                  const user = { ...this.userValue, ...params };
                  this.storageService.setItem(KEY_STORAGE.User_Login, JSON.stringify(user));
                  this.userSubject.next(user);
              }
              return x;
          }));
  }

  delete(id: string) {
      return this.http.delete(`${environment.apiUrl}/users/${id}`)
          .pipe((x => {
              if (id == this.userValue.id) {
                  this.logout();
              }
              return x;
          }));
  }
}
