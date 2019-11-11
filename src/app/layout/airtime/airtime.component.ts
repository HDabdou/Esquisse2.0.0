import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-airtime',
  templateUrl: './airtime.component.html',
  styleUrls: ['./airtime.component.scss']
})
export class AirtimeComponent implements OnInit {

  places:any;

  loadAirtime(service){
    if(service == "Orange"){
        this.router.navigate(['/seddo']);
    }
    if(service == "Free"){
        this.router.navigate(['/izi']);
    }
    if(service == 'Expresso'){
        this.router.navigate(['/yakalma']);
    }
   
  
}
  constructor(private router:Router) { }

  ngOnInit() {

    this.places = [
      {imgSrc: 'assets/images/orang.png', nbrTransaction:  0,montant: 0, commission: 0,service:"Orange"},
      {imgSrc: 'assets/images/free.png', nbrTransaction:  0,montant: 0, commission: 0,service:"Free"},
      {imgSrc: 'assets/images/express.jpg', nbrTransaction:  0,montant: 0, commission: 0,service:"Expresso"},
    ]
  }
}
