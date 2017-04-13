import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import { FileService } from '../providers/file-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { EventModel } from '../models/event';
import { AngularFire } from 'angularfire2';

@Injectable()
export class EventService {

  private _isDataPrimed: boolean = false;

  private _events$: BehaviorSubject<Array<EventModel>>;

  // Service consumers can subscribe to this observable to get latest events data.
  public events$: Observable<Array<EventModel>>;

  // Local events cache.
  private _eventsStore: {
    events: Array<EventModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire, private _fileService: FileService) {

    this._eventsStore = { events: new Array<EventModel>() };

    this._events$ = new BehaviorSubject(new Array<EventModel>());

    this.events$ = this._events$.asObservable();

    this._getEvents();

  }

  // Initiates retrieval of CagedSpace events.
  private _getEvents(): void {

    this._af.database.list('events').subscribe(newEvents => {

      this._eventsStore = { events: newEvents };

      this._events$.next(this._eventsStore.events);

      // Preload images.
      if (!this._isDataPrimed) {

        this._eventsStore.events.forEach(event => {

          if (event.eventImageFileName) {

            this._fileService.getFileAsDataUrl('events', event.id, event.eventImageFileName).then(dataUrl => {

              let index = this._eventsStore.events.indexOf(event, 0);

              if (index > -1) {
                this._eventsStore.events[index].eventImageDataUrl = dataUrl;
              }

              this._events$.next(this._eventsStore.events);

            });

          }

        });

        this._isDataPrimed = true;

      }

    });

  }

  // Maps raw JSON data to EventModels.
  private _mapEvent(response: any) {

    let newEvent: EventModel = response.json().data;

    return newEvent;

  }

  // Add new Event.
  public addEvent(model: EventModel, hasUploadedNewImage: boolean, profileImage: string): Promise<EventModel> {

    let promise = new Promise<EventModel>((resolve, reject) => {

      this._getNewEventId()
        .subscribe(eventId => {

          let newEvent = model;
          newEvent.id = eventId;

          if (hasUploadedNewImage) {

            let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

            this._uploadEventProfileImage(eventId, fileName, profileImage).then(imageUrl => {

              newEvent.eventImageUrl = imageUrl;
              newEvent.eventImageFileName = fileName;

              this._http.post(this._config.addEventUrl, newEvent).subscribe(response => {

                resolve(this._mapEvent(response));

              }, error => {

                reject(error);

              });

            }).catch(error => {

              reject(error);

            });

          } else {

            newEvent.eventImageUrl = '../../assets/thumbnail-totoro.png';

            this._http.post(this._config.addEventUrl, newEvent).subscribe(response => {

              resolve(this._mapEvent(response));

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

  // Modify existing events.
  public editEvent(model: EventModel, hasUploadedNewImage: boolean, profileImage: string): Promise<EventModel> {

    let promise = new Promise<EventModel>((resolve, reject) => {

      let updatedEvent = model;

      if (hasUploadedNewImage) {

        let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(profileImage);

        this._uploadEventProfileImage(updatedEvent.id, fileName, profileImage).then(imageUrl => {

          updatedEvent.eventImageUrl = imageUrl;
          updatedEvent.eventImageFileName = fileName;

          this._http.put(this._config.updateEventUrl, updatedEvent).subscribe(response => {

            resolve(this._mapEvent(response));

          }, error => {

            reject(error);

          });

        }).catch(error => {

          reject(error);

        });

      } else {

        this._http.put(this._config.updateEventUrl, updatedEvent).subscribe(response => {

          resolve(this._mapEvent(response));

        }, error => {

          reject(error);

        });

      }

    });

    return promise;

  }

  public deleteEvent(eventId: string): Observable<string> {

    return this._http.delete(this._config.deleteEventUrl + '/' + eventId)
      .map(res => {
        return res.json().message;
      });
  }

  private _getNewEventId(): Observable<string> {

    return this._http.get(this._config.getNewEventIdUrl)
      .map(res => {
        return res.json().data;
      });

  }

  private _uploadEventProfileImage(eventId: string, fileName: string, file: string): Promise<any> {

    let promise = new Promise<any>((res, rej) => {

      this._fileService.uploadFile('events', eventId, fileName, file).then(function (imageUrl) {

        res(imageUrl);

      }).catch(function (error) {

        rej(error);

      });

    });

    return promise;

  }
}