import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tnt',
  templateUrl: './tnt.component.html',
  styleUrls: ['./tnt.component.scss']
})
export class TntComponent implements OnInit {

  operation:string;
  type =[
    {name:"Sans abonnement"},
    {name:"1 mois"},
    {name:"3 mois"},
  ]
  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
