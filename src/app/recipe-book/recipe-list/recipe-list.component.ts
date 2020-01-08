import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
})

export class RecipeListComponent implements OnInit, OnDestroy {

    public recipes: Recipe[] = [];
    private recipesChangedSub: Subscription;

    constructor(private recipeService: RecipeService) {}

    ngOnInit() {
        this.recipes = this.recipeService.getRecipes();

        this.recipesChangedSub = this.recipeService.recipesChanged.subscribe(() => {
            this.recipes = this.recipeService.getRecipes();
        });
    }

    ngOnDestroy() {
        this.recipesChangedSub.unsubscribe();
    }

}
