import { Injectable } from '@angular/core';
import { ConfigModel } from '../models/config';
import { FunctionsConfigModel } from '../models/functionsConfig';

@Injectable()
export class ConfigService {

  private _config: ConfigModel;
  private _functionsConfig: FunctionsConfigModel;

  constructor() {

    this._config = new ConfigModel();
    this._functionsConfig = new FunctionsConfigModel();

  }

  // MailGun API properties.
  set mailGunAPIKey(value: string) {
    this._config.mailGunAPIKey = value;
  }

  get mailGunAPIKey(): string {
    return this._config.mailGunAPIKey;
  }

  set mailGunDomain(value: string) {
    this._config.mailGunDomain = value;
  }

  get mailGunDomain(): string {
    return this._config.mailGunDomain;
  }

  set mailGunURL(value: string) {
    this._config.mailGunURL = value;
  }

  get mailGunURL(): string {
    return this._config.mailGunURL;
  }

  // Lambda Functions URLs
  // Users
  get userLoginUrl(): string {
    return this._functionsConfig.userLoginUrl;
  }

  get addUserUrl(): string {
    return this._functionsConfig.createUserUrl;
  }

  get updateUserUrl(): string {
    return this._functionsConfig.updateUserUrl;
  }

  get deleteUserUrl(): string {
    return this._functionsConfig.deleteUserUrl;
  }
  get getNewUserIdUrl(): string {
    return this._functionsConfig.getNewUserIdUrl;
  }

  // Musicans
  get addMusicianUrl(): string {
    return this._functionsConfig.createMusicianUrl;
  }

  get updateMusicianUrl(): string {
    return this._functionsConfig.updateMusicianUrl;
  }

  get deleteMusicianUrl(): string {
    return this._functionsConfig.deleteMusicianUrl;
  }

  get getNewMusicianIdUrl(): string {
    return this._functionsConfig.getNewMusicianIdUrl;
  }

  // Events

    get getNewEventIdUrl(): string {
    return this._functionsConfig.getNewEventIdUrl;
  }

  get deleteEventUrl(): string {
    return this._functionsConfig.deleteEventUrl;
  }

  get addEventUrl(): string {
    return this._functionsConfig.createEventUrl;
  }

  get updateEventUrl(): string {
    return this._functionsConfig.updateEventUrl;
  }

  // Beacons
  get deleteBeaconUrl(): string {
    return this._functionsConfig.deleteBeaconUrl;
  }

  get addBeaconUrl(): string {
    return this._functionsConfig.createBeaconUrl;
  }

  get updateBeaconUrl(): string {
    return this._functionsConfig.updateBeaconUrl;
  }

  // Streams
  get deleteStreamUrl(): string {
    return this._functionsConfig.deleteStreamUrl;
  }

  get addStreamUrl(): string {
    return this._functionsConfig.createStreamUrl;
  }

  get updateStreamUrl(): string {
    return this._functionsConfig.updateStreamUrl;
  }

}