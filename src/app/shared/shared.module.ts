import { NgModule } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { CommonModule } from '@angular/common';

const declarations = [
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
];

@NgModule({
    declarations: declarations,
    imports: [
        CommonModule,
    ],
    exports: [
        ...declarations,
        CommonModule,
    ],
})
export class SharedModule {}
