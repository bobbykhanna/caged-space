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
  private unfilteredEvents: Array<EventModel>;
  private filteredEvents: Array<EventModel>
  private _isMobileDevice: boolean;

  constructor(private _eventService: EventService, private _nav: NavController, private _platform: Platform) {

    this._platform.ready().then((readySource) => {

      this._isMobileDevice = (this._platform.width() <= 768);

    });

    this._eventService.events$.subscribe(events => {

      this.unfilteredEvents = events;
      this.filteredEvents = events;

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

  // Search events by name.
  filterEvents(event: any) {

    let allEvents = this.unfilteredEvents;

    let searchText = event.target.value;

    if (searchText && searchText.trim() != '') {

      this.filteredEvents = allEvents.filter((item) => {

        return (item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);

      });

    } else {

      this.filteredEvents = allEvents;

    }

  }
}
