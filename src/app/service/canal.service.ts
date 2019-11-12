import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class CanalService {

  private link = "https://sentool.bbstvnet.com/index.php";

  private headers=new Headers();
  private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;
  public datas:any;

  public payer(requete:any): Promise<any>{

    let params="requestParam="+JSON.stringify({requete : requete, token:this.token});

    console.log(params) ;

    let link=this.link+"/canal/payer";
    console.log(params);
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {
      console.log(res);
      return res
    } ).catch(error => {
                        console.log(error);
                        return 'bad' 
                        });
  }
  public recherche(requete:any): Promise<any>{

    this.token = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;

    let params="requestParam="+JSON.stringify({requete : requete, tokenParam: this.token});

 
    let link=this.link+"/canal/rechercher";

    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {console.log(res);return res} ).catch(error => {console.log(error);return 'bad' });
  }  

  public resultRecherche(requete:any): Promise<any>{

    let params="requestParam="+JSON.stringify({filename : requete, tokenParam:this.token});

    console.log(params) ;

    let link=this.link+"/canal/resultRecherche";
    console.log(params);
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {console.log(res);return res} ).catch(error => {console.log(error);return 'bad' });
  }
  constructor(private http:Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }
}
