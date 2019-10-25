import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCheckboxModule, MatInputModule } from '@angular/material';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationServiceService } from '../service/authentication-service.service';
import { HttpModule } from '@angular/http';
import { LoaderModule } from '../shared/modules/loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        FormsModule,
        HttpModule,
        LoaderModule,
        FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    providers: [
        AuthenticationServiceService,
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
