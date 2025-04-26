import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; // URL del json-server

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener un producto por ID
  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Agregar un nuevo producto
  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  // Actualizar un producto
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
