import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-virement-bancaire',
  templateUrl: './virement-bancaire.component.html',
  styleUrls: ['./virement-bancaire.component.scss']
})
export class VirementBancaireComponent implements OnInit {

  places:any;
  constructor() { }

  ngOnInit() {
    this.places = [
      {imgSrc: 'assets/images/senegal.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"senegal"},
      {imgSrc: 'assets/images/cote_d_ivoire.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"cote d\'ivoire"},
      {imgSrc: 'assets/images/mali.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"mali"},
      {imgSrc: 'assets/images/burkina.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"burkina faso"},
      {imgSrc: 'assets/images/benin.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Bénin"},
      {imgSrc: 'assets/images/guinnee_bissau.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"guinnée bissau"},
      {imgSrc: 'assets/images/niger.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Niger"},
      {imgSrc: 'assets/images/togo.png',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"Togo"},
     
  ]
  }

}
