import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeleteService {

  constructor(private http: HttpClient) {}

  deleteAccount(token): Observable<object> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token)

    const httpOptions = {
      headers: headers
    };

    return this.http
      .delete('http://127.0.0.1:3000/user/deleteAccount', httpOptions);
  }

}