import { Component,ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  @ViewChild('streamImageInputEdit') streamImageInputEdit: ElementRef;

  public isEditing: boolean = false;
  public stream: StreamModel;
  hasUploadedNewImage: boolean;
  streamImage: string;
  editStreamForm: any;

  constructor(private _streamService: StreamService, private _alertCtrl: AlertController, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.stream = new StreamModel();

    this.editStreamForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ip: ['', Validators.required]
    });

    this.stream = this._navParams.get('model');

    if (this.stream.streamImageUrl) {

      this.streamImage = this.stream.streamImageUrl;

    } else {

      this.streamImage = '../../assets/thumbnail-totoro.png';

    }

  }

  ngAfterViewInit() {

    // Create an event listener when stream's image is uploaded. 
    if (this.streamImageInputEdit) {

      this.streamImageInputEdit.nativeElement.addEventListener('change', event => {
        this.readSingleFile(event);
      }, false);

    }

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

      let updatedStream = this.stream;
      updatedStream.name = this.editStreamForm.value.name;
      updatedStream.ip = this.editStreamForm.value.ip;
      updatedStream.description = this.editStreamForm.value.description;

      this._streamService.editStream(updatedStream, this.hasUploadedNewImage, this.streamImage)
        .then(stream => {

          this._util.StopSpinner();

          // Navigate back to stream list page.
          this._nav.pop();

        }).catch(error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new stream.');

        });

    }

  }

  public readSingleFile(event: any) {

    let fileName = event.target.files[0];

    if (!fileName) {
      return;
    }

    let reader = new FileReader();

    reader.onload = file => {

      let contents: any = file.target;
      this.streamImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    this.streamImageInputEdit.nativeElement.click();
    
  }

  // Display Delete Stream Confirmation.
  public toggleDeleteStream() {

    let confirm = this._alertCtrl.create({
      title: 'Delete Stream',
      message: 'Are you sure you want to delete this stream?',
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
            this._util.StartSpinner('Deleting Stream...');

            this._streamService.deleteStream(this.stream.id)
              .subscribe(message => {

                this._util.StopSpinner();

                this._nav.pop();

              }, error => {

                this._util.StopSpinner();

                this._util.ShowAlert('Internal Error', 'Could not delete Stream.');

              });

          }
        }
      ]
    });

    confirm.present();

  }

}
