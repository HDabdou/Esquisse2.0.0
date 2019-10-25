import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-e-money',
  templateUrl: './e-money.component.html',
  styleUrls: ['./e-money.component.scss']
})
export class EMoneyComponent implements OnInit {

  operation:string;

  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
