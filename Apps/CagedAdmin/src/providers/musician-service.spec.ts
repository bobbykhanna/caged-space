import { MusicianService } from './musician-service';
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

describe('Service: Musician Service', () => {

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
                MusicianService,
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

        inject([MusicianService], (service) => {

            // Make sure we have a valid instance of musician service.
            expect(service).toBeDefined();

        })

    );

    // API Tests:
    it('deletes musician', done => {

        let musicianService: MusicianService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.deleteMusicianUrl + '/testId') {

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ message: 'Musician Deleted' })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Delete);

                        connection.mockRespond(response);

                    }

                });

            musicianService = getTestBed().get(MusicianService);

            // Tests that Musician Service was instantiated correctly.
            expect(musicianService).toBeDefined();

            musicianService.deleteMusician('testId', '').subscribe(message => {

                // Tests that API call's return value is valid.
                expect(message).toBeDefined();

                // Tests that API call's return value is correct.
                expect(message).toEqual('Musician Deleted');

                done();
            });

        });
    });

});
