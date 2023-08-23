import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Environment } from './environment';
import { LoginRequest } from './login/login-request.model';
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  env = new Environment();
  view: any;

  registeredData(data: any) {
    return this.http.post(this.env.getUrl() + '/users/addUser', data, {
      responseType: 'text'
    }).pipe(
      map((res: any) => res),
      catchError(this.handleError)
    );
  }

  login(username: any, password: any) {
    const body = new LoginRequest(username, password);
    return this.http
      .post(
        `${this.env.getUrl()}/users/login`,
        body,
        {
          responseType: 'text'
        }
      )
      .pipe(
        map((res: any) => res),
        catchError(this.handleError)
      );
  }

  getRegisterData() {
    return this.http
      .get(
        this.env.getUrl() + '/users/allUsers',
        {}
      ).pipe(map(((response: any) => response)), catchError(this.handleError));
  }

  deleteUser(userId: number) {
    return this.http
      .delete(
        `${this.env.getUrl()}/users/delete/${userId}`
      )
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }

  getUserDetails(id: number) {
    return this.http
      .get(
        `${this.env.getUrl()}/users/user/${id}`
      )
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }

  updatedUserData(data: any) {
    return this.http.post(this.env.getUrl() + '/users/updateUser', data, {
      responseType: 'text'
    }).pipe(
      map((res: any) => res),
      catchError(this.handleError)
    );
  }

  viewData(data: any): void {
    this.view.push(data);
  }

  getViewData() {
    return this.view;
  }

  handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    if (error instanceof HttpErrorResponse) {
      const body: any = error || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message
        ? error.message
        : error.status
          ? '${error.status} - ${error.statusText}'
          : 'Server error';
    }
    console.error(errMsg);
    return throwError(() => errMsg);

  }
  constructor(private http: HttpClient) { }
}
