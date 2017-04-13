import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MusicianModel } from '../../models/musician';
import { FormBuilder, Validators } from '@angular/forms';
import { MusicianService } from '../../providers/musician-service';
import { UtilityService } from '../../providers/utility-service';


@Component({
  selector: 'page-musician-details',
  templateUrl: 'musician-details-page.html'
})
export class MusicianDetailsPage {
  @ViewChild('musicianImageInputEdit') musicianImageInputEdit: ElementRef;

  public isEditing: boolean = false;
  public musician: MusicianModel;
  hasUploadedNewImage: boolean;
  musicianProfileImage: string;
  editMusicianForm: any;

  constructor(private _musicianService: MusicianService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder, private _alertCtrl: AlertController) {

    this.musician = new MusicianModel();

    this.editMusicianForm = this._fb.group({
      name: ['', Validators.required],
      instrument: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.musician = this._navParams.get('model');

    if (this.musician.musicianImageDataUrl) {

      this.musicianProfileImage = this.musician.musicianImageDataUrl;

    } else if (this.musician.musicianImageUrl) {

      this.musicianProfileImage = this.musician.musicianImageUrl;

    }
    else {

      this.musicianProfileImage = '../../assets/thumbnail-totoro.png';

    }

  }

  ngAfterViewInit() {

    // Create an musician listener when musician's image is uploaded. 
    if (this.musicianImageInputEdit) {

      this.musicianImageInputEdit.nativeElement.addmusicianListener('change', musician => {
        this.readSingleFile(musician);
      }, false);

    }

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

      let updatedMusician = this.musician;
      updatedMusician.name = this.editMusicianForm.value.name;
      updatedMusician.instrument = this.editMusicianForm.value.instrument;
      updatedMusician.description = this.editMusicianForm.value.description;
      updatedMusician.musicianImageDataUrl = null;

      this._musicianService.editMusician(updatedMusician, this.hasUploadedNewImage, this.musicianProfileImage)
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
  public readSingleFile(musician: any) {

    let fileName = musician.target.files[0];
    
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

    this.musicianImageInputEdit.nativeElement.click();

  }

  // Display Delete Musician Confirmation.
  public toggleDeleteMusician() {

    let confirm = this._alertCtrl.create({
      title: 'Delete Musician',
      message: 'Are you sure you want to delete this musician?',
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
            this._util.StartSpinner('Deleting Musician...');

            this._musicianService.deleteMusician(this.musician.id)
              .subscribe(message => {

                this._util.StopSpinner();

                this._nav.pop();

              }, error => {

                this._util.StopSpinner();

                this._util.ShowAlert('Internal Error', 'Could not delete Musician.');

              });

          }
        }
      ]
    });

    confirm.present();

  }

}
