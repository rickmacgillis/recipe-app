import { NgModule } from '@angular/core';

import { WelcomeComponent } from './welcome/welcome.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeComponent } from './recipe.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        RecipeComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        WelcomeComponent,
        RecipeEditComponent,
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        RecipesRoutingModule,
        SharedModule,
    ],
})
export class RecipesModule {}
