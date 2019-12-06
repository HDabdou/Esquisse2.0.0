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
import { CanalService } from '../service/canal.service';
import { FactureService } from '../service/facture.service';
import { TntService } from '../service/tnt.service';
import { TarifsService } from '../service/tarifs.service';
import { PosteCashComponent } from './mobileMoney/poste-cash/poste-cash.component';
import { PosteCashService } from '../service/poste-cash.service';
import { TransfertInternatinnalService } from '../service/transfert-internatinnal.service';
import { UtilsService } from '../service/utils.service';

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
    dataImpression:any;
    autorisedUser:number = 0;
    message:string;
    solde:any;
     // om:OrangeMoneyComponent;
 
     @ViewChild('waitingmodal') public waitingmodal:ModalDirective;

   updateCaution(){
    console.log("updateCaution 1");
    console.log("autorisedUser "+this.autorisedUser);
    if ( this.autorisedUser == 1){
      this._utilsService.checkCaution().then(res =>{
        console.log(res['_body'].split('"')[1]);
        console.log(parseInt(res['_body'].split('"')[1]));
        
        this.solde =parseInt(res['_body'].split('"')[1]);
        console.log(this.solde);
        this.dataService.sendData(this.solde);
        console.log(this.solde);
        this.dataService.clearData();
        console.log("Le solde vaut "+this.solde) ;
    })
    }
    
     /* this._utilsService.checkCaution().then(
        data => {
          console.log(data) ;
          this.solde = data ;
          this.dataService.sendData(this.solde)
          this.dataService.clearData();
          console.log("Le solde vaut "+data) ;
        },
        error => alert(error),
       
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

  /**==============================================================
   * *****************************CANAL Plus**********************
   * ============================
   */
  payerCanalReab(objet){
    
    let infosClient = {'operation':'CANAL Réabonnement', 'nomclient': objet.data.nomclient,
     'prenom' : objet.data.prenom, 'tel': objet.data.tel, 'numAbo': objet.data.numAbo,
      'numDec' : objet.data.numDec, 'numCarte' : objet.data.numCarte,
       'formule': objet.data.formule, 'montant' : objet.data.montant, 
       'nbreMois' : objet.data.nbreMois, 'charme' : objet.data.charme, 'pvd' : objet.data.pvd, 'ecranII' : objet.data.deuxiemeEcran} ;
    
    //console.log(infosClient) ;

    let infosToSend = JSON.stringify(infosClient) ;

    this._canalService.payer(infosToSend).then(response =>{
      console.log(response._body);
      if(response._body==1){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        objet.etats.errorCode="*";
        
        objet.dataI = {
          apiservice:'canal',
          service:'reabonnement',
          infotransaction:{
            client:{
              transactionBBS: response.idtransactionbbs,
              prenom:objet.data.prenom,
              nom:objet.data.nomclient,
              telephone:objet.data.tel,
              carte:objet.data.numCarte,
              chip:objet.data.numAbo,
              typebouquet:objet.data.formule,
              montant: objet.data.montant,
              duree:objet.data.nbreMois
            },

          },
        }
    
      }else{
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode=response._body;
      }
    });
  }

  payerCanalRec(objet){
    
    let infosClient = {'operation':'CANAL Recrutement', 'nomclient': objet.data.nomclient,
     'prenom' : objet.data.prenom, 'tel': objet.data.tel,
      'numAbo': objet.data.numAbo, 'numDec' : objet.data.numDec, 'numCarte' : objet.data.numCarte, 'formule': objet.data.formule, 'montant' : objet.data.montant, 'nbreMois' : objet.data.nbreMois, 'charme' : objet.data.charme, 'pvd' : objet.data.pvd, 'ecranII' : objet.data.deuxiemeEcran} ;
    
    //console.log(infosClient) ;

    let infosToSend = JSON.stringify(infosClient) ;

    this._canalService.payer(infosToSend).then(response =>{
      console.log(response._body);
      if(response._body==1){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        objet.etats.errorCode="*";
        objet.dataI = {
          apiservice:'canal',
          service:'recrutement',
          infotransaction:{
            client:{
              transactionBBS: response.idtransactionbbs,
              prenom:objet.data.prenom,
              nom:objet.data.nomclient,
              telephone:objet.data.tel,
              carte:objet.data.numCarte,
              chip:objet.data.numDec,
              typebouquet:objet.data.formule,
              montant: objet.data.montant,
              duree:objet.data.nbreMois
            },

          },
        }
      }else{
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode=response._body;
      }
    });
  }
  /**=====================================================
   * *****************Facture*****************************
   * ==================================================
   */
  validerpaimentsenelec(objet){
		this._facturierService.validerpaimentsenelec(objet.data.police,objet.data.num_facture,objet.data.montant,objet.data.telephone).then(reponse =>{
      console.log(reponse);
      let tontou=reponse["_body"].trim();
      if(tontou=="0"){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode="Vous n'etes pas autorise a effectue cette transaction.";
      }else{
      setTimeout(()=>{
        this._facturierService.getReponse(tontou).then(rep =>{
          let Tontou=rep["_body"].trim();
          if(Tontou!="no"){
            switch(parseInt(Tontou)){
              case 200:{
                objet.dataI = {
                  apiservice:'facturier',
                  service:'senelec',
                  infotransaction:{
                    client:{
                      transactionApi: "y-y-y-y",
                      transactionBBS: 'x-x-x-x',
                      police: objet.data.police,
                      numfacture: objet.data.num_facture,
                      client: "",
                      montant: objet.data.montant,
                      dateecheance: objet.data.echeance,
                    },

                  },
                }
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='green';
                this.updateCaution();
                break;

              }
              case 400:{
                objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Veulliez reessayer plus tard.";
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='red';
                break;
              }
              case 600:{
                objet.etats.errorCode = "Numero facture ou reference incorrect";
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='red';
                break;
              }
              case 700:{
                objet.etats.errorCode = "Facture deja payée.";
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='red';
                break;
              }
              case 800:{
                objet.etats.color='orange';
								objet.etats.errorCode='Votre requete est en cour de traitement veuillez patienter svp.';
								break;
              }
              default :{
                break;
              }

            }

          }else{
            let nb=0;
            let timer=setInterval(()=>{
              if(nb<15){
                nb++;
              this._facturierService.getReponse(tontou).then(rep =>{
                let t=rep["_body"].trim();
                if(t!="no"){
                  switch(parseInt(t)){
                    case 200:{
                      objet.dataI = {
                        apiservice:'facturier',
                        service:'senelec',
                        infotransaction:{
                          client:{
                            transactionApi: "y-y-y-y",
                            transactionBBS: 'x-x-x-x',
                            police: objet.data.police,
                            numfacture: objet.data.num_facture,
                            client: "",
                            montant: objet.data.montant,
                            dateecheance: objet.data.echeance,
                          },

                        },
                      }
                      objet.etats.etat=true;
                      objet.etats.load='terminated';
                      objet.etats.color='green';
                      this.updateCaution();
                      clearInterval(timer);
                      break;
                    }
                    case 400:{
                      objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Veulliez reessayer plus tard.";
                      objet.etats.etat=true;
                      objet.etats.load='terminated';
                      objet.etats.color='red';
                      clearInterval(timer);
                      break;
                    }
                    case 600:{
                      objet.etats.errorCode = "Numero facture ou reference incorrect";
                      objet.etats.etat=true;
                      objet.etats.load='terminated';
                      objet.etats.color='red';
                      clearInterval(timer);
                      break;
                    }
                    case 700:{
                      objet.etats.errorCode = "Facture deja payée.";
                      objet.etats.etat=true;
                      objet.etats.load='terminated';
                      objet.etats.color='red';
                      clearInterval(timer);
                      break;
                    }
                    case 800:{
                      objet.etats.color='orange';
                      objet.etats.errorCode='Votre requete est en cour de traitement veuillez patienter svp.';
                      clearInterval(timer);
                      break;
                    }
                    default :{
                      break;
                    }

                  }

                }

              });

            }else{
              this._facturierService.annulation(tontou).then(rep =>{
                let serverRep=rep["_body"].trim();
                console.log(serverRep);
                if(serverRep=="ko"){
                  objet.etats.errorCode = "Operation annule.";
                  objet.etats.etat=true;
                  objet.etats.load='terminated';
                  objet.etats.color='red';
                  clearInterval(timer);
                }else{
                  if(serverRep=="200"){
                    objet.etats.etat=true;
                    objet.etats.load='terminated';
                    objet.etats.color='green';
                    clearInterval(timer);
                  }
                }
              });

            }
           },10000);
          }
        });
      },30000);
     }
		});
   }
   validerwoyofal(objet){
    console.log('nns');
     this._facturierService.validerwoyofal(objet.data.montant, objet.data.compteur,objet.data.telephone,'').then(response =>{
       console.log(response) ;
       if(typeof response !== 'object') {
         objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
         objet.etats.etat=true;
         objet.etats.load='terminated';
         objet.etats.color='red';
       }
       else if( (typeof response.errorCode != "undefined") && response.errorCode == "0" && response.errorMessage == ""){
         objet.dataI = {
           apiservice:'facturier',
           service:'achatcodewayafal',
           infotransaction:{
             client:{
               transactionPostCash: response.transactionId,
               transactionBBS: 'x-x-x-x',
               codewoyafal: response.code,
               montant: objet.data.montant,
               compteur: objet.data.compteur,
             },
           },
         };
         objet.etats.etat=true;
         objet.etats.load='terminated';
         objet.etats.color='green';
         this.updateCaution();
       }
       else if(typeof response.errorMessage == "string"){
         objet.etats.errorCode = response.errorMessage
         objet.etats.etat=true;
         objet.etats.load='terminated';
         objet.etats.color='red';
       }
       else{
         objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
         objet.etats.etat=true;
         objet.etats.load='terminated';
         objet.etats.color='red';
       }
     }).catch(response => {
       console.log(response);
       objet.etats.errorCode = response;
       objet.etats.etat=true;
       objet.etats.load='terminated';
       objet.etats.color='red';
     });
   }
   payeroolusolar(objet){
    this._facturierService.payeroolusolar("00221"+objet.data.telephone.toString(),objet.data.compte,objet.data.montant).then(response =>{
      console.log(response);
      let Response = JSON.parse(response);
      console.log(Response);

      if(Response.errorCode==0){
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';
          this.updateCaution();
      }else{
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode=Response.errorMessage;
      }
    });
  }
  validerrapido(objet){
    console.log(objet);
    this._facturierService.validerrapido(objet.data.numclient,objet.data.montant,objet.data.badge).then(response =>{
      console.log(response);
      if(typeof response !== 'object') {
        objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
      }
      else if(response.errorCode==0){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='green';
        this.updateCaution();
        this.dataImpression = {
          apiservice:'facturier',
          service:'rapido',
          infotransaction:{
            client:{
              transactionBBS: 'x-x-x-x',
              badge: objet.data.badge,
              numclient: objet.data.numclient,
              montant: objet.data.montant,
              transactionID:response.transactionid
            },

          },
        }
        sessionStorage.setItem('dataImpression', JSON.stringify(this.dataImpression));
      }else{
        objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
      }
    }).catch(response => {
      console.log(response);
      objet.etats.errorCode = response;
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
    });
  }
  paiemantsde(objet){
    this._facturierService.paimentsde(objet.data.reference_client,objet.data.telephone,objet.data.reference_facture,objet.data.montant).then( resp =>{
      console.log("********************************************************");
      let serverResponse=resp["_body"].trim();
    if(serverResponse=="0"){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode="Vous n'etes pas autorise a effectue cette transaction.";
    }else{
      setTimeout(()=>{
		this._facturierService.getReponse(serverResponse).then(tontou =>{
			let TonTou=tontou["_body"].trim();
			if(TonTou!="no"){
					switch(parseInt(TonTou)){
						case 200:{
							let donnees=TonTou.split("#");
							objet.dataI = {
							apiservice:'facturier',
							service:'sde',
							infotransaction:{
							client:{
							  transactionApi: 256665,
							  transactionBBS: 'x-x-x-x',
							  reference_client: objet.data.reference_client,
							  reference_facture: objet.data.reference_facture,
							  client: "",
							  date_echeance: objet.data.echeance,
							  montant: objet.data.montant,
							 },

							},
						   };
							objet.etats.etat=true;
							objet.etats.load='terminated';
							objet.etats.color='green';
							this.updateCaution();
							break;
						}
						case 400:{
							objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Veulliez reessayer plus tard."
							objet.etats.etat=true;
							objet.etats.load='terminated';
							objet.etats.color='red';
							break;
						}
						case 600:{
							objet.etats.errorCode = "Numero facture ou reference incorrect"
							objet.etats.etat=true;
							objet.etats.load='terminated';
							objet.etats.color='red';
							break;
						}
						case 700:{
							objet.etats.errorCode = "Facture deja payée."
							objet.etats.etat=true;
							objet.etats.load='terminated';
							objet.etats.color='red';
							break;
						}
						case 800:{
						    objet.etats.color='orange';
						    objet.etats.errorCode='Votre requete est en cour de traitement veuillez patienter svp.';
							break;
						}
						default :{
							break;
						}
					}
			}else{
          let nb=0;
			     let timer=setInterval(()=>{
             if(nb<15){
                this._facturierService.getReponse(serverResponse).then(reponse =>{
                  let rep=reponse["_body"].trim();
                  if(rep!="no"){
                    switch(parseInt(rep)){
                      case 200:{
                        //let donnees=TonTou.split("#");
                        objet.dataI = {
                        apiservice:'facturier',
                        service:'sde',
                        infotransaction:{
                        client:{
                          transactionApi: 256665,
                          transactionBBS: 'x-x-x-x',
                          reference_client: objet.data.reference_client,
                          reference_facture: objet.data.reference_facture,
                          client: "bbs invest",
                          date_echeance: objet.data.echeance,
                          montant: objet.data.montant,
                        },

                        },
                        };
                        objet.etats.etat=true;
                        objet.etats.load='terminated';
                        objet.etats.color='green';
                        this.updateCaution();
                        clearInterval(timer);
                        break;

                      }
                      case 400:{
                        objet.etats.errorCode = "Votre requête n'a pas pu être traitée correctement. Veulliez reessayer plus tard."
                        objet.etats.etat=true;
                        objet.etats.load='terminated';
                        objet.etats.color='red';
                        clearInterval(timer);
                        break;
                      }
                      case 600:{
                        objet.etats.errorCode = "Numero facture ou reference incorrect"
                        objet.etats.etat=true;
                        objet.etats.load='terminated';
                        objet.etats.color='red';
                        clearInterval(timer);
                        break;
                      }
                      case 700:{
                        objet.etats.errorCode = "Facture deja payée."
                        objet.etats.etat=true;
                        objet.etats.load='terminated';
                        objet.etats.color='red';
                        clearInterval(timer);
                        break;
                      }
                      case 800:{
                        objet.etats.color='orange';
                        objet.etats.errorCode='Votre requete est en cour de traitement veuillez patienter svp.';
                        break;
                          }
                      default :{
                        break;
                      }
                }

                  }
                });

          }else{
            this._facturierService.annulation(serverResponse).then(rep =>{
              let serverRep=rep["_body"].trim();
              console.log(serverRep);
              if(serverRep=="ko"){
                objet.etats.errorCode = "Operation annule.";
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='red';
                clearInterval(timer);
              }else{
                if(serverRep=="200"){
                  objet.etats.etat=true;
                  objet.etats.load='terminated';
                  objet.etats.color='green';
                  clearInterval(timer);
                }
              }
            });
          }
        },5000);
			}

		});
      },10000);
    }
    }).catch(response => {
      objet.etats.errorCode = response;
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
    });

  }
  /**================================================
   * ************************TNT*********************
   * ===============================================
   */
  validnabon(objet:any){
    this._tntService.abonner(objet.data.token, objet.data.prenom,objet.data.nomclient, objet.data.tel,objet.data.cni, objet.data.chip, objet.data.carte, objet.data.duree, objet.data.typedebouquet).then( response =>
      {

        let montant:number = 0;
        let typedebouquet = "" ;
        console.log(response);
        
        response = JSON.parse(response['_body']) ;
        if(response.response=="ok"){

           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='green';
           this.updateCaution();
          this._tarifsService.getTarifTntAbon({typedemande:'abonne',typedebouquet:Number(objet.data.typedebouquet),duree:Number(objet.data.duree)})
            .then(
              data => {
                console.log(data);
                if(data.errorCode){
                  typedebouquet = data.message.typedebouquetLetter;
                  montant = data.message.montant
                }
                else{
                  typedebouquet = data.errorMessage;
                }
              }),
              error => console.log(error),
              () => {
                objet.dataI = {
                  apiservice:'tnt',
                  service:'abonnement',
                  infotransaction:{
                    client:{
                      transactionBBS: response.idtransactionbbs,
                      prenom:objet.data.prenom,
                      nom:objet.data.nomclient,
                      telephone:objet.data.tel,
                      carte:objet.data.carte,
                      chip:objet.data.chip,
                      typebouquet:typedebouquet,
                      montant: montant,
                      duree:objet.data.duree
                    },

                  },
                }
              }
            
        }else{
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
      }

      });

  }
  vendreDecodeur(objet:any){

    this._tntService.vendreDecodeur(objet.data.token, objet.data.prenom,objet.data.nomclient,objet.data.tel, objet.data.adresse, objet.data.region, objet.data.cni,objet.data.chip,objet.data.carte, objet.data.duree, objet.data.typedebouquet, objet.data.montant).then( response =>
      {
        
        if(response=="ok"){

           objet.dataI = {
            apiservice:'tnt',
            service:'ventedecodeur',
            infotransaction:{
                client:{
                transactionBBS: 'Id BBS',
                prenom:objet.data.prenom,
                nom:objet.data.nomclient,
                telephone:objet.data.tel,
                chip:objet.data.chip,
                carte:objet.data.carte,
                montant:objet.data.montant,
                typedebouquet:objet.data.typedebouquet,
              },

            },
          } ;

          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';
          this.updateCaution();
        }else{
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
        }

      });
  }

  /*==================================================================================
  *********************************************POSTE CASH============================
  =====================================================================================*/
  validrechargementespecePostCash(objet:any){

    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

    this._postCashService.rechargementespece('00221'+objet.data.telephone+'',''+objet.data.montant).then(postcashwebserviceList => {
          console.log(postcashwebserviceList);

          if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){

          
          console.log(this.process[index]);

            //this.process[index].etats.pourcentage = 5;

            objet.etats.etat=true;
            objet.etats.load='terminated';
            objet.etats.color='#36A9E0';
           // this.process[index].etats.pourcentage = 5;
            objet.dataI = {
            apiservice:'postecash',
            service:'rechargementespece',

            infotransaction:{
              client:{
                transactionPostCash: postcashwebserviceList.transactionId,
                transactionBBS: 'Id BBS',
                telephone:'00221'+objet.data.telephone,
                montant:objet.data.montant,
              },

            },
          } ;
      }else{
            objet.etats.etat=true;
            objet.etats.load='terminated';
            objet.etats.color='red';
            this.process[index].etats.pourcentage = 5;
      }
    });

  }
  validateachatjula(objet:any){
    let index = this.process.findIndex(
      item => (item.data.mt_carte === objet.data.mt_carte && item.data.mt_carte === objet.data.mt_carte && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

    
     this._postCashService.achatjula(objet.data.mt_carte+'',objet.data.nb_carte+'').then(postcashwebserviceList => {
      

        if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
        
         this.process[index].etats.pourcentage = 5;
        
         let mt_carte = objet.data.nb_carte * objet.data.mt_carte ;
         objet.dataI = {
         

              apiservice:'postecash',
              service:'achatjula',
              infotransaction:{
                client:{
                  transactionPostCash: postcashwebserviceList.transactionId,
                  transactionBBS: 'id BBS',
                  typecarte:objet.data.mt_carte,
                  nbcarte:objet.data.nb_carte,
                  montant:mt_carte,
                },

              },
            }
         objet.etats.etat=true;
         objet.etats.load='terminated';
         objet.etats.color='red';
        }else{
             objet.etats.etat=true;
             objet.etats.load='terminated';
             objet.etats.color='#36A9E0';

             this.process[index].etats.pourcentage = 5;
        }
      });

  }
  /**===========================================================
   * ****************************Transfert internationnal*******
   * ===========================================================
   */
  retraitInternationnal(objet:any){
  this._transfertInternationnal.initSession().then(res =>{
    console.log(res);
    // console.log(JSON.parse(res['_body']));
      let correspondant =  JSON.parse(res['_body']).correspondant;
      console.log(correspondant);

      this._transfertInternationnal.payTransfert(objet.data.codeTransation,correspondant,objet.data.noTransaction,objet.data.typepiece,objet.data.numeropiece).then(
        res =>{
          console.log(res);
          if(res['_body'].trim() != ""){
            if(JSON.parse(res['_body']).status==1){
              objet.etats.etat=true;
              objet.etats.load='terminated';
              objet.etats.color='green';
              objet.etats.errorCode="*";
              objet.dataI = {
                apiservice:'TransfertInternationnal',
                service:'retrait',
                infotransaction:{
                  client:{
                    transactionBBS: "1234525",
                    prenom_emet:objet.data.prenom_emet,
                    nom_emet:objet.data.nom_emet,
                    prenom_benef:objet.data.prenom_benef,
                    nom_benef:objet.data.nom_benef,
                    code_transaction:objet.data.codeTransation,
                    numero_transaction:objet.data.noTransaction,
                    montant: objet.data.montant_payer,
                  }
                }
              }  
            }else{
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='red';
                objet.etats.errorCode=JSON.parse(res['_body']).status;
            }
          }else{
            objet.etats.etat=true;
            objet.etats.load='terminated';
            objet.etats.color='red';
            objet.etats.errorCode="-3";
          }
          
        }
      )
  })

  }
  envoieInternationnal(objet:any){
    this._transfertInternationnal.initSession().then(res =>{
      console.log(res);
      // console.log(JSON.parse(res['_body']));
        let correspondant =  JSON.parse(res['_body']).correspondant;
        console.log(correspondant);
  
        this._transfertInternationnal.send(JSON.stringify(objet.data.info),correspondant).then(
          res =>{
            console.log(objet.data,correspondant);
            //console.log(JSON.parse(res['_body']));
            if(res['_body'].trim() != ""){
              if(JSON.parse(res['_body']).status=="0" && JSON.parse(res['_body']).codetransaction  != ""){
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='green';
                objet.etats.errorCode="*";
                objet.dataI = {
                  apiservice:'TransfertInternationnal',
                  service:'envoie',
                  infotransaction:{
                    client:{
                      transactionBBS: "1234525",
                      prenom_emet:objet.data.info.prenom_emet,
                      nom_emet:objet.data.info.nom_emet,
                      ville_emet:objet.data.info.ville_emet,
                      pays_emet:objet.data.info.pays_emet,
                      adresse_emet:objet.data.info.adresse_emet,
                      prenom_benef:objet.data.info.prenom_benef,
                      nom_benef:objet.data.info.nom_benef,
                      ville_benef:objet.data.info.ville_benef,
                      pays_benef:objet.data.info.pays_benef,
                      adresse_benef: objet.data.info.adresse_benef,
                      montant_emis: objet.data.info.montant_emis,
                      devise_emission:objet.data.info.devise_emission,
                      //"success":200,
                      codetransaction:JSON.parse(res['_body']).codetransaction,
                      //"status":"0",
                      //"designationstatus":"TRANSFERT EN ATTENTE DE PAIEMENT"

                    }
                  }
                }  
                this.updateCaution();
              }else{
                  objet.etats.etat=true;
                  objet.etats.load='terminated';
                  objet.etats.color='red';
                  objet.etats.errorCode=JSON.parse(res['_body']).status;
              }
            }else{
              objet.etats.etat=true;
              objet.etats.load='terminated';
              objet.etats.color='red';
              objet.etats.errorCode="-1";
            }
            
          }
        )
    })
  
  }

 
  myData(data){
    //console.log(data);
    let infoOperation:any;
    if(data){
      infoOperation={'etat':false,'id':this.process.length,'load':'loader','color':'', 'errorCode':'*', nbtour:0};
      let sesion={'data':data,'etats':infoOperation,'dataI':''};
      console.log(sesion);
      let operateur=sesion.data.operateur;
      if(operateur==1){
      let operation=sesion.data.operation;
      this.process.push(sesion);
      switch(operation){
        case 1:{
              this.validrechargementespecePostCash(sesion);
              break;
        }
        case 2:{
              this.validateachatjula(sesion);
              break;
        }
        case 3:{
             // this.validatedetailfacturesenelec(sesion);
              break;
        }
        case 4:{
             // this.validateachatcodewoyofal(sesion);
              break;
        }
        default:break;
      }
      }
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
      if(operateur==4){
        let operation=sesion.data.operation;
        this.process.push(sesion);
        switch(operation){
          case 1:{
              this.validnabon(sesion);
                break;
                }
          case 2:{
                this.vendreDecodeur(sesion);
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
               this.depotEmoney(sesion);
                break;
          }
          case 2:{
            // this.cashOutEmoney(sesion);
            this.retraitEmoney(sesion);
              break;
          }
          case 3:{
              //this.cashOutPIN(sesion);
              break;
          }
          default : break;
          }
      
      }
      if(operateur==8){
        let operation=sesion.data.operation;
        this.process.push(sesion);
        switch(operation){
          case 1:{
            console.log(sesion);
               this.paiemantsde(sesion);
               break;
          }
          case 2:{
            console.log(sesion);
              this.validerrapido(sesion);
              break;
          }
          case 3:{
            console.log(sesion);
              this.validerwoyofal(sesion);
              break;
          }
          case 4:{
              console.log(sesion);
              this.validerpaimentsenelec(sesion);
              break;
          }
          case 5:{

              //this.payeroolusolar(sesion);
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
     
     if(operateur==11){
      this.process.push(sesion);
      if(sesion.data.operation==1){
        console.log(sesion);
        
        this.retraitInternationnal(sesion);
      }
      if(sesion.data.operation==2){
        console.log(sesion);
        
        this.envoieInternationnal(sesion);
      }
     }
     if(operateur == 12){
      this.process.push(sesion);
      if(sesion.data.operation==1){
        console.log(sesion);
        
         this.payerCanalReab(sesion);
     }
     if(sesion.data.operation==2){
       console.log(sesion);
       
        this.payerCanalRec(sesion);
    }

     }
    }
  console.log("youpi");
    
  }
    constructor(private _utilsService:UtilsService,private router:Router,private _transfertInternationnal:TransfertInternatinnalService, private _postCashService:PosteCashService ,private _tarifsService:TarifsService, private _tntService:TntService ,private _facturierService:FactureService ,private _canalService:CanalService, private airtimeService:AirtimeService ,private _wizallService:WizallService ,private Emservice:EMoneyService ,private _tcService:FreeMoneyService,private dataService:SendDataService,private _omService:OrangeMoneyService,private modalService: BsModalService) {
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
      
      if (!sessionStorage.getItem('currentUser'))
      this.router.navigate(['']);
     // this.processus();
     this._utilsService.isDepotCheckAuthorized().then(
       rep => {
         console.log(rep);
         
         let data = JSON.parse(rep["_body"])
         if(data.estautorise==1) this.autorisedUser = data.estautorise ;
         this.retrieveAlerteMessage() ;
       },
       error => alert(error),
      
     )
     //this.updateCaution()
       // this.onLoggedout();
    }
    retrieveAlerteMessage(){
      var periodicVerifier = setInterval(()=>{
        this._utilsService.consulterLanceurDalerte().then(
          data => {
            this.message=data.message;
          },
          error => alert(error),
         
        )
      },60000);
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
          if(item.data.operateur==11){
          if(item.etats.errorCode=='-3' || item.etats.errorCode==-3){
            return "Service Indisponible Veuillez Reessayer Plus Tard";
          }
          if(item.etats.errorCode=="224" || item.etats.errorCode==224){
            return "Wrong currency code (Mauvais code de devise)";
          }
          if(item.etats.errorCode=="222" || item.etats.errorCode==222){
            return "Correspondant not autorized to pay this transaction (Correspondant non autorisé à payer cette transaction)";
          }
          if(item.etats.errorCode=="224" || item.etats.errorCode==224){
            return "Wrong currency code (Mauvais code de devise)";
          }
          if(item.etats.errorCode=="223" || item.etats.errorCode==223){
            return "Transaction not autorized for this destination ( Transaction non autorisée pour cette destination)";
          }
          if(item.etats.errorCode=="225" || item.etats.errorCode==225){
            return "Wrong destination country: DESTINATION COUNTRY MUST BE SN  (Mauvais pays de destination : LE PAYS DE DESTINATION DOIT ÊTRE SN = SENEGAL )";
          }
          if(item.etats.errorCode=="226" || item.etats.errorCode==226){
            return "Session is expired ";
          }
          if(item.etats.errorCode=="228" || item.etats.errorCode==228){
            return "User locked (Utilisateur verrouillé)";
          }
          if(item.etats.errorCode=="230" || item.etats.errorCode==230){
            return "Bank account number invalid ( Numéro de compte bancaire invalide) ";
          }
          if(item.etats.errorCode=="231" || item.etats.errorCode==231){
            return "Error on the setting of fees ( Erreur sur la fixation des frais) ";
          }
          if(item.etats.errorCode=="232" || item.etats.errorCode==232){
            return "Error on the amount  (  Erreur sur le montant) ";
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
    
              sessionStorage.setItem('dataImpression', JSON.stringify(imprime));
               this.router.navigate(['impression']);
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
