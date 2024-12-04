import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingComponent } from './components/landing/landing.component';
import { IntroComponent } from './components/intro/intro.component';
import { FeaturedComponent } from './components/featured/featured.component';
import { PartnersComponent } from './components/partners/partners.component';
import { StoreComponent } from './components/store/store.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/cart/cart.component';
import { ServicesComponent } from './components/services/services.component';
import { FixedComponent } from './components/fixed/fixed.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { PageHeadingComponent } from './components/page-heading/page-heading.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AddProductComponent } from './components/add-product/add-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    IntroComponent,
    FeaturedComponent,
    PartnersComponent,
    StoreComponent,
    HomeComponent,
    AboutComponent,
    CartComponent,
    ServicesComponent,
    FixedComponent,
    ContactUsComponent,
    MainLayoutComponent,
    PageHeadingComponent,
    ProductListComponent,
    ProductDetailsComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AddProductComponent,
    UpdateProductComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideAnimationsAsync() , provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
