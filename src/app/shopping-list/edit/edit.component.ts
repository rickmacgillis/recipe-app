import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
    selector: 'app-shopping-list-edit',
    templateUrl: './edit.component.html',
})

export class ShoppingListEditComponent implements OnInit, OnDestroy {

    @ViewChild('formEl', { static: false }) ingredientForm: NgForm;

    public editMode: boolean = false;
    public editedItemIndex: number = 0;
    public editedItem: Ingredient;

    private startedEditingSub: Subscription;

    constructor(
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {

        this.startedEditingSub = this.store.select('shoppingList').subscribe(stateData => {

            if (stateData.editedIngredientIndex > -1) {

                this.editMode = true;
                this.editedItem = stateData.editedIngredient;
                this.ingredientForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount,
                });

            } else {
                this.editMode = false;
            }

        });

    }

    onSubmit(form: NgForm) {

        const ingredient = new Ingredient(form.value.name, form.value.amount);

        if (this.editMode) {
            this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
        } else {
            this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
        }

        this.clearForm();

    }

    deleteItem() {

        this.store.dispatch(new ShoppingListActions.DeleteIngredient());
        this.clearForm();

    }

    clearForm() {
        this.editMode = false;
        this.editedItem = null;
        this.editedItemIndex = 0;
        this.ingredientForm.reset();
        this.store.dispatch(new ShoppingListActions.StopEdit());
    }

    ngOnDestroy() {
        this.startedEditingSub.unsubscribe();
        this.store.dispatch(new ShoppingListActions.StopEdit());
    }

}
