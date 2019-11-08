import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SendDataService } from 'src/app/service/send-data.service';
import { WizallService } from 'src/app/service/wizall.service';

@Component({
  selector: 'app-wizall',
  templateUrl: './wizall.component.html',
  styleUrls: ['./wizall.component.scss']
})
export class WizallComponent implements OnInit {

  operation:string;
  errornumero:boolean=false;
  errormontant:boolean=false;
  num:string;
  mtt:string;
  fraisDepot: number = 0 ;
  montantNet:number = 0;
  codebon:string;
  messageretraitcash:boolean=false;
  errorverifcode:boolean=false;
  messageretraitcasherror:boolean=false;
  messagesecondcode:boolean=false;
  donneeretraitbon:any
  validerfirst:boolean;
  validersecond:boolean;
  prenomE:string;
  nomE:string;
  telE:string;
  prenomB:string;
  nomB:string;
  telB:string;
  montant:string;
  reinitialiser(){
    this.prenomE=undefined;
    this.nomE=undefined;
    this.telE=undefined;
    this.prenomB=undefined;
    this.nomB=undefined;
    this.telB=undefined;
    this.montant=undefined;
    this.donneeretraitbon=undefined;
    this.codebon = undefined;
    this.errormontant = false;
    this.errornumero = false;
    this.messageretraitcash = false;
    this.errorverifcode = false;
    this.messageretraitcasherror = false;
    this.messagesecondcode = false;
    this.validerfirst = false;
    this.validersecond = false;
    this.num = undefined;
    this.mtt = undefined;
    this.fraisDepot = 0;
    this.montantNet = 0;
  }
  @ViewChild('addChildModal') public addChildModal:ModalDirective;
  @ViewChild('modalfraiscashin') public modalfraiscashin:ModalDirective;
  @ViewChild('modalretraitbon') public modalretraitbon:ModalDirective;


  public showmodalretraitbon(){
   // this.messageretraitcash=false;
    //this.messageretraitcasherror=false;
    //this.errorverifcode=false;
    this.modalretraitbon.show();
    //if(this.codebon!="" && this.codebon!=undefined){
      //if(this.codebon == "1234ABCD4321"){
        //this.validerfirst = true;
        //this.prenomE="Abdoul Hamid";
        //this.nomE="DIALLO";
        //this.telE="221779854080";
        //this.prenomB="Naby";
        //this.nomB="NDIAYE";
        //this.telB="221772220594";
        //this.montant="300000";
      //}else{
        //this.errorverifcode = false;
      //}
      
      /*this._wizallService.verifier_code_retraitbon(this.codebon).then(data => {
        if(typeof data !== 'object') {
          this.errorverifcode=true;
          this.messageretraitcasherror=false;
        }
        else if(data.status=="valid"){
          this.errorverifcode=false;
          this.donneeretraitbon=data;
          this.prenomE=this.donneeretraitbon.customer.first_name;
          this.nomE=this.donneeretraitbon.customer.last_name;
          this.telE=this.donneeretraitbon.customer.phone_number;
          this.prenomB=this.donneeretraitbon.recipient.first_name;
          this.nomB=this.donneeretraitbon.recipient.last_name;
          this.telB=this.donneeretraitbon.recipient.phone_number;
          this.montant=this.donneeretraitbon.value;
          this.validerfirst=true;
          this.validersecond=false;
          this.modalretraitbon.show();
        }
        else{
          this.errorverifcode=true;
          this.messageretraitcasherror=false;
        }
      }).catch(response => {
        console.log(response);
        this.errorverifcode=true;
        this.messageretraitcasherror=false;
      });*/
    //}
  }

  public hidemodalretraitbon(){
    this.modalretraitbon.hide();
    this.reinitialiser();
  }
  public showAddChildModal():void {
    this.addChildModal.show();
  }

  public hideAddChildModal():void {
    this.addChildModal.hide();
  }
  public showmodalfraiscashin(){
    this.modalfraiscashin.show();
  }
  public fermermodalfraiscashin(){
    this.modalfraiscashin.hide();
  }
  typePiece =[{name:"carte d'identité nationnal"},
  {name:"passport"},
  ]
  nationnalite =[{name:"senegalaise"},
 
  ]
  loadOperation(op){
    this.operation=op;
  }

  retirer(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'Wizall retrait','operateur':6,'operation':2,'montant':this.mtt,
   'num':this.num};
    this.dataService.sendData(object)
     this.hideAddChildModal()  
     this.dataService.clearData();
     this.reinitialiser();
   }
  deposer(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'Wizall dépot','operateur':6,'operation':1,'montant':this.montantNet,
   'num':this.num};
    this.dataService.sendData(object)
     this.hideAddChildModal()  
     this.dataService.clearData();
     this.reinitialiser();
   }
   verifiersaisieRetrait(){
    
    if( this.verif_phone_number(this.num) &&  this.num!=""&& this.verif_montant(this.mtt) == true && this.mtt!="" && this.num!="766003601" ){
      this.showAddChildModal();
    }
    if(this.verif_phone_number(this.num)==false ||  this.num=="" || this.num=="766003601"){
      this.errornumero = true;
    }
    if(this.verif_montant(this.mtt)==false || this.mtt=="" ){
      this.errormontant= true;
    }
  }
  verifiersaisie(){
    
    if( this.verif_phone_number(this.num) &&  this.num!=""&& this.verif_montant(this.mtt) == true && this.mtt!=""){
      this.fraisDepot = this.getFrais(this.mtt);
      this.montantNet = parseInt(this.mtt) + this.fraisDepot;
      this.showAddChildModal();
    }
    if(this.verif_phone_number(this.num)==false ||  this.num==""){
      this.errornumero = true;
    }
    if(this.verif_montant(this.mtt)==false || this.mtt==""){
      this.errormontant= true;
    }
  }
  constructor(private dataService:SendDataService,private _wizallService:WizallService) { }

  ngOnInit() {
  }
  verif_phone_number(number:string):boolean{
    if(number == null || number == ""){
      return false;
    }
    let numero=number.split("");
    //console.log(numero.length);
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
  getFrais(montant){
    let frais = 0 ;

    if(montant>=1 && montant <=499)
      frais =  25 ;

    if(montant>=500 && montant <=1100)
      frais =  60 ;

    if(montant>=1101 && montant <=3000)
      frais =  150 ;

    if(montant>=3001 && montant <=5000)
      frais =  200 ;

    if(montant>=5001 && montant <=10000)
      frais =  400 ;

    if(montant>=10001 && montant <=15000)
      frais =  600 ;
    if(montant>=15001 && montant <=20000)
      frais =  800 ;
    if(montant>=20001 && montant <=35000)
      frais =  1400 ;
    if(montant>=35001 && montant <=60000)
      frais =  2400 ;
    if(montant>=60001 && montant <=75000)
      frais =  2625 ;
    if(montant>=75001 && montant <=100000)
      frais =  3100 ;
    if(montant>=100001 && montant <=150000)
      frais =  4000 ;
    if(montant>=150001 && montant <=200000)
      frais =  6000 ;
    if(montant>=200001 && montant <=300000)
      frais =  7500 ;
    if(montant>=300001 && montant <=400000)
      frais =  10000 ;
    if(montant>=400001 && montant <=750000)
      frais =  14000 ;
    if(montant>=750001 && montant <=1000000)
      frais =  montant*0.018 ;

    return frais ;
  }

  getFraisTransfert(montant){
    let frais = 0 ;

    if(montant>=2000 && montant <=3049)
      frais =  200 ;

    if(montant>=3050 && montant <=5049)
      frais =  400 ;

    if(montant>=5050 && montant <=10049)
      frais =  700 ;

    if(montant>=10050 && montant <=15049)
      frais =  1100 ;

    if(montant>=15050 && montant <=20049)
      frais =  1300 ;

    if(montant>=20050 && montant <=25049)
      frais =  1500 ;

    if(montant>=25050 && montant <=35049)
      frais =  1700 ;

    if(montant>=35050 && montant <=50049)
      frais =  1800 ;

    if(montant>=50050 && montant <=60049)
      frais =  2300 ;

    if(montant>=60050 && montant <=75049)
      frais =  2700 ;

    if(montant>=75050 && montant <=100049)
      frais =  3200 ;

    if(montant>=100050 && montant <=125049)
      frais =  3600 ;

    if(montant>=125050 && montant <=150049)
      frais =  4000 ;

    if(montant>=150050 && montant <=200049)
      frais =  4800 ;

    if(montant>=200050 && montant <=250049)
      frais =  6350 ;

    if(montant>=250050 && montant <=300049)
      frais =  8050 ;

    if(montant>=300050 && montant <=350049)
      frais =  8450 ;

    if(montant>=350050 && montant <=400049)
      frais =  9750 ;

    if(montant>=400050 && montant <=600049)
      frais =  11850 ;

    if(montant>=600050 && montant <=750049)
      frais =  13550 ;

    if(montant>=750050 && montant <=1000000)
      frais =  21650 ;

    return frais ;
  }

  nombreFormate(montant){
    return Number( montant.split(".")[0] ).toLocaleString() ;
  }

  nombreEntier(montant){
    return Number( montant ) ;
  }
}
