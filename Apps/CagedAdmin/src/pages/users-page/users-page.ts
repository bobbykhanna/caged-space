import { Component, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { UserModel } from '../../models/user';
import { UserService } from '../../providers/user-service';
import { UserDetailsPage } from '../../pages/user-details-page/user-details-page';
import { AddUserPage } from '../../pages/add-user-page/add-user-page';

@Component({
  selector: 'page-users',
  templateUrl: 'users-page.html'
})
export class UsersPage {

  private users: Array<UserModel>
  private _isMobileDevice: boolean;

  constructor(private _userService: UserService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this._isMobileDevice = (this._platform.width() <= 768);

    });

    this._userService.users$.subscribe(users => {

      this.users = users;

    });

  }

  openDetails(detailsModel: UserModel) {

    this._nav.push(UserDetailsPage, {
      model: detailsModel
    });

  }

  addNewUser() {

    this._nav.push(AddUserPage);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this._isMobileDevice = (event.target.innerWidth <= 768);

  }

}
