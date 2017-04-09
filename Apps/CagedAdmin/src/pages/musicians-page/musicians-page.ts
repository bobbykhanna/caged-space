import { Component, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { MusicianModel } from '../../models/musician';
import { MusicianService } from '../../providers/musician-service';
import { MusicianDetailsPage } from '../../pages/musician-details-page/musician-details-page';
import { AddMusicianPage } from '../../pages/add-musician-page/add-musician-page';

@Component({
  selector: 'page-musicians',
  templateUrl: 'musicians-page.html'
})
export class MusiciansPage {

  private unfilteredMusicians: Array<MusicianModel>;
  private filteredMusicians: Array<MusicianModel>;
  private isMobileDevice: boolean;

  constructor(private _musicianService: MusicianService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this.isMobileDevice = (this._platform.width() <= 768);

    });

    this._musicianService.musicians$.subscribe(musicians => {

      this.unfilteredMusicians = musicians;
      this.filteredMusicians = musicians;

    });

  }

  openDetails(detailsModel: MusicianModel) {

    this._nav.push(MusicianDetailsPage, {
      model: detailsModel
    });

  }

  addNewMusician() {

    this._nav.push(AddMusicianPage);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this.isMobileDevice = (event.target.innerWidth <= 768);

  }

  // Search musicians by name.
  filterMusicians(event: any) {

    let allMusicians = this.unfilteredMusicians;

    let searchText = event.target.value;

    if (searchText && searchText.trim() != '') {

      this.filteredMusicians = allMusicians.filter((item) => {

        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);

      });

    } else {

      this.filteredMusicians = allMusicians;

    }

  }

}
