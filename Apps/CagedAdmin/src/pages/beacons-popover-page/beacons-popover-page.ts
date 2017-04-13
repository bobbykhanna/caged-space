import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { BeaconModel } from "../../models/beacon";

@Component({
  selector: 'page-beacons-popover',
  templateUrl: 'beacons-popover-page.html'
})
export class BeaconsPopoverPage {

  beacons: Array<BeaconModel>;

  constructor(private _viewCtrl: ViewController, private _navParams: NavParams) {

    this.beacons = this._navParams.data;

  }

  selectBeacon(beacon: BeaconModel) {

    this._viewCtrl.dismiss(beacon);

  }

}
