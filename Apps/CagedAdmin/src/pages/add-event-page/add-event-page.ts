import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../providers/event-service';
import { UtilityService } from '../../providers/utility-service';
import { AddEventModel } from '../../models/addEvent';

/*
  Generated class for the AddEventPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event-page.html'
})
export class AddEventPage {

  addEventForm: any;
  hasUploadedNewImage: boolean;
  eventProfileImage: string = '../../assets/thumbnail-totoro.png';
// -------- Written by Saransh Bhardwaj on 2nd April 2017 ------------
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _fb: FormBuilder, private _eventService: EventService,
    private _util: UtilityService, private _nav: NavController) {

     this.addEventForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
     
    });
  }

ionViewDidLoad() {

    // Create an event listener when musician's image is uploaded. 
    document.getElementById('eventImageUpload').addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

    // Add New Event.
    /* this method will get called when a user clicks on Add Event button of Add Event page */
  public addEvent(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Adding New Event...');

      let model = new AddEventModel();

      if (this.hasUploadedNewImage) {

        model.hasUploadedNewImage = true;
        model.eventImage = this.eventProfileImage;

      }
      this._eventService.addEvent(this.addEventForm.value) //Calling addEvent Service and Subscribing to it
        .subscribe(event => {

          this._util.StopSpinner();

          // Navigate back to event list page.
          this._nav.pop();

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new Event.');

        });

    }

  }
  // -------- Written by Saransh Bhardwaj till here ------------
// Enables uploaded image preview.
  public readSingleFile(event: any) {

    let fileName = event.target.files[0];

    if (!fileName) {
      return;
    }

    let reader = new FileReader();

    reader.onload = file => {

      let contents: any = file.target;
      this.eventProfileImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    document.getElementById('eventImageUpload').click();

  }s
}
