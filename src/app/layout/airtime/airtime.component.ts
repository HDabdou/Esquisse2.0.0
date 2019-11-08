import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-airtime',
  templateUrl: './airtime.component.html',
  styleUrls: ['./airtime.component.scss']
})
export class AirtimeComponent implements OnInit {

  places:any;

  constructor() { }

  ngOnInit() {

    this.places = [
      {imgSrc: 'assets/images/orang.png', nbrTransaction:  0,montant: 0, commission: 0,service:"Orange"},
      {imgSrc: 'assets/images/free.png', nbrTransaction:  0,montant: 0, commission: 0,service:"Free"},
      {imgSrc: 'assets/images/express.jpg', nbrTransaction:  0,montant: 0, commission: 0,service:"Expresso"},
    ]
  }
}
