import { Injectable } from '@angular/core';
//
import { Cambio } from './cambio';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endpoint: string = 'http://localhost:55581/api';

  constructor(private http: HttpClient) {
  }

  convertir(data: Cambio): Observable<any> {
    let API_URL = `${this.endpoint}/divisa`;
    return this.http.post(API_URL, data).pipe(
      map((res: Response) => {
        return res;
      }),
      catchError(this.errorMgmt)
    )
  }

  private errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
      console.error('client-side error ', error.error.message);
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error('server-side error ', error);
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
