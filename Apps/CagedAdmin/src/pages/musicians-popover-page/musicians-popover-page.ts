import { Component} from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { MusicianModel } from "../../models/musician";


@Component({
  selector: 'page-musicians-popover',
  templateUrl: 'musicians-popover-page.html'
})
export class MusiciansPopoverPage {

  musicians: Array<MusicianModel>;

constructor(private _viewCtrl: ViewController, private _navParams: NavParams) {

  this.musicians = this._navParams.data;

}

  selectMusician(musician: MusicianModel) {

    this._viewCtrl.dismiss(musician);

  }

}
