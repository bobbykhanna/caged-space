import { Component, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { StreamModel } from '../../models/stream';
import { StreamService } from '../../providers/stream-service';
import { MusicStreamDetailsPage } from '../../pages/music-stream-details-page/music-stream-details-page';
import { AddMusicStreamPage } from '../../pages/add-music-stream-page/add-music-stream-page';

@Component({
  selector: 'page-music-streams',
  templateUrl: 'music-streams-page.html'
})
export class MusicStreamsPage {

  private streams: Array<StreamModel>
  private _isMobileDevice: boolean;

  constructor(private _streamService: StreamService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this._isMobileDevice = (this._platform.width() <= 768);

    });

    this._streamService.streams$.subscribe(streams => {

      this.streams = streams;

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

    this._isMobileDevice = (event.target.innerWidth <= 768);

  }
}
