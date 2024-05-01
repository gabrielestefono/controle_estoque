import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/get-categories-response.interface';
import { MessageService } from 'primeng/api';

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
        error: error => {
          // TODO: FAZER
        }
      })
  }

  handleSubmitAddProduct(): void
  {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
