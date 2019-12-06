import { Component, OnInit, ViewChild } from '@angular/core';
import { TntService } from 'src/app/service/tnt.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';

@Component({
  selector: 'app-tnt',
  templateUrl: './tnt.component.html',
  styleUrls: ['./tnt.component.scss']
})
export class TntComponent implements OnInit {

  token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;

  operation:string;
  chearch:boolean =false;
  verifierNumInput:string ;
  noma:string;
  prenoma:string;
  telNewClient:string;
  chip:string;
  carte:string;
  tbouquet:string;
  loading:boolean =false;
  montantNet:number = 0 ;
  nombreMois :number = 0 ;

  prenomNewClient : string ;
  nomNewClient: string ;
  adresseNewClient: string ;
  regionNewClient: string ;
  cniNewClient: string ;
  nchipNewClient: number ;
  ncarteNewClient: number ;
  nbmNewClient: number;
  tbouquetNewClient : string = 'Sans Abonnement';
  reinitialiser(){
    this.prenomNewClient =undefined ;
    this.nomNewClient=undefined ;
    this.telNewClient=undefined ;
    this.adresseNewClient=undefined ;
    this.regionNewClient=undefined ;
    this.cniNewClient=undefined ;
    this.nchipNewClient=undefined ;
    this.ncarteNewClient=undefined ;
    this.nbmNewClient=undefined;
    this.tbouquetNewClient=undefined ;
    this.chearch = false;
    this.verifierNumInput =null;
    this.noma =null;
    this.prenoma =null;
    this.telNewClient =null;
    this.chip =null;
    this.carte =null;
    this.tbouquet =null;
    this.loading = false;
    this.montantNet = 0;
    this.nombreMois = 0;
  }
  getMontant(){
    if(this.tbouquet == "Maanaa")
    this.montantNet = 5000 * this.nombreMois;
    if(this.tbouquet == "Boul khool")
    this.montantNet = 3000 * this.nombreMois;
    if(this.tbouquet == "Maanaa + Boul khool")
    this.montantNet = 8000 * this.nombreMois;
  }
  type =[
    {name:"Sans abonnement"},
    {name:"+1 mois"},
    {name:"+3 mois"},
  ]
  typeBouquet =[
    {name:"Maanaa"},
    {name:"Boul khool"},
    {name:"Maanaa + Boul khool"},
  ]
  validVerifierNum(){
    this.loading = true ;
    //this.erreur = false ;
    console.log(this.verifierNumInput);
    this.tntCaller.checkNumber(this.verifierNumInput.toString()).then( response => {
       // this.singleTntWS = response ;
        console.log(JSON.parse(response['_body']));
        let rep = JSON.parse(response['_body'])
        console.log(rep.nom,rep.prenom,rep.tel,rep.n_chip);
        console.log(response);
        console.log(JSON.parse(rep));

        this.chearch = true;
        this.noma = JSON.parse(rep).nom ;
        this.prenoma = JSON.parse(rep).prenom ;
        this.telNewClient =JSON.parse(rep).tel;
        this.chip = JSON.parse(rep).n_chip ;
        this.carte = JSON.parse(rep).n_carte ;
        //this.cni = rep.cni;

        if (JSON.parse(rep).id_typeabonnement=="1")
          this.tbouquet = "Maanaa";
        if (JSON.parse(rep).id_typeabonnement=="2")
          this.tbouquet = "Boul Khool";
        if (JSON.parse(rep).id_typeabonnement=="3")
          this.tbouquet = "Maanaa + Boul Khool";

        //this.verifierNumValide = true;
        //this.verifierNumInputValide = false;

        this.loading = false ;
    });
    //sessionStorage.removeItem('dataImpression');
  }

  @ViewChild('modalabonnement') modalabonnement: ModalDirective;
  public showmodalabonnement(){
    this.modalabonnement.show();
   }
  abonnement(){
    this.modalabonnement.hide();
    var typedebouquet : number ;
    if(this.tbouquet == "Maanaa")
      typedebouquet=1;
    if(this.tbouquet == "Boul khool")
      typedebouquet=2;
    if(this.tbouquet == "Maanaa + Boul khool")
      typedebouquet=3;
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'token':this.token,'nom':'Tnt abonnement','operateur':4,'operation':1,'typedebouquet':typedebouquet,'tel':this.telNewClient,
   'chip':this.chip,'carte':this.carte,
   'prenom':this.prenoma,'nomclient':this.noma,'duree':this.nombreMois,'cni':''};
    this.dataService.sendData(object)
     this.dataService.clearData();
     this.reinitialiser();
   }
   vendreDecodeur(){
    this.modalabonnement.hide();
    var typedebouquet : number ;
    var prix:number ;
    if(this.tbouquetNewClient == "Sans Abonnement"){
      typedebouquet=0;
      prix = 15000 ;
    }
    if(this.tbouquetNewClient == "+ 1 Mois"){
      typedebouquet=1;
      prix = 19500 ;
    }
    if(this.tbouquetNewClient == "+ 3 Mois"){
      typedebouquet=3;
      prix = 28000 ;
    }
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'token':this.token,'nom':'Tnt vente decodeur','operateur':4,'operation':2,
   'prenom':this.prenomNewClient,'tel':this.telNewClient,adresse:this.adresseNewClient, region:this.regionNewClient, cni:this.cniNewClient,'chip':this.nchipNewClient,
   'carte':this.ncarteNewClient,'nomclient':this.nomNewClient,'typedebouquet':typedebouquet,'montant':prix};
    this.dataService.sendData(object)
     this.dataService.clearData();
     this.reinitialiser();
   }
  loadOperation(op){
    this.operation=op;
  }
  constructor(private tntCaller:TntService,private dataService:SendDataService) { }

  ngOnInit() {
  }

}
