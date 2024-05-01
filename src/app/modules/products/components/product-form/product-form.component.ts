import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/get-categories-response.interface';
import { MessageService } from 'primeng/api';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/create-product-request.interface';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit, OnDestroy{
  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private productsService: ProductsService,
  ){}
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesData: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{name: string, code: string}> = [];

  public addProductForm = this.formBuilder.group({
    name: ["", Validators.required],
    price: ["", Validators.required],
    description: ["", Validators.required],
    category_id: ["", Validators.required],
    amount: [0, Validators.required],
  });

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if(response && response.length > 0){
            this.categoriesData = response
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
