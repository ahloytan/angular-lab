import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BE_ENDPOINT } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsTableService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  addNews(payload: any): Observable<any> {
    return this._httpClient.post(`${BE_ENDPOINT}/news`, payload);
  }

  getNews(): Observable<any> {
    return this._httpClient.get(`${BE_ENDPOINT}/news`);
  }

  getNewsCached(): Observable<any> {
    return this._httpClient.get(`${BE_ENDPOINT}/news/news-cached`);
  }
}
