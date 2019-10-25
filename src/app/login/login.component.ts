import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AuthenticationServiceService } from '../service/authentication-service.service';
import { LoaderComponent } from '../shared/modules/loader/loader/loader.component';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    login:string;
    password:string;
    smsCode:string;
    phases:boolean=false;
    loading:boolean=false;
    data ={login:"",pwd:"",tokentemporaire:''}
    constructor(private router: Router,private _authService:AuthenticationServiceService) {}

    ngOnInit() {
        //this._authService.loggout();
    }
    onLoginPhaseTwo(){
        this.loading = true;
        this.data.tokentemporaire = this.smsCode+"#"+sessionStorage.getItem('headToken');
        //console.log(this.data.tokentemporaire);
        
        this._authService.authentificationPhaseTwo(this.data).then(res =>{
           
            //console.log(res.reponse==true);
            if(res.reponse==true){
                this.loading = false;
                if (JSON.parse(sessionStorage.getItem('currentUser')).firstuse==1){
                    this.router.navigate(['/soppipwdbifi']);
                 } else {
                    this.loading = false;
                localStorage.setItem('isLoggedin', 'true');
                this.router.navigate(['/dashboard']);
                }
            }else{
                this.loading = false;
                alert("sms code un incorrecte !!!")
            }
            
        })
    }
    onLoginPhaseOne() {
        //console.log(this.login+" "+this.password);
        this.loading = true;
       this.data.login = this.login;
        this.data.pwd = this.password;
        
        this._authService.login(this.data).then(res => {
            
           // console.log(res);
            if(res.includes("ok")){
                this.phases = true;
                this.loading = false;
            }else{
                alert("Login ou mots de pass un correct !!");
                this.loading = false;
            }
        })
        //localStorage.setItem('isLoggedin', 'true');
        //this.router.navigate(['/dashboard']);
    }
}
