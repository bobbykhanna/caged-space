import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service';
import { UtilityService } from '../../providers/utility-service';

@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user-page.html'
})
export class AddUserPage {

  addUserForm: any;

  constructor(private _userService: UserService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addUserForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required]
    });

  }

  // Add New User.
  public addUser(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding New User...');

      this._userService.addUser(this.addUserForm.value)
        .subscribe(user => {

          this._util.StopSpinner();

          // Navigate back to users list page.
          this._nav.pop();

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new User.');

        });

    }

  }


}
