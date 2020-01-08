import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {

    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

    public isLoginMode: boolean = true;
    public isLoading: boolean = false;
    public error: string = null;

    private closeSub: Subscription = null;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        
        if (form.invalid) {
            return;
        }

        this.isLoading = true;

        const email = form.value.email;
        const pass = form.value.password;

        let authObs: Observable<AuthResponseData>;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, pass);
        } else {
            authObs = this.authService.signup(email, pass);
        }
        
        authObs.subscribe(
            responseData => {

                this.isLoading = false;
                this.router.navigate(['/recipes']);

            },
            errorMessage => {

                this.showErrorAlert(errorMessage);
                this.isLoading = false;

            }
        );

        form.reset();

    }

    onHandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {
        
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();

        });

    }

    ngOnDestroy() {
        
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }

    }

}
