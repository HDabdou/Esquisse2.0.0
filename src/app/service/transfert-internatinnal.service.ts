import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class TransfertInternatinnalService {

  private link = "http://localhost:8088/sentoolMiddleware/index.php";

private headers=new Headers();
private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;
public datas:any;


constructor(private http:Http) {
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
 }

public initSession(): Promise<any>  {
  
  let reEspParams = {token:this.token} ;
  console.log(reEspParams)
  let params="params="+JSON.stringify(reEspParams);
  let link=this.link+"/transfertInternationnal/initSession";
  return  this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
}
public searchByCode(codeRetrait,correspondant): Promise<any>  {
  
  let requestParam = {token:this.token,codetransaction:codeRetrait,correspondant:correspondant} ;
  console.log(requestParam)
  let params="params="+JSON.stringify(requestParam);
  let link=this.link+"/transfertInternationnal/search";
  return  this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
}
public payTransfert(codeRetrait,correspondant,numerotransaction,typedepiece,numeropiece): Promise<any>  {
  
  let requestParam = {token:this.token,codetransaction:codeRetrait,correspondant:correspondant,numerotransaction:numerotransaction,typedepiece:typedepiece,numeropiece:numeropiece} ;
  console.log(requestParam)
  let params="params="+JSON.stringify(requestParam);
  let link=this.link+"/transfertInternationnal/pay";
  return  this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
}

public send(data,correspondant): Promise<any>  {
  
  let requestParam = {token:this.token,data:data,correspondant:correspondant} ;
  console.log(requestParam)
  let params="params="+JSON.stringify(requestParam);
  let link=this.link+"/transfertInternationnal/send";
  return  this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
}
}
