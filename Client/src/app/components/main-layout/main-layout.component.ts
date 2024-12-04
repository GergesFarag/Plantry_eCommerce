import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnDestroy {
  myBG:string = "url('imgs/bg1.jpg')";
  private ImgIndex:number = 0;
  private myInterval:any;
  constructor(public router:Router){
    this.myInterval = setInterval(() => {
      this.myBG = this.changeBG()
    } , 3000)
  }
  private changeBG():string{
    const images:string[] = ["url('imgs/bg1.jpg')" , "url('imgs/bg2.jpg')" , "url('imgs/bg3.jpg')"];
    this.ImgIndex = (this.ImgIndex + 1) % images.length;
    return images[this.ImgIndex];
  }
  get isLandingPage(): boolean {
    return this.router.url === '/home';
  }
  get isLoginPage(): boolean {
    return this.router.url === "/signup"
  }
  ngOnDestroy(): void {
    clearInterval(this.myInterval);
  }
}
