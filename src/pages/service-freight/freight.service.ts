import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { Subscription } from '../../../node_modules/rxjs/Subscription';

@Injectable()
export class FreightService {

  constructor(
    private http: HttpClient,
  ) {
    // this.sub$ = this.sub.subscribe(res => {
    //   console.log(res)
    // }, err => {

    // }, () => {

    // })
  }

  getVendors(): Observable<any | { result: Array<any> }>{
    return this.http.get('http://localhost:3000/api/pg/vendor');
  }

  getVendorIntro(v_id, language): Observable<any> {
    return this.http.get(`http://localhost:3000/api/pg/vendor/${v_id}/${language}`);
  }

  // sub: Observable<any> = new Observable(observer => {
  //   observer.next(true)
  //   observer.next(true)
  //   observer.next(true)
  //   observer.next(true)
  //   observer.error(false);

  // });
  // sub$: Subscription;
  // pro: Promise<any>;
}
