import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zuulu',
  templateUrl: './zuulu.component.html',
  styleUrls: ['./zuulu.component.scss']
})
export class ZuuluComponent implements OnInit {

  operation:string;
  paiementmode =[
    {name:"Wallet"},
    {name:"Ward"}
  ]
  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
