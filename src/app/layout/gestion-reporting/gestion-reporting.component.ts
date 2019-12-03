import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import {MatTableDataSource,} from '@angular/material/table';
import { MasterServiceService } from 'src/app/service/master-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl } from '@angular/forms';
import { GestionReportingService } from 'src/app/service/gestion-reporting.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gestion-reporting',
  templateUrl: './gestion-reporting.component.html',
  styleUrls: ['./gestion-reporting.component.scss']
})
export class GestionReportingComponent implements OnInit {
  operation:string;
  typeEnvoie:string= "";
  etapeEnvoie:number;
  dateByDay:any =undefined;
  servicepoint:any = [];
  service:string;
  libelle:string;
  montant:number;
  loadOperation(op){
    this.operation=op;
    this.typeEnvoie = "";
    this.etapeEnvoie =1;
    console.log("loader "+op);
    
    if(op == "historiqueOperation"){
      console.log("inside  "+op);
      this.loading = true;
      this._gestionreportingService.reportingdate({idpdv:10, type:'jour', infotype:this.dateByDay})
        .then(
          data => {
            //this.gestionreporting = data;
            console.log(data);
              this.listeUser = JSON.parse(data['_body']);
              if(this.listeUser.length != 0){
                console.log(this.listeUser);
              console.log(this.getDate(this.listeUser[0].dateoperation));
              this.getDate(this.listeUser[0].dateoperation);
              this.dataSource = new MatTableDataSource(this.listeUser);
              
              setTimeout(() => {
                this.dataSource.sort = this.sort; 
                this.dataSource.paginator = this.paginator;
              }, 5000);   
              this.loading = false; 
            }else{
              this.loading = false; 
            }
            //this.dataSource.paginator = this.paginator;
           
          })
    }
   
  }
  depenseop(){
    console.log("----------------------------")
    this._gestionreportingService.servicepoint()
      .then(
        data => {
          console.log(data['_body']);
          console.log(JSON.parse(data['_body']));
          
          this.servicepoint = JSON.parse(data['_body']);
        },
        error => console.log(error),
       
      )
  }
  reinitialiser(){
    this.servicepoint = [];
    this.service = undefined;
    this.libelle = undefined;
    this.montant = undefined;

    //this.dateByDay = undefined
  }
  validCharge(){
    this.loading = true ;
    this._gestionreportingService.ajoutdepense({libelle:this.libelle, service:this.service, montant:this.montant})
      .then(
        data => {
         console.log(data);
         this.loading = false ;
        },
        error => console.log(error),
        
      )
  }
  listeUser:any = []; 
    displayedColumns = ['Date', 'Service', 'Traitement', 'Montant','Client'];
    dataSource:any=[];
    dateDebut:any =undefined;
    dateFin:any =undefined;
    listeDetail:any = [];
    nombreDetail:number = 0;
    id_userSave:String;
    loading:boolean=false;
	constructor(private router:Router,private _masterService:MasterServiceService,private modalService: BsModalService,private _gestionreportingService:GestionReportingService) { 
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
    @ViewChild(MatPaginator) paginator: MatPaginator;
    doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    sortedData:any =[]
    sortData(sort: Sort) {
        const data = this.listeDetail.slice();
        if (!sort.active || sort.direction === '') {
          this.sortedData = data;
          return  this.sortedData;
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
    historiquejour(){
      this.loading = true ;
      this.dateDebut = undefined;
      this.dateFin = undefined;
      this._gestionreportingService.reportingdate({idpdv:10, type:'jour', infotype:this.dateByDay})
        .then(
          data => {
            //this.gestionreporting = data;
              console.log(data);
              this.listeUser = JSON.parse(data['_body']);
              if(this.listeUser.length != 0){
                console.log(this.listeUser);
              console.log(this.getDate(this.listeUser[0].dateoperation));
              this.getDate(this.listeUser[0].dateoperation);
              this.dataSource = new MatTableDataSource(this.listeUser);
              
              setTimeout(() => {
                this.dataSource.sort = this.sort; 
                this.dataSource.paginator = this.paginator;
              }, 5000);   
              this.loading = false; 
            }else{
              this.loading = false; 
            }
            
            
          })
         
    }
    trimer(infosclient) : string{
      return infosclient.replace('R', '') ;
    }
    historiqueintervalle(){
      console.log('reportingdate intervalle');
      this.loading = true ;
      this.dateByDay = undefined;
      this._gestionreportingService.reportingdate({idpdv:10, type:'intervalle', infotype:this.dateDebut+" "+this.dateFin})
        .then(
          data => {
            console.log(data);
              this.listeUser = JSON.parse(data['_body']);
              if(this.listeUser.length != 0){
                console.log(this.listeUser);
              console.log(this.getDate(this.listeUser[0].dateoperation));
              this.getDate(this.listeUser[0].dateoperation);
              this.dataSource = new MatTableDataSource(this.listeUser);
              
              setTimeout(() => {
                this.dataSource.sort = this.sort; 
                this.dataSource.paginator = this.paginator;
              }, 5000);   
              this.loading = false; 
            }else{
              this.loading = false; 
            }
            
          })
    }
    getDate(date){
      let rep = date.date.split(".")[0];
      return rep;
    }
  ngOnInit() {
    this.dateByDay = ((new Date()).toJSON()).split("T",2)[0];
    //this.dateFin = ((new Date()).toJSON()).split("T",2)[0]
    console.log(this.dateByDay);
    
   /* this.listeUser =[
      {telephone:'779854080',prenom:"Abdoul Hamid",nom:"DIALLO",caution:500000,id_user:1},
      {telephone:'772220594',prenom:"Naby",nom:"NDIAYE",caution:550000,id_user:2},
      {telephone:'775332089',prenom:"MOUHAMED",nom:"DIA",caution:500000,id_user:3},
      {telephone:'778641663',prenom:"Abdoul",nom:"DIOP",caution:500000,id_user:4},
      {telephone:'779854088',prenom:"ISSA",nom:"TAMBA",caution:500000,id_user:5},
    ]
      this.dataSource = this.listeUser;
    console.log(this.dataSource);*/
    
 /*   this.dataSource.sort = this.sort; 
    this._masterService.listeUser().then(res =>{
      this.listeUser = res['users'];
      this.dataSource = new MatTableDataSource(this.listeUser);
      this.dataSource.sort = this.sort;  
      this.loading = false; 
      console.log(res['users']); 
      console.log(res['users']); 
  })*/
  
      
  }
  reimprimerhistop(operation){
    console.log(operation)
    this._gestionreportingService.reimpression({idpdv:10, operation:JSON.stringify(operation), infooperation:operation.operateur})
      .then(gestreportserviceList => {
          let getdataimpression = JSON.parse(gestreportserviceList['_body']);
          console.log("***************************************")
          console.log(getdataimpression)
          let dataImpression = null;
          let infos = JSON.parse(getdataimpression.infosoperation);
          if(operation.operateur.toUpperCase()=="TNT"){
            if(getdataimpression.typeoperation=="abonnement"){
              let typebouquet = "";
              if (infos.id_typeabonnement==1){
                typebouquet = "Maanaa";
              }
              if (infos.id_typeabonnement==2){
                typebouquet = "Boul Khool";
              }
              if (infos.id_typeabonnement==3){
                typebouquet = "Maanaa + Boul Khool";
              }
              dataImpression = {
                apiservice:'tntreimpression',
                service:'abonnement',
                infotransaction:{
                  dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                  echeance:getdataimpression.echeance.date.split('.')[0],
                  transactionBBS: getdataimpression.idoperation,
                  client:{
                    prenom:infos.prenom,
                    nom:infos.nom,
                    telephone:infos.tel,
                    carte: infos.n_carte,
                    chip:infos.n_chip,
                    typebouquet:typebouquet,
                    montant: infos.montant,
                    duree:infos.duree,
                  },
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
              this.router.navigate(['impression']);
            }
            if(getdataimpression.typeoperation=="decodeur"){
              let infos = JSON.parse(getdataimpression.infosoperation);
            }
            if(getdataimpression.typeoperation=="carte"){
              let infos = JSON.parse(getdataimpression.infosoperation);
            }
          }
          if(operation.operateur.toUpperCase()=="WIZALL"){
            if(getdataimpression.typeoperation.toLowerCase().match("sde")){
              let infos = JSON.parse(getdataimpression.infosoperation);
              dataImpression = {
                apiservice:'facturierreimpression',
                service:'sde',
                infotransaction:{
                  dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                  transactionBBS: getdataimpression.idoperation,
                  client:{
                    reference_client: infos.reference_client,
                    reference_facture: infos.reference_facture,
                    client: infos.prenom+" "+infos.nom,
                    date_echeance: infos.date_echeance,
                    montant: infos.montant,
                  },
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
              this.router.navigate(['accueil/impression']);
            }
            if(getdataimpression.typeoperation.toLowerCase().match("senelec")){
              let infos = JSON.parse(getdataimpression.infosoperation);
              dataImpression = {
                apiservice:'facturierreimpression',
                service:'senelec',
                infotransaction:{
                  dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                  transactionBBS: getdataimpression.idoperation,
                  client:{
                    police: infos.police,
                    numfacture: infos.numfacture,
                    client: infos.client,
                    montant: infos.montant,
                    dateecheance: infos.dateecheance,
                  },
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
              this.router.navigate(['accueil/impression']);
            }
            if(getdataimpression.typeoperation.toLowerCase().match("woyofal")){
              let infos = JSON.parse(getdataimpression.infosoperation);
              dataImpression = {
                apiservice:'facturierreimpression',
                service:'achatcodewayafal',
                infotransaction:{
                  dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                  transactionBBS: getdataimpression.idoperation,
                  client:{
                    codewoyafal: infos.TOKEN,
                    montant: infos.amount,
                    compteur: infos.METER_NO,
                  },
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
              this.router.navigate(['accueil/impression']);
            }
            if(getdataimpression.typeoperation.toLowerCase().match("rapido")){
              let infos = JSON.parse(getdataimpression.infosoperation);
              dataImpression = {
                apiservice:'facturierreimpression',
                service:'rapido',
                infotransaction:{
                  dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                  transactionBBS: getdataimpression.idoperation,
                  client:{
                    badge_num: infos.badge_num,
                    numclient: infos.telephone,
                    montant: infos.amount,
                    transactionID:infos.transactionid
                  },
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
              this.router.navigate(['accueil/impression']);
            }
          }
          if(operation.operateur=="POSTCASH"){
            if(operation.traitement=="RETRAIT CASH"){
              console.log('RETRAIT CASH');
              dataImpression = {
                apiservice:'postecashreimpression',
                service:'retraitespece',
                infotransaction:{
                  dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                  transactionBBS: getdataimpression.idoperation,
                  transactionPostCash: infos.transactionId,
                  client:{
                    montant: infos.montant_reel,
                    telephone:'00221??',
                  },
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
              this.router.navigate(['accueil/impression']);
            }
            if(operation.traitement=="ACHAT DE CODE WOYOFAL"){
              console.log("ACHAT DE CODE WOYOFAL");
              dataImpression = {
                apiservice:'postecashreimpression',
                service:'achatcodewayafal',
                infotransaction:{
                  dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                  transactionBBS: getdataimpression.idoperation,
                  transactionPostCash: infos.transactionId,
                  client:{
                    montant: infos.montant_reel,
                    codewoyafal: infos.code,
                    compteur: '??',
                  },
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
              this.router.navigate(['login/impression']);
            }
          }
        }
      )
  }

}
