import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { MusicianService } from '../../providers/musician-service';
import { UtilityService } from '../../providers/utility-service';
import { AddMusicianModel } from '../../models/addMusician';

@Component({
  selector: 'page-add-musician',
  templateUrl: 'add-musician-page.html'
})
export class AddMusicianPage {

  addMusicianForm: any;
  hasUploadedNewImage: boolean;
  musicianProfileImage: string = '../../assets/thumbnail-totoro.png';

  constructor(private _musicianService: MusicianService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addMusicianForm = this._fb.group({
      name: ['', Validators.required],
      instrument: ['', Validators.required],
      description: ['', Validators.required]
    });

  }

  ionViewDidEnter() {

    // Create an event listener when musician's image is uploaded. 
    document.getElementById('musicianImageUpload').addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Add New Musician.
  public addMusician(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding New Musician...');

      let model = new AddMusicianModel();

      model.name = this.addMusicianForm.value.name;
      model.instrument = this.addMusicianForm.value.instrument;
      model.description = this.addMusicianForm.value.description;

      if (this.hasUploadedNewImage) {

        model.hasUploadedNewImage = true;
        model.profileImage = this.musicianProfileImage;

      }

      this._musicianService.addMusician(model)
        .subscribe(musician => {

          this._util.StopSpinner();

          // Navigate back to musicians list page.
          this._nav.pop();

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new Musician.');

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

    document.getElementById('musicianImageUpload').click();

  }


}
