import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { CategoryEvent } from 'src/app/models/enums/categories/category-event';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/edit-category-action.interface';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit, OnDestroy{
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ref: DynamicDialogConfig,
    private readonly messageService: MessageService,
    private readonly categoriesService: CategoriesService,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ){}

  private readonly destroy$: Subject<void> = new Subject();

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryAction!: {event: EditCategoryAction};
  public categoryForm = this.formBuilder.group({
    name: ["", Validators.required],
  })

  ngOnInit(): void {
    this.categoryAction = this.ref.data;

    if(this.categoryAction.event.action === this.editCategoryAction && this.categoryAction.event.category_name != null || undefined){
      this.setCategoryName(this.categoryAction.event.category_name as string);
    }
  }

  handleSubmitAddCategory(): void
  {
    if(this.categoryForm.value && this.categoryForm.valid){
      const requestCreateCategory: { name: string} = {
        name: this.categoryForm.value.name as string,
      }
      this.categoriesService.createNewCategory(requestCreateCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if(response){
            this.categoryForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Sucesso!",
              detail: "Categoria criada com sucesso!",
              life: 3000,
            })
          }
        },
        error: error => {
          console.log(error);
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: "Erro!",
            detail: "Erro ao deletar categoria",
            life: 2500,
          });
        }
      })
    };
  }

  handleSubmitCategoryAction(): void
  {
    if(this.categoryAction.event.action === this.addCategoryAction){
      this.handleSubmitAddCategory()
    }else if(this.categoryAction.event.action === this.editCategoryAction){
      this.handleSubmitEditCategory()
    }
  }

  setCategoryName(category_name: string): void
  {
    if(category_name){
      this.categoryForm.setValue({
        name: category_name,
      });
    }
  }

  handleSubmitEditCategory(): void
  {
    if(this.categoryForm.value && this.categoryForm.valid && this.categoryAction.event.id){
      const requestEditCategory: {name: string, category_id: string}= {
        name: this.categoryForm.value.name as string,
        category_id: this.categoryAction.event.id,
      }
      this.categoriesService.editCategoryName(requestEditCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.categoryForm.reset()
            this.messageService.add({
              severity: "success",
              summary: "Sucesso!",
              detail: "Categoria editada com sucesso!",
              life: 3000,
            })
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: "Erro!",
              detail: "Erro ao editar categoria",
              life: 2500,
            });
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
