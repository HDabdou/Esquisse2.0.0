import { Component, OnInit } from '@angular/core';
import { StylesCompileDependency } from '@angular/compiler';
import { TransfertInternatinnalService } from 'src/app/service/transfert-internatinnal.service';

@Component({
  selector: 'app-ria',
  templateUrl: './ria.component.html',
  styleUrls: ['./ria.component.scss']
})
export class RiaComponent implements OnInit {

  codeRetrait:string;
  etapeEnvoie:number=1;
  operation:string;
  typeEnvoie:string="";
  loadOperation(op){
    this.operation=op;
    this.typeEnvoie = "";
    this.etapeEnvoie =1;
  }
  next(){
    this.etapeEnvoie = this.etapeEnvoie +1;
  }
  back(){
    this.etapeEnvoie = this.etapeEnvoie -1;
  }

  recherche(){
    this._transfertIService.initSession().then(res =>{
      console.log(res);
      
    })
  }
  constructor(private _transfertIService:TransfertInternatinnalService) { }
  listPays :any =[];
  ngOnInit() {
    var countries = require('country-data').countries;
    this.listPays = countries.all;
    console.log(countries);
    console.log(this.listPays);

    
    

  }

}
