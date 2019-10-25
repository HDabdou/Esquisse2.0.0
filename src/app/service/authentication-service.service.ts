import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as sha1 from 'js-sha1';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {
  public baseToken: string ;
  public email: string ;
  public prenom: string ;
  public nom: string ;
  public nometps: string ;
  public telephone: string ;
  public accessLevel: number ;
  public authorizedApis: string ;
  private link = "https://sentool.bbstvnet.com/index.php"; 

  private headers=new Headers();

  public datas:any;


  constructor(private http:Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
   }

   
  login(data:any){
    let url = this.link+"/auth-sen/authentification";
    let datas = JSON.stringify({login:data.login, pwd: sha1(data.pwd) });
    this.email = data.login;
    let params = 'params='+datas;
    return this.http.post(url,params,{headers:this.headers}).toPromise().then( res => {
      //console.log(res);
      //console.log(res);
      if( res['_body'] != 'false' ){
        sessionStorage.setItem('headToken', res['_body'].split("#")[1].replace('"', '') );
        return JSON.parse(res['_body']) 
      }
     

    } ).catch(error => {console.log(error);return 'bad' });
  }

  authentificationPhaseTwo(data:any){
    let url = this.link+"/auth-sen/authentificationPhaseTwo";
    let datas = JSON.stringify({tokentemporaire:data.tokentemporaire});
    let params = 'params='+datas;

    return this.http.post(url,params,{headers:this.headers}).toPromise().then( res => {
      
     let rp = JSON.parse(res['_body']);
     let resp = JSON.parse(rp);
     this.baseToken = sessionStorage.getItem('headToken')+sha1(resp.baseToken+sha1("bay3k00_f1_n10un") );
           
     
      sessionStorage.setItem('currentUser', JSON.stringify({ username: this.email, baseToken: this.baseToken, authorizedApis:resp.authorizedApis, accessLevel:resp.accessLevel, prenom:resp.prenom, nom:resp.nom, telephone:resp.telephone, firstuse:resp.firstuse}));
      console.log(JSON.parse(sessionStorage.getItem('currentUser')).baseToken);

      return JSON.parse(JSON.parse(res['_body']) )
     } ).catch(error => {console.log(error);return 'bad' });
  }


  loggout(){
    let url = this.link+"/auth-sen/deconnexion";
    let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken, hdeconnexion:"345"});

    let params = 'params='+datas;

    return this.http.post(url,params,{headers:this.headers}).toPromise().then( res => {console.log(res);return JSON.parse(JSON.parse(res['_body']) ) } ).catch(error => {console.log(error);return 'bad' });
  }


  inscription(data:any){
    let url = this.link+"/auth-sen/inscription";
    let datas = JSON.stringify(data);
    let params = 'params='+datas;
    return this.http.post(url,params,{headers:this.headers}).toPromise().then( res => {
      return JSON.parse(res['_body']) ;
      } ).catch(error => {
      console.log(error);
      return 'bad' 
      });

  }

  modifpwdinit(data:any){
    let url = this.link+"/auth-sen/modifpwdinit";
    let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken, pwdactuel:data.pwdactuel, newpwd : data.newpwd});
    let params = 'params='+datas;
    return this.http.post(url, params, {headers:this.headers}).toPromise().then( res => {
      console.log(res);
      return JSON.parse(res['_body']) ;
      } ).catch(error => {
      console.log(error);
      return 'bad' 
      });
  }
}
