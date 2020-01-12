import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT     = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS    = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT  = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT  = '[Shopping List] DeleteIngredient';
export const START_EDIT         = '[Shopping List] Start Edit';
export const STOP_EDIT          = '[Shopping List] Stop Edit';

export class AddIngredient implements Action {

    public readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) {}

}

export class AddIngredients implements Action {

    public readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) {}

}

export class UpdateIngredient implements Action {

    public readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient) {}

}

export class DeleteIngredient implements Action {
    public readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {

    public readonly type = START_EDIT;

    constructor(public payload: number) {}

}

export class StopEdit implements Action {
    public readonly type = STOP_EDIT;
}

export type ShoppingListActions =
    | AddIngredient
    | AddIngredients
    | UpdateIngredient
    | DeleteIngredient
    | StartEdit
    | StopEdit;
