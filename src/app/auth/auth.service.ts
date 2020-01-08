import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface AuthResponseData {
    kind?: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    public user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    private readonly baseUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts';
    private logoutTimer: any = null;

    constructor(private http: HttpClient, private router: Router) {}

    signup (email: string, password: string) {

        return this.http.post<AuthResponseData>(
            this.baseUrl + ':signUp?key=' + environment.firebaseApiKey,
            { email, password, returnSecureToken: true }
        ).pipe(
            catchError(this.handleError),
            tap(resData => this.handleAuthentication(resData))
        );

    }

    login(email: string, password: string) {

        return this.http.post<AuthResponseData>(
            this.baseUrl + ':signInWithPassword?key=' + environment.firebaseApiKey,
            { email, password, returnSecureToken: true }
        ).pipe(
            catchError(this.handleError),
            tap(resData => this.handleAuthentication(resData))
        );

    }

    autoLogin() {

        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(
            localStorage.getItem('userData')
        );

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {

            this.user.next(loadedUser);

            const expirationDuration = new Date(
                userData._tokenExpirationDate).getTime() -
                new Date().getTime();

            this.autoLogout(expirationDuration);

        }

    }

    logout() {

        this.user.next(null);
        localStorage.removeItem('userData');

        if (this.logoutTimer) {
            
            clearTimeout(this.logoutTimer);
            this.logoutTimer = null;

        }

        this.router.navigate(['/auth']);

    }

    autoLogout(expirationDuration: number) {

        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);

    }

    private handleAuthentication(resData: AuthResponseData) {

        const expirationDate = new Date(
            (new Date().getTime() + +resData.expiresIn) * 1000
        );

        const user = new User(
            resData.email,
            resData.localId,
            resData.idToken,
            expirationDate
        );

        this.user.next(user);

        this.autoLogout(+resData.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));

    }

    private handleError(error: HttpErrorResponse) {

        let errorMessage = 'An unknown error ocurred.';
        if (!error.error || !error.error.error) {
            return throwError(errorMessage);
        }

        switch (error.error.error.message) {

            case "EMAIL_EXISTS":
                return throwError('An error ocurred. If you already have an account, please log in.');
            
            case "EMAIL_NOT_FOUND":
            case "INVALID_PASSWORD":
                return throwError('The email or password provided was incorrect.');

            case "USER_DISABLED":
                return throwError('Your account is disabled.');

        }

        return throwError(errorMessage);

    }

}
