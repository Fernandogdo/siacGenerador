
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { Angular2CsvModule } from 'angular2-csv';

/*PIPE */
import { ObjToArrayPipe } from 'app/objToArray.pipe';
/* Components */

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { CompletoCvComponent } from './../../components/completo-cv/completo-cv.component';
import { PersonalizadoCvComponent } from 'app/components/personalizado-cv/personalizado-cv.component';
// import { ModalPersonalizacionComponent } from 'app/components/modal-personalizacion/modal-personalizacion.component';
import { GuardadosComponent } from 'app/components/guardados/guardados.component';
import { BloqueComponent } from '../../components/bloque/bloque.component';
import { ResumidoCvComponent } from 'app/components/resumido-cv/resumido-cv.component';
import { BloqueResumidoComponent } from '../../components/bloque-resumido/bloque-resumido.component';
import { EditaPersonalizadoComponent } from '../../components/edita-personalizado/edita-personalizado.component';
import { CreacvPersonalizadoComponent } from '../../components/creacv-personalizado/creacv-personalizado.component';
import { AdministradorComponent } from 'app/components/administrador/administrador.component';
import { CreaFormatosComponent } from 'app/components/crea-formatos/crea-formatos.component';


/* MATERIAL */
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card'; 
import { MatListModule } from '@angular/material/list'; 
import { MatStepperModule } from '@angular/material/stepper'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
// import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

// import { ProgressSpinnerModule } from 'app/components/progress-spinner/progress-spinner.module';
// import { ProgressSpinnerComponent } from 'app/components/progress-spinner/progress-spinner.component';
// ProgressSpinnerModule

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
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    Angular2CsvModule,
    MatTableModule,
    MatRadioModule,
    MatPaginatorModule,
    MatProgressBarModule,
    // Ng4LoadingSpinnerModule
    // ProgressSpinnerModule
    
    
  ],
  declarations: [
    DashboardComponent,
    AdministradorComponent,
    CompletoCvComponent,
    PersonalizadoCvComponent,
    // ModalPersonalizacionComponent,
    GuardadosComponent,
    BloqueComponent,
    BloqueResumidoComponent,
    ResumidoCvComponent,
    EditaPersonalizadoComponent,
    CreacvPersonalizadoComponent,
    CreaFormatosComponent,
    // ProgressSpinnerComponent
    
  ]
})

export class AdminLayoutModule {}
