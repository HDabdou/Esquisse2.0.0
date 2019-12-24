import { Component, OnInit } from '@angular/core';
import { MasterServiceService } from 'src/app/service/master-service.service';
import { Subscription } from 'rxjs';
import { SendDataService } from 'src/app/service/send-data.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public showMenu: string;
    subscription : Subscription;
    solde:any;
    data:any;
    constructor(private _masterService:MasterServiceService,private dataService:SendDataService,private _utilsService:UtilsService) {
        this.subscription = this.dataService.getDataSolde().subscribe(rep =>{
            this.data =rep;
            console.log(rep);
            
            this.updateCaution(this.subscription);  
        });
        //console.log("fi la ko beugué");
    }
    updateCaution(soldeN){
        if(isNaN(soldeN)){
            console.log("this is not a number");
            
        }else{
            this.solde = soldeN;
        }
    } 
    getSolde(){
        this._utilsService.checkCaution().then(res =>{
            this.solde =parseInt(res['_body'].split('"')[1]);
            
        })
    }
    currencyFormat(somme) : String{
        return Number(somme).toLocaleString() ;
      }
    ngOnInit() {
        this.showMenu = '';
        this._utilsService.checkCaution().then(res =>{
            console.log(res['_body'].split('"')[1]);
            console.log(parseInt(res['_body'].split('"')[1]));
            
            this.solde =parseInt(res['_body'].split('"')[1]);
            console.log(this.solde);
            
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
