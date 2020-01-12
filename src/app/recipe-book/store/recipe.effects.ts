import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';

import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

    private readonly recipesUrl = environment.firebaseBaseUrl + '/recipes.json';
    
    @Effect()
    public fetchRecipes = this.actions$.pipe(
        ofType(RecipeActions.FETCH_RECIPES),
        switchMap(fetchAction => {
            return this.http.get<Recipe[]>(this.recipesUrl);
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : [],
                };
            });
        }),
        map(recipes => {
            return new RecipeActions.SetRecipes(recipes);
        })
    );

    @Effect({ dispatch: false })
    public storeRecipes = this.actions$.pipe(
        ofType(RecipeActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
            return this.http.put(this.recipesUrl, recipesState.recipes);
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) {}

}
