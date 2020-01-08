import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ShoppingListService {

    public ingredientChanged = new Subject<Ingredient[]>();
    public startedEditing = new Subject<number>();

    private ingredients: Array<Ingredient> = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ];

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients = this.ingredients.concat(ingredients);
        this.ingredientChanged.next(this.ingredients.slice());
    }

    getIngredient(index: number) : Ingredient {
        return this.ingredients[index];
    }

    getIngredients() {
        return this.ingredients.slice();
    }

    updatateIngredient(index: number, updatedIngredient: Ingredient) {
        this.ingredients[index] = updatedIngredient;
        this.ingredientChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientChanged.next(this.ingredients.slice());
    }

}
