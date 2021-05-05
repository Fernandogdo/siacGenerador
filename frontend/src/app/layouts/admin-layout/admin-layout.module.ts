
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

/* Components */

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { CompletoCvComponent } from './../../components/completo-cv/completo-cv.component';
import { PersonalizadoCvComponent } from 'app/components/personalizado-cv/personalizado-cv.component';
import { ModalPersonalizacionComponent } from 'app/components/modal-personalizacion/modal-personalizacion.component';
import { GuardadosComponent } from 'app/components/guardados/guardados.component';

/* MATERIAL */
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card'; 
import {MatListModule} from '@angular/material/list'; 
import { ObjToArrayPipe } from 'app/objToArray.pipe';
import {MatStepperModule} from '@angular/material/stepper'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatListModule,
    MatStepperModule,
    MatCheckboxModule,
    MatDialogModule
    
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    CompletoCvComponent,
    PersonalizadoCvComponent,
    ModalPersonalizacionComponent,
    GuardadosComponent,
    ObjToArrayPipe
  ]
})

export class AdminLayoutModule {}
