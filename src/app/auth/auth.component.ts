import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {

    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

    public isLoginMode: boolean = true;
    public isLoading: boolean = false;
    public error: string = null;

    private closeSub: Subscription = null;
    private storeSub: Subscription = null;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {

        this.storeSub = this.store.select('auth').subscribe(authState => {
            
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error) {
                this.showErrorAlert(this.error);
            }

        });

    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        
        if (form.invalid) {
            return;
        }

        this.isLoading = true;

        const email = form.value.email;
        const password = form.value.password;

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({ email, password }));
        } else {
            this.store.dispatch(new AuthActions.SignupStart({ email, password }));
        }

        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
        });

        form.reset();

    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());
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

        this.storeSub.unsubscribe();

    }

}
