import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class EMoneyService {

  private headers=new Headers();
  private link="https://sentool.bbstvnet.com/index.php";
  private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;

  constructor(private http:Http){
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  depot(montant:string,numero:string):Promise<any>{
    let requete="1/"+numero+"/"+montant;
    let url=this.link+"/emoney/depot";
    let param="requestParam="+JSON.stringify({requestParam:requete,tokenParam:this.token});
    return new Promise((resolve,reject) =>{
       this.http.post(url,param,{headers:this.headers}).subscribe(res =>{
          resolve(res);
        });
       // resolve(requete);
    });
  }
  getReponse(file:string){
    let url=this.link+"/emoney/getReponse";
    let param="requestParam="+JSON.stringify({requestParam:file,token:this.token});
    return new Promise((resolve,reject)=>{
      this.http.post(url,param,{headers:this.headers}).subscribe(res =>{
        resolve(res);
      });
    });
  }
  retrait(montant:string,numero:string){
    let requete="2/"+numero+"/"+montant;
    let url=this.link+"/emoney/retrait";
    let param="requestParam="+JSON.stringify({requestParam:requete,tokenParam:this.token});
    return new Promise((resolve,reject) =>{
       this.http.post(url,param,{headers:this.headers}).subscribe(res =>{
          resolve(res);
        });
       // resolve(requete);
    });

  }
}
