import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';

@Component({
  selector: 'app-woyofal',
  templateUrl: './woyofal.component.html',
  styleUrls: ['./woyofal.component.scss']
})
export class WoyofalComponent implements OnInit {

  compteur:string;
  montant:string;
  errorCompteur:boolean =false;
  errorMontant:boolean =false;

  reinitialiser(){
    this.compteur= null;
    this.montant = null;
    this.errorCompteur =false;
    this.errorMontant =false;
  }
  

  @ViewChild('modalwoyofal') public modalwoyofal:ModalDirective;

  showmodalwoyofal(){
    let cpt = this.compteur.split("");

    if(this.verifCompteur(this.compteur.toString()) && cpt.length == 11 &&parseInt(this.montant) >= 1000 && this.verifCompteur(this.montant.toString())){
      this.modalwoyofal.show();
    }else{
     
      if(!this.verifCompteur(this.compteur.toString()) || cpt.length != 11){
        console.log("comteur bi bakhoule");
        this.errorCompteur = true;
      }
      if(!this.verifCompteur(this.montant.toString()) || parseInt(this.montant) < 1000){
        console.log("montant bi bakhoule");
        this.errorMontant =true;
      }
    }
  }
  hidemodalwoyofal(){
    this.modalwoyofal.hide();
   
  }
  validerwoyofal(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'WOYOFAL','operateur':8,'operation':3,'montant':this.montant.toString(),
    'compteur':this.compteur,'telephone':''};
    this.dataService.sendData(object)
     this.hidemodalwoyofal()  
     this.dataService.clearData();
     this.reinitialiser();
   }
  constructor(private dataService:SendDataService) { }

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
  ngOnInit() {
  }

}
