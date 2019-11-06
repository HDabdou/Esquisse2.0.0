import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zuulu',
  templateUrl: './zuulu.component.html',
  styleUrls: ['./zuulu.component.scss']
})
export class ZuuluComponent implements OnInit {

  operation:string;
  etapeEnvoie:number=1;
  typeEnvoie:string="";
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
   paiementmode =[
    {name:"Wallet"},
    {name:"Card"}
  ]
  typepiece = [
    {name:"Carte nationnal d'identité"},
    {name:"Passport"},
    {name:"Carte Consulaire"},
  ]
  ville =[
    {name:"Dakar"},
    {name:"Thies"},
    {name:"Mbour"},
    {name:"Kaolak"},
    {name:"Fatik"},
    {name:"Matam"},
    {name:"St-Louis"},
  ]
  pays=[
    {name:"Senegal"},
    {name:"Mali"},
    {name:"France"},
    {name:"Canada"},
    {name:"Itali"},
    {name:"Espagne"},
  ]
  motiftransfert =[
    {name:"Assistance famiiale"},
    {name:"Aide scolaire"},
  ]
 
  constructor() { }

  ngOnInit() {
  }

}
