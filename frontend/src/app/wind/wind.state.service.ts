import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WindStateService {
  private windPathSubject = new Subject<any>();

  constructor() {}

  triggerWindPathStatus(data: any) {
    this.windPathSubject.next(data);
  }

  handleWindPathStatus(): Observable<any> {
    return this.windPathSubject.asObservable();
  }

}

