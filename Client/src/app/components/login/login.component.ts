import { Component, OnInit } from '@angular/core';
import { AuthloginService } from '../../services/authlogin.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  failedMSG: boolean = false;
  constructor(private _authLoginService:AuthloginService , private router:Router){}
  ngOnInit(): void {
  }
  login(email:string  , password:string){
    this._authLoginService.login(email,password).subscribe((token) => {
      if(token){
        this.router.navigate(['/home']);
      }else{
        this.failedMSG = true;
      }
    })
  }
}
