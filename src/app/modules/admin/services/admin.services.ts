import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Users } from '../../../shared/dummy-data/admin-users';
import { Roles } from '../../../shared/dummy-data/admin-roles';
import { Profile } from '../../../shared/dummy-data/admin-profile';

@Injectable()
export class AdminService {
  
  private users = Users;
  private roles = Roles;
  private profile = Profile;

  constructor() {}

  getAllUsers(): Observable<any> {
    const observable = Observable.of(this.users);
    return observable
      .map(res => res)
      .catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }

  getUserProfile(username: string) {
    const observable = Observable.of(this.profile);
    return observable
      .map(res => res)
      .catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }

  getAllRoles(): Observable<any> {
    const observable = Observable.of(this.roles);
    return observable
      .map(res => res)
      .catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }
}