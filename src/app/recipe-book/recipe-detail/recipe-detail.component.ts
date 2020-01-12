import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
})

export class RecipeDetailComponent implements OnInit {

    @Input() selectedRecipe: Recipe = null;
    public recipeId: number = null;

    constructor(
        private store: Store<fromApp.AppState>,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.recipeId = this.route.snapshot.params.id;
        
        this.route.params.pipe(
            map(params => +params['id']),
            switchMap(id => {

                this.recipeId = id;
                return this.store.select('recipes');
                
            }),
            map(recipesState => {
                return recipesState.recipes.find((recipe, index) => index === this.recipeId);
            })
        ).subscribe(recipe => {
            this.selectedRecipe = recipe;
        });
    }

    onAddToShoppingList() {
        this.store.dispatch(new ShoppingListActions.AddIngredients(this.selectedRecipe.ingredients));
        this.router.navigate(['shopping-list']);
    }

    onEdit() {
        this.router.navigate(['edit'], { relativeTo: this.route });
    }

    onDelete() {
        this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipeId));
        this.router.navigate(['/recipes']);
    }

}
