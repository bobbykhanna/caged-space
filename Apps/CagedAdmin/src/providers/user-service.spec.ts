import { UserService } from './user-service';
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
import { UserModel } from "../models/user";
import {} from 'jasmine';

describe('Service: User Service', () => {

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
                UserService,
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

        inject([UserService], (service) => {

            // Make sure we have a valid instance of user service.
            expect(service).toBeDefined();

        })

    );

    // API Tests:
    it('adds user', done => {

        let userService: UserService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.addUserUrl) {

                        let responseModel: UserModel = new UserModel();
                        responseModel.id = 'testId';

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ data: responseModel })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Post);

                        connection.mockRespond(response);

                    } else if (connection.request.url === _config.getNewUserIdUrl) {

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ data: 'testId' })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Get);

                        connection.mockRespond(response);

                    }

                });

            userService = getTestBed().get(UserService);

            // Tests that User Service was instantiated correctly.
            expect(userService).toBeDefined();

            userService.addUser(new UserModel(), false, '').then(user => {

                // Tests that API call's return value is valid.
                expect(user).toBeDefined();

                // Tests that API call's return value is correct.
                expect(user.id).toEqual('testId');

                done();
            });

        });
    });

    it('edits user', done => {

        let userService: UserService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.updateUserUrl) {

                        let responseModel: UserModel = new UserModel();
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

            userService = getTestBed().get(UserService);

            // Tests that User Service was instantiated correctly.
            expect(userService).toBeDefined();

            userService.editUser(new UserModel(), false, '').then(user => {

                // Tests that API call's return value is valid.
                expect(user).toBeDefined();

                // Tests that API call's return value is correct.
                expect(user.id).toEqual('testId');

                done();
            });

        });
    });

    it('deletes user', done => {

        let userService: UserService;

        getTestBed().compileComponents().then(() => {

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {

                    if (connection.request.url === _config.deleteUserUrl + '/testId') {

                        let response: any = new Response(new ResponseOptions(
                            {
                                body: JSON.stringify({ message: 'User Deleted' })

                            }));

                        // Tests that correct HTTP methos is used with a given URL.
                        expect(connection.request.method).toBe(RequestMethod.Delete);

                        connection.mockRespond(response);

                    }

                });

            userService = getTestBed().get(UserService);

            // Tests that User Service was instantiated correctly.
            expect(userService).toBeDefined();

            userService.deleteUser('testId', '').subscribe(message => {

                // Tests that API call's return value is valid.
                expect(message).toBeDefined();

                // Tests that API call's return value is correct.
                expect(message).toEqual('User Deleted');

                done();
            });

        });
    });

});
