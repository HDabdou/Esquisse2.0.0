import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { Screen1Component } from './screen1/screen1.component';
import { Screen2Component } from './screen2/screen2.component';
import { CreateCompteComponent } from './create-compte/create-compte.component';
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
import { ZuuluComponent } from './mobileMoney/zuulu/zuulu.component';
import { KashKashComponent } from './mobileMoney/kash-kash/kash-kash.component';
import { PaiementMarchandComponent } from './paiement-marchand/paiement-marchand.component';
import { AirtimeComponent } from './airtime/airtime.component';

const routes: Routes = [
    { path: '', component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'facturier',
                loadChildren: './screen1/screen1.module#Screen1Module'
            },
            {
                path: 'transfertinternationnal',
                component: Screen2Component
            },
            {
                path: 'abonnement',
                component:CreateCompteComponent
            },
            {
                path: 'viremetbancaire',
                component:VirementBancaireComponent
            },
            {
                path: 'assurance',
                component:AssuranceComponent
            },
            {
                path: 'orangemoney',
                component:OrangeMoneyComponent
            },
            {
                path: 'freemoney',
                component:TigocashComponent
            },
            {
                path: 'emoney',
                component:EMoneyComponent
            },
            {
                path: 'wizall',
                component:WizallComponent
            },
            {
                path: 'postecash',
                component:PosteCashComponent
            },
            {
                path: 'senelec',
                component:SenelecComponent
            },
            {
                path: 'sde',
                component:SdeComponent
            },
            {
                path: 'woyofal',
                component:WoyofalComponent
            },
            {
                path: 'rapido',
                component:RapidoComponent
            },
            {
                path: 'ria',
                component:RiaComponent
            },
            {
                path: 'worldremit',
                component:WorldRemitComponent
            },
            {
                path: 'moneyexchange',
                component:MoneyExchangeComponent
            },
            {
                path: 'tnt',
                component:TntComponent
            },
            {
                path: 'canal',
                component:CanalComponent
            },
            {
                path: 'zuulu',
                component:ZuuluComponent
            },
            {
                path: 'kashkash',
                component:KashKashComponent
            },
            {
                path: 'paiementmarchand',
                component:PaiementMarchandComponent
            },
            {
                path: 'airtime',
                component:AirtimeComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
