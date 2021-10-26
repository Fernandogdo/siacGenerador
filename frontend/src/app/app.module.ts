import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './comun/components.module';

import { AppComponent } from './app.component';

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';



import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
// import { AdministradorComponent } from './components/administrador/administrador.component';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './components/login/login.component';



// import { ResumidoCvComponent } from './components/resumido-cv/resumido-cv.component';
//import { PersonalizadoCvComponent } from './components/personalizado-cv/personalizado-cv.component';
// import { CompletoCvComponent } from './components/completo-cv/completo-cv.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'; 

// import { MatMenuModule } from '@angular/material/menu';

// import {MatMenuModule} from '@angular/material/menu';
import { Angular2CsvModule } from 'angular2-csv';
import { ModalNotaComponent } from './components/modal-nota/modal-nota.component';
// import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { ProgressSpinnerModule } from '../app/components/progress-spinner/progress-spinner.module';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatSnackBarModule,
    Angular2CsvModule,
    MatCardModule,
    // ProgressSpinnerModule
    // MatPaginatorModule
    // MatMenuModule

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    // AdministradorComponent,
    LoginComponent,
    ModalNotaComponent,
    // CreaFormatosComponent,
    
   
    // ResumidoCvComponent,
    //PersonalizadoCvComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
