import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {
  private url:string='https://sentool.bbstvnet.com/index.php';
  private header :HttpHeaders;
  private token;
  constructor(private http:HttpClient) {
    this.header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.token=JSON.parse(sessionStorage.getItem('currentUser')).baseToken;
    console.log("token = "+this.token);
   }

   
   //token="b21efc053cc7e16ce4729c2ce0e8ad90";
   public listeOperation(dateDebut,dateFin): Promise<any>{
    let params="param="+JSON.stringify({dateDebut:dateDebut,dateFin:dateFin,token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken,timetampe:(new Date()).toString()});
    //console.log(params);
    
    let link=this.url+"/master/listOperation";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }
  public listOperationByPoint(dateDebut,dateFin,id_user): Promise<any>{
    let params="param="+JSON.stringify({dateDebut:dateDebut,dateFin:dateFin,id_user:id_user,timetampe:(new Date()).toString()});
    
    let link=this.url+"/master/listOperationByPoint";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }
  
  public listeUser(): Promise<any>{
    let params="param="+JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken,timetampe:(new Date()).toString()});
    //console.log(params);
    
    let link=this.url+"/master/listUsers";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }

  public listedeposit(dateDebut,dateFin,id_user): Promise<any>{
    let params="param="+JSON.stringify({dateDebut:dateDebut,dateFin:dateFin,token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken,id_user:id_user,timetampe:(new Date()).toString()});
    
    let link=this.url+"/master/listDeposit";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }

  public updateCaution(montant,id_user): Promise<any>{
    let params="param="+JSON.stringify({montant:montant,token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken,id_receiver:id_user,timetampe:(new Date()).toString()});
    
    let link=this.url+"/master/updateCaution";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }

  public getSolde(): Promise<any>{
    let params="param="+JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken,timetampe:(new Date()).toString()});
    console.log("param = "+params);
    
    let link=this.url+"/master/getSolde";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }
  public affectation(codeValidation): Promise<any>{
    let params="param="+JSON.stringify({codeValidation:codeValidation,timetampe:(new Date()).toString()});
    //console.log("param = "+params);
    
    let link=this.url+"/master/affecterPoint";
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  }


}
