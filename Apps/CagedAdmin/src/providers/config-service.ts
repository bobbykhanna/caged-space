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
  get userLoginUrl(): string {
    return this._functionsConfig.userLoginUrl;
  }

  get addMusicianUrl(): string {
    return this._functionsConfig.createMusicianUrl;
  }

  get updateMusicianUrl(): string {
    return this._functionsConfig.updateMusicianUrl;
  }

  get deleteMusicianUrl(): string {
    return this._functionsConfig.deleteMusicianUrl;
  }

  // Events
  get deleteEventUrl(): string {
    return this._functionsConfig.deleteEventUrl;
  }

  get addEventUrl(): string {
    return this._functionsConfig.createEventUrl;
  }

  get updateEventUrl(): string {
    return this._functionsConfig.updateEventUrl;
  }



}