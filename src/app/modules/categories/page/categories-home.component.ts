import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/get-categories-response.interface';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/delete-category-action.interface';

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

  handleDeleteCategoryAction(event: DeleteCategoryAction): void
  {
    if(event){
      this.confirmationService.confirm({
        message: `Confirma a exclusão da categoria ${event.categoryName}?`,
        header: "Confirmação de Exclusão!",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Sim",
        rejectLabel: "Não",
        accept: ()=>this.deleteCategory(event.category_id)
      })
    }
  }

  deleteCategory(category_id: string): void
  {
    if(category_id){
      this.CategoriesService.deleteCategory({category_id})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Sucesso!",
            detail: "Categoria removida com sucesso!",
            life: 3000,
          })
          this.getAllCategories();
        },
        error: error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: "Erro!",
            detail: "Erro ao deletar categoria",
            life: 2500,
          });
          this.getAllCategories();
        }
      })
    }
    this.getAllCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
