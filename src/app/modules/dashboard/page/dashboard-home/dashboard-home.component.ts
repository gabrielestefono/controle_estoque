import { MessageService } from 'primeng/api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/get-all-products-response.interface';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html'
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService: ProductsDataTransferService
  ){}

  private destroy$ = new Subject<void>();

  public productsList: GetAllProductsResponse[] = [];
  public productsChartData!: ChartData;
  public productsChartOptions!: ChartOptions;

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void
  {
    this.productsService.getAllProducts()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: response => {
        if(response.length > 0){
          this.productsList = response;
          this.productsDataTransferService.setProductsData(this.productsList);
          this.setProductsChartConfig();
        }
      },
      error: error => {
        this.messageService.add(
          {
            severity: 'error',
            summary: "Erro!",
            detail: "Erro ao buscar produtos!",
            life: 2500,
          }
        );
        console.log(error)
      }
    })
  }

  setProductsChartConfig(): void
  {
    if(this.productsList.length > 0){
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      this.productsChartData = {
        labels: this.productsList.map(element => element?.name),
        datasets: [
          {
            label: 'Quantidade',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
            data: this.productsList.map(element => element?.amount)
          }
        ]
      };
      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: '500',
              }
            },
            grid: {
              color: surfaceBorder,
            }
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder
            }
          }
        },
      }
    }
  }

  ngOnDestroy(): void
  {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
