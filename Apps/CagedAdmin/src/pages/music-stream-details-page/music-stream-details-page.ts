import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, PopoverOptions, ViewController } from 'ionic-angular';
import { StreamModel } from '../../models/stream';
import { StreamBeaconModel } from '../../models/streamBeacon';
import { FormBuilder, Validators } from '@angular/forms';
import { StreamService } from '../../providers/stream-service';
import { BeaconService } from '../../providers/beacon-service';
import { UtilityService } from '../../providers/utility-service';
import { BeaconsPopoverPage } from '../beacons-popover-page/beacons-popover-page';
import { BeaconDetailsPage } from '../beacon-details-page/beacon-details-page';
import { BeaconModel } from "../../models/beacon";
import _ from 'lodash';


@Component({
  selector: 'page-music-stream-details',
  templateUrl: 'music-stream-details-page.html'
})
export class MusicStreamDetailsPage {
  @ViewChild('streamImageInputEdit') streamImageInputEdit: ElementRef;

  public isEditing: boolean = false;
  public stream: StreamModel;
  hasUploadedNewImage: boolean;
  streamImage: string;
  editStreamForm: any;
  private beacons: Array<BeaconModel>;
  private availableBeacons: Array<BeaconModel>;

  constructor(
    private _streamService: StreamService,
    private _beaconService: BeaconService,
    private _alertCtrl: AlertController,
    private _util: UtilityService,
    private _nav: NavController,
    private _navParams: NavParams,
    private _popOver: PopoverController,
    private _fb: FormBuilder
  ) {

    this.stream = new StreamModel();

    this.editStreamForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ip: ['', Validators.required]
    });

    this.stream = this._navParams.get('model');

    if (this.stream.streamImageDataUrl) {

      this.streamImage = this.stream.streamImageDataUrl;

    } else if (this.stream.streamImageUrl) {

      this.streamImage = this.stream.streamImageUrl;

    }
    else {

      this.streamImage = '../../assets/default_image.png';

    }

    this._beaconService.beacons$.subscribe(newBeacons => {

      let beacons = new Array<BeaconModel>();
      let availableBeacons = new Array<BeaconModel>();

      let beaconsIds = this.stream.beacons;

      newBeacons.forEach(function (beacon) {

        if (_.some(beaconsIds, function (id) { return id === beacon.id; })) {

          beacons.push(beacon);

        } else {

          availableBeacons.push(beacon);

        }

      });

      this.beacons = beacons;
      this.availableBeacons = availableBeacons;

    });

  }

  ngAfterViewInit() {

    // Create an stream listener when stream's image is uploaded. 
    if (this.streamImageInputEdit) {

      this.streamImageInputEdit.nativeElement.addEventListener('change', stream => {
        this.readSingleFile(stream);
      }, false);

    }

  }

  // Display Edit Stream Form.
  public toggleEditStream() {

    if (this.isEditing == true) {

      this.isEditing = false;

    } else {

      this.isEditing = true;

    }

  }

  // Update Stream's Info.
  public editStream(isValid: boolean) {

    if (isValid) {

      // Instantiate spinner. 
      this._util.StartSpinner('Updating Stream\'s Info...');

      let updatedStream = this.stream;
      updatedStream.name = this.editStreamForm.value.name;
      updatedStream.ip = this.editStreamForm.value.ip;
      updatedStream.description = this.editStreamForm.value.description;
      updatedStream.streamImageDataUrl = null;

      this._streamService.editStream(updatedStream, this.hasUploadedNewImage, this.streamImage)
        .then(stream => {

          this._util.StopSpinner();

          // Navigate back to stream list page.
          this._nav.pop();

        }).catch(error => {

          this._util.StopSpinner();

          this._util.ShowAlert('Internal Error', 'Could not add new stream.');

        });

    }

  }

  public readSingleFile(stream: any) {

    let fileName = stream.target.files[0];

    if (!fileName) {
      return;
    }

    let reader = new FileReader();

    reader.onload = file => {

      let contents: any = file.target;
      this.streamImage = contents.result;
      this.hasUploadedNewImage = true;

    };

    reader.readAsDataURL(fileName);

  }

  public toggleImageUpload() {

    this.streamImageInputEdit.nativeElement.click();

  }

  // Display Delete Stream Confirmation.
  public toggleDeleteStream() {

    let confirm = this._alertCtrl.create({
      title: 'Delete Stream',
      message: 'Are you sure you want to delete this stream?',
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
            this._util.StartSpinner('Deleting Stream...');

            this._streamService.deleteStream(this.stream.id, this.stream.streamImageFileName)
              .subscribe(message => {

                this._util.StopSpinner();

                this._nav.pop();

              }, error => {

                this._util.StopSpinner();

                this._util.ShowAlert('Internal Error', 'Could not delete Stream.');

              });

          }
        }
      ]
    });

    confirm.present();

  }

  openBeaconDetails(detailsModel: BeaconModel) {

    this._nav.push(BeaconDetailsPage, {
      model: detailsModel
    });

  }

  presentBeaconsPopover() {

    if (this.availableBeacons.length > 0) {

      let options: PopoverOptions = {};
      options.enableBackdropDismiss = true;
      options.showBackdrop = true;

      let popover = this._popOver.create(BeaconsPopoverPage, this.availableBeacons, options);

      popover.onDidDismiss(beacon => this.assignBeacon(beacon));

      popover.present();

    } else {

      this._util.ShowAlert('Alert', 'All Beacons already assigned');

    }

  }

  assignBeacon(beacon: BeaconModel) {

    if (beacon != null) {

      this._util.StartSpinner('Assigning Beacon...');

      let model = new StreamBeaconModel();
      model.streamId = this.stream.id;
      model.beaconId = beacon.id;

      this._streamService.assignBeaconToStream(model).subscribe(response => {

        var index = this.availableBeacons.indexOf(beacon, 0);

        if (index > -1) {
          this.availableBeacons.splice(index, 1);
        }

        this.beacons.push(beacon);

        if (!this.stream.beacons) { this.stream.beacons = new Array<string>(); }
        this.stream.beacons[beacon.id] = beacon.id;

        this._util.StopSpinner();

      }, error => {

        this._util.StopSpinner();
        this._util.ShowAlert('Internal Error', 'Cannot assign Beacon to Stream');

      });

    }

  }

  unassignBeacon(beacon: BeaconModel) {

    let model = new StreamBeaconModel();

    this._util.StartSpinner('Unassigning Beacon...');

    model.streamId = this.stream.id;
    model.beaconId = beacon.id;

    this._streamService.unassignBeaconFromStream(model).subscribe(response => {

      var index = this.beacons.indexOf(beacon, 0);

      if (index > -1) {
        this.beacons.splice(index, 1);
      }

      this.stream.beacons[beacon.id] = null;

      this.availableBeacons.push(beacon);

      this._util.StopSpinner();

    }, error => {

      this._util.StopSpinner();
      this._util.ShowAlert('Internal Error', 'Cannot unassign Beacon from Stream');

    });

  }

}
