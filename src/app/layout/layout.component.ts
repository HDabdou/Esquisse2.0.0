import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { OrangeMoneyComponent } from './mobileMoney/orange-money/orange-money.component';
import { SendDataService } from '../service/send-data.service';
import { Subscription } from 'rxjs';
import { OrangeMoneyService } from '../service/orange-money.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    process =[];
    subscription : Subscription;
    data:any;
    indexOp:number=0;
    quinzeMinutes = 900000;
     // om:OrangeMoneyComponent;
 
     @ViewChild('waitingmodal') public waitingmodal:ModalDirective;

   updateCaution(){
    console.log("updateCaution 1");
   /* if ( this.autorisedUser == 1)
      this._utilsService.checkCaution().subscribe(
        data => {
          this.solde = data ;
          console.log("Le solde vaut "+data) ;
        },
        error => alert(error),
        () => {
          console.log(3)
        }
      )*/
  }
   updateOpInLastedFifteen(operation:any,id:number){
    let omOps = JSON.parse( localStorage.getItem(operation) ) ;
    console.log("updateOpInLastedFifteen id="+id);
    omOps[id].bool=true;
    localStorage.setItem(operation, JSON.stringify(omOps) );
  }
   repeatedInLastFifteen(operation : any, incomingRequest : any) : number{

    let today = Number( Date.now() ) ;
    let omOps = [] ;
    console.log(localStorage.getItem(operation)) ;

    if (localStorage.getItem(operation)==null ){
      localStorage.setItem(operation, JSON.stringify([{requete:incomingRequest, tstamp:today,bool:false}]) );
      this.indexOp=0;
      return 0 ;
    }else{
      omOps = JSON.parse( localStorage.getItem(operation) ) ;
      for (let i=0 ; i<omOps.length ; i++){
        if (omOps[i].requete==incomingRequest){
          console.log(omOps[i]);
          let ilYa15Minutes = today - this.quinzeMinutes;

          let diff =  today - omOps[i].tstamp  ;

//          console.log("Diff vaut "+diff) ;

          if (  diff < this.quinzeMinutes && omOps[i].bool==false ){
            this.indexOp=i;
            return -1 ;
          }else{
            if(omOps[i].bool==true || diff > this.quinzeMinutes){
              omOps[i].tstamp = today ;
              this.indexOp=i;
              console.log("sama cas bi : "+i);
              localStorage.setItem(operation, JSON.stringify(omOps) );
              return i;
            }
          }
        }
      }
      omOps.push({requete:incomingRequest, tstamp:today,bool:false}) ;
      this.indexOp=omOps.length-1;
      localStorage.setItem(operation, JSON.stringify(omOps) );
      return omOps.length-1 ;
    }
  }
  deposerOM(objet:any){

    // console.log("Debut 1- "+JSON.stringify(objet))
     let requete = "1/"+objet.data.montant+"/"+objet.data.num ;
     let id:number=this.repeatedInLastFifteen('om-depot', requete);
     console.log(requete);
     if (id==-1){
       objet.etats.etat=true;
       objet.etats.load='terminated';
       objet.etats.color='red';
       objet.etats.errorCode='r';
      // console.log("indexOp bi la ="+this.indexOp);
      // id=this.indexOp;
       return 0 ;
     }
 
 
     this._omService.requerirControllerOM(requete).then( resp => {
       if (resp.status==200){
         console.log("requerirControllerOM : "+resp._body) ;
         if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
           this.updateOpInLastedFifteen('om-depot',id);
 
         }else
         if(resp._body.match('-12')){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='-12';
 
         }
         else{
           setTimeout(()=>{
             this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
               let donnee=rep._body.trim().toString();
             //  console.log("verifierReponseOM : "+donnee) ;
               if(donnee=='1'){
                 objet.etats.etat=true;
                 objet.etats.load='terminated';
                 objet.etats.color='green';
                // this.addOpInLastedFifteen('om-depot',requete);
                 this.updateCaution();
 
               }
               else{
                 if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   this.updateOpInLastedFifteen('om-depot',id);
                   this.updateOpInLastedFifteen('om-depot',id);
 
                 }
                 else{
                   let periodicVerifierOMDepot = setInterval(()=>{
                     //console.log("periodicVerifierTCDepot : "+objet.etats.nbtour) ;
                     objet.etats.nbtour = objet.etats.nbtour + 1 ;
                     this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                       let donnee=rep._body.trim().toString();
                       //console.log("verifierReponseOM 1 : "+donnee) ;
                       if(donnee=='1'){
                         objet.etats.etat=true;
                         objet.etats.load='terminated';
                         objet.etats.color='green';
                         this.updateCaution();
                        // this.addOpInLastedFifteen('om-depot',requete);
                         clearInterval(periodicVerifierOMDepot) ;
                       }
                       else{
                         if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           this.updateOpInLastedFifteen('om-depot',id);
                           clearInterval(periodicVerifierOMDepot) ;
                         }
                         if(donnee=='-1'){
                           if(donnee=='-1' && objet.etats.nbtour>=5)
                           this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                             let donnee=rep._body.trim().toString();
                            // console.log("demanderAnnulationOM : "+donnee) ;
                             if(donnee=="c"){
                               objet.etats.etat=true;
                               objet.etats.load='terminated';
                               objet.etats.color='red';
                               objet.etats.errorCode="c";
                              // this.om[0].style["background-color"]='red';
                               this.updateOpInLastedFifteen('om-depot',id);
                               clearInterval(periodicVerifierOMDepot) ;
                             }
                             else if(donnee!='w'){
                               objet.etats.etat=true;
                               objet.etats.load='wait';
                               objet.etats.color='yellow';
                               objet.etats.errorCode=donnee;
                               this.updateOpInLastedFifteen('om-depot',id);
                               clearInterval(periodicVerifierOMDepot) ;
                             }
                             else {
                               objet.etats.etat=true;
                               objet.etats.load='terminated';
                               objet.etats.color='red';
                               objet.etats.errorCode="bad";
                              // this.om[0].style["background-color"]='red';
                               this.updateOpInLastedFifteen('om-depot',id);
                               clearInterval(periodicVerifierOMDepot) ;
                             }
                           }) ;
                         }
                       }
                     });
                   },10000);
                 }
               }
             });
           },30000);
           }
       }
       else{
         console.log("error") ;
 
       }
     });
 
   }
   retirerOM(objet:any){
      // console.log("Debut 1- "+JSON.stringify(objet))
      let requete = "2/"+objet.data.num+"/"+objet.data.montant ;
      let id=this.repeatedInLastFifteen('om-retrait', requete);
    if (id==-1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      this.waitingmodal.hide();
      return 0 ;
    }
   // console.log('avant om service');
    this._omService.requerirControllerOM(requete).then( resp => {
      console.log('avant resp.status'+resp);
      if (resp.status==200){

     //    console.log("For this 'retrait', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
           this.updateOpInLastedFifteen('om-retrait',id);
           this.waitingmodal.hide();
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.updateOpInLastedFifteen('om-retrait',id);
               this.waitingmodal.hide();
            }
            else{
              setTimeout(()=>{
               // console.log('si set time ou bila');
                this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                let donnee=rep._body.trim().toString();
              //  console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                   this.updateCaution();
                }
                else{
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   this.updateOpInLastedFifteen('om-retrait',id);
                   this.waitingmodal.hide();
                  }
                  else{
                 //       console.log('avant set interval bi');
                        let periodicVerifierOMRetirer = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                   //     console.log('si set interval bi');
                        this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                        let donnee=rep._body.trim().toString();
                     //   console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='green';
                           this.updateCaution();
                           clearInterval(periodicVerifierOMRetirer) ;
                        }
                        else{
                          if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           this.updateOpInLastedFifteen('om-retrait',id);
                           clearInterval(periodicVerifierOMRetirer) ;
                           //this.waitingmodal.hide();
                          }
                            if(donnee=='-1' && objet.etats.nbtour>=1){
                              //console.log('avant demande annulation');
                              let respo = resp._body.trim().toString();
                              this._omService.demanderAnnulationOM(respo).then(rep =>{
                                let donnee=rep._body.trim().toString();
                                  console.log('apres demande annulation');
                                  console.log(donnee);
                                  if(donnee=='w'){
                                    objet.etats.etat=true;
                                    objet.etats.load='wait';
                                    objet.etats.color='yellow';
                                    objet.etats.errorCode=donnee;
                                    this.updateOpInLastedFifteen('om-retrait',id);
                                    this.retrieveOperationInfo(objet);
                                   // this.openModal("waitingmodal1")
                                    clearInterval(periodicVerifierOMRetirer) ;                                    this.postDemanderAnnulationOM(objet,resp._body.trim().toString());
                                    this.postDemanderAnnulationOM(objet,respo);
                                  }
                                  else{
                                   objet.etats.etat=true;
                                   objet.etats.load='terminated';
                                   objet.etats.color='red';
                                   objet.etats.errorCode="c";
                                   this.updateOpInLastedFifteen('om-retrait',id);
                                   clearInterval(periodicVerifierOMRetirer) ;
                                   this.waitingmodal.hide();
                                 }
                              });
                            }
                        }
                      });
                      },10000);

                  }
                }
              });
             },60000);
            }
      }
      else{
        console.log("error") ;
        }
    });
   }
  myData(data){
    //console.log(data);
    let infoOperation:any;
    if(data){
      infoOperation={'etat':false,'id':this.process.length,'load':'loader','color':'', 'errorCode':'*', nbtour:0};
      let sesion={'data':data,'etats':infoOperation,'dataI':''};
      let operateur=sesion.data.operateur;
      if(operateur==2){
        console.log('operateur bi bakh na');
      let operation=sesion.data.operation;
      this.process.push(sesion);
          switch(operation){
            case 1:{
                     console.log(this.process);
                     
                   this.deposerOM(sesion);
                   break;
                   }
            case 2:{
             console.log(this.process);
                   this.retirerOM(sesion);
                   break;
            }
            case 3:{
             console.log(this.process);
                   //this.retraitAvecCode(sesion);
                   break;
            }
            case 4:{
             console.log(this.process);
                   //this.retraitCpteRecep(sesion);
                   break;
            }
            case 5:{
                   //this.acheterCredit(sesion);
                   break;
            }
            default :break;
          }
        }
    }
  console.log("youpi");
    
  }
    constructor(private dataService:SendDataService,private _omService:OrangeMoneyService,private modalService: BsModalService) {
      this.subscription = this.dataService.getData().subscribe(rep =>{
        this.data =rep;
        this.myData(this.data);  
      });
    }
    ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
    }
    orangeMoney($object){
         console.log("fila wara change");
         console.log(sessionStorage.getItem('curentProcess'));
         console.log($object);
   
           let infoOperation:any;
           if(sessionStorage.getItem('curentProcess')!="" && sessionStorage.getItem('curentProcess')!=undefined){
             infoOperation={'etat':false,'id':this.process.length,'load':'loader','color':'', 'errorCode':'*', nbtour:0};
             let sesion={'data':JSON.parse(sessionStorage.getItem('curentProcess')),'etats':infoOperation,'dataI':''};
             let operateur=sesion.data.operateur;
             sessionStorage.removeItem('curentProcess');
             if(operateur==2){
             let operation=sesion.data.operation;
             this.process.push(sesion);
                 switch(operation){
                   case 1:{
                            console.log(this.process);
                            
                          //this.deposer(sesion);
                          break;
                          }
                   case 2:{
                    console.log(this.process);
                          //this.retirer(sesion);
                          break;
                   }
                   case 3:{
                    console.log(this.process);
                          //this.retraitAvecCode(sesion);
                          break;
                   }
                   case 4:{
                    console.log(this.process);
                          //this.retraitCpteRecep(sesion);
                          break;
                   }
                   case 5:{
                          //this.acheterCredit(sesion);
                          break;
                   }
                   default :break;
                 }
                 sessionStorage.removeItem('curentProcess');
               }
           }
         console.log("youpi");
   
     }
    ngOnInit() {
      
       // this.onLoggedout();
    }
    postDemanderAnnulationOM(objet:any,resp:string){
      let timerInterval  = setInterval(
        ()=>{
          this._omService.postDemanderAnnulationOM(resp).then(rep => {
            let donnee=rep._body.trim().toString();
            console.log('apres demande post annulation');
            console.log(donnee);
            if(donnee=='1'){
                clearInterval(timerInterval) ;
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='green';
                objet.etats.errorCode=donnee;
                this.retrieveOperationInfo(objet);
            }
            else if(donnee!='-1'){
                clearInterval(timerInterval) ;
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='red';
                objet.etats.errorCode=donnee;
                this.retrieveOperationInfo(objet);
            }

          });
        },10000)
  }
    retrieveOperationInfo(item : any) : string{

      /* OM */
           if(item.data.operateur==2 ){
      
              if (item.etats.errorCode=='r')
                return "Vous venez d'effectuer la même opèration sur le même numéro." ;
      
              if (item.etats.errorCode=='c')
                return "Opèration annulée. La requête n'est pas parvenue au serveur. Veuillez recommencer." ;
      
              if (item.etats.errorCode=='w')
                return "Faites patienter le client ; votre requete est en cours de traitement." ;
      
              if (item.etats.errorCode=='0')
                return "Vous n'êtes pas autorisé à effectuer cette opèration." ;
      
              if (item.etats.errorCode=='-2')
                return "Le client a atteint le nombre maximum de transactions par jour en tant que beneficiaire" ;
              if (item.etats.errorCode=='-3')
                return "Le solde du compte du client ne lui permet pas d'effectuer cette opèration" ;
              if (item.etats.errorCode=='-4')
                return "Le beneficiaire a atteint le montant maximum autorisé par mois" ;
              if (item.etats.errorCode=='-5')
                return "Le montant maximum cumulé de transactions par semaine en tant que beneficiaire a ete atteint par le client" ;
              if (item.etats.errorCode=='-6')
                return "Le destinataire n'est pas un client orangemoney" ;
              if (item.etats.errorCode=='-7')
                return "Probléme de connexion ou code IHM invalide. Veuillez réessayer!" ;
              if (item.etats.errorCode=='-8')
                return "Le client a atteint le nombre maximum de transactions par semaine en tant que beneficiaire" ;
              if (item.etats.errorCode=='-9')
                return "Le client a atteint le nombre maximum de transactions par mois en tant que beneficiaire" ;
      
      //        if (item.etats.errorCode=='-10')
       //         return "Votre requête n'a pas pu être traitée. Vérifiez la conformité des informations saisies!" ;
      
              if (item.etats.errorCode=='-12')
                return "Service actuellement indisponible. Veuillez réessayer plus tard." ;
      
              if (item.etats.errorCode=='-13')
                return "Le code de retrait saisi est incorrect. Veuillez recommencer!" ;
      
             return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
          }
      
      /* TC */
           if(item.data.operateur==3 ){
      
              if (item.etats.errorCode=='r')
                return "Vous venez d'effectuer la même opèration sur le même numéro." ;
      
              if (item.etats.errorCode=='c')
                return "Opèration annulée. La requête n'est pas parvenue au serveur. Veuillez recommencer." ;
      
              if (item.etats.errorCode=='0')
                return "Vous n'êtes pas autorisé à effectuer cette opèration." ;
              if (item.etats.errorCode=='w')
                return "Votre requête est en cour de traitement , merci de faire patienter le client." ;
              if (item.etats.errorCode=='-2')
                return "Numéro Invalide." ;
              if (item.etats.errorCode=='-3')
                return "Le compte de l'utilisateur ne dispose pas de permissions suffisantes pour recevoir un dépot." ;
              if (item.etats.errorCode=='-4')
                return "Le beneficiaire a atteint le montant maximum autorisé par mois" ;
              if (item.etats.errorCode=='-5')
                return "Le montant maximum cumulé de transactions par semaine en tant que beneficiaire a ete atteint par le client" ;
              if (item.etats.errorCode=='-6')
                return "Le destinataire n'est pas un client orangemoney" ;
              if (item.etats.errorCode=='-7')
                return "Probléme de connexion ou code IHM invalide. Veuillez réessayer!" ;
              if (item.etats.errorCode=='-8')
                return "Le client a atteint le nombre maximum de transactions par semaine en tant que beneficiaire" ;
              if (item.etats.errorCode=='-9')
                return "Le client a atteint le nombre maximum de transactions par mois en tant que beneficiaire" ;
      
      //        if (item.etats.errorCode=='-10')
       //         return "Votre requête n'a pas pu être traitée. Vérifiez la conformité des informations saisies!" ;
      
              if (item.etats.errorCode=='-12')
                return "Service actuellement indisponible. Veuillez réessayer plus tard." ;
      
              if (item.etats.errorCode=='-13')
                return "Le code de retrait saisi est incorrect. Veuillez recommencer!" ;
      
             return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
          }
      
      
           if(item.data.operateur==4 ){
      
              if (item.etats.errorCode=='0')
                return "Vous n'êtes pas autorisé à effectuer cette opèration." ;
             return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
          }
      
          /* WIZALL */
          if(item.data.operateur==6 ){
            if (item.etats.errorCode=='-12' || item.etats.errorCode==-12)
              return "Impossible de se connecter au serveur du partenaire. Merci de contacter le service client.";
            else if (item.etats.errorCode=='-11' || item.etats.errorCode==-11)
              return "Opèration annulée. La requête n'est pas parvenue au serveur. Merci de contacter le service client." ;
            else if (item.etats.errorCode=='-1' || item.etats.errorCode==-1)
              return "Impossible de se connecter au serveur du partenaire. Merci de réessayer plus tard." ;
            else if (item.etats.errorCode=='500' || item.etats.errorCode==500)
              return "Une erreur a empêché le traitement de votre requête. Réessayez plus tard ou contactez le service client." ;
            else if (item.etats.errorCode=='400' || item.etats.errorCode==400)
              return "Facture dèja payée." ;
            else if (item.etats.errorCode && (typeof item.etats.errorCode == 'string'))
              return item.etats.errorCode;
            return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
          }
      
          /* EXPRESSO */
          if(item.data.operateur==7 ){
      
            if (item.etats.errorCode=='-1')
              return "" ;
            if (item.etats.errorCode=='1')
              return "" ;
            if (item.etats.errorCode=='2')
              return "Cette requête n'est pas authorisée" ;
            if (item.etats.errorCode=='51')
              return "Le numéro du destinataire n'est pas authorisé à recevoir de transfert." ;
            if (item.etats.errorCode=='3')
              return "Numéro de téléphone invalide." ;
            if (item.etats.errorCode=='2')
              return "Cette requête n'est pas authorisée" ;
            if (item.etats.errorCode=='-7')
              return "Votre demande de retrait a echoué." ;
            if (item.etats.errorCode=='9')
              return "Votre compte est à l'état inactif." ;
      
            return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
          }
      
          /* FACTURIER */
          if(item.data.operateur==8 ){
            if (item.etats.errorCode=='-12' || item.etats.errorCode==-12)
              return "Impossible de se connecter au serveur du partenaire. Merci de contacter le service client.";
            else if (item.etats.errorCode=='-11' || item.etats.errorCode==-11)
              return "Opèration annulée. La requête n'est pas parvenue au serveur. Merci de contacter le service client." ;
            else if (item.etats.errorCode=='-1' || item.etats.errorCode==-1)
              return "Impossible de se connecter au serveur du partenaire. Merci de réessayer plus tard." ;
            else if (item.etats.errorCode && (typeof item.etats.errorCode == 'string')) return item.etats.errorCode;
            return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
          }
          if(item.data.operateur==9){
          if(item.etats.errorCode=='-3' || item.etats.errorCode==-3){
            return "Service Indisponible Veuillez Reessayer Plus Tard";
          }
          if(item.etats.errorCode=="-7" || item.etats.errorCode==-7){
            return "Service Indisponible Veuillez Reessayer Plus Tard";
          }
          if(item.etats.errorCode=="2" || item.etats.errorCode==2){
            return "Votre requete est en cour de traitement";
          }
          if(item.etats.errorCode=="1" || item.etats.errorCode==1){
            return "Operation Reussie";
          }
      
          }
      
      
        }
}
