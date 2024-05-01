import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';
import { EventAction } from 'src/app/models/interfaces/products/events/event-action';
import { DeleteProductAction } from 'src/app/models/interfaces/products/events/delete-product-action';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

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
      private readonly confirmationService: ConfirmationService,
      private readonly dialogService:DialogService,
    ){}

    private readonly destroy$: Subject<void> = new Subject();
    private productSubject = new Subject();
    public productsData: GetAllProductsResponse[] = [];
    private ref!: DynamicDialogRef;


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

    // Output

    handleProductAction(event: EventAction): void
    {
      if(event){
        this.ref = this.dialogService.open(ProductFormComponent, {
          header: event.action,
          width: '50%',
          contentStyle: { overflow: 'auto'},
          baseZIndex: 10000,
          maximizable: true,
          data: {
            event: event,
            productsData: this.productsData
          }
        });
        this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProductsData(),
        })
      }
    }

    handleDeleteProductAction(event: DeleteProductAction): void
    {
      if(event){
        this.confirmationService.confirm({
          message: `Confirma a exclusão do produto ${event.product_name}?`,
          header: "Confirmação de exclusão",
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: "Sim",
          rejectLabel: "Não",
          accept: () => this.deleteProduct(event.product_id)
        })
      }
    }

    deleteProduct(id: string){
      this.productsService.deleteProduct(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          if(response){
            this.message.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: "Produto removido com sucesso!",
              life: 2500,
            });
          }
          this.getAPIProductsData();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.message.add({
            severity: 'error',
            summary: "Erro",
            detail: "Erro ao deletar produto!",
            life: 2500,
          })
        }
      })
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
