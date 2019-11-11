import { Component, OnInit, ViewChild } from '@angular/core';
import { SendDataService } from 'src/app/service/send-data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-seddo',
  templateUrl: './seddo.component.html',
  styleUrls: ['./seddo.component.scss']
})
export class SeddoComponent implements OnInit {

  num:string;
  mtt:string;
  errorNum:boolean=false;
  errormtt:boolean=false;
  reinitialiser(){
    this.num=null;
    this.mtt=null;
    this.errorNum = false;
    this.errormtt = false;
  }
  @ViewChild('addChildModal') public addChildModal:ModalDirective;

  verifiersaisie(){
    let tabs = this.num.split("");
    if( this.verif_phone_number(this.num) &&  this.num!=""&& this.verif_montant(this.mtt) && this.mtt!="" ){
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
   let object ={'nom':"izi",'operateur':9,'operation':1,'montant':this.mtt,'numero':this.num};
    this.dataService.sendData(object)
     this.hideAddChildModal()  
     this.dataService.clearData();
     this.reinitialiser();

   }
  public showAddChildModal():void {
    this.addChildModal.show();
  }

  public hideAddChildModal():void {
    this.addChildModal.hide();
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
    if(parseInt(mnt)>=100){
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
