import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/get-categories-response.interface';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(
    private readonly http: HttpClient,
    private readonly cookie: CookieService
  ) {}

  private API_URL = enviroment.API_URL;
  private JWT_TOKEN = this.cookie.get('jwt_token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    );
  }
}
