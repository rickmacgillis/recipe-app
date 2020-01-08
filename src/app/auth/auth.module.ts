import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AlertComponent } from '../shared/alert/alert.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AuthComponent],
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: AuthComponent },
        ]),
    ],
    entryComponents: [AlertComponent],
})
export class AuthModule {}
