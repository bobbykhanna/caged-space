import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BeaconModel } from '../../models/beacon';
import { FormBuilder, Validators } from '@angular/forms';
import { BeaconService } from '../../providers/beacon-service';
import { UtilityService } from '../../providers/utility-service';


@Component({
  selector: 'page-beacon-details',
  templateUrl: 'beacon-details-page.html'
})
export class BeaconDetailsPage {

  public isEditing: boolean = false;
  public beacon: BeaconModel;
  editBeaconForm: any;

  constructor(private _beaconService: BeaconService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.beacon = new BeaconModel();

    this.editBeaconForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      guid: ['', Validators.required]
    });

  }

  ionViewDidEnter() {

    this.beacon = this._navParams.get('model');

    this.editBeaconForm.value.name = this.beacon.name;
    this.editBeaconForm.value.description = this.beacon.description;
    this.editBeaconForm.value.guid = this.beacon.guid;

  }

  // Display Edit Musician Form.
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

      let updatedBeacon = this.editBeaconForm.value;
      updatedBeacon.id = this.beacon.id;

      this._beaconService.editBeacon(updatedBeacon)
        .subscribe(beacon => {

          this._util.StopSpinner();

          this.beacon = beacon;

          this.isEditing = false;

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not edit Musician.');

        });

    }

  }

}

