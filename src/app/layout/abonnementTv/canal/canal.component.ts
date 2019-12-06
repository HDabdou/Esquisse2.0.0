import { Component, OnInit, ViewChild } from '@angular/core';
import { CanalService } from 'src/app/service/canal.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';

@Component({
  selector: 'app-canal',
  templateUrl: './canal.component.html',
  styleUrls: ['./canal.component.scss']
})
export class CanalComponent implements OnInit {

  etapeRecructement:number=1;
  operation:string;
  chearch:boolean =false;
  numAb:any;
  nomAb:any;
  prenomAb:any;
  telAb:any;
  formuleAb:any;
  matAb:any;
  abonnerFound:any
  reachAbonne:string;
  tntloading:boolean =false;
  montantNet:number = 0
  Bouquet:string
  prixCharme:number 
  prixPVD:number 
  prix2Ecran:number 
  nombreMois:number = 0;
  deuxiemeEcran:string ="";
  pvr:string ="";
  charme:string = "";
  titre:string = "";
  cni:string = "";
  ville:string = "";
  numDec:string = "";
  adresse:string = "";
  mail:string = "";
  tel:string = "";
  errorCheach:boolean = false;
  reinitialiser(){
    this.errorCheach = false;
    this.deuxiemeEcran ="";
    this.pvr ="";
    this.charme = ""; 

    this.titre ="";
    this.cni ="";
    this.ville = "";   
     this.numDec ="";
    this.adresse ="";
    this.mail = "";
    this.tel = "";
    this.montantNet = 0
    this.Bouquet =null
    this.prixCharme = 0
    this.prixPVD = 0
    this.prix2Ecran = 0
    this.nombreMois = 0
   // this.tntloading =false;
    this.chearch =false;
    this.numAb=null;
    this.nomAb=null;
    this.prenomAb=null;
    this.telAb=null;
    this.formuleAb=null;
    this.matAb=null;
    this.reachAbonne=null;
    this.abonnerFound=null;
  }

  @ViewChild('reabonnement') public reabonnement:ModalDirective;
  @ViewChild('recrutement') public recrutement:ModalDirective;
  
  showmodalreabonnement(){
    this.reabonnement.show();
  }
  showmodalrecrutement(){
    this.recrutement.show();
  }
 
  hidereabonnement(){
    this.reabonnement.hide();
  }
  hiderecrutement(){
    this.recrutement.hide();
  }


  getMontant(){
   /* {name:"Date à date Access"},
    {name:"Date à date Evasion"},
    {name:"Date à date ESSENTIEL Plus"},
    {name:"Date à date Les Chaines Canal + Evasion"},
    {name:"Date à date Tous Canal Plus"},*/
    this.montantNet = 0;
    if(this.Bouquet == 'Date à date Access'){ 
      this.montantNet = this.montantNet + 5000 + this.prixCharme;
    }else if(this.Bouquet == 'Date à date Evasion')  {
      this.montantNet = this.montantNet + 10000 + this.prixCharme + this.prixPVD + this.prix2Ecran;
    }else if(this.Bouquet == 'Date à date ESSENTIEL Plus')  {
      this.montantNet = this.montantNet + 12000 + this.prixCharme + this.prixPVD + this.prix2Ecran;
    }else if(this.Bouquet == 'Date à date Les Chaines canal+  Access')  {
      this.montantNet = this.montantNet + 15000 + this.prixCharme + this.prixPVD + this.prix2Ecran;
    }else if(this.Bouquet == 'Date à date Les Chaines Canal + Evasion')  {
      this.montantNet = this.montantNet + 20000 + this.prixCharme + this.prixPVD + this.prix2Ecran;
    }else if(this.Bouquet == 'Date à date Tous Canal Plus')  {
      this.montantNet = this.montantNet + 40000 + this.prixCharme + this.prixPVD + this.prix2Ecran;
    }
    this.montantNet = this.montantNet * this.nombreMois;

  }
  rechercher(){
    this.chearch = false;
    this.errorCheach = false
    this._canal.recherche(this.reachAbonne.toString()).then(res =>{
      let numFile = res['_body'].trim();
      console.log(res['_body']);
      this.tntloading =true;
     // this.loading=true;
      let periodicVerifier = setInterval(()=> this._canal.resultRecherche(numFile).then(res =>{ 

      let result=res['_body'].trim();

      if(result.indexOf("-1")!=0 && result.trim() != ""){
        clearInterval(periodicVerifier) ;
        console.log("Resultat de la rechercher : "); 
        console.log(result);

        this.numAb = result.split('[')[0];
        this.nomAb = result.split('[')[2];
        this.prenomAb = result.split('[')[3];
        this.numAb ; //this.telAb = result.split('[')[7];
        this.formuleAb = result.split('[')[8];
        this.matAb = result.split('[')[11];
        this.tntloading = false;
       // this.loading=false;
        this.errorCheach = false;
       this.chearch = true;
      }else{
        //this.tntloading = false;
        //this.errorCheach = true;
      }

    }), 2000);
    }).catch ( () => {
      this.chearch = false;
      this.tntloading=false;
       console.log("probleme !!!!");
       
     }); 
   
  }
  recructement(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'canal plus recrutement','operateur':12,'operation':2, 'nomclient': +this.nomAb,
    'prenom' : +this.prenomAb, 'tel': this.tel, 'numAbo': this.numAb, 'numDec' : this.matAb,
     'numCarte' : this.matAb, 'formule': this.Bouquet,
    'montant' : this.montantNet, 'nbreMois' : this.nombreMois, 'charme' : '', 'pvd' : '', 'ecranII' : ''};
    console.log(object);
    this.dataService.sendData(object)
     this.hidereabonnement()  
     this.dataService.clearData();
     this.reinitialiser();
  }
  abonnement(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'canal plus réabonnment','operateur':12,'operation':1, 'nomclient': this.nomAb, 'prenom' : this.prenomAb,
    'tel': '', 'numAbo': this.numAb, 'numDec' : '', 'numCarte' : this.matAb,
     'formule': this.Bouquet, 'montant' : this.montantNet, 'nbreMois' : this.nombreMois,
    'charme' : this.charme, 'pvd' : this.pvr, 'ecranII' : this.deuxiemeEcran};
    this.dataService.sendData(object)
     this.hidereabonnement()  
     this.dataService.clearData();
     this.reinitialiser();
   }

  Titre= [
    {name:"Monsieur"},
    {name:"Madame"},
    {name:"Mademoiselle"},
    {name:"Société"},
  ]
  bouquet2 =[
    {name:"Date à date Evasion"},
    {name:"Date à date ESSENTIEL Plus"},
    {name:"Date à date Les Chaines Canal + Evasion"},
    {name:"Date à date Tous Canal Plus"},
  ]
  bouquet1=[
    {name:"Date à date Access"},
    {name:"Date à date Evasion"},
    {name:"Date à date ESSENTIEL Plus"},
    {name:"Date à date Les Chaines Canal + Evasion"},
    {name:"Date à date Tous Canal Plus"},
  ]
  getCharme(){
    if(this.prixCharme == 0){
     this.prixCharme = 6000;
     this.charme ='charme';
    }else if(this.prixCharme != 0){
     this.prixCharme = 0;
     this.charme ="";
    }
    this.getMontant();
 }
 getPVD(){
    if(this.prixPVD == 0){
      this.prixPVD = 5000;
      this.pvr ='PVD';
    }else  if(this.prixPVD != 0){
      this.prixPVD = 0;
      this.pvr ="";
      }
    this.getMontant();
  }
  get2EECRAN(){
    if(this.prix2Ecran == 0){
      this.prix2Ecran = 6000;
      this.deuxiemeEcran ='2E ECRAN';
    }else if(this.prix2Ecran != 0){
      this.prix2Ecran = 0;
      this.deuxiemeEcran ="";
    }
    this.getMontant();
  }
  next(){
    this.etapeRecructement = this.etapeRecructement +1;
  }
  back(){
    this.etapeRecructement = this.etapeRecructement -1;
  }
  loadOperation(op){
    this.operation=op;
    this.etapeRecructement=1;
  }
  constructor(private _canal:CanalService,private dataService:SendDataService) { }

  ngOnInit() {
  }

}
