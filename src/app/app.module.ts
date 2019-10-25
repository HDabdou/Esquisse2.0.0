import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSortModule,
    MatCheckboxModule,
    MatInputModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MasterServiceService } from './service/master-service.service';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthService } from './service/auth.service';
import { AuthenticationServiceService } from './service/authentication-service.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FirstlogComponent } from './firstlog/firstlog.component';
import { HttpModule } from '@angular/http';


// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-javascript/sb-admin-material/master/dist/assets/i18n/',
        '.json'
    );*/
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
    declarations: [AppComponent, FirstlogComponent, ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        OverlayModule,
        HttpClientModule,
        HttpModule,
        FormsModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        
        ModalModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        FlexLayoutModule.withConfig({addFlexToParent: false})

    ],
    providers: [
        MasterServiceService,
        AuthService,
        AuthenticationServiceService,
    ],
    exports: [
        MatSortModule,
    ],

    bootstrap: [AppComponent]
})
export class AppModule {}
