import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../providers/config-service';
import { FileService } from '../providers/file-service';
import 'rxjs/add/operator/map';
import { MusicianModel } from '../models/musician';
import { AngularFire } from 'angularfire2';

@Injectable()
export class MusicianService {

  private _musicians$: BehaviorSubject<Array<MusicianModel>>;

  // Service consumers can subscribe to this observable to get latest musicians data.
  public musicians$: Observable<Array<MusicianModel>>;

  // Local musicians cache.
  private _musiciansStore: {
    musicians: Array<MusicianModel>
  };

  constructor(private _http: Http, private _config: ConfigService, private _af: AngularFire, private _fileService: FileService) {

    this._musiciansStore = { musicians: new Array<MusicianModel>() };

    this._musicians$ = new BehaviorSubject(new Array<MusicianModel>());

    this.musicians$ = this._musicians$.asObservable();

    this._getMusicians();

  }

  // Initiates retrieval of CagedSpace musicians.
  private _getMusicians(): void {

    this._af.database.list('musicians').subscribe(newMusicians => {

      this._musiciansStore = { musicians: newMusicians };

      this._musicians$.next(this._musiciansStore.musicians);

    });

  }

  // Maps raw JSON data to MusicianModels.
  private _MapMusician(response: any) {

    let newMusician: MusicianModel = response.json().data;

    return newMusician;

  }

  public addMusician(model: MusicianModel): Observable<MusicianModel> {

    return this._http.post(this._config.addMusicianUrl, model)
      .map(res => {
        return this._MapMusician(res);
      });

  }

  public editMusician(model: MusicianModel): Observable<MusicianModel> {

    return this._http.put(this._config.addMusicianUrl, model)
      .map(res => {
        return this._MapMusician(res);
      });

  }

  public getNewMusicianId(): Observable<string> {

    return this._http.get(this._config.getNewMusicianIdUrl)
      .map(res => {
        return res.json().data;
      });

  }

  public uploadMusicianProfileImage(musicianId: string, file: string): Promise<any> {

    let promise = new Promise<any>((res, rej) => {

      let fileName = 'resource_image' + this._fileService.getFileExtensionFromDataString(file);

      this._fileService.uploadFile('musicians', musicianId, fileName, file).then(function (imageUrl) {

        res(imageUrl);

      }).catch(function (error) {

        rej(error);

      });

    });

    return promise;

  }

}