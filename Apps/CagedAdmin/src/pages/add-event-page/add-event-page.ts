import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../providers/event-service';
import { UtilityService } from '../../providers/utility-service';
import { AddEventModel } from '../../models/addEvent';
import { EventModel } from '../../models/event';

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
  @ViewChild('imageInput') imageInput: ElementRef;

  addEventForm: any;
  hasUploadedNewImage: boolean;
  eventProfileImage: string = '../../assets/default_image.png';
  // -------- Written by Saransh Bhardwaj on 2nd April 2017 ------------
  constructor(public navCtrl: NavController, public navParams: NavParams, private _fb: FormBuilder, private _eventService: EventService,
    private _util: UtilityService, private _nav: NavController) {

    this.addEventForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required,],
      location: ['', Validators.required],

    });
  }

  ngAfterViewInit() {

    // Create an event listener when musician's image is uploaded. 
    this.imageInput.nativeElement.addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Add New Event.
  /* this method will get called when a user clicks on Add Event button of Add Event page */
  public addEvent(isValid: boolean) {

    if (isValid) {

      if (this.addEventForm.value.endDate < this.addEventForm.value.beginDate) {

        this._util.ShowAlert('', 'Event End Date cannot be less than Event Start Date');
        return;
      }
      // Instantiate spinner. 
      this._util.StartSpinner('Adding New Event...');

      let model = new EventModel();

      model.name = this.addEventForm.value.name;
      model.location = this.addEventForm.value.location;
      model.beginDate = this.addEventForm.value.beginDate;
      model.endDate = this.addEventForm.value.endDate;
      model.description = this.addEventForm.value.description;
      model.eventImageDataUrl = null;

      this._eventService.addEvent(model, this.hasUploadedNewImage, this.eventProfileImage)
        .then(musician => {

          this._util.StopSpinner();

          // Navigate back to musicians list page.
          this._nav.pop();

        }).catch(error => {

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

    this.imageInput.nativeElement.click();

  }
}
