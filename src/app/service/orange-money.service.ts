import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class OrangeMoneyService {
  private link = "https://sentool.bbstvnet.com/index.php";
 // private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";
//  private link = "https://sentool.bbstvnet.com/sslayer/index.php";

 // private link = "https://mysentool.pro/index.php";

  private headers=new Headers();
  private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;
  public datas:any;


  constructor(private http:Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  public requerirControllerOM(requete:any): Promise<any>{
   
    
    let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : JSON.parse(sessionStorage.getItem('currentUser')).baseToken});
    console.log(params);
    let link=this.link+"/om-sen/requerirControllerOM";
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{return res} ).catch(error => {return 'bad' });
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

  public postDemanderAnnulationOM(requete:any): Promise<any>{ 
    let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token,timestamp: Date.now()});
    let link=this.link+"/om-sen/verifierAlertOM";
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {console.log(res); return res} ).catch(error => {return 'bad' });
    //return Promise.resolve("1");
  }

  public isDepotCheckAuthorized(): Promise<any>{
    let params="requestParam="+JSON.stringify({token : this.token});
    let link=this.link+"/om-sen/isDepotCheckAuthorized";
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
  }
}
