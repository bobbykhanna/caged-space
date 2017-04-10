import { Component, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { BeaconModel } from '../../models/beacon';
import { BeaconService } from '../../providers/beacon-service';
import { BeaconDetailsPage } from '../../pages/beacon-details-page/beacon-details-page';
import { AddBeaconPage } from '../../pages/add-beacon-page/add-beacon-page';

@Component({
  selector: 'page-beacons',
  templateUrl: 'beacons-page.html'
})
export class BeaconsPage {

  private unfilteredBeacons: Array<BeaconModel>;
  private filteredBeacons: Array<BeaconModel>;
  private isMobileDevice: boolean;

  constructor(private _beaconService: BeaconService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this.isMobileDevice = (this._platform.width() <= 768);

    });

    this._beaconService.beacons$.subscribe(beacons => {

      this.unfilteredBeacons = beacons;
      this.filteredBeacons = beacons;

    });

  }

  openDetails(detailsModel: BeaconModel) {

    this._nav.push(BeaconDetailsPage, {
      model: detailsModel
    });

  }

  addNewBeacon() {

    this._nav.push(AddBeaconPage);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this.isMobileDevice = (event.target.innerWidth <= 768);

  }

  // Search beacons by name.
  filterBeacons(event: any) {

    let allBeacons = this.unfilteredBeacons;

    let searchText = event.target.value;

    if (searchText && searchText.trim() != '') {

      this.filteredBeacons = allBeacons.filter((item) => {

        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);

      });

    } else {

      this.filteredBeacons = allBeacons;

    }

  }

}
