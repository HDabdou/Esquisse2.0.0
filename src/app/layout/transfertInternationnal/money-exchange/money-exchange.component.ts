import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-money-exchange',
  templateUrl: './money-exchange.component.html',
  styleUrls: ['./money-exchange.component.scss']
})
export class MoneyExchangeComponent implements OnInit {

  etapeEnvoie:number=1;
  operation:string;
  typeEnvoie:string="";
  loadOperation(op){
    this.operation=op;
    this.typeEnvoie = "";
    this.etapeEnvoie =1;
  }
  next(){
    this.etapeEnvoie = this.etapeEnvoie +1;
    console.log("typeEnvoie ->"+this.typeEnvoie);
    
  }
  back(){
    this.etapeEnvoie = this.etapeEnvoie -1;
    console.log("typeEnvoie ->"+this.typeEnvoie);

  }
  constructor() { }

  ngOnInit() {
  }

}
