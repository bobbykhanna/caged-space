import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, PopoverOptions, ViewController } from 'ionic-angular';
import { EventModel } from '../../models/event';
import { MusicianModel } from '../../models/musician';
import { StreamModel } from '../../models/stream';
import { EventStreamModel } from '../../models/eventStream';
import { EventMusicianModel } from '../../models/eventMusician';
import { MusicianDetailsPage } from '../musician-details-page/musician-details-page';
import { MusiciansPopoverPage } from '../musicians-popover-page/musicians-popover-page';
import { StreamsPopoverPage } from '../streams-popover-page/streams-popover-page';
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
  private musicians: Array<MusicianModel>;
  private availableMusicians: Array<MusicianModel>;
  private streams: Array<StreamModel>;
  private availableStreams: Array<StreamModel>;

  constructor(
    private _eventService: EventService,
    private _utilService: UtilityService,
    private _musicianService: MusicianService,
    private _streamService: StreamService,
    private _navCtrl: NavController,
    public _navParams: NavParams,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    private _popOver: PopoverController
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
      let availableMusicians = new Array<MusicianModel>();

      let musiciansIds = this.event.musicians;

      newMusicians.forEach(function (musician) {

        if (_.some(musiciansIds, function (id) { return id === musician.id; })) {

          musicians.push(musician);

        } else {

          availableMusicians.push(musician);

        }

      });

      this.musicians = musicians;
      this.availableMusicians = availableMusicians;

    });

    this._streamService.streams$.subscribe(newStreams => {

      let streams = new Array<StreamModel>();
      let availableStreams = new Array<StreamModel>();

      let streamsIds = this.event.streams;

      newStreams.forEach(function (stream) {

        if (_.some(streamsIds, function (id) { return id === stream.id; })) {

          streams.push(stream);

        } else {

          availableStreams.push(stream);

        }

      });

      this.streams = streams;
      this.availableStreams = availableStreams;

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

  unassignMusician(musician: MusicianModel) {

    let model = new EventMusicianModel();

    this._utilService.StartSpinner('Unassigning Musician...');

    model.eventId = this.event.id;
    model.musicianId = musician.id;

    this._eventService.unassignMusicianFromEvent(model).subscribe(response => {

      var index = this.musicians.indexOf(musician, 0);

      if (index > -1) {
        this.musicians.splice(index, 1);
      }

      this.event.musicians[musician.id] = null;

      this.availableMusicians.push(musician);

      this._utilService.StopSpinner();

    }, error => {

      this._utilService.StopSpinner();
      this._utilService.ShowAlert('Internal Error', 'Cannot unassign Musician from Event');

    });

  }

  unassignStream(stream: StreamModel) {

    let model = new EventStreamModel();

    this._utilService.StartSpinner('Unassigning Stream...');

    model.eventId = this.event.id;
    model.streamId = stream.id;

    this._eventService.unassignStreamFromEvent(model).subscribe(response => {

      var index = this.streams.indexOf(stream, 0);

      if (index > -1) {
        this.streams.splice(index, 1);
      }

      this.event.streams[stream.id] = null;

      this.availableStreams.push(stream);

      this._utilService.StopSpinner();

    }, error => {

      this._utilService.StopSpinner();
      this._utilService.ShowAlert('Internal Error', 'Cannot unassign Stream from Event');

    });

  }

  presentMusiciansPopover() {

    if (this.availableMusicians.length > 0) {

      let options: PopoverOptions = {};
      options.enableBackdropDismiss = true;
      options.showBackdrop = true;

      let popover = this._popOver.create(MusiciansPopoverPage, this.availableMusicians, options);

      popover.onDidDismiss(musician => this.assignMusician(musician));

      popover.present();

    } else {

      this._utilService.ShowAlert('Alert', 'All musicians already assigned');

    }

  }

  presentStreamsPopover() {

    if (this.availableStreams.length > 0) {

      let options: PopoverOptions = {};
      options.enableBackdropDismiss = true;
      options.showBackdrop = true;

      let popover = this._popOver.create(StreamsPopoverPage, this.availableStreams, options);

      popover.onDidDismiss(stream => this.assignStream(stream));

      popover.present();

    } else {

      this._utilService.ShowAlert('Alert', 'All streams already assigned');

    }

  }

  assignStream(stream: StreamModel) {

    if (stream != null) {

      this._utilService.StartSpinner('Assigning Stream...');

      let model = new EventStreamModel();
      model.eventId = this.event.id;
      model.streamId = stream.id;

      this._eventService.assignStreamToEvent(model).subscribe(response => {

        var index = this.availableStreams.indexOf(stream, 0);

        if (index > -1) {
          this.availableStreams.splice(index, 1);
        }

        this.streams.push(stream);

        if (!this.event.streams) { this.event.streams = new Array<string>(); }
        this.event.streams[stream.id] = stream.id;

        this._utilService.StopSpinner();

      }, error => {

        this._utilService.StopSpinner();
        this._utilService.ShowAlert('Internal Error', 'Cannot assign Stream to Event');

      });

    }

  }

  assignMusician(musician: MusicianModel) {

    if (musician != null) {

      this._utilService.StartSpinner('Assigning Musician...');

      let model = new EventMusicianModel();
      model.eventId = this.event.id;
      model.musicianId = musician.id;

      this._eventService.assignMusicianToEvent(model).subscribe(response => {

        var index = this.availableMusicians.indexOf(musician, 0);

        if (index > -1) {
          this.availableMusicians.splice(index, 1);
        }

        this.musicians.push(musician);

        if (!this.event.musicians) { this.event.musicians = new Array<string>(); }
        this.event.musicians[musician.id] = musician.id;

        this._utilService.StopSpinner();

      }, error => {

        this._utilService.StopSpinner();
        this._utilService.ShowAlert('Internal Error', 'Cannot assign Musician to Event');

      });

    }

  }

}


