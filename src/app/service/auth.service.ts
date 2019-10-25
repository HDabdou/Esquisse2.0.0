import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://sentool.bbstvnet.com/index.php";
  //private url:string='http://localhost:8088/db_mbirmi/index.php';
  private header :HttpHeaders;
  constructor(private http:HttpClient) {
    this.header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
   }

  token="b21efc053cc7e16ce4729c2ce0e8ad90";
  public authentifier(data:any): Promise<any>{
    let datas = JSON.stringify({login:data.login,pwd:data.pwd});
    let params="param="+datas;
    console.log(datas);
    
    let link=this.url+"/auth-sen/authentification";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }

  public authentificationPhaseTwo(data:any): Promise<any>{
    let datas = JSON.stringify({tokentemporaire:data.tokentemporaire});
    let params="param="+datas;
    console.log(params);
    
    let link=this.url+"/auth-sen/authentificationPhaseTwo";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }
}
