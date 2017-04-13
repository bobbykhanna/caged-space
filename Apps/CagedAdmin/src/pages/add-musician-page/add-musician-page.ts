import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { MusicianService } from '../../providers/musician-service';
import { UtilityService } from '../../providers/utility-service';
import { MusicianModel } from '../../models/musician';

@Component({
  selector: 'page-add-musician',
  templateUrl: 'add-musician-page.html'
})
export class AddMusicianPage {
  @ViewChild('imageInput') imageInput: ElementRef;

  addMusicianForm: any;
  hasUploadedNewImage: boolean;
  musicianProfileImage: string = '../../assets/default_image.png';

  constructor(private _musicianService: MusicianService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addMusicianForm = this._fb.group({
      name: ['', Validators.required],
      instrument: ['', Validators.required],
      description: ['', Validators.required]
    });

  }

  ngAfterViewInit() {

    // Create an event listener when musician's image is uploaded. 
    this.imageInput.nativeElement.addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Add New Musician.
  public addMusician(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding New Musician...');

      let model = new MusicianModel();

      model.name = this.addMusicianForm.value.name;
      model.instrument = this.addMusicianForm.value.instrument;
      model.description = this.addMusicianForm.value.description;
      model.musicianImageDataUrl = null;

      this._musicianService.addMusician(model, this.hasUploadedNewImage, this.musicianProfileImage)
        .then(musician => {

          this._util.StopSpinner();

          // Navigate back to musicians list page.
          this._nav.pop();

        }).catch(error => {

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

    this.imageInput.nativeElement.click();

  }

}
