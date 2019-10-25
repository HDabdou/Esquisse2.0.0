import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { Screen1Component } from './screen1/screen1.component';
import { Screen2Component } from './screen2/screen2.component';
import { CreateCompteComponent } from './create-compte/create-compte.component';
import { VirementBancaireComponent } from './virement-bancaire/virement-bancaire.component';
import { AssuranceComponent } from './assurance/assurance.component';

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
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
