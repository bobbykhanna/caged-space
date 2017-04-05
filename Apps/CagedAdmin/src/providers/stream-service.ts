import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import 'rxjs/add/operator/map';
import { StreamModel } from '../models/stream';
import { AddStreamModel } from '../models/addStream';
import { AngularFire } from 'angularfire2';

@Injectable()
export class StreamService {

  private _streams$: BehaviorSubject<Array<StreamModel>>;

  // Service consumers can subscribe to this observable to get latest streams data.
  public streams$: Observable<Array<StreamModel>>;

  // Local streams cache.
  private _streamsStore: {
    streams: Array<StreamModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire) {

    this._streamsStore = { streams: new Array<StreamModel>() };

    this._streams$ = new BehaviorSubject(new Array<StreamModel>());

    this.streams$ = this._streams$.asObservable();

    this._getStreams();

  }

  // Initiates retrieval of CagedSpace streams.
  private _getStreams(): void {

    this._af.database.list('streams').subscribe(newStreams => {

      this._streamsStore = { streams: newStreams };

      this._streams$.next(this._streamsStore.streams);

    });

  }

  // Maps raw JSON data to StreamModels.
  private _MapStream(response: any) {

    let newStream: StreamModel = response.json().data;

    return newStream;

  }

  public addStream(model: AddStreamModel): Observable<StreamModel> {

    return this._http.post(this._config.addStreamUrl, model)
      .map(res => {
        return this._MapStream(res);
      });

  }

  public editStream(model: StreamModel): Observable<StreamModel> {

    return this._http.put(this._config.addStreamUrl, model)
      .map(res => {
        return this._MapStream(res);
      });

  }

}