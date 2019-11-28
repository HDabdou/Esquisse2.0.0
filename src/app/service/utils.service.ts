import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  //private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";
//  private link = "https://sentool.bbstvnet.com/sslayer/index.php";

private link = "https://sentool.bbstvnet.com/index.php";


private headers = new Headers();

constructor(private _http: Http){
  this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
}

getOnePointSuivicc(data:any) : Promise<any>{
  let url = this.link+"/utils-sen/getdetailonepointsuivisentool";
  let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken, data:data});
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

recupererInfosCC() : Promise<any>{
  let url = this.link+"/utils-sen/initajoutdeposit";
  let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken});
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

demandedeposit(data:any) : Promise<any>{
  let url = this.link+"/utils-sen/demndedeposit";
  let datas = JSON.stringify(data);
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

getRegion() : Promise<any>{
  let url = this.link+"/utils-crm/region";
  let datas = JSON.stringify({});
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

getZoneByRegion(region:string) : Promise<any>{
  let url = this.link+"/utils-crm/zone";
  let datas = JSON.stringify({region:region});
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

getSouszoneByZoneByRegion(data:any) : Promise<any>{
  let url = this.link+"/utils-crm/souszonebyzonebyregion";
  let datas = JSON.stringify(data);
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

consulterLanceurDalerte(){
  let url = this.link+"/utils-sen/consulterLanceurDalerte";
  let datas = JSON.stringify({});
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

isDepotCheckAuthorized() : Promise<any>{
  let url = this.link+"/utils-sen/isDepotCheckAuthorized";
  let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken});
  let params = 'requestParam='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

checkCaution() : Promise<any>{
  let url = this.link+"/utils-sen/checkCaution";
  let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken});
  let params = 'requestParam='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}


getDetailOnePointSuivicc(data:any) : Promise<any>{
  let url = this.link+"/apiplatform/getdetailonepointsuivicc";
  let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken, data:data});
  let params = 'params='+datas;
  return  this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

recordGeospatialCoords(data:any) : Promise<any>{
  let url = this.link+"/utils-sen/geolocationRegistration";
  let datas = JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken, geoposition:data});
  let params = 'params='+datas;
  return this._http.post(url,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return error });
}

}
