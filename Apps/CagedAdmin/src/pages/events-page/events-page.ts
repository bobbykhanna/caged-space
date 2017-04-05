import { Component, HostListener } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { EventModel } from '../../models/event';
import { EventService } from '../../providers/event-service';
import { EventDetailsPage } from '../../pages/event-details-page/event-details-page';
import { AddEventPage } from '../../pages/add-event-page/add-event-page';

@Component({
  selector: 'page-events',
  templateUrl: 'events-page.html'
})
export class EventsPage {

  private events: Array<EventModel>
  private _isMobileDevice: boolean;

  constructor(private _eventService: EventService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this._isMobileDevice = (this._platform.width() <= 768);

    });

    this._eventService.events$.subscribe(events => {

      this.events = events;

    });

  }

  openDetails(detailsModel: EventModel) {

    this._nav.push(EventDetailsPage, {
      model: detailsModel
    });

  }

  addNewEvent() {

    this._nav.push(AddEventPage);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this._isMobileDevice = (event.target.innerWidth <= 768);

  }

}
