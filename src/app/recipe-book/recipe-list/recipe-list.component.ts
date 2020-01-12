import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
})

export class RecipeListComponent implements OnInit, OnDestroy {

    public recipes: Recipe[] = [];
    private recipesChangedSub: Subscription;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.recipesChangedSub = this.store.select('recipes').pipe(
            map(recipesState => recipesState.recipes)
        ).subscribe((recipes: Recipe[]) => {
            this.recipes = recipes;
        });
    }

    ngOnDestroy() {
        this.recipesChangedSub.unsubscribe();
    }

}
