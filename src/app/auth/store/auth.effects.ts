import { Actions, ofType, Effect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
    kind?: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {

    private readonly baseUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts';

    @Effect()
    public authSignup: Observable<any> = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {

            return this.http.post<AuthResponseData>(
                this.baseUrl + ':signUp?key=' + environment.firebaseApiKey,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)),
                catchError(errorRes => this.handleError(errorRes))
            );

        })
    );

    @Effect()
    public authLogin:Observable<any> = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {

            return this.http.post<AuthResponseData>(
                this.baseUrl + ':signInWithPassword?key=' + environment.firebaseApiKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true,
                }
            ).pipe(
                map(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)),
                catchError(errorRes => this.handleError(errorRes))
            );
            
        })
    );

    @Effect({ dispatch: false })
    public authRedirect:Observable<any> = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {

            if (authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }

        })
    );

    @Effect()
    public autoLogin: Observable<any> = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(
                localStorage.getItem('userData')
            );
    
            if (!userData) {
                return { type: 'STUB' };
            }
    
            if (userData._token) {
    
                const expirationDate = new Date(userData._tokenExpirationDate);
                const expirationDuration = expirationDate.getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                
                return new AuthActions.AuthenticateSuccess({
                    email: userData.email,
                    userId: userData.id,
                    token: userData._token,
                    expirationDate,
                    redirect: false,
                });
    
            }

            return { type: 'STUB' };
        })
    );

    @Effect({ dispatch: false })
    public authLogout: Observable<any> = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

        const expirationDate = new Date((new Date().getTime() + (expiresIn * 1000)));
        const user = new User(email, userId, token, expirationDate);
        localStorage.setItem('userData', JSON.stringify(user));

        this.authService.setLogoutTimer(expiresIn * 1000);

        return new AuthActions.AuthenticateSuccess({ email, userId, token, expirationDate, redirect: true });

    }

    private handleError(errorRes: HttpErrorResponse) {

        let errorMessage = 'An unknown error ocurred.';
        if (!errorRes.error || !errorRes.error.error) {
            return of(new AuthActions.AuthenticateFail(errorMessage));
        }

        switch (errorRes.error.error.message) {

            case "EMAIL_EXISTS":
                errorMessage = 'An error ocurred. If you already have an account, please log in.';
                break;
            
            case "EMAIL_NOT_FOUND":
            case "INVALID_PASSWORD":
                errorMessage = 'The email or password provided was incorrect.';
                break;

            case "USER_DISABLED":
                errorMessage = 'Your account is disabled.';
                break;

        }

        return of(new AuthActions.AuthenticateFail(errorMessage));

    }

}
