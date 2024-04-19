import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html'
})
export class DashboardHomeComponent implements OnInit{
  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService: ProductsDataTransferService
  ){}

  public productsList: GetAllProductsResponse[] = [];

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(){
    this.productsService.getAllProducts().subscribe({
      next: response => {
        if(response.length > 0){
          this.productsList = response;
          this.productsDataTransferService.setProductsData(this.productsList);
        }
      },
      error: error => {
        this.messageService.add(
          {
            severity: 'error',
            summary: "Erro!",
            detail: "Erro ao buscar produtos!",
            life: 2500,
          }
        );
        console.log(error)
      }
    })
  }
}
