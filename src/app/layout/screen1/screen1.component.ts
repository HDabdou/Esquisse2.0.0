import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MasterServiceService } from 'src/app/service/master-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.scss']
})
export class Screen1Component implements OnInit {


  places:any;

    listeUser:any = []; 
    displayedColumns = ['telephone', 'nom', 'prenom', 'caution','option'];
    dataSource:any=[];
    dateDebut:any;
    dateFin:any;
    listeDetail:any = [];
    nombreDetail:number = 0;
    id_userSave:String;
    loading:boolean=false;
	constructor(private _masterService:MasterServiceService,private modalService: BsModalService) { 
        this.sortedData = this.listeDetail.slice();
    }
    modalRef: BsModalRef;
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,{class: 'modal-lg'});
    }
    suivi(id_user){
        this.id_userSave = id_user;
        this.listeDetail =[];
        this.nombreDetail = 0;
        this.dateDebut = ((new Date()).toJSON()).split("T",2)[0];
        this.dateFin = ((new Date()).toJSON()).split("T",2)[0];
        this._masterService.listOperationByPoint(this.dateDebut,this.dateFin,id_user).then(res =>{
            this.listeDetail = res['operations'];
            this.nombreDetail = this.listeDetail.length;
            console.log(res['operations']);

            
        });

    }
    rechercher(){
        this.listeDetail =[];
        this.nombreDetail = 0;
          this._masterService.listOperationByPoint(this.dateDebut,this.dateFin,this.id_userSave).then(res =>{
            this.listeDetail = res['operations'];
            this.nombreDetail = this.listeDetail.length;
            console.log(res['operations']);            
        });
    }

   
    @ViewChild(MatSort) sort: MatSort;
    doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    sortedData:any =[]
    sortData(sort: Sort) {
        const data = this.listeDetail.slice();
        if (!sort.active || sort.direction === '') {
          this.sortedData = data;
          return;
        }
    
        this.sortedData = data.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'nom': return this.compare(a.nom, b.nom, isAsc);
            case 'prenom': return this.compare(a.prenom, b.prenom, isAsc);
            case 'caution': return this.compare(a.caution, b.caution, isAsc);
            default: return 0;
          }
        });
      }
    
    
     compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
	ngOnInit() {
    this.loading = true;
    this._masterService.listeUser().then(res =>{
        this.listeUser = res['users'];
        this.dataSource = new MatTableDataSource(this.listeUser);
        this.dataSource.sort = this.sort;  
        this.loading = false; 
        console.log(res['users']); 
    })
    this.places = [
      {imgSrc: 'assets/images/facture senelec.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"facture senelec"},
      {imgSrc: 'assets/images/facture sde.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"facture sde"},
      {imgSrc: 'assets/images/rapido.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"rapido"},
      {imgSrc: 'assets/images/woyofal.jpg',
      nbrTransaction:  0,
      montant: 0,
      commission: 0,
      service:"woyofal"},
      

  ]
        
        
	}

}
