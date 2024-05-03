import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/app/models/enums/categories/category-event';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/delete-category-action.interface';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/edit-category-action.interface';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/get-categories-response.interface';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
})
export class CategoriesTableComponent {
  @Input() public categories: Array<GetCategoriesResponse> = [];
  @Output() public categoryEvent: EventEmitter<EditCategoryAction> = new EventEmitter<EditCategoryAction>();
  @Output() public deleteCategoryEvent: EventEmitter<DeleteCategoryAction> = new EventEmitter<DeleteCategoryAction>();
  public categorySelected!: GetCategoriesResponse;
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  handleDeleteCategoryEvent(category_id: string, categoryName: string): void
  {
    if(category_id !== '' && categoryName !== ''){
      this.deleteCategoryEvent.emit({category_id,categoryName})
    }
  }

  handleCategoryEvent(action: string, id?: string, category_name?: string): void
  {
    if(action && action != ''){
      this.categoryEvent.emit({action, id, category_name})
    }
  }
}
