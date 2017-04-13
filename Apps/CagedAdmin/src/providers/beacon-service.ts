import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import { FileService } from '../providers/file-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BeaconModel } from '../models/beacon';
import { AngularFire } from 'angularfire2';

@Injectable()
export class BeaconService {

  private _isDataPrimed: boolean = false;

  private _beacons$: BehaviorSubject<Array<BeaconModel>>;

  // Service consumers can subscribe to this observable to get latest beacons data.
  public beacons$: Observable<Array<BeaconModel>>;

  // Local beacon cache.
  private _beaconsStore: {
    beacons: Array<BeaconModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire, private _fileService: FileService) {

    this._beaconsStore = { beacons: new Array<BeaconModel>() };

    this._beacons$ = new BehaviorSubject(new Array<BeaconModel>());

    this.beacons$ = this._beacons$.asObservable();

    this._getBeacons();

  }

  // Add new Beacon.
  public addBeacon(model: BeaconModel, hasUploadedNewImage: boolean, profileImage: string): Promise<BeaconModel> {

    let promise = new Promise<BeaconModel>((resolve, reject) => {

      this._getNewBeaconId()
        .subscribe(beaconId => {

          let newBeacon = model;
          newBeacon.id = beaconId;

          if (hasUploadedNewImage) {

            let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

            this._uploadBeaconProfileImage(beaconId, fileName, profileImage).then(imageUrl => {

              newBeacon.beaconImageUrl = imageUrl;
              newBeacon.beaconImageFileName = fileName;

              this._http.post(this._config.addBeaconUrl, newBeacon).subscribe(response => {

                resolve(this._mapBeacon(response));

              }, error => {

                reject(error);

              });

            }).catch(error => {

              reject(error);

            });

          } else {

            newBeacon.beaconImageUrl = '../../assets/default_image.png';

            this._http.post(this._config.addBeaconUrl, newBeacon).subscribe(response => {

              resolve(this._mapBeacon(response));

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

  // Modify existing beacon.
  public editBeacon(model: BeaconModel, hasUploadedNewImage: boolean, profileImage: string): Promise<BeaconModel> {

    let promise = new Promise<BeaconModel>((resolve, reject) => {

      let updatedBeacon = model;

      if (hasUploadedNewImage) {

        let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

        this._uploadBeaconProfileImage(updatedBeacon.id, fileName, profileImage).then(imageUrl => {

          updatedBeacon.beaconImageUrl = imageUrl;
          updatedBeacon.beaconImageFileName = fileName;

          this._http.put(this._config.updateBeaconUrl, updatedBeacon).subscribe(response => {

            resolve(this._mapBeacon(response));

          }, error => {

            reject(error);

          });

        }).catch(error => {

          reject(error);

        });

      } else {

        this._http.put(this._config.updateBeaconUrl, updatedBeacon).subscribe(response => {

          resolve(this._mapBeacon(response));

        }, error => {

          reject(error);

        });

      }

    });

    return promise;

  }

  public deleteBeacon(beaconId: string, imageFileName: string): Observable<string> {

    return this._http.delete(this._config.deleteBeaconUrl + '/' + beaconId)
      .map(res => {

        this._fileService.deleteResourceFile('beacons', beaconId, imageFileName);
        return res.json().message;

      });

  }

  private _getNewBeaconId(): Observable<string> {

    return this._http.get(this._config.getNewBeaconIdUrl)
      .map(res => {
        return res.json().data;
      });

  }

  private _uploadBeaconProfileImage(beaconId: string, fileName: string, file: string): Promise<any> {

    let promise = new Promise<any>((res, rej) => {

      this._fileService.uploadFile('beacons', beaconId, fileName, file).then(function (imageUrl) {

        res(imageUrl);

      }).catch(function (error) {

        rej(error);

      });

    });

    return promise;

  }

  // Initiates retrieval of CagedSpace beacons.
  private _getBeacons(): void {

    this._af.database.list('beacons').subscribe(newBeacons => {

      this._beaconsStore = { beacons: newBeacons };

      this._beacons$.next(this._beaconsStore.beacons);

      // Preload images.
      if (!this._isDataPrimed) {

        this._beaconsStore.beacons.forEach(beacon => {

          if (beacon.beaconImageFileName) {

            this._fileService.getFileAsDataUrl('beacons', beacon.id, beacon.beaconImageFileName).then(dataUrl => {

              let index = this._beaconsStore.beacons.indexOf(beacon, 0);

              if (index > -1) {
                this._beaconsStore.beacons[index].beaconImageDataUrl = dataUrl;
              }

              this._beacons$.next(this._beaconsStore.beacons);

            });

          }

        });

        this._isDataPrimed = true;

      }

    });

  }

  // Maps raw JSON data to BeaconModels.
  private _mapBeacon(response: any) {

    let newBeacon: BeaconModel = response.json().data;

    return newBeacon;

  }

}