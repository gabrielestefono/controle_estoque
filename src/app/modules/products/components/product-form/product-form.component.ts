import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/get-categories-response.interface';
import { MessageService } from 'primeng/api';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/create-product-request.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/events/event-action';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';
import { ProductEvent } from 'src/app/models/enums/products/product-event';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/edit-product-request.interface';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit, OnDestroy{
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly productsService: ProductsService,
    private readonly ref: DynamicDialogConfig,
    private readonly productsDataTransferService: ProductsDataTransferService
  ){}

  private destroy$: Subject<void> = new Subject();
  public categoriesData: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{name: string, code: string}> = [];
  public productSelectedData!: GetAllProductsResponse;
  public productsData!: Array<GetAllProductsResponse>;
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;
  public renderDropDown: boolean = false;

  public productAction!: {
    event: EventAction,
    productsData: Array<GetAllProductsResponse>
  };

  public addProductForm = this.formBuilder.group({
    name: ["", Validators.required],
    price: ["", Validators.required],
    description: ["", Validators.required],
    category_id: ["", Validators.required],
    amount: [0, Validators.required],
  });

  public editProductForm = this.formBuilder.group({
    name: ["", Validators.required],
    price: ["", Validators.required],
    description: ["", Validators.required],
    category_id: ["", Validators.required],
    amount: [0, Validators.required],
  });

  ngOnInit(): void {
    this.productAction = this.ref.data;

    this.productAction?.event?.action === this.saleProductAction && this.getProductData();
    this.getAllCategories();
    this.renderDropDown = true;
  }

  getAllCategories(){
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if(response && response.length > 0){
            this.categoriesData = response
            if(this.productAction?.event?.action == this.editProductAction && this.productAction.productsData){
              this.getProductSelectedData(this.productAction?.event?.id as string);
            }
          }
        },
      })
  }

  handleSubmitAddProduct(): void
  {
    if(this.addProductForm?.valid && this.addProductForm?.value){
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: this.addProductForm.value.amount as number,
      }

      this.productsService.createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if(response){
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 2500
              })
            }
          },
          error: error => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500
            })

          }
        });
        this.addProductForm.reset();
    }
  }

  handleSubmitEditProduct(): void
  {
    if(this.editProductForm?.valid && this.editProductForm?.value && this.productAction.event.id){
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        amount: this.editProductForm.value.amount as number,
        description: this.editProductForm.value.description as string,
        price: this.editProductForm.value.price as string,
        product_id: this.productAction.event.id,
        category_id: this.editProductForm.value.category_id as string,
      }

      this.productsService.editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Sucesso!",
              detail: "Produto Editado com Sucesso!",
              life: 2500,
            })
            this.editProductForm.reset();
          },
          error: error => {
            console.log(error);
            this.messageService.add({
              severity: "error",
              summary: "SuErrocesso!",
              detail: "Erro ao editar produto!",
              life: 2500,
            })
          },
        })
    }
  }

  getProductSelectedData(productId: string): void
  {
    const allProducts = this.productAction?.productsData;
    if(allProducts.length > 0){
      const productFiltered = allProducts.filter(element => element?.id === productId);

      if(productFiltered){
        this.productSelectedData = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedData?.name,
          price: this.productSelectedData?.price,
          amount: this.productSelectedData?.amount,
          description: this.productSelectedData?.description,
          category_id: this.productSelectedData?.category?.id,
        })
      }
    }
  }

  getProductData(): void
  {
    this.productsService.getAllProducts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          if(response.length > 0){
            this.productsData = response;
            this.productsData && this.productsDataTransferService.setProductsData(this.productsData);
          }
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
