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

  private unfilteredUsers: Array<UserModel>;
  private filteredUsers: Array<UserModel>;
  private isMobileDevice: boolean;

  constructor(private _userService: UserService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this.isMobileDevice = (this._platform.width() <= 768);

    });

    this._userService.users$.subscribe(users => {

      this.unfilteredUsers = users;
      this.filteredUsers = users;

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

    this.isMobileDevice = (event.target.innerWidth <= 768);

  }

  // Search users by name.
  filterUsers(event: any) {

    let allUsers = this.unfilteredUsers;

    let searchText = event.target.value;

    if (searchText && searchText.trim() != '') {

      this.filteredUsers = allUsers.filter((item) => {

        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);

      });

    } else {

      this.filteredUsers = allUsers;

    }

  }

}
