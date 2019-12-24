import { Component, OnInit, ViewChild } from '@angular/core';
import { TransfertInternatinnalService } from 'src/app/service/transfert-internatinnal.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';
@Component({
  selector: 'app-money-exchange',
  templateUrl: './money-exchange.component.html',
  styleUrls: ['./money-exchange.component.scss']
})
export class MoneyExchangeComponent implements OnInit {

  codeRetrait:string;
  etapeEnvoie:number=1;
  operation:string;
  typeEnvoie:string ="";
  num_card:string;
  type_piece:string;
  errorverifcode:boolean = false;
  validerfirst:boolean = false;
  validersecond:boolean = false;
  modalLoader:boolean = false;
  data:any;
  suivant:boolean = false;
  prenomB:string;
  nomB:string;
  montant:string;
  errorMessage:string;
  correspondant:string;

  indicePaysSender:any;
  indicePaysReceiver:any;
  pays_emet:string;
  pays_benef:string;
  frais:number ;
  montantNet:number ;
  reinitialiser(){
    this.etapeEnvoie = 1;
    this.montantNet =0
    this.frais = 0
    this.indicePaysSender = undefined;
    this.indicePaysReceiver = undefined;
    this.pays_emet = undefined;
    this.pays_benef = undefined;
    
    this.correspondant = undefined;
    this.modalLoader = false;
    this.errorMessage = undefined;
    this.suivant = false;
    this.errorverifcode = false;
    this.validersecond = false;
    this.validerfirst = false;
    this.codeRetrait = undefined;
    this.data = undefined;
    this.num_card = undefined;
    this.type_piece = undefined;
    this.prenomB = undefined;
    this.nomB = undefined;
    this.montant = undefined;
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
  loadOperation(op){
    this.operation=op;
    this.typeEnvoie = "";
    this.etapeEnvoie =1;
  }
  next(){
    this.etapeEnvoie = this.etapeEnvoie +1;
  }
  back(){
    this.etapeEnvoie = this.etapeEnvoie -1;
  }
  @ViewChild('modalretraitbonachat') public modalretraitbonachat:ModalDirective;
  @ViewChild('modalretrait') public modalretrait:ModalDirective;
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
  public showmodalretrait(){
    this.modalretrait.show();
    this.hidemodalretraitbonachat();
  }

  public hidemodalretrait(){
   
    this.num_card = "";
    this.type_piece = "";
    this.validersecond = false;
    this.modalretrait.hide();
  } 
  public showmodalretraitbonachat(){
    this.modalretraitbonachat.show();
  }

  public hidemodalretraitbonachat(){
    this.modalretraitbonachat.hide();
    
  }
  recherche(){
    this.showmodalretraitbonachat();
    this.modalLoader = true;
    this._transfertIService.initSession().then(res =>{
      console.log(res);
     // console.log(JSON.parse(res['_body']));
      this.correspondant =  JSON.parse(res['_body']).correspondant;
      this._transfertIService.searchByCode(this.codeRetrait,this.correspondant).then(res=>{
        console.log(res);
        let rep  = JSON.parse(res['_body']);
        console.log(rep);

        if(res['_body'].includes("{\"success\"")){
          this.errorverifcode = true;
          this.errorMessage = rep.designationstatus;
          this.modalLoader = false;
        }else{
          this.data = rep[0];
          this.prenomB = this.data.prenom_benef
          this.nomB = this.data.nom_benef
          this.montant = this.data.montant_paye
          console.log(this.data);
          this.validerfirst =true;
          this.modalLoader = false;
        }
       
      });
      //this.validerfirst =true;
    });
  }
  retirer(){
    let tp ;
    if(this.type_piece == "Carte d'identité"){
      tp = 'CI'
    }
    if(this.type_piece == "passport"){
      tp = 'PT'
    }

    let object ={'nom':'Money-exchange retrait','operateur':11,'operation':1,'nom_benef':this.data.nom_benef,'prenom_benef':this.data.prenom_benef,
    'noTransaction':this.data.NumeroTransaction,'codeTransation':this.data.codeTransaction,
    'montant_payer':this.data.montant_paye,
    'typepiece':this.type_piece ,'numeropiece':this.num_card,'correspondant':this.correspondant};
    console.log(JSON.stringify(object));
    
    this.dataService.sendData(object)
    this.hidemodalretrait();  
    this.dataService.clearData();
    this.reinitialiser();
  }
  valider_code(){
    this.validersecond = true;
    this.suivant = true;
  }
  nombreFormate(montant){
    return Number( montant.split(".")[0] ).toLocaleString() ;
  }
  nombreFormate1(montant){
    return Number(montant).toLocaleString() ;
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
     this.envoie.compteacrediter = "SN144-12345-123456789012-12";
     this.envoie.banqueacrediter = "BRM";
     //this.envoie.montant_emis =pa parseInt(this.envoie.montant_emis) + this.frais
     this.envoie.produit = "010";
     console.log(JSON.stringify(this.envoie));
     let object ={'nom':'Money-exchange envoie','operateur':11,'operation':2,'info':this.envoie};
     console.log(JSON.stringify(object));
     
     this.dataService.sendData(object)
     this.hidemodalenvoie();  
     this.dataService.clearData();
     this.reinitialiser();
 
  }


  constructor(private _transfertIService:TransfertInternatinnalService,private dataService:SendDataService) { }
  listPays :any =[];
  
  ngOnInit() {
    //var require:any
   var countries = require('country-data').countries;
   this.listPays = countries.all;
  //  console.log(countries);o
//    console.log(this.listPays);
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
