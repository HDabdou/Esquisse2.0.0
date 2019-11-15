import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FactureService } from 'src/app/service/facture.service';
import { SendDataService } from 'src/app/service/send-data.service';

@Component({
  selector: 'app-senelec',
  templateUrl: './senelec.component.html',
  styleUrls: ['./senelec.component.scss']
})
export class SenelecComponent implements OnInit {

  operation:string;

  etat1:boolean=false;
  etat2:boolean=false;
  etat3:boolean=false;
  adejaclick:boolean = false;


  message:boolean=false;
  errorMessage : any ;

  service:string;
  detailfacturesenelec:any={errorCode:0,police:"125455",numeroFacture:"156665",nom_client:'nom du client',montant:50000,dateecheance:"12/3/2018"};
  police:string;
  num_facture:string;
  dataImpression:any;
  telephone:string;
  loading:boolean=false;
  
  totalFacture(){
    return parseInt(this.detailfacturesenelec.montant)+500;
 }
  loadOperation(op){
    this.operation=op;
  }

  @ViewChild('modalsenelec') public modalsenelec:ModalDirective;

  showmodalsenelec(){
    this.adejaclick = false;
    this.detailfactsenelec();
    this.loading=true;
  }
  hidemodalsenelec(){
    this.modalsenelec.hide();
    this.police = undefined;
    this.num_facture = undefined;
    this.loading=false;
    this.etat2=false;
    this.detailfacturesenelec.service = "senelec";
    this.detailfacturesenelec.police="";
    this.detailfacturesenelec.numeroFacture="";
    this.detailfacturesenelec.montant="";
    this.detailfacturesenelec.dateecheance="";
  }
  detailfactsenelec(){
    this.detailfacturesenelec={errorCode:0,police:"5",numeroFacture:"5",nomclient:'nom du client',montant:1,dateecheance:"12/3/2018",service:"12/3/2018"};
    this.etat1=false;
    this.etat2=false;
    this.etat3=false;
    this.loading=false;
    this.modalsenelec.show();
    this._facturierService.detailfacturesenelec(this.police,this.num_facture,this.telephone).then(resp =>{
      console.log(resp);
      let rep=JSON.parse(JSON.parse(resp._body));
      console.log(rep);
      if(parseInt(rep.errorCode)!=1001){
        if(typeof rep.response !== 'object') {
          this.etat1=true;
          this.loading=true;
          this.detailfacturesenelec.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client.";
        }
       // else if(resp.response.length==0) this.etat3=true;
       switch(parseInt(rep.errorCode)){
         case 0:{
          //this.etat2=true;
          this.loading=false;
          this.detailfacturesenelec.service = resp.typeservice;
          this.detailfacturesenelec.police=rep.police;
          this.detailfacturesenelec.numeroFacture=rep.numfacture;
          this.detailfacturesenelec.nomclient=rep.client;
          this.detailfacturesenelec.montant=rep.montant_facture;
          this.detailfacturesenelec.dateecheance=resp.response[0].dateecheance;
           break;
         }
        case 1004:{
          this.detailfacturesenelec.errorCode = "Facture déjà payée";
          this.etat1=true;
          this.loading=false;
          break;
        }
        default:{
          this.detailfacturesenelec.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client.";
          break;

        }

       }
       
      }else{
        this.etat1=true;
        this.loading=false;
        this.detailfacturesenelec.errorCode = "Facture non trouvée"
        this.modalsenelec.show();
      }
    }).catch(resp => {
      console.log(resp);
      if(resp==-11){
        this.detailfacturesenelec.errorCode = "Opèration annulée. La requête n'est pas parvenue au serveur. Merci de contacter le service client."
      }
      else if(resp==-12){
        this.detailfacturesenelec.errorCode = "Impossible de se connecter au serveur du partenaire. Merci de contacter le service client."
      }
      else {
        this.detailfacturesenelec.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
      }
      this.etat1=true;
      this.modalsenelec.show();
    });
  }
  validerpaimentsenelec(){
    
    // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
   let object ={'nom':'Facturier senelec','operateur':8,'operation':4,'montant':this.detailfacturesenelec.montant,
   'police':this.police,'num_facture':this.num_facture,'service':this.detailfacturesenelec.service,
   'telephone':this.telephone,'echeance':this.detailfacturesenelec.dateecheance};
    this.dataService.sendData(object)
    this.hidemodalsenelec()  
     this.dataService.clearData();
      this.police = null;
      this.num_facture = null;
   }

  constructor(private _facturierService:FactureService,private dataService:SendDataService) { }

  ngOnInit() {
  }

}
