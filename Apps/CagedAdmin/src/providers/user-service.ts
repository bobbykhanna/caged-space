import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import { FileService } from '../providers/file-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { UserModel } from '../models/user';
import { AngularFire } from 'angularfire2';

@Injectable()
export class UserService {

  private _users$: BehaviorSubject<Array<UserModel>>;

  // Service consumers can subscribe to this observable to get latest user's data.
  public users$: Observable<Array<UserModel>>;

  // Local users cache.
  private _usersStore: {
    users: Array<UserModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire, private _fileService: FileService) {

    this._usersStore = { users: new Array<UserModel>() };

    this._users$ = new BehaviorSubject(new Array<UserModel>());

    this.users$ = this._users$.asObservable();

    this._getUsers();

  }

  // Add new User
  public addUser(model: UserModel, hasUploadedNewImage: boolean, profileImage: string): Promise<UserModel> {

    let promise = new Promise<UserModel>((resolve, reject) => {

      this._getNewUserId()
        .subscribe(userId => {

          let newUser = model;
          newUser.id = userId;

          if (hasUploadedNewImage) {

            this._uploadUserProfileImage(userId, profileImage).then(imageUrl => {

              newUser.profileImageUrl = imageUrl;

              this._http.post(this._config.addUserUrl, newUser).subscribe(response => {

                resolve(this._mapUser(response));

              }, error => {

                reject(error);

              });

            }).catch(error => {

              reject(error);

            });

          } else {

            newUser.profileImageUrl = '../../assets/thumbnail-totoro.png';

            this._http.post(this._config.addUserUrl, newUser).subscribe(response => {

              resolve(this._mapUser(response));

            }, error => {

              reject(error);

            });

          }

        }, error => {

          reject(error);

        });

    });

    return promise;

  }

  // Modify existing user.
  public editUser(model: UserModel, hasUploadedNewImage: boolean, profileImage: string): Promise<UserModel> {

    let promise = new Promise<UserModel>((resolve, reject) => {

      let updatedUser = model;

      if (hasUploadedNewImage) {

        this._uploadUserProfileImage(updatedUser.id, profileImage).then(imageUrl => {

          updatedUser.profileImageUrl = imageUrl;

          this._http.put(this._config.updateUserUrl, updatedUser).subscribe(response => {

            resolve(this._mapUser(response));

          }, error => {

            reject(error);

          });

        }).catch(error => {

          reject(error);

        });

      } else {

        this._http.put(this._config.updateUserUrl, updatedUser).subscribe(response => {

          resolve(this._mapUser(response));

        }, error => {

          reject(error);

        });

      }

    });

    return promise;

  }

  public deleteUser(userId: string): Observable<string> {

    return this._http.delete(this._config.deleteUserUrl + '/' + userId)
      .map(res => {
        return res.json().message;
      });

  }

  private _getNewUserId(): Observable<string> {

    return this._http.get(this._config.getNewUserIdUrl)
      .map(res => {
        return res.json().data;
      });

  }

  private _uploadUserProfileImage(userId: string, file: string): Promise<any> {

    let promise = new Promise<any>((res, rej) => {

      let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(file);

      this._fileService.uploadFile('users', userId, fileName, file).then(function (imageUrl) {

        res(imageUrl);

      }).catch(function (error) {

        rej(error);

      });

    });

    return promise;

  }

  // Initiates retrieval of CagedSpace users.
  private _getUsers(): void {

    this._af.database.list('users').subscribe(newUsers => {

      this._usersStore = { users: newUsers };

      this._users$.next(this._usersStore.users);

    });

  }

  // Maps raw JSON data to UserModels.
  private _mapUser(response: any) {

    let newUser: UserModel = response.json().data;

    return newUser;

  }

}