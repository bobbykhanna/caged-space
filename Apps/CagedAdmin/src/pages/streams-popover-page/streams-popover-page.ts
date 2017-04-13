import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { StreamModel } from "../../models/stream";

@Component({
  selector: 'page-streams-popover',
  templateUrl: 'streams-popover-page.html'
})
export class StreamsPopoverPage {

  streams: Array<StreamModel>;

  constructor(private _viewCtrl: ViewController, private _navParams: NavParams) {

    this.streams = this._navParams.data;

  }

  selectStream(stream: StreamModel) {

    this._viewCtrl.dismiss(stream);

  }

}

