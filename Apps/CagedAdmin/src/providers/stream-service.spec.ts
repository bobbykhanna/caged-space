import { StreamService } from './stream-service';
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
import { StreamModel } from "../models/stream";
import {} from 'jasmine';

describe('Service: Stream Service', () => {

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
                StreamService,
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

        inject([StreamService], (service) => {

            // Make sure we have a valid instance of stream service.
            expect(service).toBeDefined();

        })

    );

    // API Tests

    it('deletes stream', done => {

        let streamService: StreamService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.deleteStreamUrl + '/testId') {

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ message: 'Stream Deleted' })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Delete);

                        connection.mockRespond(response);

                    }

                });

            streamService = getTestBed().get(StreamService);

            // Tests that Stream Service was instantiated correctly.
            expect(streamService).toBeDefined();

            streamService.deleteStream('testId', '').subscribe(message => {

                // Tests that API call's return value is valid.
                expect(message).toBeDefined();

                // Tests that API call's return value is correct.
                expect(message).toEqual('Stream Deleted');

                done();
            });

        });
    });

    // add stream
    it('adds stream', done => {

        let streamService: StreamService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.addStreamUrl) {

                        let responseModel: StreamModel = new StreamModel();
                        responseModel.id = 'testId';

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ data: responseModel })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Post);

                        connection.mockRespond(response);

                    } else if (connection.request.url === _config.getNewStreamIdUrl) {

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ data: 'testId' })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Get);

                        connection.mockRespond(response);

                    }

                });

            streamService = getTestBed().get(StreamService);

            // Tests that Stream Service was instantiated correctly.
            expect(streamService).toBeDefined();

            streamService.addStream(new StreamModel(), false, '').then(stream => {

                // Tests that API call's return value is valid.
                expect(stream).toBeDefined();

                // Tests that API call's return value is correct.
                expect(stream.id).toEqual('testId');

                done();
            });

        });
    });

    // edit stream

    it('edits stream', done => {

        let streamService: StreamService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.updateStreamUrl) {

                        let responseModel: StreamModel = new StreamModel();
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

            streamService = getTestBed().get(StreamService);

            // Tests that Stream Service was instantiated correctly.
            expect(streamService).toBeDefined();

            streamService.editStream(new StreamModel(), false, '').then(stream => {

                // Tests that API call's return value is valid.
                expect(stream).toBeDefined();

                // Tests that API call's return value is correct.
                expect(stream.id).toEqual('testId');

                done();
            });

        });
    });

})