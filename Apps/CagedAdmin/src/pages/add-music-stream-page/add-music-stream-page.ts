import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { StreamService } from '../../providers/stream-service';
import { UtilityService } from '../../providers/utility-service';

@Component({
  selector: 'page-add-music-stream',
  templateUrl: 'add-music-stream-page.html'
})
export class AddMusicStreamPage {

  addStreamForm: any;

  constructor(private _streamService: StreamService, private _util: UtilityService, private _nav: NavController, private _navParams: NavParams, private _fb: FormBuilder) {

    this.addStreamForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ip: ['', Validators.required]
    });

  }

  // Add New Stream.
  public addStream(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding a New Stream...');

      this._streamService.addStream(this.addStreamForm.value)
        .subscribe(musician => {

          this._util.StopSpinner();

          // Navigate back to streams list page.
          this._nav.pop();

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add New Stream.');

        });

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMusicStreamPage');
  }

}
