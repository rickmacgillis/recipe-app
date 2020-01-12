import { Action } from '@ngrx/store';

export const LOGIN_START    = '[Auth] Login Start';
export const AUTO_LOGIN     = '[Auth] Auto Login';
export const AUTHENTICATE_SUCCESS   = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL      = '[Auth] Authenticate Fail';
export const SIGNUP_START   = '[Auth] Signup Start';
export const CLEAR_ERROR    = '[Auth] Clear Error';
export const LOGOUT         = '[Auth] Logout';

export class LoginStart implements Action
{
    public readonly type = LOGIN_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class AutoLogin implements Action
{
    public readonly type = AUTO_LOGIN;
}

export class AuthenticateSuccess implements Action
{
    public readonly type = AUTHENTICATE_SUCCESS;
    constructor(
        public payload: {
            email:string;
            userId: string;
            token: string;
            expirationDate: Date;
            redirect: boolean;
        }
    ) {}
}

export class AuthenticateFail implements Action
{
    public readonly type = AUTHENTICATE_FAIL;

    constructor(public payload: string) {}
}

export class SignupStart implements Action
{
    public readonly type = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class ClearError implements Action
{
    public readonly type = CLEAR_ERROR;
}

export class Logout implements Action
{
    public readonly type = LOGOUT;
}

export type AuthActions =
    | LoginStart
    | AutoLogin
    | AuthenticateSuccess
    | AuthenticateFail
    | SignupStart
    | ClearError
    | Logout;
