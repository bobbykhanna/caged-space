import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventModel } from '../../models/event';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../providers/event-service';
import { UtilityService } from '../../providers/utility-service';

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details-page.html'
})
export class EventDetailsPage {

  public isEditing: boolean = false;
  public event: EventModel;
  editEventForm: any;
  hasUploadedNewImage: boolean;
  eventProfileImage: string = '../../assets/thumbnail-totoro.png';

  constructor(private _eventService: EventService, private _util: UtilityService, public navCtrl: NavController, public _navParams: NavParams, private _fb: FormBuilder) {

    this.event = new EventModel();
    this.editEventForm = this._fb.group({
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }


  ionViewDidEnter() {
    console.log('ionViewDidLoad EventDetailsPage');
    this.event = this._navParams.get('model');
    this.editEventForm.value.name = this.event.name;
    this.editEventForm.value.description = this.event.description;
    this.editEventForm.value.beginDate = this.event.beginDate;
    this.editEventForm.value.endDate = this.event.endDate;
    this.editEventForm.value.location = this.event.location;
  }

  ionViewDidLoad() {

    // Create an event listener when musician's image is uploaded. 
    document.getElementById('editEventImageUpload').addEventListener('change', event => {
      this.readSingleFile(event);
    }, false);

  }

  // Display Edit Event Form.
  public toggleEditEvent() {

    if (this.isEditing == true) {

      this.isEditing = false;

    } else {

      this.isEditing = true;

    }

  }

  // Update Event's Info.
  public editEvent(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Updating Event\'s Info...');

      let updatedEvent = this.editEventForm.value;
      updatedEvent.id = this.event.id;
      
      //let model = new AddEventModel();
      
      /*if (this.hasUploadedNewImage) {

        model.hasUploadedNewImage = true;
        model.eventImage = this.eventProfileImage;

      }*/
      this._eventService.editEvent(updatedEvent)
        .subscribe(event => {

          this._util.StopSpinner();

          this.event = event;

          this.isEditing = false;

        }, error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not edit Event.');

        });

    }

  }

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

    document.getElementById('editEventImageUpload').click();

  }



}