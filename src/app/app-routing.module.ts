import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { FirstlogComponent } from './firstlog/firstlog.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: 'soppipwdbifi',
        component: FirstlogComponent
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
        
    },
    {
        path: '',
        loadChildren: './layout/layout.module#LayoutModule',
        canActivate: [AuthGuard]
    }
   
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
