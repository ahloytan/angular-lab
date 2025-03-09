import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BE_ENDPOINT } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServerSentEventsService {

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  sendReminders(data: any): Observable<any> {
    return this._httpClient.post(`${BE_ENDPOINT}/reminders`, data);
  }
}
