import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-beacons-popover',
  templateUrl: 'beacons-popover-page.html'
})
export class BeaconsPopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeaconsPopoverPagePage');
  }

}
