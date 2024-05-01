import { CreateProductRequest } from './../../models/interfaces/products/request/create-product-request.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/create-product-response.interface';
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/delete-product-response.interface';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  /**
   * Constructor
   */
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private API_URL = enviroment.API_URL;
  private JWT_TOKEN = this.cookieService.get('jwt_token');
  private httpOption = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  getAllProducts(): Observable<GetAllProductsResponse[]> {
    return this.http
      .get<GetAllProductsResponse[]>(
        `${this.API_URL}/products`,
        this.httpOption
      )
      .pipe(map((product) => product.filter((product) => product.amount > 0)));
  }

  deleteProduct(product_id: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOption,
        params: {
          product_id,
        },
      }
    );
  }

  createProduct(
    createProductRequest: CreateProductRequest
  ): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/product`,
      createProductRequest,
      this.httpOption
    );
  }
}
