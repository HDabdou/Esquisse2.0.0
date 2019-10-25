import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tigocash',
  templateUrl: './tigocash.component.html',
  styleUrls: ['./tigocash.component.scss']
})
export class TigocashComponent implements OnInit {

  operation:string;
  typePiece =[{name:"carte d'identité nationnal"},
  {name:"passport"},
]
  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
