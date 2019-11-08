import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class WizallService {

  //private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";

//  private link = "https://sentool.bbstvnet.com/sslayer/index.php";
//  private link = "http://127.0.0.1/kheuteuteupeuseu/index.php";

private link = "https://sentool.bbstvnet.com/index.php";

private headers=new Headers();
private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;
public datas:any;


constructor(private http:Http) {
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
 }

public intouchCashin(frommsisdn : string, tomsisdn : string, amount : number): Promise<any>  {
  let reEspParams = {token:this.token, receiver_phone_number: tomsisdn, amount: amount} ;
  console.log(reEspParams)
  let params="params="+JSON.stringify(reEspParams);
  let link=this.link+"/wizall-sen/intouchCashin";
  return  this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
}

public intouchCashout(usermsisdn : string, amount : number): Promise<any>  {
  let reEspParams = {token:this.token, customer: usermsisdn, amount: amount} ;
  let params="params="+JSON.stringify(reEspParams);
  console.log(params);
  
  let link=this.link+"/wizall-sen/intouchCashout";
  return this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
}

public verifier_code_retraitbon(codebon:any):Promise<any>{
  let link=this.link+"/wizall-sen/verifiercodebonachat";
  let params="params="+JSON.stringify({codebon:codebon,token:this.token});
  return this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
}

public getSendSecureID(codebon:any):Promise<any>{
  let link=this.link+"/wizall-sen/getSendSecureID";
  let params="params="+JSON.stringify({codebon:codebon,token:this.token});
  return this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
}

public bonDebitVoucher(data:any):Promise<any>{
  let link=this.link+"/wizall-sen/bonDebitVoucher";
  let params="params="+JSON.stringify({token:this.token,nationalite:data.nationalite,num_card:data.num_card,type_carte:data.type_carte,secure_id:data.codebon,code_validation:data.code_validation, montant:data.montant});
  return this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
}

public validerenvoiboncash(data:any):Promise<any>{
  let link=this.link+"/wizall-sen/validerenvoiboncash";
  let params="params="+JSON.stringify({token:this.token,model_voucher:"0",requested_value:data.data.montant,customer_phone_number:data.data.telE,customer_first_name:data.data.prenomE,customer_last_name:data.data.nomE,customer_nationality:data.data.nationalite,customer_identity_type:data.data.type_piece,customer_identity_number:data.data.num_card,recipient_phone_number:data.data.telB,recipient_first_name:data.data.prenomB,recipient_last_name:data.data.nomB});
  return this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
}

public validerbonachat(data:any):Promise<any>{
  let link=this.link+"/wizall-sen/validerenvoibonachat";
  let params="params="+JSON.stringify({token:this.token,data:data});
  return this.http.post(link,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
}

}
