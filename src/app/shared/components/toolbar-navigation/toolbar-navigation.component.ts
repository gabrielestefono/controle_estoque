import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductEvent } from 'src/app/models/enums/products/product-event';
import { ProductFormComponent } from 'src/app/modules/products/components/product-form/product-form.component';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
})
export class ToolbarNavigationComponent {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private readonly dialogService: DialogService,
  ){}

  handleLogout(): void
  {
    this.cookieService.delete('jwt_token');
    void this.router.navigate(['/home']);
  }

  handleSaleProduct(): void
  {
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT
    this.dialogService.open(ProductFormComponent, {
      header: ProductEvent.SALE_PRODUCT_EVENT,
      width: '50%',
      contentStyle: {
        overflow: 'auto'
      },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: saleProductAction }
      }
    })
  }
}
