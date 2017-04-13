import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import 'rxjs/add/operator/map';
import { StreamModel } from '../models/stream';
import { AddStreamModel } from '../models/addStream';
import { AngularFire } from 'angularfire2';
import { FileService } from '../providers/file-service';

@Injectable()
export class StreamService {

  private _isDataPrimed: boolean = false;

  private _streams$: BehaviorSubject<Array<StreamModel>>;

  // Service consumers can subscribe to this observable to get latest streams data.
  public streams$: Observable<Array<StreamModel>>;

  // Local streams cache.
  private _streamsStore: {
    streams: Array<StreamModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire, private _fileService: FileService) {

    this._streamsStore = { streams: new Array<StreamModel>() };

    this._streams$ = new BehaviorSubject(new Array<StreamModel>());

    this.streams$ = this._streams$.asObservable();

    this._getStreams();

  }

  // Add new Stream.
  public addStream(model: StreamModel, hasUploadedNewImage: boolean, profileImage: string): Promise<StreamModel> {

    let promise = new Promise<StreamModel>((resolve, reject) => {

      this._getNewStreamId()
        .subscribe(streamId => {

          let newStream = model;
          newStream.id = streamId;

          if (hasUploadedNewImage) {

            let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

            this._uploadStreamImage(streamId, fileName, profileImage).then(imageUrl => {

              newStream.streamImageUrl = imageUrl;
              newStream.streamImageFileName = fileName;

              this._http.post(this._config.addStreamUrl, newStream).subscribe(response => {

                resolve(this._mapStream(response));

              }, error => {

                reject(error);

              });

            }).catch(error => {

              reject(error);

            });

          } else {

            newStream.streamImageUrl = '../../assets/thumbnail-totoro.png';

            this._http.post(this._config.addStreamUrl, newStream).subscribe(response => {

              resolve(this._mapStream(response));

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

  // Initiates retrieval of CagedSpace streams.
  private _getStreams(): void {

    this._af.database.list('streams').subscribe(newStreams => {

      this._streamsStore = { streams: newStreams };

      this._streams$.next(this._streamsStore.streams);

      // Preload images.
      if (!this._isDataPrimed) {

        this._streamsStore.streams.forEach(stream => {

          if (stream.streamImageFileName) {

            this._fileService.getFileAsDataUrl('streams', stream.id, stream.streamImageFileName).then(dataUrl => {

              let index = this._streamsStore.streams.indexOf(stream, 0);

              if (index > -1) {
                this._streamsStore.streams[index].streamImageDataUrl = dataUrl;
              }

              this._streams$.next(this._streamsStore.streams);

            });

          }

        });

        this._isDataPrimed = true;

      }

    });

  }

  // Modify existing stream.
  public editStream(model: StreamModel, hasUploadedNewImage: boolean, profileImage: string): Promise<StreamModel> {

    let promise = new Promise<StreamModel>((resolve, reject) => {

      let updatedStream = model;

      if (hasUploadedNewImage) {

        let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

        this._uploadStreamImage(updatedStream.id, fileName, profileImage).then(imageUrl => {

          updatedStream.streamImageUrl = imageUrl;
          updatedStream.streamImageFileName = fileName;

          this._http.put(this._config.updateStreamUrl, updatedStream).subscribe(response => {

            resolve(this._mapStream(response));

          }, error => {

            reject(error);

          });

        }).catch(error => {

          reject(error);

        });

      } else {

        this._http.put(this._config.updateStreamUrl, updatedStream).subscribe(response => {

          resolve(this._mapStream(response));

        }, error => {

          reject(error);

        });

      }

    });

    return promise;

  }

  private _uploadStreamImage(streamId: string, fileName: string, file: string): Promise<any> {

    let promise = new Promise<any>((res, rej) => {

      this._fileService.uploadFile('streams', streamId, fileName, file).then(function (imageUrl) {

        res(imageUrl);

      }).catch(function (error) {

        rej(error);

      });

    });

    return promise;

  }

  // Delete Functionality
  public deleteStream(streamId: string): Observable<string> {

    return this._http.delete(this._config.deleteStreamUrl + '/' + streamId)
      .map(res => {
        return res.json().message;
      });

  }

  // Get New Stream ID 
  private _getNewStreamId(): Observable<string> {

    return this._http.get(this._config.getNewStreamIdUrl)
      .map(res => {
        return res.json().data;
      });

  }

  // Maps raw JSON data to StreamModels.
  private _mapStream(response: any) {

    let newMusician: StreamModel = response.json().data;

    return newMusician;

  }

}