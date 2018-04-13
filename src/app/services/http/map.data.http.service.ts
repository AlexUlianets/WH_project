import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DevelopUtil } from '../../utils/develop.utils';

@Injectable()
export class MapDataHttpService {

  public static MAP_DATA_URL = DevelopUtil.url('api/weather');

  private headers: Headers;
  private requestOptions: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.requestOptions = new RequestOptions({headers: this.headers});
  }

  get(date, type): Observable<Response> {
    return this.http.get(MapDataHttpService.MAP_DATA_URL + '?date=' + date + '&type=' + type);
  }

}
