import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { StreamService } from '../../providers/stream-service';
import { UtilityService } from '../../providers/utility-service';
import { AddStreamModel } from '../../models/addStream';

@Component({
  selector: 'page-add-music-stream',
  templateUrl: 'add-music-stream-page.html'
})
export class AddMusicStreamPage {

  addStreamForm: any;
  hasUploadedNewImage: boolean;
  streamProfileImage: string = '../../assets/thumbnail-totoro.png';

  constructor(private _streamService: StreamService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addStreamForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ip: ['', Validators.required]
    });

  }

  // Add New Stream.
  public addStream(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding a New Stream...');

      let model = new AddStreamModel();

      model.name = this.addStreamForm.value.name;
      model.ip = this.addStreamForm.value.ip;
      model.description = this.addStreamForm.value.description;

      if (this.hasUploadedNewImage) {

        model.hasUploadedNewImage = true;
        model.streamImage = this.streamProfileImage;

      }

      this._streamService.addStream(this.addStreamForm.value)
        .subscribe(stream => {

          this._util.StopSpinner();

          // Navigate back to streams list page.
          this._nav.pop();

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add New Stream.');

        });

    }
  }

  ionViewDidLoad() {
    // Create an event listener when stream's image is uploaded. 
    document.getElementById('streamImageUpload').addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);
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
      this.streamProfileImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    document.getElementById('streamImageUpload').click();

  }

}
