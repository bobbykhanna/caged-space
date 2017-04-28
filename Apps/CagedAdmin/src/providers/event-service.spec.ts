import { EventService } from './event-service';
import { ConfigService } from '../providers/config-service';
import { FileService } from '../providers/file-service';
import { AngularFire } from 'angularfire2';
import { AngularFireModule } from 'angularfire2';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, XHRBackend, HttpModule, ResponseOptions, RequestMethod } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Response } from '@angular/http';
import { ReflectiveInjector } from "@angular/core";
import { EventModel } from "../models/event";

describe('Service: Event Service', () => {

    // Test Configuration:
    let mockBackend: MockBackend;

    // Define config service for use in testing suite.
    let injector = ReflectiveInjector.resolveAndCreate([ConfigService]);
    let _config: ConfigService = injector.get(ConfigService);

    // Mock app-level dependencies and Firebase configuration.
    beforeEach(async(() => {

        const firebaseConfig = {
            apiKey: "AIzaSyAgvU-ZNdAMYJaw_kTK-uyWMIGHwCZtmMM",
            authDomain: "cagedspace-9d75f.firebaseapp.com",
            databaseURL: "https://cagedspace-9d75f.firebaseio.com",
            storageBucket: "cagedspace-9d75f.appspot.com",
            messagingSenderId: "464147072174"
        };

        TestBed.configureTestingModule({
            providers: [
                EventService,
                ConfigService,
                FileService,
                MockBackend,
                AngularFire,
                BaseRequestOptions,
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
                HttpModule,
                AngularFireModule.initializeApp(firebaseConfig),
            ]
        });

        mockBackend = getTestBed().get(MockBackend);

    }));

    // Tests:
    it('is created',

        inject([EventService], (service) => {

            // Make sure we have a valid instance of event service.
            expect(service).toBeDefined();

        })

    );

    // API Tests:
    it('adds event', done => {

        let eventService: EventService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.addEventUrl) {

                        let responseModel: EventModel = new EventModel();
                        responseModel.id = 'testId';

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ data: responseModel })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Post);

                        connection.mockRespond(response);

                    } else if (connection.request.url === _config.getNewEventIdUrl) {

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ data: 'testId' })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Get);

                        connection.mockRespond(response);

                    }

                });

            eventService = getTestBed().get(EventService);

            // Tests that Event Service was instantiated correctly.
            expect(eventService).toBeDefined();

            eventService.addEvent(new EventModel(), false, '').then(event => {

                // Tests that API call's return value is valid.
                expect(event).toBeDefined();

                // Tests that API call's return value is correct.
                expect(event.id).toEqual('testId');

                done();
            });

        });
    });

    it('edits event', done => {

        let eventService: EventService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.updateEventUrl) {

                        let responseModel: EventModel = new EventModel();
                        responseModel.id = 'testId';

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ data: responseModel })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Put);

                        connection.mockRespond(response);

                    }

                });

            eventService = getTestBed().get(EventService);

            // Tests that Event Service was instantiated correctly.
            expect(eventService).toBeDefined();

            eventService.editEvent(new EventModel(), false, '').then(event => {

                // Tests that API call's return value is valid.
                expect(event).toBeDefined();

                // Tests that API call's return value is correct.
                expect(event.id).toEqual('testId');

                done();
            });

        });
    });

    it('deletes event', done => {

        let eventService: EventService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.deleteEventUrl + '/testId') {

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ message: 'Event Deleted' })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Delete);

                        connection.mockRespond(response);

                    }

                });

            eventService = getTestBed().get(EventService);

            // Tests that Event Service was instantiated correctly.
            expect(eventService).toBeDefined();

            eventService.deleteEvent('testId', '').subscribe(message => {

                // Tests that API call's return value is valid.
                expect(message).toBeDefined();

                // Tests that API call's return value is correct.
                expect(message).toEqual('Event Deleted');

                done();
            });

        });
    });

});
