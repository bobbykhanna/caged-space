import { MusicianService } from './musician-service';
import { ConfigService } from '../providers/config-service';
import { FileService } from '../providers/file-service';
import { AngularFire } from 'angularfire2';
import { AngularFireModule } from 'angularfire2';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, XHRBackend, HttpModule, ResponseOptions, RequestMethod } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { MockBackend, MockConnection } from "@angular/http/testing";

describe('Service: Musician Service', () => {

    // Test Configuration.
    let mockBackend: MockBackend;

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
    it('Should instantiate service correctly',

        inject([MusicianService], (service) => {

            // Make sure we have a valid instance of musician service.
            expect(service).toBeDefined();

        })

    );

    // API Tests:
    it('should delete musician', done => {

        let musicianService: MusicianService;

        let response: any = new Response(new ResponseOptions({
            body: "{message:'Musician Deleted'}"
        }
        ));

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    expect(connection.request.method).toBe(RequestMethod.Delete);

                    connection.mockRespond(response);
                });

            musicianService = getTestBed().get(MusicianService);
            expect(musicianService).toBeDefined();

            musicianService.deleteMusician('', '').subscribe(message => {
                expect(message).toBeDefined();
                done();
            });

        });
    });

});
