import { Component, Input } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: GetAllProductsResponse[] = [];

  public productSelected!: GetAllProductsResponse

}
