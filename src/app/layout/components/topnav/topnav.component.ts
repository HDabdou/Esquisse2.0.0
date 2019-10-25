import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationServiceService } from 'src/app/service/authentication-service.service';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
    public pushRightClass: string;

    constructor(public router: Router, private translate: TranslateService,private authentificationService:AuthenticationServiceService) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onLoggedout() {
        
        this.authentificationService.loggout().then(access=>
            {
              console.log(access) ;
    
              if(access  == 1){
                localStorage.removeItem('isLoggedin');
                
                sessionStorage.clear();
                 this.router.navigate(['']);
               // window.location.reload() ;
              }else{
                localStorage.removeItem('isLoggedin');
                sessionStorage.clear();
                this.router.navigate(['']);
                // window.location.reload() ;
              }
            });
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
