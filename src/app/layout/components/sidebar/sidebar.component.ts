import { Component, OnInit } from '@angular/core';
import { MasterServiceService } from 'src/app/service/master-service.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public showMenu: string;
    solde:any;
    constructor(private _masterService:MasterServiceService) {}
    getSolde(){
        this._masterService.getSolde().then(res =>{
           this.solde = res['caution']
            
        })
    }
    currencyFormat(somme) : String{
        return Number(somme).toLocaleString() ;
      }
    ngOnInit() {
        this.showMenu = '';
        this._masterService.getSolde().then(res =>{
            this.solde = res['caution']
            
        })
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}
