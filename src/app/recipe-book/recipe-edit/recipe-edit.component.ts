import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Ingredient } from '../../shared/ingredient.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  public id: number = null;
  public editMode: boolean = false;
  public recipeForm: FormGroup;
  private storeSub: Subscription = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.id = +params.id;
      this.editMode = params.id !== undefined;
      this.initForm();

    });
  }

  onSubmit() {

    if (this.editMode) {
      this.store.dispatch(new RecipeActions.UpdateRecipe({ index: this.id, recipe: this.recipeForm.value }));
    } else {
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }

    this.onCancel();

  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(this.makeIngredientInputGroup());
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  initForm() {

    let ingredients: FormArray = new FormArray([]);

    if (!this.editMode) {
      return this.makeRecipeForm(ingredients);
    }

    this.storeSub = this.store.select('recipes').pipe(
      map(recipeState => {
        return recipeState.recipes.find((recipe, index) => index === this.id);
      })
    ).subscribe(recipe => {

      if (recipe.ingredients !== undefined) {
      
        for (let ingredient of recipe.ingredients) {
          ingredients.push(this.makeIngredientInputGroup(ingredient));
        }

      }

      this.makeRecipeForm(ingredients, recipe.name, recipe.imagePath, recipe.description);

    });
    
  }

  makeRecipeForm(ingredients: FormArray, name: string = '', imagePath: string = '', description: string = '') {

    this.recipeForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients,
    });

  }

  makeIngredientInputGroup(ingredient?: Ingredient) {

    if (ingredient === undefined) {
      ingredient = new Ingredient(null, null);
    }

    return new FormGroup({
      name: new FormControl(ingredient.name, Validators.required),
      amount: new FormControl(ingredient.amount, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    })
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnDestroy() {

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    
  }

}
