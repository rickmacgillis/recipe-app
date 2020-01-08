import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  public id: number = null;
  public editMode: boolean = false;
  public recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
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
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.id = this.recipeService.addRecipe(this.recipeForm.value);
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

    const { recipe, ingredients } = this.makeRecipeFormData();

    this.recipeForm = new FormGroup({
      name: new FormControl(recipe.name, Validators.required),
      imagePath: new FormControl(recipe.imagePath, Validators.required),
      description: new FormControl(recipe.description, Validators.required),
      ingredients: ingredients,
    });

  }

  makeRecipeFormData() {

    let recipe: Recipe = null;
    let ingredients: FormArray = new FormArray([]);

    if (this.editMode) {

      recipe = this.recipeService.getRecipe(this.id);
      if (recipe.ingredients !== undefined) {
        
        for (let ingredient of recipe.ingredients) {
          ingredients.push(this.makeIngredientInputGroup(ingredient));
        }

      }

    } else {
      recipe = new Recipe(null, null, null, null);
    }

    return { recipe, ingredients };

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

}
