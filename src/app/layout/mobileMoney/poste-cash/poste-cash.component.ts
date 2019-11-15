import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';

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
  
  reinitialiseRbool(){
    this.telephonebool=false;
    this.montantbool=false;
    this.mtcartebool=false;
    this.nbcartebool=false;
  }
  reinitialiser(){
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
  hidemodalRechargementEspece(){
    this.rechargementespece.hide();
  }
  validrechargementespece(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'rechargement espece','operateur':1,'operation':1,
   'montant':this.montant,'telephone':this.telephone};
    this.dataService.sendData(object)
     this.hidemodalRechargementEspece()  
     this.dataService.clearData();
     this.reinitialiser();
   }
  monatntJula =[{name:2000},
  {name:5000},
  {name:10000},
  {name:25000},
]
  loadOperation(op){
    this.operation=op;
  }
  constructor(private dataService:SendDataService) { }

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
