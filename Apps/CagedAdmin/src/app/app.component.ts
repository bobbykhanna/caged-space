import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login-page/login-page';
import { EventsPage } from '../pages/events-page/events-page';
import { MusiciansPage } from '../pages/musicians-page/musicians-page';
import { BeaconsPage } from '../pages/beacons-page/beacons-page';
import { MusicStreamsPage } from '../pages/music-streams-page/music-streams-page';
import { UsersPage } from '../pages/users-page/users-page';

import { UserService } from '../providers/user-service';
import { MusicianService } from '../providers/musician-service';
import { StreamService } from '../providers/stream-service'
import { EventService } from '../providers/event-service';
import { BeaconService } from '../providers/beacon-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  menuPages: Array<{ title: string, component: any, icon: string }>;

  // Injecting App's resource services to kick-off data pre-fetch process.
  constructor(
    private _platform: Platform,
    private _user: UserService,
    private _musician: MusicianService,
    private _stream: StreamService,
    private _event: EventService,
    private _beacon: BeaconService
  ) {
    this.initializeApp();

    // Populates side menu.
    this.menuPages = [
      { title: 'Sign Out', component: LoginPage, icon: 'log-out' },
      { title: 'Events', component: EventsPage, icon: 'calendar' },
      { title: 'Musicians', component: MusiciansPage, icon: 'musical-note' },
      { title: 'Streams', component: MusicStreamsPage, icon: 'options' },
      { title: 'Beacons', component: BeaconsPage, icon: 'bluetooth' },
      { title: 'Users', component: UsersPage, icon: 'person' }
    ];

  }

  initializeApp() {
    this._platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {}, { animate: true, direction: 'forward' });
  }
}
