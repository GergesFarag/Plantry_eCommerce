import { Component, OnDestroy } from '@angular/core';
import { TimeoutInfo } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnDestroy{
  currentIMG:string = "imgs/img77.png";
  currentINDEX:number = 0;
  isfade:boolean = false;
  myInterval:any = 0;
  myTimeout:any = 0;
  constructor(){
    this.myInterval = setInterval(()=>{
      this.isfade = true;
      this.myTimeout = setTimeout(() => {
        this.currentIMG = this.changeImg();
        this.isfade = false;
      } ,1000)
    } ,4000)
  }
  private changeImg(){
    const images = ["imgs/img77.png" , "imgs/img11.png" , "imgs/img22.png"]
    this.currentINDEX = (this.currentINDEX + 1) % images.length;
    return images[this.currentINDEX]
  }
  ngOnDestroy(): void {
    clearInterval(this.myInterval);
    clearTimeout(this.myTimeout);
  }
}
