import { Component, OnInit, TemplateRef, Input, Output,EventEmitter } from '@angular/core';
import { MasterServiceService } from 'src/app/service/master-service.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LayoutComponent } from '../../layout.component';
import { SendDataService } from 'src/app/service/send-data.service';

@Component({
  selector: 'app-orange-money',
  templateUrl: './orange-money.component.html',
  styleUrls: ['./orange-money.component.scss']
})
export class OrangeMoneyComponent implements OnInit {

  num:string;
  mtt:string;
  
  reinitialiser(){
    this.num=null;
    this.mtt=null;
  }
  @Input() bbs:number=0;
  @Output() changementOm=new EventEmitter();
  increment() {
    this.bbs++;
    console.log("si incremente bi"+this.bbs);
    this.changementOm.emit(this.bbs);
  }
  retirer(){
    let object ={'nom':'Orange money retrait','operateur':2,'operation':2,'montant':this.mtt,
    'num':this.num};
     this.dataService.sendData(object)
      this.increment();
      this.modalRef.hide();
      this.dataService.clearData();
      this.reinitialiser();
  }
  deposer(){
    
   // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.num,'num':this.mtt}));
  let object ={'nom':'Orange money dépot','operateur':2,'operation':1,'montant':this.mtt,
  'num':this.num};
   this.dataService.sendData(object)
    this.increment();
    this.modalRef.hide();
    this.dataService.clearData();
    this.reinitialiser();
  }
  operation:string;

  loadOperation(op){
    this.operation=op;
  }
  constructor(private dataService:SendDataService,private router:Router, private _masterService:MasterServiceService,private modalService: BsModalService) {

  }
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template,);
    }

  ngOnInit() {
  }

}
