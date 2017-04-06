import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import _ from 'lodash';

@Injectable()
export class FileService {


  constructor( @Inject(FirebaseApp) private firebaseApp: any) {}

  public uploadFile(resourceCategory: string, resourceId: string, fileName: string, file: string): Promise<any> {

    let promise = new Promise<any>((res, rej) => {

      let ref = this.firebaseApp.storage().ref(`/${resourceCategory}/${resourceId}/${fileName}`);

      ref.putString(file, 'data_url').then(function (snapshot) {

        res(snapshot.downloadURL);

      }).catch(function (error) {

        rej(error);

      });

    });

    return promise;

  }

  public getFileExtensionFromDataString(file: string): string {

    if (_.includes(file, 'data:image/png')) { return '.png'; }
    if (_.includes(file, 'data:image/jpeg')) { return '.jpeg'; }
    if (_.includes(file, 'data:image/gif')) { return '.gif'; }
    if (_.includes(file, 'data:image/bmp')) { return '.bmp'; }

    // Default value.
    return '.png';

  }

}