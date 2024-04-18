import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';

import { AuthRequest } from 'src/app/models/interfaces/user/auth/auth-request.interface';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/auth-response.interface';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/sign-up-user-request.interface';
import { SignUpUserResponse } from 'src/app/models/interfaces/user/sign-up-user-response.interface';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ){}

  private api_url = enviroment.API_URL;

  signUpUser(requestData: SignUpUserRequest): Observable<SignUpUserResponse>
  {
    return this.http.post<SignUpUserResponse>(`${this.api_url}/user`, requestData);
  }

  authUser(requestData: AuthRequest): Observable<AuthResponse>
  {
    return this.http.post<AuthResponse>(`${this.api_url}/auth`, requestData);
  }

  isLoggedIn(): boolean
  {
    // Verifica se o usuário tem um cookie
    const JWT_TOKEN = this.cookieService.get('jwt_token');
    if(JWT_TOKEN){
      return true;
    }
    return false;
  }
}
