import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/product-event';
import { DeleteProductAction } from 'src/app/models/interfaces/products/events/delete-product-action';
import { EventAction } from 'src/app/models/interfaces/products/events/event-action';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: GetAllProductsResponse[] = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;
  // public saleProductEvent = ProductEvent.SALE_PRODUCT_EVENT;

  public handleProductEvent(action: string, id?: string): void
  {
    if(action && action !== ''){
      const productEventData = id && id !== '' ? { action, id } : { action };
      this.productEvent.emit(productEventData);
    }
  }

  handleDeleteProduct(product_id: string, product_name: string): void
  {
    if(product_id !== '' && product_name !== ''){
      this.deleteProductEvent.emit({
        product_id,
        product_name
      })
    }
  }
}
