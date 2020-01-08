import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipe-book/recipe.service';
import { Recipe } from '../recipe-book/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class DataStorageService {

    private readonly recipesUrl = 'https://recipe-app-2c81a.firebaseio.com/recipes.json';

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ) {}

    storeRecipes() {
        
        const recipes = this.recipeService.getRecipes();
        this.http.put(this.recipesUrl, recipes)
        .subscribe(response => {
            console.log(response);
        });

    }

    fetchRecipes() {

        return this.http.get<Recipe[]>(this.recipesUrl).pipe(
            map(recipes => {
                return recipes.map(recipe => {

                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : [],
                    };

                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }

}
