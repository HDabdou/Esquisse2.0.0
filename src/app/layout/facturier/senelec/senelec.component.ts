import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-senelec',
  templateUrl: './senelec.component.html',
  styleUrls: ['./senelec.component.scss']
})
export class SenelecComponent implements OnInit {

  operation:string;
  
  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
