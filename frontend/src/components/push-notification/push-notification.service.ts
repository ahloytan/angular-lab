import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BE_ENDPOINT } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  addPushSubscriber(payload: any): Observable<any> {
    return this._httpClient.post(`${BE_ENDPOINT}/push-notification`, payload);
  }

  broadcast(): Observable<any> {
    return this._httpClient.get(`${BE_ENDPOINT}/push-notification/broadcast`);
  }

  deleteSubscriber(payload: any): any {
    return this._httpClient.post(`${BE_ENDPOINT}/push-notification/delete-subscriber`, payload);
  }
}
