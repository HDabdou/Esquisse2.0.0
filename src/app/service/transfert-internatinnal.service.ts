import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class TransfertInternatinnalService {

  private link = "http://localhost:8088/BRMBackend/index.php";

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
  let link=this.link+"/brm_backend/initSession";
  return  this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
}

}
