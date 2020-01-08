import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from './recipe.component';
import { AuthGuard } from '../auth/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolverService } from './recipes-resolver.service';

const routes: Routes = [
    { path: '', component: RecipeComponent, canActivate: [AuthGuard], children: [
        { path: '', component: WelcomeComponent },
        { path: 'new', component: RecipeEditComponent },
        {
            path: ':id',
            component: RecipeDetailComponent,
            resolve: [RecipesResolverService]
        },
        {
            path: ':id/edit',
            component: RecipeEditComponent,
            resolve: [RecipesResolverService]
        },
    ]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RecipesRoutingModule {

}
