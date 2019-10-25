import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from '../service/authentication-service.service';
import * as sha1 from 'js-sha1';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firstlog',
  templateUrl: './firstlog.component.html',
  styleUrls: ['./firstlog.component.scss']
})
export class FirstlogComponent implements OnInit {

  currentPassword:string;
  newPassword:string;
  confirmNewPassword:string;
  errorMesage:boolean=false;
  message:string;
  loading:boolean=false;
  changePassword(){
    this.errorMesage =false;
    this.loading = true;
    if(this.newPassword == this.confirmNewPassword){
      this._authService.modifpwdinit({pwdactuel:sha1(this.currentPassword), newpwd:sha1(this.newPassword)}).then(res =>{
        if(res!='badpwd'){
          this.loading = false;
          this.errorMesage =false;
          this.router.navigate(['/login']);
        }else{
          this.loading = false;
          this.errorMesage =true;
          this.message = "Mots de pass actuel incorrect !!!";
          this.currentPassword=undefined;
          this.newPassword=undefined;
          this.confirmNewPassword=undefined;
        }
      })

    }else{
      this.loading = false;
      this.errorMesage =true;
      this.message = "Nouveau mots de pass et la confirmation ne correspond pas !!!";
      this.currentPassword=undefined;
      this.newPassword=undefined;
      this.confirmNewPassword=undefined;
    }

  }
  constructor(private _authService:AuthenticationServiceService,private router:Router) { }

  ngOnInit() {
  }

}
