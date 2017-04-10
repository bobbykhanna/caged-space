import { Component, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { StreamModel } from '../../models/stream';
import { StreamService } from '../../providers/stream-service';
import { MusicStreamDetailsPage } from '../../pages/music-stream-details-page/music-stream-details-page';
import { AddMusicStreamPage } from '../../pages/add-music-stream-page/add-music-stream-page';
import { UtilityService } from '../../providers/utility-service';

@Component({
  selector: 'page-music-streams',
  templateUrl: 'music-streams-page.html'
})
export class MusicStreamsPage {

  private unfilteredStreams: Array<StreamModel>;
  private filteredStreams: Array<StreamModel>;
  private isMobileDevice: boolean;

  constructor(private _streamService: StreamService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this.isMobileDevice = (this._platform.width() <= 768);

    });

    this._streamService.streams$.subscribe(musicians => {

      this.unfilteredStreams = musicians;
      this.filteredStreams = musicians;

    });

  }

  openDetails(detailsModel: StreamModel) {

    this._nav.push(MusicStreamDetailsPage, {
      model: detailsModel
    });

  }

  addNewStream() {

    this._nav.push(AddMusicStreamPage);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this.isMobileDevice = (event.target.innerWidth <= 768);

  }

  // Search streams by name.
  filterStreams(event: any) {

    let allMusicians = this.unfilteredStreams;

    let searchText = event.target.value;

    if (searchText && searchText.trim() != '') {

      this.filteredStreams = allMusicians.filter((item) => {

        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);

      });

    } else {

      this.filteredStreams = allMusicians;

    }

  }
}
