import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { StreamModel } from '../../models/stream';
import { FormBuilder, Validators } from '@angular/forms';
import { StreamService } from '../../providers/stream-service';
import { UtilityService } from '../../providers/utility-service';

@Component({
  selector: 'page-music-stream-details',
  templateUrl: 'music-stream-details-page.html'
})
export class MusicStreamDetailsPage {

  public isEditing: boolean = false;
  public stream: StreamModel;
  editStreamForm: any;

  constructor(private _streamService: StreamService, private _alertCtrl: AlertController, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.stream = new StreamModel();

    this.editStreamForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ip: ['', Validators.required]
    });

  }

  ionViewDidEnter() {

    this.stream = this._navParams.get('model');

    this.editStreamForm.value.name = this.stream.name;
    this.editStreamForm.value.description = this.stream.description;
    this.editStreamForm.value.ip = this.stream.ip;

  }

  // Display Edit Stream Form.
  public toggleEditStream() {

    if (this.isEditing == true) {

      this.isEditing = false;

    } else {

      this.isEditing = true;

    }

  }

  // Update Stream's Info.
  public editStream(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Updating Stream\'s Info...');

      let updatedStream = this.editStreamForm.value;
      updatedStream.id = this.stream.id;

      this._streamService.editStream(updatedStream)
        .subscribe(stream => {

          this._util.StopSpinner();

          this.stream = stream;

          this.isEditing = false;

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not edit Stream.');

        });

    }

  }

  // Display Delete Stream Confirmation.
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

            this._streamService.deleteStream(this.stream.id)
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
