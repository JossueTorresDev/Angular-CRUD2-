import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveProductDlgComponent } from '../save-product-dlg/save-product-dlg.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.scss'
})
export class ProductHomeComponent implements OnInit {
  columns: string[] = ['image', 'name', 'description', 'currency', 'price', 'state', 'action'];
  dataSource = new MatTableDataSource<Product>();

  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getAll();

    this.dataSource.filterPredicate = (data: Product, filter: string): boolean => {
      const search = filter.trim().toLowerCase();

      return (
        String(data.name ?? '').toLowerCase().includes(search) ||
        String(data.description ?? '').toLowerCase().includes(search) ||
        String(data.currencyCode ?? '').toLowerCase().includes(search) ||
        String(data.state ?? '').toLowerCase().includes(search) ||
        String(data.price ?? '').includes(search) // corregido: sin toLowerCase
      );
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll(): void {
    this.productService.getAll().subscribe(res => {
      this.dataSource.data = res.data;
    });
  }

  openProductDlg(product?: Product): void {
    const dialogRef = this.dialog.open(SaveProductDlgComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getAll();
      }
    });
  }

  inactiveProduct(id: number): void {
    this.productService.inactive(id).subscribe(res => {
      if (res.status) {
        this.getAll();
        this.snackbar.open('Se inactivó el producto', 'Aceptar', {
          duration: 3000
        });
      }
    });
  }
}
