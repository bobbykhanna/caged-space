import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';

// Pages.
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login-page/login-page';

import { EventsPage } from '../pages/events-page/events-page';
import { AddEventPage } from '../pages/add-event-page/add-event-page';
import { EventDetailsPage } from '../pages/event-details-page/event-details-page';

import { MusiciansPage } from '../pages/musicians-page/musicians-page';
import { AddMusicianPage } from '../pages/add-musician-page/add-musician-page';
import { MusicianDetailsPage } from '../pages/musician-details-page/musician-details-page';

import { BeaconsPage } from '../pages/beacons-page/beacons-page';
import { AddBeaconPage } from '../pages/add-beacon-page/add-beacon-page';
import { BeaconDetailsPage } from '../pages/beacon-details-page/beacon-details-page';

import { MusicStreamsPage } from '../pages/music-streams-page/music-streams-page';
import { AddMusicStreamPage } from '../pages/add-music-stream-page/add-music-stream-page';
import { MusicStreamDetailsPage } from '../pages/music-stream-details-page/music-stream-details-page';

import { UsersPage } from '../pages/users-page/users-page';
import { AddUserPage } from '../pages/add-user-page/add-user-page';
import { UserDetailsPage } from '../pages/user-details-page/user-details-page';

// Services.
import { ConfigService } from '../providers/config-service';
import { EmailService } from '../providers/email-service';
import { UtilityService } from '../providers/utility-service';
import { UserService } from '../providers/user-service';
import { MusicianService } from '../providers/musician-service';
import { EventService } from '../providers/event-service';
import { BeaconService } from '../providers/beacon-service'; 

// Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyAgvU-ZNdAMYJaw_kTK-uyWMIGHwCZtmMM",
  authDomain: "cagedspace-9d75f.firebaseapp.com",
  databaseURL: "https://cagedspace-9d75f.firebaseio.com",
  storageBucket: "cagedspace-9d75f.appspot.com",
  messagingSenderId: "464147072174"
};

// Bootstraping.
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    EventsPage,
    AddEventPage,
    EventDetailsPage,
    MusiciansPage,
    AddMusicianPage,
    MusicianDetailsPage,
    BeaconsPage,
    AddBeaconPage,
    BeaconDetailsPage,
    MusicStreamsPage,
    AddMusicStreamPage,
    MusicStreamDetailsPage,
    UsersPage,
    AddUserPage,
    UserDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    EventsPage,
    AddEventPage,
    EventDetailsPage,
    MusiciansPage,
    AddMusicianPage,
    MusicianDetailsPage,
    BeaconsPage,
    AddBeaconPage,
    BeaconDetailsPage,
    MusicStreamsPage,
    AddMusicStreamPage,
    MusicStreamDetailsPage,
    UsersPage,
    AddUserPage,
    UserDetailsPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConfigService,
    EmailService,
    UtilityService,
    UserService,
    EventService,
    MusicianService,
    BeaconService
  ]
})
export class AppModule { }
