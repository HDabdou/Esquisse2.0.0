import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MatSortModule,
    MAT_SNACK_BAR_DEFAULT_OPTIONS,
    MatSnackBar,
    MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
    MatCardModule,
    MatSelect,
    MatSelectModule,
    MAT_LABEL_GLOBAL_OPTIONS,
    MatFormFieldModule,
    MatRippleModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavComponent } from './nav/nav.component';
import { Screen2Component } from './screen2/screen2.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CreateCompteComponent } from './create-compte/create-compte.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationServiceService } from '../service/authentication-service.service';
import { AuthService } from '../service/auth.service';
import { MasterServiceService } from '../service/master-service.service';
import { HttpModule } from '@angular/http';
import { VirementBancaireComponent } from './virement-bancaire/virement-bancaire.component';
import { AssuranceComponent } from './assurance/assurance.component';
import { OrangeMoneyComponent } from './mobileMoney/orange-money/orange-money.component';
import { TigocashComponent } from './mobileMoney/tigocash/tigocash.component';
import { EMoneyComponent } from './mobileMoney/e-money/e-money.component';
import { WizallComponent } from './mobileMoney/wizall/wizall.component';
import { PosteCashComponent } from './mobileMoney/poste-cash/poste-cash.component';
import { SenelecComponent } from './facturier/senelec/senelec.component';
import { SdeComponent } from './facturier/sde/sde.component';
import { WoyofalComponent } from './facturier/woyofal/woyofal.component';
import { RapidoComponent } from './facturier/rapido/rapido.component';
import { RiaComponent } from './transfertInternationnal/ria/ria.component';
import { WorldRemitComponent } from './transfertInternationnal/world-remit/world-remit.component';
import { MoneyExchangeComponent } from './transfertInternationnal/money-exchange/money-exchange.component';
import { TntComponent } from './abonnementTv/tnt/tnt.component';
import { CanalComponent } from './abonnementTv/canal/canal.component';
import { KashKashComponent } from './mobileMoney/kash-kash/kash-kash.component';
import { ZuuluComponent } from './mobileMoney/zuulu/zuulu.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        MatTableModule,
        FlexLayoutModule,
        MatGridListModule,
        MatSortModule,
        FormsModule,
        HttpClientModule,
        HttpModule,
        MatSelectModule,
          
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ModalModule.forRoot(),
        TranslateModule,
        PopoverModule.forRoot(),
        

      
        
    ],
    providers: [
        MasterServiceService,
        AuthService,
        AuthenticationServiceService,
        MatSnackBar,
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY, useValue: {duration: 2500}},
    ],
    exports: [
        MatSortModule,],
    declarations: [Screen2Component, LayoutComponent, NavComponent, TopnavComponent, SidebarComponent, CreateCompteComponent, VirementBancaireComponent, AssuranceComponent, OrangeMoneyComponent, TigocashComponent, EMoneyComponent, WizallComponent, PosteCashComponent, SenelecComponent, SdeComponent, WoyofalComponent, RapidoComponent, RiaComponent, WorldRemitComponent, MoneyExchangeComponent, TntComponent, CanalComponent, ZuuluComponent, KashKashComponent, ]

})
export class LayoutModule { }
