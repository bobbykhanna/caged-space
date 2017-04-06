import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserModel } from '../../models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service';
import { UtilityService } from '../../providers/utility-service';

/*
  Generated class for the UserDetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details-page.html'
})
//export class UserDetailsPage {

  //constructor(public navCtrl: NavController, public navParams: NavParams) {}

 // ionViewDidLoad() {
  //  console.log('ionViewDidLoad UserDetailsPage');
  //}

//}

export class UserDetailsPage {

  public isEditing: boolean = false;
  public user: UserModel;
  editUserForm: any;

  constructor(private _userService: UserService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.user = new UserModel();

    this.editUserForm = this._fb.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      email: ['', Validators.required],
       isLoggedIn: ['', Validators.required]
    });

  }

  ionViewDidEnter() {

    this.user = this._navParams.get('model');

    this.editUserForm.value.name = this.user.name;
    this.editUserForm.value.id = this.user.id;
    this.editUserForm.value.email = this.user.email;
    this.editUserForm.value.isLoggedIn = this.user.isLoggedIn;
 
  }

  // Display Edit User Form.
  public toggleEditUser() {

    if (this.isEditing == true) {

      this.isEditing = false;

    } else {

      this.isEditing = true;

    }

  }

  // Update User's Info.
  public editUser(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Updating User\'s Info...');

      let updatedUser = this.editUserForm.value;
      updatedUser.id = this.user.id;

      this._userService.editUser(updatedUser)
        .subscribe(user => {

          this._util.StopSpinner();

          this.user = user;

          this.isEditing = false;

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not edit User.');

        });

    }

  }

}

