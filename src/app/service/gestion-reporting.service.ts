import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class GestionReportingService {
  private link = "https://sentool.bbstvnet.com/index.php";


  private headers = new Headers();
  private basetoken:any;

  constructor(private http: Http){
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.basetoken = JSON.parse(sessionStorage.getItem('currentUser')).baseToken;
  }

  reportingdate(data:any){
    let url = this.link+"/gestionreporting-sen/reportingdate";
    let datas = JSON.stringify({token:this.basetoken, idpdv:data.idpdv, type:data.type, infotype:data.infotype});
    let params = 'params='+datas;
    return  this.http.post( url,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
  }

  reimpression(data:any){
    let url = this.link+"/gestionreporting-sen/reimpression";
    let datas = JSON.stringify({token:this.basetoken, idpdv:data.idpdv, operation:data.operation, infooperation:data.infooperation});
    let params = 'params='+datas;
    return  this.http.post( url,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
  }

  gestionreporting(){
    let url = this.link+"/gestionreporting-sen/gestionreporting";
    let datas = JSON.stringify({token:this.basetoken});
    let params = 'params='+datas;
    return  this.http.post( url,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
  }

  servicepoint(){
    let url = this.link+"/gestionreporting-sen/servicepoint";
    let datas = JSON.stringify({token:this.basetoken});
    let params = 'params='+datas;
    return  this.http.post( url,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
  }

  ajoutdepense(data:any){
    let url = this.link+"/gestionreporting-sen/ajoutdepense";
    let datas = JSON.stringify({token:this.basetoken, libelle:data.libelle, service:data.service, montant:data.montant});
    let params = 'params='+datas;
    return  this.http.post( url,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
  }

  reclamation(data:any){
    let url = this.link+"/gestionreporting-sen/reclamation";
    let datas = JSON.stringify({token:this.basetoken, sujet:data.sujet, nomservice:data.nomservice, message:data.message});
    let params = 'params='+datas;
    return  this.http.post( url,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
  }

  vente(data:any){
    let url = this.link+"/gestionreporting-sen/vente";
    let datas = JSON.stringify({token:this.basetoken, servicevente:data.servicevente, designation:data.designation, quantite:data.quantite});
    let params = 'params='+datas;
    return  this.http.post( url,params,{headers:this.headers}).toPromise().then( res =>{console.log(res);return res} ).catch(error => {return 'bad' });
 
  }
}
