import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserModel } from '../../models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service';
import { UtilityService } from '../../providers/utility-service';


@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details-page.html'
})


export class UserDetailsPage {

  public isEditing: boolean = false;
  public user: UserModel;
    hasUploadedNewImage: boolean;
  userProfileImage: string = '../../assets/thumbnail-totoro.png';
  editUserForm: any;

  constructor(private _userService: UserService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.user = new UserModel();

    this.editUserForm = this._fb.group({
      name: ['', Validators.required],
   
      email: ['', Validators.required]
      
    });

  }

  ionViewDidEnter() {

    this.user = this._navParams.get('model');

    this.editUserForm.value.name = this.user.name;
   
    this.editUserForm.value.email = this.user.email;

 
  }


  
  ionViewDidLoad() {

    // Create an event listener when user's image is uploaded. 
    document.getElementById('editUserImageUpload').addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

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
   // Enables uploaded image preview.
  public readSingleFile(event: any) {

    let fileName = event.target.files[0];

    if (!fileName) {
      return;
    }

    let reader = new FileReader();

    reader.onload = file => {

      let contents: any = file.target;
      this.userProfileImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    document.getElementById('editUserImageUpload').click();

  }



}
 
