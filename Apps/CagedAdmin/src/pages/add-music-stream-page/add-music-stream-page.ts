import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { StreamService } from '../../providers/stream-service';
import { UtilityService } from '../../providers/utility-service';
import { StreamModel } from '../../models/Stream';

@Component({
  selector: 'page-add-music-stream',
  templateUrl: 'add-music-stream-page.html'
})
export class AddMusicStreamPage {
  @ViewChild('imageInput') imageInput: ElementRef;

  addStreamForm: any;
  hasUploadedNewImage: boolean;
  streamProfileImage: string = '../../assets/new_stream.png';

  constructor(private _streamService: StreamService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addStreamForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ip: ['', Validators.required]
    });

  }
  
  ngAfterViewInit() {

    // Create an event listener when stream's image is uploaded. 
    this.imageInput.nativeElement.addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Add New Stream.
  public addStream(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding a New Stream...');

      let model = new StreamModel();

      model.name = this.addStreamForm.value.name;
      model.ip = this.addStreamForm.value.ip;
      model.description = this.addStreamForm.value.description;

      this._streamService.addStream(model, this.hasUploadedNewImage, this.streamProfileImage)
        .then(musician => {

          this._util.StopSpinner();

          // Navigate back to streams list page.
          this._nav.pop();

        }).catch(error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new Stream.');

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
      this.streamProfileImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    this.imageInput.nativeElement.click();

  }

}
