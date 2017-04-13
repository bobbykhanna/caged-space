import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { BeaconService } from '../../providers/beacon-service';
import { UtilityService } from '../../providers/utility-service';
import { BeaconModel } from '../../models/beacon';

@Component({
  selector: 'page-add-beacon',
  templateUrl: 'add-beacon-page.html'
})
export class AddBeaconPage {
  @ViewChild('imageInput') imageInput: ElementRef;

  addBeaconForm: any;
  hasUploadedNewImage: boolean;
  beaconProfileImage: string = '../../assets/thumbnail-totoro.png';

  constructor(private _beaconService: BeaconService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addBeaconForm = this._fb.group({
      name: ['', Validators.required],
      
      description: ['', Validators.required],
      guid: ['', Validators.required],
    });

  }

  ngAfterViewInit() {

    // Create an event listener when beacon's image is uploaded. 
    this.imageInput.nativeElement.addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Add New Beacon.
  public addBeacon(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding New Beacon...');

      let model = new BeaconModel();

      model.name = this.addBeaconForm.value.name;
      model.description = this.addBeaconForm.value.description;
      model.guid = this.addBeaconForm.value.guid;
      model.beaconImageDataUrl = null;

      this._beaconService.addBeacon(model, this.hasUploadedNewImage, this.beaconProfileImage)
        .then(beacon => {

          this._util.StopSpinner();

          // Navigate back to beacons list page.
          this._nav.pop();

        }).catch(error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new Beacon.');

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
      this.beaconProfileImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    this.imageInput.nativeElement.click();

  }

}
