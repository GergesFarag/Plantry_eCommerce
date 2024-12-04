import { Component } from '@angular/core';
import { AuthloginService } from '../../services/authlogin.service';
import { Iuser } from '../../models/iuser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  newUser:Iuser;
  constructor(private _authLoginService: AuthloginService , private router:Router){
    this.newUser = {} as Iuser;
  }
  signup(event:Event){
    event.preventDefault();
    this._authLoginService.register(this.newUser).subscribe(token => {
      console.log("Token From Authentication" , token)
      if(token){
        this.router.navigate(["/home"]);
      }
    })
  }
}
