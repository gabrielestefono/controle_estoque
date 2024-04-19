import { Injectable } from '@angular/core';
import { BehaviorSubject, take, map } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  public productsDataEmitter$ = new BehaviorSubject<GetAllProductsResponse[] | null>(null);
  public productsData: GetAllProductsResponse[] = [];

  setProductsData(product: GetAllProductsResponse[]): void
  {
    this.productsDataEmitter$.next(product);
    this.getProductsData()
  }

  getProductsData(){
    this.productsDataEmitter$
    .pipe(
      take(1),
      map(product => product?.filter(data => data.amount > 0))
    ).subscribe({
      next: response => {
        if(response){
          this.productsData = response;
        }
      },
      error: error => console.log(error)
    })
    return this.productsData;
  }
}
