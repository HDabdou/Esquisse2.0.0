import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canal',
  templateUrl: './canal.component.html',
  styleUrls: ['./canal.component.scss']
})
export class CanalComponent implements OnInit {

  etapeRecructement:number=1;
  operation:string;

  titre= [
    {name:"Monsieur"},
    {name:"Madame"},
    {name:"Mademoiselle"},
    {name:"Société"},
  ]
  bouquet =[
    {name:"Date à date Evasion"},
    {name:"Date à date ESSENTIEL Plus"},
    {name:"Date à date Les Chaines Canal + Evasion"},
    {name:"Date à date Toust Canal Plus"},
  ]
  next(){
    this.etapeRecructement = this.etapeRecructement +1;
  }
  back(){
    this.etapeRecructement = this.etapeRecructement -1;
  }
  loadOperation(op){
    this.operation=op;
    this.etapeRecructement=1;
  }
  constructor() { }

  ngOnInit() {
  }

}
