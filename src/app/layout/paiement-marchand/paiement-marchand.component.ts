import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paiement-marchand',
  templateUrl: './paiement-marchand.component.html',
  styleUrls: ['./paiement-marchand.component.scss']
})
export class PaiementMarchandComponent implements OnInit {

  places:any;
  constructor() { }

  ngOnInit() {

    this.places = [
      {imgSrc: 'assets/images/orangemoney.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"OrangeMoney"},
      {imgSrc: 'assets/images/tigocash.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"FreeMoney"},
      {imgSrc: 'assets/images/emoney.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"E-Money"},
      {imgSrc: 'assets/images/wizall.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Wizall"},
      {imgSrc: 'assets/images/POSTCASH.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"POSTE CASH"},
      {imgSrc: 'assets/images/kk.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"kash-kash"},
      {imgSrc: 'assets/images/zp.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Zuulu"},

  ]
  }

}
