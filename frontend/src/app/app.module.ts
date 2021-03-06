import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './comun/components.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './components/login/login.component';


import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { Angular2CsvModule } from 'angular2-csv';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NetworkInterceptor } from './interceptors/interceptor.spinner';
import { AuthInterceptorInterceptor } from './interceptors/auth-interceptor/auth-interceptor.interceptor';


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
    MatProgressSpinnerModule,
    // Ng4LoadingSpinnerModule.forRoot()
    // ProgressSpinnerModule
    // MatPaginatorModule
    // MatMenuModule
    MatToolbarModule,
    MatIconModule

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    // AdministradorComponent,
    LoginComponent,
    // ModalNotaComponent,
    // CreaFormatosComponent,
    
   
    // ResumidoCvComponent,
    //PersonalizadoCvComponent,
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: NetworkInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorInterceptor,
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
