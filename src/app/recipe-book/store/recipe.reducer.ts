import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
    recipes: Recipe[];
};

const InitialState:State = {
    recipes: [],
};

export function RecipeReducer(state = InitialState, action: RecipeActions.RecipeActions) {

    switch (action.type) {

        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload],
            };

        case RecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [
                    ...state.recipes,
                    action.payload,
                ],
            };

        case RecipeActions.UPDATE_RECIPE:

            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.recipe,
            };

            let updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe;

            return {
                ...state,
                recipes: updatedRecipes,
            };

        case RecipeActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => index !== action.payload),
            };


        default:
            return state;

    }

}
