import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';

@Component({
  selector: 'app-rapido',
  templateUrl: './rapido.component.html',
  styleUrls: ['./rapido.component.scss']
})
export class RapidoComponent implements OnInit {

  numclient:string;
  badge:string;
  montant:string;
  errorTel:boolean =false;
  errorBadge:boolean = false;
  errorMontant:boolean = false;
  reinitialiser(){
    this.numclient = null;
    this.badge = null;
    this.montant = null;
    this.errorTel =false;
    this.errorBadge = false;
    this.errorMontant = false;
  }
  @ViewChild('modalrapido') public modalrapido:ModalDirective;

  showmodalrapido(){

    let cpt = this.numclient.split("");

    if(this.verifCompteur(this.numclient.toString()) && cpt.length == 9 &&parseInt(this.montant) >= 1 && this.verifCompteur(this.montant.toString()) && this.verifCompteur(this.badge.toString())){
      this.modalrapido.show();
    }else{
     
      if(!this.verifCompteur(this.numclient.toString()) || cpt.length != 9){
        console.log("comteur bi bakhoule");
        this.errorTel = true;
      }
      if(!this.verifCompteur(this.montant.toString()) || parseInt(this.montant) < 1){
        console.log("montant bi bakhoule");
        this.errorMontant =true;
      }
      if(!this.verifCompteur(this.badge.toString()) || this.badge ==""|| this.badge ==null){
        console.log("montant bi bakhoule");
        this.errorBadge =true;
      }
    }
  }

  validerrapido(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'rapido','operateur':8,'operation':2,'montant':this.montant,'badge':this.badge,'numclient':this.numclient};
    this.dataService.sendData(object)
     this.hidemodalrapido()  
     this.dataService.clearData();
     this.reinitialiser();
   }
  hidemodalrapido(){
    this.modalrapido.hide();
    
  }
  constructor(private dataService:SendDataService) { }

  ngOnInit() {
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
  verifCompteur(compteur:string){
    let compt=compteur.split("");
    if(compteur!="" && compteur!=undefined){
      for(let i=0;i<compt.length;i++){
        if(!this.isNumber(compt[i])){
          return false;
         }
        }
          return true;
    }else{
      return false;
    }

  }

}
