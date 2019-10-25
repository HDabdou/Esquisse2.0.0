import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizall',
  templateUrl: './wizall.component.html',
  styleUrls: ['./wizall.component.scss']
})
export class WizallComponent implements OnInit {

  operation:string;

  loadOperation(op){
    this.operation=op;
  }
  constructor() { }

  ngOnInit() {
  }

}
