import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
})

export class RecipeDetailComponent implements OnInit {

    @Input() selectedRecipe: Recipe = null;
    public recipeId: number = null;

    constructor(
        private shoppingListService: ShoppingListService,
        private recipeService: RecipeService,
        private route: ActivatedRoute,
        private router: Router) {}

    ngOnInit() {
        this.recipeId = this.route.snapshot.params.id;
        this.selectedRecipe = this.recipeService.getRecipe(this.recipeId);
        
        this.route.params.subscribe((params: Params) => {
            this.recipeId = +params.id;
            this.selectedRecipe = this.recipeService.getRecipe(this.recipeId);
        });
    }

    toShoppingList() {
        this.shoppingListService.addIngredients(this.selectedRecipe.ingredients);
        this.router.navigate(['shopping-list']);
    }

    onEdit() {
        this.router.navigate(['edit'], { relativeTo: this.route });
    }

    onDelete() {
        this.recipeService.deleteRecipe(this.recipeId);
        this.router.navigate(['/recipes']);
    }

}
