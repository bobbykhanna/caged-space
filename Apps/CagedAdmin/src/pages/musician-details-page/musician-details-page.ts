import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MusicianModel } from '../../models/musician';
import { FormBuilder, Validators } from '@angular/forms';
import { MusicianService } from '../../providers/musician-service';
import { UtilityService } from '../../providers/utility-service';


@Component({
  selector: 'page-musician-details',
  templateUrl: 'musician-details-page.html'
})
export class MusicianDetailsPage {

  public isEditing: boolean = false;
  public musician: MusicianModel;
  hasUploadedNewImage: boolean;
  musicianProfileImage: string = '../../assets/thumbnail-totoro.png';
  editMusicianForm: any;

  constructor(private _musicianService: MusicianService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.musician = new MusicianModel();

    this.editMusicianForm = this._fb.group({
      name: ['', Validators.required],
      instrument: ['', Validators.required],
      description: ['', Validators.required]
    });

  }

  ionViewDidEnter() {

    this.musician = this._navParams.get('model');

    if (this.musician.profileImageUrl) { this.musicianProfileImage = this.musician.profileImageUrl; }

    this.editMusicianForm.value.name = this.musician.name;
    this.editMusicianForm.value.instrument = this.musician.instrument;
    this.editMusicianForm.value.description = this.musician.description;

  }

  ionViewDidLoad() {

    // Create an event listener when musician's image is uploaded. 
    document.getElementById('editMusicianImageUpload').addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Display Edit Musician Form.
  public toggleEditMusician() {

    if (this.isEditing == true) {

      this.isEditing = false;

    } else {

      this.isEditing = true;

    }

  }

  // Update Musician's Info.
  public editMusician(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Updating Musician\'s Info...');

      let updatedMusician = this.editMusicianForm.value;
      updatedMusician.id = this.musician.id;

      if (this.hasUploadedNewImage) {

        updatedMusician.hasUploadedNewImage = true;
        updatedMusician.profileImage = this.musicianProfileImage;

      }

      this._musicianService.editMusician(updatedMusician)
        .subscribe(musician => {

          this._util.StopSpinner();

          this.musician = musician;

          this.isEditing = false;

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not edit Musician.');

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
      this.musicianProfileImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    document.getElementById('editMusicianImageUpload').click();

  }

}
