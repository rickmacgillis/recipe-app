import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipe-book/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy {

    @Output() pageChange = new EventEmitter<string>();
    public collapsed: boolean = true;
    public isAuthenticated: boolean = false;

    private userSub: Subscription = null;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.userSub = this.store.select('auth').pipe(
            map(authState => {
                return authState.user;
            })
        ).subscribe(user => {
            this.isAuthenticated = !!user;
        });
    }

    onSaveData() {
        this.store.dispatch(new RecipeActions.StoreRecipes());
    }

    onFetchData() {
        this.store.dispatch(new RecipeActions.FetchRecipes());
    }

    onLogout() {
        this.store.dispatch(new AuthActions.Logout());
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

}
