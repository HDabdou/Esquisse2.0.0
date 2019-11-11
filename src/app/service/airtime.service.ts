import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class AirtimeService {
  //private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";
//  private link = "https://sentool.bbstvnet.com/sslayer/index.php";

 // private link = "https://mysentool.pro/index.php";
 private link = "https://sentool.bbstvnet.com/index.php";


 private headers=new Headers();
 private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;
 public datas:any;


 constructor(private http:Http) {
   this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
 }
 public Airtime(type:string,numero:string,montant:string): Promise<any>{
   let rep="mag test"+type+"-"+numero+"-"+montant;
   let link=this.link+"/airtime/Airtime";
   let requete=numero+"/"+montant;
   let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token,type:type});
 return new Promise((resolve,reject)=>{
     this.http.post(link,params,{headers:this.headers}).subscribe(data =>{
     resolve(data);
     });
     //resolve(rep);
 });
 }
 public verifierReponse(requete:string):Promise<any>{
    let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token, cacheDisabler : Date.now()});
    let link=this.link+"/airtime/verifierReponseAirtime";
    return new Promise((resolve,reject)=>{
     this.http.post(link,params,{headers:this.headers}).subscribe(data =>{
     resolve(data);
     });
     //resolve('1');
 });
 }
 public demanderAnnulation(rep:string):Promise<any>{
  let params="requestParam="+JSON.stringify({requestParam : rep, tokenParam : this.token, cacheDisabler : Date.now()});
    let link=this.link+"/airtime/annulationAirtime";
  return new Promise((resolve,reject)=>{
    /* this.http.post(link,params,{headers:this.headers}).subscribe(data =>{
     resolve(data);
     });*/
     resolve('-1');
 });
  
 }
 public ceddo(): Promise<any>{
   let rep="mag test";
 return new Promise((resolve,reject)=>{
   resolve(rep);
 });
 }
 public izi(): Promise<any>{
   let rep="mag test"
 return new Promise((resolve,reject)=>{
   resolve(rep);
 });
 }
 public yakalma(): Promise<any>{
   let rep="mag test"
 return new Promise((resolve,reject)=>{
   resolve(rep);
 });
 }

 public requerirControllerOM(requete:any): Promise<any>{
   let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token});
   let link=this.link+"/om-sen/requerirControllerOM";
   return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
 }

 public verifierReponseOM(requete:any): Promise<any>{
   let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token, cacheDisabler : Date.now()});
   
   let link=this.link+"/om-sen/verifierReponseOM";
   return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
 }

 public demanderAnnulationOM(requete:any): Promise<any>{
   let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token});
   let link=this.link+"/om-sen/demanderAnnulationOM";
   return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
 }

 public isDepotCheckAuthorized(): Promise<any>{
   let params="requestParam="+JSON.stringify({token : this.token});
   let link=this.link+"/om-sen/isDepotCheckAuthorized";
   return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
 }

}
