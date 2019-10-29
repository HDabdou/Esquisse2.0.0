import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizall',
  templateUrl: './wizall.component.html',
  styleUrls: ['./wizall.component.scss']
})
export class WizallComponent implements OnInit {

  operation:string;

  typePiece =[{name:"carte d'identité nationnal"},
  {name:"passport"},
  ]
  nationnalite =[{name:"senegalaise"},
 
  ]
  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
