import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service';
import { UtilityService } from '../../providers/utility-service';
import { UserModel } from '../../models/user';


@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user-page.html'
})
export class AddUserPage {
  @ViewChild('imageInput') imageInput: ElementRef;

  addUserForm: any;
  hasUploadedNewImage: boolean;
  userProfileImage: string = '../../assets/thumbnail-totoro.png';

  constructor(private _userService: UserService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addUserForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required]
    });

  }

  ngAfterViewInit() {

    // Create an event listener when user's image is uploaded. 
    this.imageInput.nativeElement.addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Add New User.
  public addUser(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding New User...');

      let model = new UserModel();

      model.name = this.addUserForm.value.name;
      model.email = this.addUserForm.value.email;

      this._userService.addUser(model, this.hasUploadedNewImage, this.userProfileImage)
        .then(user => {

          this._util.StopSpinner();

          // Navigate back to user's list page.
          this._nav.pop();

        }).catch(error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new User.');

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

    this.imageInput.nativeElement.click();

  }

}
