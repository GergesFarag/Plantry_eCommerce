import { Component, OnInit } from '@angular/core';
import { Iproduct } from '../../models/iproduct';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  product: Iproduct;
  categories: string[];
  selectedFile:File | null;
  uploadStatus: string = '';
  constructor(
    private _productService: ProductService,
    private category: CategoryService,
    private router: Router,
    private http:HttpClient
  ) {
    this.categories = this.category.getAllCategories;
    this.product = {
      _id: '0',
      title: '',
      price: 0,
      imageURL: '',
      category: this.categories[0],
      quantity: 1,
      description: '',
      hasDiscount: false,
      isFeatured: false,
      isDeleted: false,
    };
    this.selectedFile = null;
  }
  ngOnInit(): void {}
  addProduct() {
    this._productService.addProduct(this.product).subscribe();
    this.router.navigate(['/dashboard']);
  }
  onFileUpload(e:any){
    this.selectedFile = e.target.files[0];
    if (!this.selectedFile) {
      this.uploadStatus = 'No file selected';
      return;
    }
    this.uploadStatus = 'Uploading...'; 
    this.uploadFile(); 
  }
  uploadFile(){
    if(!this.selectedFile){
      this.uploadStatus = 'no file uploaded';
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post('http://localhost:3000/upload' , formData).pipe(
      catchError((error) => {
        this.uploadStatus = 'File upload failed!';
        return of(error); // Handling error
      })
    ).subscribe(data => {
      this.uploadStatus = "File upload",
      this.product.imageURL = data.fileName
      console.log(data);
    })
  }
}
