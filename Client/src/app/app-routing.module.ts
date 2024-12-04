import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { StoreComponent } from './components/store/store.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth-guard.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';

const routes: Routes = [
 {path: "" , component: MainLayoutComponent , children:[
   {path: "home" , component: HomeComponent},
   {path: "about" , component: AboutComponent},
   {path:"login" , component: LoginComponent},
   {path: "dashboard" , canActivate : [authGuard], component: DashboardComponent},
   {path: "addProduct" , canActivate : [authGuard], component:AddProductComponent},
   {path: "updateProduct/:prodId" , canActivate : [authGuard], component:UpdateProductComponent},
   {path: "store" , component: StoreComponent},
   {path: "contact" , component: ContactUsComponent},
   {path: "signup" , component: SignupComponent},
   {path: "productDetails/:prodId" , component: ProductDetailsComponent},
   {path: "**", redirectTo: "home"}
 ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
