import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BeaconModel } from '../../models/beacon';
import { FormBuilder, Validators } from '@angular/forms';
import { BeaconService } from '../../providers/beacon-service';
import { UtilityService } from '../../providers/utility-service';


@Component({
  selector: 'page-beacon-details',
  templateUrl: 'beacon-details-page.html'
})
export class BeaconDetailsPage {
  @ViewChild('beaconImageInputEdit') beaconImageInputEdit: ElementRef;

  public isEditing: boolean = false;
  public beacon: BeaconModel;
  hasUploadedNewImage: boolean;
  beaconProfileImage: string;
  editBeaconForm: any;

  constructor(private _beaconService: BeaconService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder, private _alertCtrl: AlertController) {

    this.beacon = new BeaconModel();

    this.editBeaconForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      guid: ['', Validators.required]
    });

    this.beacon = this._navParams.get('model');

    if (this.beacon.beaconImageDataUrl) {

      this.beaconProfileImage = this.beacon.beaconImageDataUrl;

    } else if (this.beacon.beaconImageUrl) {

      this.beaconProfileImage = this.beacon.beaconImageUrl;

    }
    else {

      this.beaconProfileImage = '../../assets/thumbnail-totoro.png';

    }

  }

  ngAfterViewInit() {

    // Create an event listener when beacon's image is uploaded. 
    if (this.beaconImageInputEdit) {

      this.beaconImageInputEdit.nativeElement.addEventListener('change', event => {
        this.readSingleFile(event);
      }, false);

    }

  }

  // Display Edit beacon Form.
  public toggleEditBeacon() {

    if (this.isEditing == true) {

      this.isEditing = false;

    } else {

      this.isEditing = true;

    }

  }

  // Update Beacon's Info.
  public editBeacon(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Updating Beacon\'s Info...');

      let updatedBeacon = this.beacon;
      updatedBeacon.name = this.editBeaconForm.value.name;
      updatedBeacon.description = this.editBeaconForm.value.description;
      updatedBeacon.guid = this.editBeaconForm.value.guid;
      updatedBeacon.beaconImageDataUrl = null;

      this._beaconService.editBeacon(updatedBeacon, this.hasUploadedNewImage, this.beaconProfileImage)
        .then(beacon => {

          this._util.StopSpinner();

          // Navigate back to beacons list page.
          this._nav.pop();

        }).catch(error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new beacon.');

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

    this.beaconImageInputEdit.nativeElement.click();

  }

  // Display Delete Beacon Confirmation.
  public toggleDeleteBeacon() {

    let confirm = this._alertCtrl.create({
      title: 'Delete Beacon',
      message: 'Are you sure you want to delete this beacon?',
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
            this._util.StartSpinner('Deleting Beacon...');

            this._beaconService.deleteBeacon(this.beacon.id)
              .subscribe(message => {

                this._util.StopSpinner();

                this._nav.pop();

              }, error => {

                this._util.StopSpinner();

                this._util.ShowAlert('Internal Error', 'Could not delete Beacon.');

              });

          }
        }
      ]
    });

    confirm.present();

  }

}
