import { MessageService } from 'primeng/api';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
})
export class ProductsHomeComponent implements OnDestroy, OnInit {

    constructor(
      private readonly productsService: ProductsService,
      private readonly productsDataTransferService: ProductsDataTransferService,
      private readonly router: Router,
      private readonly message: MessageService,
    ){}

    private readonly destroy$: Subject<void> = new Subject();
    private productSubject = new Subject();
    public productsData: GetAllProductsResponse[] = [];


    ngOnInit(): void {
      this.getServiceProductsData()
    }

    getServiceProductsData(){
      const productsLoaded = this.productsDataTransferService.getProductsData();
      if(productsLoaded.length > 0){
        this.productsData = productsLoaded;
      }else{
        this.getAPIProductsData()
      }
    }

    getAPIProductsData(){
      this.productsService.getAllProducts()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: response => {
          this.productsData = response;
        },
        error: error => {
          console.log(error);
          this.message.add({
            severity: 'error',
            summary: "Erro!",
            detail: "Erro ao buscar produtos",
            life: 2500
          })
          this.router.navigate(['/dashboard']);
        }
      })
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
