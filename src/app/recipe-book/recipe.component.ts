import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
})
export class RecipeComponent implements OnInit {

    public selectedRecipe: Recipe = null;

    constructor() {}

    ngOnInit() {
        
    }

}
