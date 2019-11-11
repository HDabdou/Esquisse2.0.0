import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { OrangeMoneyComponent } from './mobileMoney/orange-money/orange-money.component';
import { SendDataService } from '../service/send-data.service';
import { Subscription } from 'rxjs';
import { OrangeMoneyService } from '../service/orange-money.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { FreeMoneyService } from '../service/free-money.service';
import { EMoneyService } from '../service/e-money.service';
import { WizallService } from '../service/wizall.service';
import { AirtimeService } from '../service/airtime.service';

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
    //console.log(localStorage.getItem(operation)) ;

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
  /*======================================================
  *******Orange Money***************
  ========================================================= */
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



   retraitAvecCode(objet:any){
    let requete = "3/"+objet.data.coderetrait+"/"+objet.data.prenom+"/"+objet.data.nomclient+"/"+objet.data.date+"/"+objet.data.cni+"/"+objet.data.num+"/"+objet.data.montant;
    console.log(requete);
    
    let id=this.repeatedInLastFifteen('om-retraitcode', requete);
    if (id==-1){
      requete = requete+'R';
    }

    this._omService.requerirControllerOM(requete).then( resp => {
      if (resp.status==200){
          console.log("For this 'retrait-code', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
           this.updateOpInLastedFifteen('om-retraitcode',id);
        }
        else if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.updateOpInLastedFifteen('om-retraitcode',id);
            }
        else{
          setTimeout(()=>{
            this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
            let donnee=rep._body.trim().toString();
           // console.log("Inside verifier retrait: "+donnee) ;
            if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                   this.updateCaution();
                }
            else {
              if (donnee != '-1') {
                    objet.etats.etat = true;
                    objet.etats.load = 'terminated';
                    objet.etats.color = 'red';
                    objet.etats.errorCode = donnee;
                    this.updateOpInLastedFifteen('om-retraitcode',id);
              }
              else {
                let periodicVerifierOMRetraitCode = setInterval(()=>{
                  objet.etats.nbtour = objet.etats.nbtour + 1 ;
                  this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                    var donnee=rep._body.trim().toString();
                   // console.log("Inside verifier retrait: "+donnee) ;
                    if(donnee=='1'){
                      objet.etats.etat=true;
                      objet.etats.load='terminated';
                      objet.etats.color='green';
                      this.updateCaution();
                      clearInterval(periodicVerifierOMRetraitCode) ;
                    }else
                    if(donnee!='-1'){
                      objet.etats.etat=true;
                      objet.etats.load='terminated';
                      objet.etats.color='red';
                      objet.etats.errorCode=donnee;
                      clearInterval(periodicVerifierOMRetraitCode) ;
                      this.updateOpInLastedFifteen('om-retraitcode',id);
                    }
                    if(donnee=='-1' && objet.etats.nbtour>=5){
                      this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                        let donnee=rep._body.trim().toString();
                        if(donnee!='w'){
                          objet.etats.etat=true;
                          objet.etats.load='wait';
                          objet.etats.color='yellow';
                          objet.etats.errorCode=donnee;
                          this.updateOpInLastedFifteen('om-retraitcode',id);
                        }
                        else{
                          objet.etats.etat=true;
                          objet.etats.load='terminated';
                          objet.etats.color='red';
                          objet.etats.errorCode="c";
                          clearInterval(periodicVerifierOMRetraitCode) ;
                          this.updateOpInLastedFifteen('om-retraitcode',id);
                        }
                      }) ;
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



  acheterCredit(objet:any){

    let requete = "5/"+objet.data.num+"/"+objet.data.montant;
   // console.log("Achat de crédit avec : "+requete) ;
    let id=this.repeatedInLastFifteen('om-vente-credit', requete);
    if (id==-1)
           requete = requete+'R' ;

    this._omService.requerirControllerOM(requete).then( resp => {
      if (resp.status==200){

            if(resp._body.trim()=='0'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='0';
               this.updateOpInLastedFifteen('om-vente-credit',id);
            }else
            if(resp._body.trim()=='-12'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.updateOpInLastedFifteen('om-vente-credit',id);
            }
            else{
              setTimeout(()=>{
              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                let donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
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
                     this.updateOpInLastedFifteen('om-vente-credit',id);

                  }
                  else{
                        let periodicVerifierOMAcheterCredit = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                          let donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='green';
                             this.updateCaution();
                             clearInterval(periodicVerifierOMAcheterCredit) ;
                          }
                          else{
                            if(donnee!='-1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             clearInterval(periodicVerifierOMAcheterCredit) ;
                             this.updateOpInLastedFifteen('om-vente-credit',id);
                            }
                            if(donnee=='-1' && objet.etats.nbtour>=5){
                              console.log('avant anulation')
                              this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                                let donnee=rep._body.trim().toString();
                                 console.log('si bir annulation bi');

                                if(donnee!='w'){
                                  objet.etats.etat=true;
                                  objet.etats.load='wait';
                                  objet.etats.color='yellow';
                                  objet.etats.errorCode=donnee;
                                  this.updateOpInLastedFifteen('om-vente-credit',id);
                                }
                                else {
                                   objet.etats.etat=true;
                                   objet.etats.load='terminated';
                                   objet.etats.color='red';
                                   objet.etats.errorCode="c";
                                   clearInterval(periodicVerifierOMAcheterCredit) ;
                                   this.updateOpInLastedFifteen('om-vente-credit',id);
                                   //929992
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
   /*============================================================
   *************free money***************************************
   ============================================================== */
   deposertc(objet:any){

    console.log("Debut 1- "+JSON.stringify(objet))
    let requete = "1/"+objet.data.num+"/"+objet.data.montant ;
    let id=this.repeatedInLastFifteen('tc-depot', requete);
    if (id==-1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      return 0 ;
    }
    this._tcService.requerirControllerTC(requete).then( resp => {
      if (resp.status==200){
        console.log("requerirControllerTC : "+resp._body) ;
        if(resp._body.trim()=='0'){
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode='0';
          this.updateOpInLastedFifteen('tc-depot',id);
        }else
        if(resp._body.match('-12')){
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode='-12';
          this.updateOpInLastedFifteen('tc-depot',id);
        }
        else{
          setTimeout(()=>{
            this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
              let donnee=rep._body.trim().toString();
              console.log("verifierReponseTC : "+donnee) ;
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
                  this.updateOpInLastedFifteen('tc-depot',id);
                } else{
                  let periodicVerifierTCDepot = setInterval(()=>{
                    console.log("periodicVerifierTCDepot : "+objet.etats.nbtour) ;
                    objet.etats.nbtour = objet.etats.nbtour + 1 ;
                    this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                      let donnee=rep._body.trim().toString();
                      console.log("verifierReponseTC 1 : "+donnee) ;
                      if(donnee=='1'){
                        objet.etats.etat=true;
                        objet.etats.load='terminated';
                        objet.etats.color='green';
                        this.updateCaution();
                        clearInterval(periodicVerifierTCDepot) ;
                      }
                      else{
                        if(donnee!='-1'){
                          objet.etats.etat=true;
                          objet.etats.load='terminated';
                          objet.etats.color='red';
                          objet.etats.errorCode=donnee;
                          clearInterval(periodicVerifierTCDepot) ;
                          this.updateOpInLastedFifteen('tc-depot',id);
                        }
                        if(donnee=='-1' && objet.etats.nbtour>=9){
                          this._tcService.demanderAnnulationTC(resp._body.trim().toString()).then(rep =>{
                            console.log("demanderAnnulationTC : "+rep._body.trim().toString()) ;
                            let donnee=rep._body.trim().toString();
                            if(donnee=="c"){
                              objet.etats.etat=true;
                              objet.etats.load='terminated';
                              objet.etats.color='red';
                              objet.etats.errorCode="c";
                              clearInterval(periodicVerifierTCDepot) ;
                              this.updateOpInLastedFifteen('tc-depot',id);
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


  retirertc(objet:any){
    let requete = "2/"+objet.data.num+"/"+objet.data.montant ;
    let id=this.repeatedInLastFifteen('tc-retrait', requete);
    if (id==-1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      return 0 ;
    }

    this._tcService.requerirControllerTC(requete).then( resp => {
      if (resp.status==200){

        console.log("For this 'retrait', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
           this.updateOpInLastedFifteen('tc-retrait',id);
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.updateOpInLastedFifteen('tc-retrait',id);
            }
            else{
              setTimeout(()=>{
              this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                let donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                }
                else{
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   this.updateOpInLastedFifteen('tc-retrait',id);
                  }
                  else{
                    let periodicVerifierTCRetirer = setInterval(()=>{
                      console.log("periodicVerifierTCRetirer : "+objet.etats.nbtour) ;
                      objet.etats.nbtour = objet.etats.nbtour + 1 ;
                      this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                        let donnee=rep._body.trim().toString();
                        console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='green';
                           clearInterval(periodicVerifierTCRetirer) ;
                        }
                        else{
                          if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           clearInterval(periodicVerifierTCRetirer) ;
                           this.updateOpInLastedFifteen('tc-retrait',id);
                          }
                          if(donnee=='-1' && objet.etats.nbtour>=5){
                            this._tcService.demanderAnnulationTC(resp._body.trim().toString()).then(rep =>{
                              console.log("demanderAnnulationTC : "+rep._body.trim().toString()) ;
                              let donnee=rep._body.trim().toString();
                              if(donnee=="c"){
                                objet.etats.etat=true;
                                objet.etats.load='terminated';
                                objet.etats.color='red';
                                objet.etats.errorCode="c";
                                clearInterval(periodicVerifierTCRetirer) ;
                                this.updateOpInLastedFifteen('tc-retrait',id);
                              }
                            }) ;
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

  retraitaveccodetc(objet:any){
    let requete = "4/"+objet.data.coderetrait+"/"+objet.data.typepiece+"/"+objet.data.numeropiece+"/"+objet.data.montant+"/"+objet.data.num;
    console.log(requete);
    let id=this.repeatedInLastFifteen('tc-retrait', requete);

    if (id==-1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      return 0 ;
    }

    this._tcService.requerirControllerTC(requete).then( resp => {
      if (resp.status==200){

        console.log("For this 'retrait', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
           this.updateOpInLastedFifteen('tc-retrait',id);
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.updateOpInLastedFifteen('tc-retrait',id);
            }
            else{
              setTimeout(()=>{
              this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                let donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
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
                   this.updateOpInLastedFifteen('tc-retrait',id);
                  }
                  else{
                    let periodicVerifierTCRetraitCode = setInterval(()=>{
                      console.log("periodicVerifierTCRetraitCode : "+objet.etats.nbtour) ;
                      objet.etats.nbtour = objet.etats.nbtour + 1 ;
                      this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                        let donnee=rep._body.trim().toString();
                        console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='green';
                           this.updateCaution();
                           clearInterval(periodicVerifierTCRetraitCode) ;
                        }
                        else{
                          if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           clearInterval(periodicVerifierTCRetraitCode) ;
                           this.updateOpInLastedFifteen('tc-retrait',id);
                          }
                          if(donnee=='-1' && objet.etats.nbtour>=9){
                            this._tcService.demanderAnnulationTC(resp._body.trim().toString()).then(rep =>{
                              console.log("demanderAnnulationTC : "+rep._body.trim().toString()) ;
                              let donnee=rep._body.trim().toString();
                              if(donnee=="c"){
                                objet.etats.etat=true;
                                objet.etats.load='terminated';
                                objet.etats.color='red';
                                objet.etats.errorCode="c";
                                clearInterval(periodicVerifierTCRetraitCode) ;
                                this.updateOpInLastedFifteen('tc-retrait',id);
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
/*======================================================
*******************E-money*****************************
======================================================== */

depotEmoney(objet:any){
  this.Emservice.depot(objet.data.mnt,objet.data.numclient).then(rep =>{
    console.log(rep);
    if(parseInt(rep.status)==200){
      let reponse=rep['_body'].trim().toString();
      if(reponse=='0'){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode=reponse;
      }else{
        if(reponse=='-12'){
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode='-12';
         }else{
           setTimeout(()=>{
             this.Emservice.getReponse(reponse).then(rep2 =>{
               console.log(rep2);
               let reponse2=rep2['_body'].trim().toString();
               if(reponse2=='1'){
                  objet.etats.etat=true;
                  objet.etats.load='terminated';
                  objet.etats.color='green';
                  objet.etats.errorCode=reponse2;
               }else{
                  if(reponse2!='-1'){
                    objet.etats.etat=true;
                    objet.etats.load='terminated';
                    objet.etats.color='red';
                    objet.etats.errorCode=reponse2;
                  }else{
                    let idinterval=setInterval(()=>{
                      this.Emservice.getReponse(reponse).then(rep3 =>{
                        console.log(rep3);
                        let reponse3=rep3['_body'].trim().toString();
                        if(reponse3=='1'){
                          objet.etats.etat=true;
                          objet.etats.load='terminated';
                          objet.etats.color='green';
                          objet.etats.errorCode=reponse2;
                          clearInterval(idinterval);
                        }else{
                          if(reponse3!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=reponse3;
                           clearInterval(idinterval) ;
                          }
                        }
                      });
                    },10000);
                  }
               }
             });
           },17000);
         }
      }
    }else{
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';

    }
  });
}
retraitEmoney(objet:any){
  this.Emservice.retrait(objet.data.montant,objet.data.tel).then(rep =>{
    console.log(rep);
    if(parseInt(rep['status'])==200){
      let reponse=rep['_body'].trim().toString();
      if(reponse=='0'){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode=reponse;
      }else{
        if(reponse=='-12'){
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode='-12';
         }else{
           setTimeout(()=>{
             this.Emservice.getReponse(reponse).then(rep2 =>{
               console.log(rep2);
               let reponse2=rep2['_body'].trim().toString();
               if(reponse2=='1'){
                  objet.etats.etat=true;
                  objet.etats.load='terminated';
                  objet.etats.color='green';
                  objet.etats.errorCode=reponse2;
               }else{
                  if(reponse2!='-1'){
                    objet.etats.etat=true;
                    objet.etats.load='terminated';
                    objet.etats.color='red';
                    objet.etats.errorCode=reponse2;
                  }else{
                    let idinterval=setInterval(()=>{
                      this.Emservice.getReponse(reponse).then(rep3 =>{
                        console.log(rep3);
                        let reponse3=rep3['_body'].trim().toString();
                        if(reponse3=='1'){
                          objet.etats.etat=true;
                          objet.etats.load='terminated';
                          objet.etats.color='green';
                          objet.etats.errorCode=reponse2;
                          clearInterval(idinterval);
                        }else{
                          if(reponse3!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=reponse3;
                           clearInterval(idinterval) ;
                          }
                        }
                      });
                    },10000);
                  }
               }
             });
           },17000);
         }
      }
    }else{
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';

    }
  });

}
/******************************************************************************************************/

  /************************************ Debut Wizall ******************************************************************/

  cashInWizall(objet : any){
    console.log('cashInWizall'+ objet.data.num, objet.data.montant);
    this._wizallService.intouchCashin("test 1", objet.data.num, objet.data.montant).then( response =>{
      if(typeof response !== 'object') {
        objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
      }
      else if(response.commission!=undefined){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        this.updateCaution();
      }
      else{
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode=500;
      }
    }).catch(response => {
      objet.etats.errorCode == response;
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
    });
  }

  cashOutWizall(objet : any){
    console.log('cashOutWizall');
    this._wizallService.intouchCashout(objet.data.num, objet.data.montant).then( response =>{
      console.log("*************************") ;
      if(typeof response !== 'object') {
        objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
      }
      else if(response.commission!=undefined){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        this.updateCaution();
      }
      else{
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode=500;
      }
    }).catch(response => {
      objet.etats.errorCode == response;
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
    });
  }

  validerenvoibon(objet:any){
    this._wizallService.validerenvoiboncash(objet).then(response =>{
      console.log("Envoi de bon via Accueil!");
      if(typeof response !== 'object') {
        objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
      }
      else if(response.status=="valid"){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        this.updateCaution();
      }
      else if(response.code !== undefined && JSON.parse(response.code).status && JSON.parse(response.code).status=="valid"){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        this.updateCaution();
      }
      else if(response.code !== undefined && JSON.parse(response.code).code && JSON.parse(response.code).code==500){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode = JSON.parse(response.code).error
      }
      else{
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
      }
    }).catch(response => {
      objet.etats.errorCode == response;
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
    });
  }

  validationretraitbon(objet:any){
    this._wizallService.bonDebitVoucher(objet.data).then(response =>{
      console.log("Retrait de bon via Accueil!");
      if(typeof response !== 'object') {
        objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
      }
      else if( response.timestamp != undefined ){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        this.updateCaution();
      }else{
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode = 500

      }
    }).catch(response => {
      objet.etats.errorCode == response;
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
    });

  }

  validerbonachat(objet:any){
    this._wizallService.validerbonachat(objet).then(response =>{
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='green';
      this.updateCaution();
    });
  }

  /************************************ FIN WIZALL ******************************************************************/

  /**===================================AIRTIME============================================== */
  validerAirtime(objet:any){
		this.airtimeService.Airtime(objet.data.nom,objet.data.numero,objet.data.montant).then(reponse =>{
		     console.log(typeof reponse);
		 if (reponse.status==200){
              console.log(reponse);
              console.log(reponse._body);
            if(reponse._body.trim()=='0'){
               console.log(reponse);
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='0';
            }else
            if(reponse._body.trim()=='-12'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
            }
            else
              setTimeout(()=>{
              this.airtimeService.verifierReponse(reponse._body.trim().toString()).then(rep =>{
                console.log(rep);
                let donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                   objet.etats.errorCode=donnee;
                }
                else{
                  if(donnee!='-1' && donnee!='2'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='red';
                     objet.etats.errorCode=donnee;

                   /*}else{
                        if(donnee=='2' || donnee==2){
							// objet.etats.etat=true;
							 objet.etats.load='loader';
							 objet.etats.color='orange';
							 objet.etats.errorCode=donnee;

                        }
                    */
                  }
                  else{
                        let periodicVerifierOMAcheterCredit = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this.airtimeService.verifierReponse(reponse._body.trim().toString()).then(rep =>{
                          let donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='green';
                              objet.etats.errorCode=donnee;
                             clearInterval(periodicVerifierOMAcheterCredit) ;
                          }
                          else{
                            if(donnee!='-1' && donnee!='2'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             clearInterval(periodicVerifierOMAcheterCredit) ;
                            }
                            if(donnee=='2'){
                             //objet.etats.etat=true;
                             objet.etats.load='loader';
                             objet.etats.color='orange';
                             objet.etats.errorCode=donnee;
                            // clearInterval(periodicVerifierOMAcheterCredit) ;
                            }
                            if(donnee=='-1' && objet.etats.nbtour>=6){
                              this.airtimeService.demanderAnnulation(reponse._body.trim().toString()).then(rep =>{
                                let donnee=rep._body.trim().toString();
                                 if(donnee=="c"){
                                   objet.etats.etat=true;
                                   objet.etats.load='terminated';
                                   objet.etats.color='red';
                                   objet.etats.errorCode="c";
                                   clearInterval(periodicVerifierOMAcheterCredit) ;
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
		});

  }
  myData(data){
    //console.log(data);
    let infoOperation:any;
    if(data){
      infoOperation={'etat':false,'id':this.process.length,'load':'loader','color':'', 'errorCode':'*', nbtour:0};
      let sesion={'data':data,'etats':infoOperation,'dataI':''};
      console.log(sesion);
      let operateur=sesion.data.operateur;
      if(operateur==2){
      let operation=sesion.data.operation;
      this.process.push(sesion);
          switch(operation){
            case 1:{
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
                   this.retraitAvecCode(sesion);
                   break;
            }
            case 4:{
             console.log(this.process);
                   //this.retraitCpteRecep(sesion);
                   break;
            }
            case 5:{
                   this.acheterCredit(sesion);
                   break;
            }
            default :break;
          }
      }
      if(operateur==3){
        let operation=sesion.data.operation;
        this.process.push(sesion);
        switch(operation){
          case 1:{
                this.deposertc(sesion);
                break;
                }
          case 2:{
                this.retirertc(sesion);
                break;
          }
          case 5:{
                  // this.creditIZItc(sesion) ;
                  console.log(sesion);
                  
                  break ;
                }
          case 6:{
                this.retraitaveccodetc(sesion) ;
                break ;
                }
          default :break;
        }
      }
      if(operateur==7){
        let operation=sesion.data.operation;
        this.process.push(sesion);
        switch(operation){
          case 1:{
            //this.cashInEmoney(sesion);
           // this.depotEmoney(sesion);
                break;
          }
          case 2:{
            // this.cashOutEmoney(sesion);
            //this.retraitEmoney(sesion);
              break;
          }
          case 3:{
              //this.cashOutPIN(sesion);
              break;
          }
          default : break;
          }
      
      }
      if(operateur==6){
        let operation=sesion.data.operation;
        this.process.push(sesion);
        switch(operation){
          case 1:{
            
            this.cashInWizall(sesion);
            break;
          }
          case 2:{
            
            this.cashOutWizall(sesion);
            break;
          }
          case 5:{
             this.validationretraitbon(sesion);
            break;
          }
          case 6:{
            console.log(sesion);
            console.log("envoie de bon cash");
            this.validerenvoibon(sesion);
            break;
          }
          case 7:{
            //this.validerbonachat(sesion);
            break;
          }
         default : break;
        }
      }
      if(operateur==9){
        this.process.push(sesion);
        if(sesion.data.operation==1){
          console.log(sesion);
          
           this.validerAirtime(sesion);
       }
     }
    }
  console.log("youpi");
    
  }
    constructor(private airtimeService:AirtimeService ,private _wizallService:WizallService ,private Emservice:EMoneyService ,private _tcService:FreeMoneyService,private dataService:SendDataService,private _omService:OrangeMoneyService,private modalService: BsModalService) {
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
        finprocess(etat:any,imprime:any){
          if(etat.data.operateur==5){
              //this.router.navigate(['/accueil','panier']);
            }
         if(etat.etats.etat==true){
    
         if(etat.etats.etat==true){
    
             if(etat.data.operateur!=2 && etat.data.operateur!=6 && etat.data.operateur!=3 && etat.data.operateur!=1 && etat.etats.color=='green'){
    
               
              // this.router.navigate(['accueil']);
               //setTimeout(()=>this.router.navigate(['accueil/impression']),100);
            }
    
               this.process.splice(etat.etats.id,1);
             for (let i=0 ; i<this.process.length ; i++){
              if(this.process[i].etats.id > etat.etats.id)
              this.process[i].etats.id = this.process[i].etats.id - 1 ;
             }
               console.log(etat.etats.id);
        }
      }
    }
}
