import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poste-cash',
  templateUrl: './poste-cash.component.html',
  styleUrls: ['./poste-cash.component.scss']
})
export class PosteCashComponent implements OnInit {

  operation:string;
  monatntJula =[{name:2000},
  {name:5000},
  {name:10000},
  {name:25000},
]
  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
