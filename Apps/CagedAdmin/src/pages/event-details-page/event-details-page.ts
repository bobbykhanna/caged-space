import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EventModel } from '../../models/event';
import { MusicianModel } from '../../models/musician';
import { StreamModel } from '../../models/stream';
import { MusicianDetailsPage } from '../musician-details-page/musician-details-page';
import { MusicStreamDetailsPage } from '../music-stream-details-page/music-stream-details-page';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../providers/event-service';
import { MusicianService } from '../../providers/musician-service';
import { StreamService } from '../../providers/stream-service';
import { UtilityService } from '../../providers/utility-service';
import _ from 'lodash';

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details-page.html'
})
export class EventDetailsPage {
  @ViewChild('eventImageInputEdit') eventImageInputEdit: ElementRef;

  public isEditing: boolean = false;
  public event: EventModel;
  editEventForm: any;
  hasUploadedNewImage: boolean;
  eventProfileImage: string;
  private musicians: Array<MusicianModel>;;
  streams: Array<StreamModel>;

  constructor(
    private _eventService: EventService,
    private _utilService: UtilityService,
    private _musicianService: MusicianService,
    private _streamService: StreamService,
    private _navCtrl: NavController,
    public _navParams: NavParams,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController
  ) {

    this.event = new EventModel();
    this.editEventForm = this._fb.group({
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.event = this._navParams.get('model');

    if (this.event.eventImageDataUrl) {

      this.eventProfileImage = this.event.eventImageDataUrl;

    } else if (this.event.eventImageUrl) {

      this.eventProfileImage = this.event.eventImageUrl;

    }
    else {

      this.eventProfileImage = '../../assets/default_image.png';

    }

    this._musicianService.musicians$.subscribe(newMusicians => {

      let musicians = new Array<MusicianModel>();

      let musiciansIds = this.event.musiciansIds;

      newMusicians.forEach(function (musician) {

        if (_.some(musiciansIds, function (id) { return id === musician.id; })) { musicians.push(musician); }

      });

      this.musicians = musicians;

    });

    this._streamService.streams$.subscribe(newStreams => {

      let streams = new Array<StreamModel>();

      let streamsIds = this.event.streamsIds;

      newStreams.forEach(function (stream) {

        if (_.some(streamsIds, function (id) { return id === stream.id; })) { streams.push(stream); }

      });

      this.streams = streams;

    });

  }

  ngAfterViewInit() {

    // Create an event listener when event's image is uploaded. 
    if (this.eventImageInputEdit) {

      this.eventImageInputEdit.nativeElement.addEventListener('change', event => {
        this.readSingleFile(event);
      }, false);

    }

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

      if (this.editEventForm.value.endDate < this.editEventForm.value.beginDate) {

        this._utilService.ShowAlert('', 'Event End Date cannot be less than Event Start Date');
        return;
      }

      // Instantiate spinner. 
      this._utilService.StartSpinner('Updating Event\'s Info...');

      let updatedEvent = this.event;
      updatedEvent.name = this.editEventForm.value.name
      updatedEvent.description = this.editEventForm.value.description;
      updatedEvent.beginDate = this.editEventForm.value.beginDate;
      updatedEvent.endDate = this.editEventForm.value.endDate
      updatedEvent.location = this.editEventForm.value.location;
      updatedEvent.eventImageDataUrl = null;

      this._eventService.editEvent(updatedEvent, this.hasUploadedNewImage, this.eventProfileImage)
        .then(event => {

          this._utilService.StopSpinner();

          // Navigate back to event list page.
          this._navCtrl.pop();

        }).catch(error => {

          this._utilService.StopSpinner();

          this._utilService.ShowAlert('Internal Error', 'Could not edit Event.');

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

    this.eventImageInputEdit.nativeElement.click();

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
            this._utilService.StartSpinner('Deleting Event...');

            this._eventService.deleteEvent(this.event.id, this.event.eventImageFileName)
              .subscribe(message => {

                this._utilService.StopSpinner();

                this._navCtrl.pop();

              }, error => {

                this._utilService.StopSpinner();

                this._utilService.ShowAlert('Internal Error', 'Could not delete Event.');

              });

          }
        }
      ]
    });

    confirm.present();

  }

  openMusicianDetails(detailsModel: MusicianModel) {

    this._navCtrl.push(MusicianDetailsPage, {
      model: detailsModel
    });

  }

  openStreamDetails(detailsModel: StreamModel) {

    this._navCtrl.push(MusicStreamDetailsPage, {
      model: detailsModel
    });

  }

  removeMusician(model: MusicianModel) {


  }

  removeStream(model: StreamModel) {


  }

}