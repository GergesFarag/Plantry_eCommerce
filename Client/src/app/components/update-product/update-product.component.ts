import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Iproduct } from '../../models/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent implements OnInit {
  product!: Iproduct;
  categories: string[] = [];
  selectedFile: any;
  uploadStatus!: string;
  constructor(
    private _productService: ProductService,
    private activeRoute: ActivatedRoute,
    private category: CategoryService,
    private router: Router,
    private http:HttpClient
  ) {
    this.categories = this.category.getAllCategories;
    this.product = {
      _id: '',
      title: '',
      price: 0,
      imageURL: '',
      category: '',
      quantity: 0,
      description: '',
      hasDiscount: false,
      isFeatured: false,
      isDeleted: false,
    }
  }
  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
      const id = params.get('prodId') as string;
      this._productService.getProductById(id).subscribe((product) => {
        this.product = product as Iproduct;
      });
    });
  }
  updateProduct() {
    this._productService.updateProduct(this.product).subscribe((_) => {
      this.router.navigate(['/dashboard']);
    });
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
