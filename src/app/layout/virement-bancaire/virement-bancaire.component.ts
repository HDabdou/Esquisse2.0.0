import { Component, OnInit, ViewChild } from '@angular/core';
import { TransfertInternatinnalService } from 'src/app/service/transfert-internatinnal.service';
import { SendDataService } from 'src/app/service/send-data.service';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-virement-bancaire',
  templateUrl: './virement-bancaire.component.html',
  styleUrls: ['./virement-bancaire.component.scss']
})
export class VirementBancaireComponent implements OnInit {

  accueil:boolean = false;
  places:any;
  etapeEnvoie:number = 1;
  currentCountry:any;
  listPays:any =[];
  listBank:any =[];
  loading:boolean = false;
  
  indicePaysSender:any;
  indicePaysReceiver:any;
  pays_emet:string;
  pays_benef:string;
  frais:number ;
  montantNet:number ;
  envoie ={
    "devise_emission":"",
    "montant_emis":"",
    "devise_paiement":"",
    "montant_paye":"",
    "paysdestination":"",
    "produit":"",
    "frais_devise_paiement":"",
    "nom_emet":"",
    "prenom_emet":"",
    "telephoneport_emet":"",
    "adresse_emet":"",
    "pays_emet":"",
    "ville_emet":"",
    "nom_benef":"",
    "prenom_benef":"",
    "telephone_benef":"",
    "telephoneport_benef":"",
    "adresse_benef":"",
    "ville_benef":"",
    "pays_benef":"",
    "compteacrediter":"",
    "banqueacrediter":"",
    "numerowalletcrediter":"",
    "nomwallercrediter":""
    }
    reinitialiser(){
      this.etapeEnvoie = 1;
      this.montantNet =0
      this.frais = 0
      this.indicePaysSender = undefined;
      this.indicePaysReceiver = undefined;
      this.pays_emet = undefined;
      this.pays_benef = undefined;
      
       this.envoie ={
        "devise_emission":"",
        "montant_emis":"",
        "devise_paiement":"",
        "montant_paye":"",
        "paysdestination":"",
        "produit":"",
        "frais_devise_paiement":"",
        "nom_emet":"",
        "prenom_emet":"",
        "telephoneport_emet":"",
        "adresse_emet":"",
        "pays_emet":"",
        "ville_emet":"",
        "nom_benef":"",
        "prenom_benef":"",
        "telephone_benef":"",
        "telephoneport_benef":"",
        "adresse_benef":"",
        "ville_benef":"",
        "pays_benef":"",
        "compteacrediter":"",
        "banqueacrediter":"",
        "numerowalletcrediter":"",
        "nomwallercrediter":""
        }
    }
    next(){
      this.etapeEnvoie = this.etapeEnvoie +1;
    }
    back(){
      this.etapeEnvoie = this.etapeEnvoie -1;
    }
    retour(){
      this.accueil = false;
      this.etapeEnvoie =1;
      this.envoie.pays_benef = "";
    }
    @ViewChild('modalenvoie') public modalenvoie:ModalDirective;

    public showmodalenvoie(){
      //console.log(this.envoie);
      this.frais = this.getFrais(parseInt(this.envoie.montant_emis));
      this.montantNet = parseInt(this.envoie.montant_emis) + this.getFrais(parseInt(this.envoie.montant_emis));
      console.log(this.montantNet);
  
      for(let i of this.listPays){
        if(i.alpha2 == this.envoie.pays_emet){
          this.indicePaysSender =i;
        }
        if(i.alpha2 == this.envoie.pays_benef){
          this.indicePaysReceiver =i;
        }
      }
      
      let emetteur = this.listPays.filter(pays => pays.name == this.envoie.pays_emet);
      let recepteur = this.listPays.filter(pays => pays.name == this.envoie.pays_benef)
  
      this.envoie.devise_emission = emetteur[0].currencies[0];
      this.envoie.devise_paiement = recepteur[0].currencies[0];
      this.envoie.paysdestination = recepteur[0].alpha2;
      console.log(this.envoie.paysdestination);
      
      this.modalenvoie.show();
    }public hidemodalenvoie(){
      this.modalenvoie.hide();
      //this.reinitialiser();
    }
    envoyer(){
          
        for(let i of this.listPays){
          if(i.alpha2 == this.envoie.pays_emet){
            this.indicePaysSender =i;
          }
          if(i.alpha2 == this.envoie.pays_benef){
            this.indicePaysReceiver =i;
          }
        }
        
        let emetteur = this.listPays.filter(pays => pays.name == this.envoie.pays_emet);
        let recepteur = this.listPays.filter(pays => pays.name == this.envoie.pays_benef)
        //this.envoie.pays_emet = emetteur[0].
      
        //this.hidemodalenvoie();
        console.log(emetteur);
        console.log(this.pays_emet);
        console.log("recepteur");
        console.log(this.pays_benef);
        this.envoie.pays_emet = emetteur[0].alpha2;
        this.envoie.pays_benef = recepteur[0].alpha2;
        this.envoie.devise_emission = emetteur[0].currencies[0];
        this.envoie.devise_paiement = recepteur[0].currencies[0];
        this.envoie.telephoneport_emet = emetteur[0].countryCallingCodes[0]+this.envoie.telephoneport_emet
        this.envoie.telephoneport_benef =recepteur[0].countryCallingCodes[0]+this.envoie.telephoneport_benef
        this.envoie.telephone_benef =  this.envoie.telephoneport_benef;
        this.envoie.montant_paye = this.envoie.montant_emis;
        //this.envoie.compteacrediter = "SN144-12345-123456789012-12";
        //this.envoie.banqueacrediter = "BRM";
        //this.envoie.montant_emis =pa parseInt(this.envoie.montant_emis) + this.frais
        this.envoie.produit = "010";
        console.log(JSON.stringify(this.envoie));
        let object ={'nom':'Versement bancaire','operateur':11,'operation':2,'info':this.envoie};
        console.log(JSON.stringify(object));
        
        this.dataService.sendData(object)
        this.hidemodalenvoie();  
        this.dataService.clearData();
        this.reinitialiser();

    }
    nombreFormate1(montant){
      return Number(montant).toLocaleString() ;
    }
  constructor(private _banqueService:TransfertInternatinnalService,private dataService:SendDataService,private router:Router) { }
  loadBanking(service){
    this.loading = true;
    if(service == "senegal"){
        //this.router.navigate(['/ria']);
       // console.log(service);
       this._banqueService.banques('SN').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Senegal";
        
      });
        
       
    }
   
    if(service == "mali"){
      this._banqueService.banques('ML').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Mali";
        
      });
    }
    if(service == "burkina faso"){
      this._banqueService.banques('BF').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Burkina Faso";
        
      });
    }
    if(service == "Bénin"){
      this._banqueService.banques('BJ').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Benin";
        
      });
    }
    if(service == "cote d\'ivoire"){
      this._banqueService.banques('CI').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Côte d\'Ivoire";
      });
    }
    if(service == "guinnée bissau"){
      this._banqueService.banques('GW').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Guinea-bissau";
      });
    }
    if(service == "Niger"){
      this._banqueService.banques('NE').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Niger";
        
      });
    }
    if(service == "Togo"){
      this._banqueService.banques('TG').then(res =>{
        console.log(JSON.parse(res['_body'])['message']);
        let rep = JSON.parse(res['_body']);
        this.listBank = rep.Message;
        this.accueil = true;
        this.loading = false;
        this.envoie.pays_benef = "Togo";
      });
    }
    
   
  
}
  ngOnInit() {
    //var require:any
    var countries = require('country-data').countries;
    this.listPays = countries.all;
   
    this.places = [
      {imgSrc: 'assets/images/senegal.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"senegal"},
      {imgSrc: 'assets/images/cote_d_ivoire.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"cote d\'ivoire"},
      {imgSrc: 'assets/images/mali.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"mali"},
      {imgSrc: 'assets/images/burkina.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"burkina faso"},
      {imgSrc: 'assets/images/benin.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Bénin"},
      {imgSrc: 'assets/images/guinnee_bissau.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"guinnée bissau"},
      {imgSrc: 'assets/images/niger.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Niger"},
      {imgSrc: 'assets/images/togo.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Togo"},
     
  ]
  }
  getFrais(montant){
    let frais = 0 ;

    if(montant>=1 && montant <=1000000)
      frais =  1000 ;

    if(montant>=1000001 && montant <=2000000)
      frais =  2000 ;

    if(montant>=2000001 && montant <=3000000)
      frais =  3000 ;
    return frais ;
  }

}
