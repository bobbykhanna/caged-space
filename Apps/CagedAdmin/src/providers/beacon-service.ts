import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import 'rxjs/add/operator/map';
import { BeaconModel } from '../models/beacon';
import { AddBeaconModel } from '../models/addBeacon';
import { AngularFire } from 'angularfire2';

@Injectable()
export class BeaconService {

  private _beacons$: BehaviorSubject<Array<BeaconModel>>;

  // Service consumers can subscribe to this observable to get latest beacons data.
  public beacons$: Observable<Array<BeaconModel>>;

  // Local beacons cache.
  private _beaconsStore: {
    beacons: Array<BeaconModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire) {

    this._beaconsStore = { beacons: new Array<BeaconModel>() };

    this._beacons$ = new BehaviorSubject(new Array<BeaconModel>());

    this.beacons$ = this._beacons$.asObservable();

    this._getBeacons();

  }

  // Initiates retrieval of CagedSpace beacons.
  private _getBeacons(): void {

    this._af.database.list('beacons').subscribe(newBeacons => {

      this._beaconsStore = { beacons: newBeacons };

      this._beacons$.next(this._beaconsStore.beacons);

    });

  }

  // Maps raw JSON data to BeaconModels.
  private _MapBeacon(response: any) {

    let newBeacon: BeaconModel = response.json().data;

    return newBeacon;

  }

  public addBeacon(model: AddBeaconModel): Observable<BeaconModel> {

    return this._http.post(this._config.addBeaconUrl, model)
      .map(res => {
        return this._MapBeacon(res);
      });

  }

  public editBeacon(model: BeaconModel): Observable<BeaconModel> {

    return this._http.put(this._config.addBeaconUrl, model)
      .map(res => {
        return this._MapBeacon(res);
      });

  }

}