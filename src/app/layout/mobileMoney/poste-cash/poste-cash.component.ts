import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';
import { PosteCashService } from 'src/app/service/poste-cash.service';

@Component({
  selector: 'app-poste-cash',
  templateUrl: './poste-cash.component.html',
  styleUrls: ['./poste-cash.component.scss']
})
export class PosteCashComponent implements OnInit {

  operation:string;

  telephone: string ;
  montant:string ;
  compteur:string ;
  nb_carte:string ;
  mt_carte: string ;
  num_facture:string ;
  police:string ;
  erreur:boolean= false ;
  telephonebool:boolean= false ;
  montantbool:boolean= false ;
  mtcartebool:boolean= false ;
  nbcartebool:boolean= false ;
  isselectretraitespeceaveccarte:boolean = false;
  codevalidation:string;
  loading:boolean = false
  codevaliadtion:boolean = false
  errorMessage:string 
  
  reinitialiseRbool(){
    this.telephonebool=false;
    this.montantbool=false;
    this.mtcartebool=false;
    this.nbcartebool=false;
  }
  reinitialiser(){
    this.loading =false
    this.codevaliadtion =false
    this.errorMessage =undefined
    this.telephone = undefined ; 
    this.montant = undefined ;
    this.compteur = undefined ;
    this.nb_carte = undefined ;
    this.mt_carte = undefined ;
    this.num_facture = undefined ;
    this.police = undefined ;
    this.erreur = false ;
    this.isselectretraitespeceaveccarte = false;
    this.codevalidation = undefined;
    this.reinitialiseRbool();
  }
  @ViewChild('rechargementespece') public rechargementespece: ModalDirective;
  @ViewChild('retraitecarte') public retraitecarte: ModalDirective;
  modalretraitcarte(){
    this.retraitecarte.show();
    this.CodeValidation()
  }
  hidemodalretraitcarte(){
    this.retraitecarte.hide();
  }

  modalRechargementEspece(){
    if(this.montant!=undefined && this.montant!="" && this.verif_montant(this.montant)==true && this.telephone!="" && this.telephone!=undefined && this.verif_phone_number(this.telephone)==true){
      this.rechargementespece.show();
    }else{
      if(this.montant=="" || this.montant==undefined || this.verif_montant(this.montant)!=true){
        this.montantbool=true;
      }
      if(this.telephone=="" || this.telephone==undefined || this.verif_phone_number(this.telephone)!=true){
        this.telephonebool=true;
      }
    }
  }
   modalAchatJULA(){
    if(this.montant!=undefined && this.montant!="" && this.verif_montant(this.montant)==true && this.nb_carte!="" && this.nb_carte!=undefined ){
      this.rechargementespece.show();
    }else{
      if(this.montant=="" || this.montant==undefined || this.verif_montant(this.montant)!=true){
        this.mtcartebool=true;
      }
      if(this.telephone=="" || this.telephone==undefined ){
        this.nbcartebool=true;
      }
    }
  }
  hidemodalRechargementEspece(){
    this.rechargementespece.hide();
  }
  validAchatJULA(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'rechargement espece','operateur':1,'operation':1,
   'montant':this.montant,'telephone':this.telephone};
    this.dataService.sendData(object)
     this.hidemodalRechargementEspece()  
     this.dataService.clearData();
     this.reinitialiser();
   }
  validrechargementespece(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'achat jula','operateur':1,'operation':2,'montant':this.montant,'nbcarte':this.nb_carte};
    this.dataService.sendData(object)
     this.hidemodalRechargementEspece()  
     this.dataService.clearData();
     this.reinitialiser();
   }
   validretraitEspece(){
  
  // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
  let object ={'nom':'achat jula','operateur':1,'operation':2,'montant':this.montant,'nbcarte':this.nb_carte};
  this.dataService.sendData(object)
    this.hidemodalRechargementEspece()  
    this.dataService.clearData();
    this.reinitialiser();
  }
  validdebiterCarte(){
  
  // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
  let object ={'nom':'achat jula','operateur':1,'operation':2,'montant':this.montant,'nbcarte':this.nb_carte};
  this.dataService.sendData(object)
    this.hidemodalRechargementEspece()  
    this.dataService.clearData();
    this.reinitialiser();
  }
  CodeValidation(){
    console.log("CodeValidation");
    this.errorMessage =  undefined;
    this.loading = true ;
    this.erreur = false;
    this._postCashService.codeValidation('00221'+this.telephone+'',''+this.montant).then(postcashwebserviceList => {
      this.loading = false ;
      console.log(postcashwebserviceList);
      if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
        this.codevaliadtion = true;
        this.erreur = false ;
      }else{
        this.erreur = true ;
        this.errorMessage = postcashwebserviceList.errorMessage;
      }

    });
  }
  monatntJula =[{name:2000},
  {name:5000},
  {name:10000},
  {name:25000},
]
  loadOperation(op){
    this.operation=op;
  }
  constructor(private dataService:SendDataService,private _postCashService:PosteCashService) { }

  ngOnInit() {
  }

  verif_phone_number(number:string):boolean{
    if(number == null || number == ""){
      return false;
    }
    let numero=number.split("");
    console.log(numero.length);
    if(numero.length!=parseInt("9")){
      return false;
    }
    for(let i=0;i<numero.length;i++){
      if(!this.isNumber(numero[i])){
        return false;
      }
    }
    return true;
  }

  verif_montant(mnt:string):boolean{
    if(mnt == null || mnt == ""){
      return false;
    }
    if(parseInt(mnt)>=1){
      return true;
    }else{
      return false;
    }
  }
  isNumber(num:string):boolean{
    let tab=["0","1","2","3","4","5","6","7","8","9"];
    for(let i=0;i<tab.length;i++){
      if(num===tab[i]){
        return true;
      }
    }
    return false;
  }

}
