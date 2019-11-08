import { Component, OnInit, ViewChild } from '@angular/core';
import { MasterServiceService } from 'src/app/service/master-service.service';
import { SendDataService } from 'src/app/service/send-data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-e-money',
  templateUrl: './e-money.component.html',
  styleUrls: ['./e-money.component.scss']
})
export class EMoneyComponent implements OnInit {

  num:string;
  mtt:string;
  coderetrait:string;
  prenom:string;
  nom:string;
  datenaissance:string;
  numpiece:string;
  bcoderetrait:boolean=false;
  bprenom:boolean=false;
  bnom:boolean=false;
  bdatenaissance:boolean=false;
  bnumpiece:boolean=false;
  errorNum:boolean=false;
  errormtt:boolean=false;
  reinitialiser(){
    this.num=null;
    this.mtt=null;
    this.coderetrait=null;
    this.prenom=null;
    this.nom=null;
    this.datenaissance=null;
    this.numpiece=null;
    this.bcoderetrait=false;
    this.bprenom=false;
    this.bnom=false;
    this.bdatenaissance=false;
    this.bnumpiece=false;
    this.errorNum = false;
    this.errormtt = false;
  }
  @ViewChild('addChildModal') public addChildModal:ModalDirective;
 


  public showAddChildModal():void {
    this.addChildModal.show();
  }

  public hideAddChildModal():void {
    this.addChildModal.hide();
  }

  retirerAvecCode(){
    let tab1=this.prenom.split(" ");
    let prenom="";
    let tab2=this.nom.split(" ");
    let nom="";
    for(let i=0;i<tab1.length;i++){
      prenom+=tab1[i].trim();
    }
    for(let j=0;j<tab2.length;j++){
      nom+=tab2[j].trim();
    }
    let object ={'nom':'Orange money retrait avec code','operateur':2,'operation':3,
    'coderetrait':this.coderetrait,'prenom':prenom,'nomclient':nom,
    'num':this.num,'date':this.datenaissance,'cni':this.numpiece,'montant':this.mtt};
     this.dataService.sendData(object)
      this.hideAddChildModal()      
      this.dataService.clearData();
      this.reinitialiser();
  } 
  ventecreditOM(){
    let object ={'nom':'Orange money retrait','operateur':2,'operation':5,'montant':this.mtt,
    'num':this.num};
     this.dataService.sendData(object)
      this.hideAddChildModal()      
      this.dataService.clearData();
      this.reinitialiser();
  }
  retirer(){
    let object ={'nom':'E-Money retrait','operateur':7,'operation':2,'numclient':this.num,'mnt':this.mtt};
     this.dataService.sendData(object)
      this.hideAddChildModal()      
      this.dataService.clearData();
      this.reinitialiser();
  }
  verifiersaisieretraitCode(){
    if(this.coderetrait !=undefined && this.coderetrait !="" &&
    this.prenom !=undefined && this.prenom !="" &&
    this.nom !=undefined && this.nom !="" &&
    this.datenaissance !=undefined && this.datenaissance !="" &&
    this.numpiece !=undefined && this.numpiece !="" &&
    this.verif_date(this.datenaissance)&& this.verif_cni(this.numpiece) &&this.verif_phone_number(this.num) &&  this.num!=""&& this.verif_montant(this.mtt) && this.mtt!=""){
      this.showAddChildModal()
    }
    if(this.coderetrait ==undefined || this.coderetrait ==""){
      this.bcoderetrait =true;
    }
    if(this.prenom ==undefined || this.prenom ==""){
      this.bprenom =true;
    }
    if(this.nom ==undefined || this.nom ==""){
      this.bnom =true;
    }
    if(this.datenaissance ==undefined || this.datenaissance =="" || !this.verif_date(this.datenaissance)){
      this.bdatenaissance =true;
    }
    if(this.numpiece ==undefined || this.numpiece =="" || !this.verif_cni(this.numpiece)){
      this.bnumpiece =true;
    }
    if(this.verif_phone_number(this.num)==false ||  this.num==""){
      this.errorNum = true;
    }
    if(this.verif_montant(this.mtt)==false || this.mtt==""){
      this.errormtt= true;
    }
  }
  verifiersaisie(){
    if( this.verif_phone_number(this.num) &&  this.num!=""&& this.verif_montant(this.mtt) && this.mtt!=""){
      this.showAddChildModal()
    }
    if(this.verif_phone_number(this.num)==false ||  this.num==""){
      this.errorNum = true;
    }
    if(this.verif_montant(this.mtt)==false || this.mtt==""){
      this.errormtt= true;
    }
  }
  deposer(){
    
   // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
  let object ={'nom':'E-Money depot','operateur':7,'operation':1,'numclient':this.num,'mnt':this.mtt};
   this.dataService.sendData(object)
    this.hideAddChildModal()  
    this.dataService.clearData();
    this.reinitialiser();
  }
  operation:string;

  loadOperation(op){
    this.operation=op;
  }
  constructor(private dataService:SendDataService, private _masterService:MasterServiceService,) {

  }
  

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
  verif_date(date:string):boolean{
    let dat=date.split("");
    if(date.length==8){
      for(let i=0;i<date.length;i++){
        if(!this.isNumber(date[i])){
          return false;
        }
      }
      return true;
    }else{
      return false;
    }
  }
  verif_cni(cni:string):boolean{
    let Cni=cni.split("");
    if(Cni.length==13 && (Cni[0]=="1" || Cni[0]=="2") ){
      for(let i=0;i<Cni.length;i++){
        if(!this.isNumber(Cni[i])){
          return false;
        }
      }
      return true;

    }else{
      return false;
    }

  }

}
