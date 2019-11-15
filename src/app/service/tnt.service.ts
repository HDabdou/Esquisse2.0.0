import { Injectable } from '@angular/core';
import {Http,Headers} from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class TntService {

  token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;

  private link = "https://sentool.bbstvnet.com/index.php";


  private headers = new Headers();
  public responseJso : any ;
  public resp : string ;
  //public responseJsoFWS : TntResponse[] ;


  constructor(private http:Http) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  public listAbonnement(token : string) : Promise<any> {
      let reEspParams = {token:token} ;
      let link=this.link+"/apitnt/listabonnement";
      console.log(link);
      let params="params="+JSON.stringify(reEspParams);
      return new Promise((resolve,reject)=>{
        this.http.post(link,params,{headers:this.headers}).subscribe(response =>{
          // console.log(response);
           resolve(response);
        });
        });
  }

  public listeVenteDecods(token : string) : Promise<any> {
      let reEspParams = {token:token} ;
      let link=this.link+"/apitnt/listeventedecodeur";
      console.log(link);
      let params="params="+JSON.stringify(reEspParams);
      return new Promise((resolve,reject)=>{
        this.http.post(link,params,{headers:this.headers}).subscribe(response =>{
          // console.log(response);
           resolve(response);
        });
        });
  }

  public listerVenteCartes(token : string) : Promise<any> {
      let reEspParams = {token:token} ;
      let link=this.link+"/apitnt/listeventecarte";
      console.log(link);
      let params="params="+JSON.stringify(reEspParams);
      return new Promise((resolve,reject)=>{
        this.http.post(link,params,{headers:this.headers}).subscribe(response =>{
          // console.log(response);
           resolve(response);
        });
        });
  }

  public checkNumber( chipOrCardNum: string) : Promise<any> {
    let params="params="+JSON.stringify({token:JSON.parse(sessionStorage.getItem('currentUser')).baseToken,numeroCarteChip:chipOrCardNum});
    let link=this.link+"/apitnt/checkNumber";
    console.log(params);
    return new Promise((resolve,reject)=>{
      this.http.post(link,params,{headers:this.headers}).subscribe(response =>{
        // console.log(response);
         resolve(response);
      });
      });
  }

  public abonner(token:string, prenom:string, nom:string, tel:string, cni:string, numerochip:string, numerocarte:string, duree:number, typedebouquet:number) : Promise<any> {
      let montant : number = 0 ;
      if(typedebouquet==1) montant = 5000;
      if(typedebouquet==2) montant = 3000;
      if(typedebouquet==3) montant = 8000;
      montant = duree*montant ;

      let reEspParams = {token:token, prenom:prenom, nom:nom, tel:tel, adresse:'', region:'', city:'', cni:cni, numerochip:numerochip, numerocarte:numerocarte, duree:duree, typedebouquet:typedebouquet, montant:montant} ;
      let link=this.link+"/apitnt/abonner";
      console.log(link);
      let params="params="+JSON.stringify(reEspParams);
      return new Promise((resolve,reject)=>{
        this.http.post(link,params,{headers:this.headers}).subscribe(response =>{
          // console.log(response);
           resolve(response);
        });
        });
  }

  public vendreDecodeur(token, prenomNewClient, nomNewClient, telNewClient, adresseNewClient, regionNewClient, cniNewClient, nchipNewClient, ncarteNewClient, nbmNewClient, typedebouquet, prix) : Promise<any> {
      let reEspParams = {token:token, prenom:prenomNewClient, nom:nomNewClient, tel:telNewClient, adresse:adresseNewClient, region:regionNewClient, cni:cniNewClient, numerochip:nchipNewClient, numerocarte:ncarteNewClient, typedebouquet:typedebouquet, prix:prix} ;
      let link=this.link+"/apitnt/ventedecodeur";
      console.log(link);
      let params="params="+JSON.stringify(reEspParams);
      return new Promise((resolve,reject)=>{
        this.http.post(link,params,{headers:this.headers}).subscribe(response =>{
          // console.log(response);
           resolve(response);
        });
        });
  }

  /*public vendreCarte(token, prenomNewClient, nomNewClient, telNewClient, adresseNewClient, regionNewClient, cniNewClient, ncarteNewClient, prix) : Promise<string> {
      let reEspParams = {token:token, prenom:prenomNewClient, nom:nomNewClient, tel:telNewClient, adresse:adresseNewClient, region:regionNewClient, cni:cniNewClient, numerocarte:ncarteNewClient, prix:prix} ;
      let params:{}[] = [] ;
      params["params"] = reEspParams ;
      return new Promise( (resolve, reject) => {
        this.http.post('http://127.0.0.1/test/listtnt.php',reEspParams).map(res =>res.json()).subscribe(data =>{
               resolve("ok");
        });
      });
  }*/
}
