import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

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

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit() {
        this.startedEditingSub = this.shoppingListService.startedEditing.subscribe((index: number) => {

            this.editedItemIndex = index;
            this.editMode = true;
            this.editedItem = this.shoppingListService.getIngredient(index);
            this.ingredientForm.setValue({
                name: this.editedItem.name,
                amount: this.editedItem.amount,
            });

        });
    }

    onSubmit(form: NgForm) {

        const ingredient = new Ingredient(form.value.name, form.value.amount);

        if (this.editMode) {
            this.shoppingListService.updatateIngredient(this.editedItemIndex, ingredient);
        } else {
            this.shoppingListService.addIngredient(ingredient);
        }

        this.clearForm();

    }

    deleteItem() {

        this.shoppingListService.deleteIngredient(this.editedItemIndex);
        this.clearForm();

    }

    clearForm() {
        this.editMode = false;
        this.editedItem = null;
        this.editedItemIndex = 0;
        this.ingredientForm.reset();
    }

    ngOnDestroy() {
        this.startedEditingSub.unsubscribe();
    }

}
