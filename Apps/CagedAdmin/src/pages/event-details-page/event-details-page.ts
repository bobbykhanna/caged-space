import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EventModel } from '../../models/event';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../providers/event-service';
import { UtilityService } from '../../providers/utility-service';

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details-page.html'
})
export class EventDetailsPage {
  @ViewChild('imageInputEdit') imageInputEdit: ElementRef;

  public isEditing: boolean = false;
  public event: EventModel;
  editEventForm: any;
  hasUploadedNewImage: boolean;
  eventProfileImage: string;

  constructor(private _eventService: EventService, private _util: UtilityService, public navCtrl: NavController, public _navParams: NavParams, private _fb: FormBuilder, private _alertCtrl: AlertController) {

    this.event = new EventModel();
    this.editEventForm = this._fb.group({
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.event = this._navParams.get('model');

    if (this.event.eventImageUrl) {

      this.eventProfileImage = this.event.eventImageUrl;

    } else {

      this.eventProfileImage = '../../assets/thumbnail-totoro.png';

    }
  }


  /*ionViewDidEnter() {
    console.log('ionViewDidLoad EventDetailsPage');
    this.event = this._navParams.get('model');
    this.editEventForm.value.name = this.event.name;
    this.editEventForm.value.description = this.event.description;
    this.editEventForm.value.beginDate = this.event.beginDate;
    this.editEventForm.value.endDate = this.event.endDate;
    this.editEventForm.value.location = this.event.location;
  }*/
  ngAfterViewInit() {

    // Create an event listener when event's image is uploaded. 

    if (this.imageInputEdit) {

      this.imageInputEdit.nativeElement.addEventListener('change', event => {
        this.readSingleFile(event);
      }, false);

    }

  }
  /*
    ionViewDidLoad() {
  
      // Create an event listener when musician's image is uploaded. 
      document.getElementById('editEventImageUpload').addEventListener('change', event => {
        this.readSingleFile(event);
      }, false);
  
    }
  */
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

      let updatedEvent = this.event;
      updatedEvent.name = this.editEventForm.value.name
      updatedEvent.description = this.editEventForm.value.description;
      updatedEvent.beginDate=this.editEventForm.value.beginDate;
      updatedEvent.endDate=this.editEventForm.value.endDate
      updatedEvent.location=this.editEventForm.value.location;

      this._eventService.editEvent(updatedEvent,  this.hasUploadedNewImage, this.eventProfileImage)
        .then(event => {

          this._util.StopSpinner();

          // Navigate back to event list page.
          this.navCtrl.pop();

        }).catch(error => {

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

    this.imageInputEdit.nativeElement.click();

  }

  // Display Delete event Confirmation.
  public toggleDeleteEvent() {

    let confirm = this._alertCtrl.create({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this Event?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            confirm.dismiss();
          }
        },
        {
          text: 'Yes',
          handler: () => {

            // Instantiate spinner. 
            this._util.StartSpinner('Deleting Event...');

            this._eventService.deleteEvent(this.event.id)
              .subscribe(message => {

                this._util.StopSpinner();

                this.navCtrl.pop();

              }, error => {

                this._util.StopSpinner();

                this._util.ShowAlert('Internal Error', 'Could not delete Event.');

              });

          }
        }
      ]
    });

    confirm.present();

  }s

}