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

  private _isDataPrimed: boolean = false;

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

            let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

            this._uploadUserProfileImage(userId, fileName, profileImage).then(imageUrl => {

              newUser.userImageUrl = imageUrl;
              newUser.userImageFileName = fileName;

              this._http.post(this._config.addUserUrl, newUser).subscribe(response => {

                resolve(this._mapUser(response));

              }, error => {

                reject(error);

              });

            }).catch(error => {

              reject(error);

            });

          } else {

            newUser.userImageUrl = '../../assets/thumbnail-totoro.png';

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

        let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

        this._uploadUserProfileImage(updatedUser.id, fileName, profileImage).then(imageUrl => {

          updatedUser.userImageUrl = imageUrl;
          updatedUser.userImageFileName = fileName;

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

  private _uploadUserProfileImage(userId: string, fileName: string, file: string): Promise<any> {

    let promise = new Promise<any>((res, rej) => {

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

      // Preload images.
      if (!this._isDataPrimed) {

        this._usersStore.users.forEach(user => {

          if (user.userImageFileName) {

            this._fileService.getFileAsDataUrl('users', user.id, user.userImageFileName).then(dataUrl => {

              let index = this._usersStore.users.indexOf(user, 0);

              if (index > -1) {
                this._usersStore.users[index].userImageDataUrl = dataUrl;
              }

              this._users$.next(this._usersStore.users);

            });

          }

        });

        this._isDataPrimed = true;

      }

    });

  }

  // Maps raw JSON data to UserModels.
  private _mapUser(response: any) {

    let newUser: UserModel = response.json().data;

    return newUser;

  }

}