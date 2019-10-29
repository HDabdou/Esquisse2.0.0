import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MasterServiceService } from 'src/app/service/master-service.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-screen2',
  templateUrl: './screen2.component.html',
  styleUrls: ['./screen2.component.scss']
})
export class Screen2Component implements OnInit {

    listeUser:any = []; 
    places:any;
    displayedColumns = ['telephone', 'nom', 'prenom', 'caution','option','option1'];
    dataSource:any=[];
    dateDebut:any;
    dateFin:any;
    listeDetail:any = [];
    nombreDetail:number = 0;
    id_userSave:String;
    loading:boolean=false;
	constructor(private router:Router,private _masterService:MasterServiceService,private modalService: BsModalService) { 
    }
    modalRef: BsModalRef;
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,{class: 'modal-lg'});
    }
    modalRef1: BsModalRef;
    openModal1(template1: TemplateRef<any>) {
        this.modalRef1 = this.modalService.show(template1,{class: 'modal-lg'});
    }
    montant:number;
    id_receiver
    deposer(id_user){
        this.id_receiver =id_user;
        //console.log(id_user);
        this.depositeError = 0;
        this.montant = undefined;
      

    }
    depositeError:number = 0;
    message:string="";
    valider(){
        if(confirm('Vous allez effectué un positionnement sur ce compte '+this.currencyFormat(this.montant)+" FCFA")){
            this.loading = true;
            this._masterService.updateCaution(this.montant,this.id_receiver).then(res=>{
                this.message = res['message'];
                console.log(res['message']);
                
                if(res['code'] == 1){
                    this.depositeError = 1;
                    this._masterService.listeUser().then(res =>{
                        this.listeUser = res['users'];
                        this.dataSource = new MatTableDataSource(this.listeUser);
                        this.dataSource.sort = this.sort; 
                        this.loading = false;  
                        console.log(res['users']); 
                    })
                }
                if(res['code'] == 0){
                    this.depositeError = -1;
                    this.loading = false;
                    alert("Votre Solde master insuffisant");
                }
                if(res['code'] == -1){
                    this.depositeError = -1;
                    this.loading = false;
                    alert("Solde point du point insuffisant");
                }
            });
            this.modalRef1.hide();
        }
       
    }
    suivi(id_user){
        this.loading = true;
        this.id_userSave = id_user;
        this.listeDetail =[];
        this.nombreDetail = 0;
        this.dateDebut = ((new Date()).toJSON()).split("T",2)[0];
        this.dateFin = ((new Date()).toJSON()).split("T",2)[0];
        this._masterService.listOperationByPoint(this.dateDebut,this.dateFin,id_user).then(res =>{
            this.listeDetail = res['operations'];
            this.nombreDetail = this.listeDetail.length;
            this.loading = false;
            console.log(res['operations']);


        });

    }
    rechercher(){
        this.loading = true;
        this.listeDetail =[];
        this.nombreDetail = 0;
         /* this._masterService.listOperationByPoint(this.dateDebut,this.dateFin,this.id_userSave).then(res =>{
            this.listeDetail = res['operations'];
            this.nombreDetail = this.listeDetail.length;
            console.log(res['operations']);            
        });*/
        this._masterService.listedeposit(this.dateDebut,this.dateFin,this.id_userSave).then(res=>{
            //console.log(res);
            this.listeDetail = res['deposit'];
            this.nombreDetail = this.listeDetail.length;
            this.loading = false;
            
        })
    }
    currencyFormat(somme) : String{
        return Number(somme).toLocaleString() ;
      }
    getInfo1(requete,nom){
        let req = JSON.parse(requete);
        if(nom == "prenom"){
          return req.prenom;
        } 
        if(nom == "nom"){
          
          return req.nom;
        }
        if(nom == "montant"){
          return req.montant ;
        }
    }
   
    @ViewChild(MatSort) sort: MatSort;
    doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    loadTransfertInternationnal(service){
        if(service == "Ria"){
            this.router.navigate(['/ria']);
        }
        if(service == "worldRemit"){
            this.router.navigate(['/worldremit']);
        }
        if(service == 'MoneyExchange'){
            this.router.navigate(['/moneyexchange']);
        }
       
      
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
            {imgSrc: 'assets/images/ria.jpg',
            nbrTransaction:  0,
            montant: 0,
            commission: 0,
            service:"Ria"},
            {imgSrc: 'assets/images/worldremit.jpg',
            nbrTransaction:  0,
            montant: 0,
            commission: 0,
            service:"worldRemit"},
            {imgSrc: 'assets/images/moneyexchange.jpg',
            nbrTransaction:  0,
            montant: 0,
            commission: 0,
            service:"MoneyExchange"},
           
        ]
        
        
	}

}
