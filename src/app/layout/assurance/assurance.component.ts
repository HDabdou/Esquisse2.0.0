import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assurance',
  templateUrl: './assurance.component.html',
  styleUrls: ['./assurance.component.scss']
})
export class AssuranceComponent implements OnInit {

  places:any;

  constructor() { }

  ngOnInit() {

    this.places = [
      {imgSrc: 'assets/images/april.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"April"},]
  }

}
