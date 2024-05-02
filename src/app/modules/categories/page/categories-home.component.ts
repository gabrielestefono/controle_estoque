import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/get-categories-response.interface';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
})
export class CategoriesHomeComponent implements OnInit, OnDestroy{
  constructor(
    private readonly CategoriesService :CategoriesService,
    private readonly dialogService:DialogService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly router: Router,
  ){}

  private destroy$: Subject<void> = new Subject();
  public categoriesData: Array<GetCategoriesResponse> = [];

  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories(): void
  {
    this.CategoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if(response.length > 0){
            this.categoriesData = response;
          }
        },
        error: error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: "Erro!",
            detail: "Erro ao buscar as categorias",
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
