import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login-page/login-page';
import { ConfigService } from '../providers/config-service';
import { EmailService } from '../providers/email-service';
import { UtilityService } from '../providers/utility-service';
import { UserService } from '../providers/user-service';
import { MusicianService } from '../providers/musician-service';
import { StreamService } from '../providers/stream-service'
import { EventService } from '../providers/event-service';
import { BeaconService } from '../providers/beacon-service';
import { FileService } from '../providers/file-service';
import { AngularFireModule } from 'angularfire2';

let comp: MyApp;
let fixture: ComponentFixture<MyApp>;

export const firebaseConfig = {
    apiKey: "AIzaSyAgvU-ZNdAMYJaw_kTK-uyWMIGHwCZtmMM",
    authDomain: "cagedspace-9d75f.firebaseapp.com",
    databaseURL: "https://cagedspace-9d75f.firebaseio.com",
    storageBucket: "cagedspace-9d75f.appspot.com",
    messagingSenderId: "464147072174"
};

describe('Component: Root Component', () => {

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            declarations: [MyApp],

            providers: [
                ConfigService,
                EmailService,
                UtilityService,
                UserService,
                EventService,
                MusicianService,
                StreamService,
                BeaconService,
                FileService
            ],

            imports: [
                IonicModule.forRoot(MyApp),
                AngularFireModule.initializeApp(firebaseConfig)
            ]

        }).compileComponents();

    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(MyApp);
        comp = fixture.componentInstance;

    });

    afterEach(() => {
        fixture.destroy();
        comp = null;
    });

    it('is created', () => {

        expect(fixture).toBeTruthy();
        expect(comp).toBeTruthy();

    });

    it('initialises with a root page of LoginPage', () => {
        expect(comp['rootPage']).toBe(LoginPage);
    });

});