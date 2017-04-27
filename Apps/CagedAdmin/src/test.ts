import './polyfills.ts';

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { ConfigService } from './providers/config-service';
import { EmailService } from './providers/email-service';
import { UtilityService } from './providers/utility-service';
import { UserService } from './providers/user-service';
import { MusicianService } from './providers/musician-service';
import { StreamService } from './providers/stream-service'
import { EventService } from './providers/event-service';
import { BeaconService } from './providers/beacon-service';
import { FileService } from './providers/file-service';

import { AngularFire } from 'angularfire2';
import { AngularFireModule } from 'angularfire2';

import { MockBackend, MockConnection } from "@angular/http/testing";
import { BaseRequestOptions, Http, XHRBackend, HttpModule, ResponseOptions, RequestMethod } from "@angular/http";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { App, Config, Form, IonicModule, DomController, MenuController, NavController, Platform, LoadingController } from 'ionic-angular';
import { ConfigMock, PlatformMock } from './mocks';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function (): void {
    // noop
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
);

// Then we find all the tests.
let context: any = require.context('./', true, /\.spec\.ts/);

// And load the modules.
context.keys().map(context);

// Finally, start Karma to run the tests.
__karma__.start();

export class TestUtils {

    public static beforeEachCompiler(components: Array<any>): Promise<{ fixture: any, instance: any }> {
        return TestUtils.configureIonicTestingModule(components)
            .compileComponents().then(() => {
                let fixture: any = TestBed.createComponent(components[0]);
                return {
                    fixture: fixture,
                    instance: fixture.debugElement.componentInstance,
                };
            });
    }

    public static configureIonicTestingModule(components: Array<any>): typeof TestBed {

        const firebaseConfig = {
            apiKey: "AIzaSyAgvU-ZNdAMYJaw_kTK-uyWMIGHwCZtmMM",
            authDomain: "cagedspace-9d75f.firebaseapp.com",
            databaseURL: "https://cagedspace-9d75f.firebaseio.com",
            storageBucket: "cagedspace-9d75f.appspot.com",
            messagingSenderId: "464147072174"
        };

        return TestBed.configureTestingModule({
            declarations: [
                ...components,
            ],
            providers: [
                App,
                Form,
                DomController,
                MenuController,
                LoadingController,
                NavController,
                ConfigService,
                EmailService,
                UtilityService,
                UserService,
                EventService,
                MusicianService,
                StreamService,
                BeaconService,
                FileService,
                AngularFire,
                MockBackend,
                BaseRequestOptions,
                { provide: Platform, useClass: PlatformMock },
                { provide: Config, useClass: ConfigMock },
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                    (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ],
            imports: [
                FormsModule,
                IonicModule,
                ReactiveFormsModule,
                HttpModule,
                AngularFireModule.initializeApp(firebaseConfig),
            ],
        });
    }

    // http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
    public static eventFire(el: any, etype: string): void {
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            let evObj: any = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }
}