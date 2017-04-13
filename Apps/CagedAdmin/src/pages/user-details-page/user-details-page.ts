import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserModel } from '../../models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service';
import { UtilityService } from '../../providers/utility-service';


@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details-page.html'
})
export class UserDetailsPage {
  @ViewChild('userImageInputEdit') userImageInputEdit: ElementRef;

  public isEditing: boolean = false;
  public user: UserModel;
  hasUploadedNewImage: boolean;
  userProfileImage: string;
  editUserForm: any;

  constructor(private _userService: UserService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder, private _alertCtrl: AlertController) {

    this.user = new UserModel();

    this.editUserForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required]

    });

    this.user = this._navParams.get('model');

    if (this.user.userImageDataUrl) {

      this.userProfileImage = this.user.userImageDataUrl;

    } else if (this.user.userImageUrl) {

      this.userProfileImage = this.user.userImageUrl;

    }
    else {

      this.userProfileImage = '../../assets/thumbnail-totoro.png';

    }

  }

  ngAfterViewInit() {

    // Create an user listener when user's image is uploaded. 
    if (this.userImageInputEdit) {

      this.userImageInputEdit.nativeElement.adduserListener('change', user => {
        this.readSingleFile(user);
      }, false);

    }

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

      let updatedUser = this.user;
      updatedUser.name = this.editUserForm.value.name;
      updatedUser.email = this.editUserForm.value.email;
      updatedUser.userImageDataUrl = null;

      this._userService.editUser(updatedUser, this.hasUploadedNewImage, this.userProfileImage)
        .then(user => {

          this._util.StopSpinner();

          // Navigate back to users list page.
          this._nav.pop();

        }).catch(error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new User.');

        });

    }

  }

  // Enables uploaded image preview.
  public readSingleFile(user: any) {

    let fileName = user.target.files[0];

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

    this.userImageInputEdit.nativeElement.click();

  }

  // Display Delete User Confirmation.
  public toggleDeleteUser() {

    let confirm = this._alertCtrl.create({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            confirm.dismiss();
          }
        },
        {
          text: 'Yes',
          handler: () => {

            // Instantiate spinner. 
            this._util.StartSpinner('Deleting User...');

            this._userService.deleteUser(this.user.id)
              .subscribe(message => {

                this._util.StopSpinner();

                this._nav.pop();

              }, error => {

                this._util.StopSpinner();

                this._util.ShowAlert('Internal Error', 'Could not delete User.');

              });

          }
        }
      ]
    });

    confirm.present();

  }

}
