import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import 'rxjs/add/operator/map';
import { UserModel } from '../models/user';
import { AddUserModel } from '../models/addUser';
import { AngularFire } from 'angularfire2';

@Injectable()
export class UserService {

  private _user: UserModel;
  private _user$: BehaviorSubject<UserModel>;
  // Service consumers can subscribe to this observable to get latest app user data.
  public user$: Observable<UserModel>;

  private _users$: BehaviorSubject<Array<UserModel>>;

  // Service consumers can subscribe to this observable to get latest users data.
  public users$: Observable<Array<UserModel>>;

  // Local users cache.
  private _usersStore: {
    users: Array<UserModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire) {

    this._user = new UserModel();
    this._user$ = new BehaviorSubject(new UserModel);
    this.user$ = this._user$.asObservable();

    this._usersStore = { users: new Array<UserModel>() };

    this._users$ = new BehaviorSubject(new Array<UserModel>());

    this.users$ = this._users$.asObservable();

    this._getUsers();

  }

  // Primary Login function.
  public Login(username: string, password: string): Observable<UserModel> {

    var credentials: any = { UserName: username, Password: password };

    return this._http.post(this._config.userLoginUrl, credentials)
      .map(res => {
        return this._ParseUserFromJSON(res);
      });

  }

  // Retrieve currently-authenticated user.
  public GetCurrentUser() { return this._user; }

  // Convert JSON to Typed UserModel.
  private _ParseUserFromJSON(res: Response) {

    let user = res.json();

    // New instance of UserModel.
    this._user = new UserModel();

    // Set Properties.
    this._user.id = user.id;
    this._user.name = user.name;
    this._user.email = user.email;
    this._user.isLoggedIn = user.isLoggedIn;

    // Propogate user model to all subscribers.
    this._user$.next(this._user);

    // Return UserModel object.
    return this._user;

  }

  // Initiates retrieval of CagedSpace users.
  private _getUsers(): void {

    this._af.database.list('users').subscribe(newUsers => {

      this._usersStore = { users: newUsers };

      this._users$.next(this._usersStore.users);

    });

  }

  // Maps raw JSON data to UserModels.
  private _MapUser(response: any) {

    let newUser: UserModel = response.json().data;

    return newUser;

  }

  public addUser(model: AddUserModel): Observable<UserModel> {

    return this._http.post(this._config.addUserUrl, model)
      .map(res => {
        return this._MapUser(res);
      });

  }

  public editUser(model: UserModel): Observable<UserModel> {

    return this._http.put(this._config.addUserUrl, model)
      .map(res => {
        return this._MapUser(res);
      });

  }

}