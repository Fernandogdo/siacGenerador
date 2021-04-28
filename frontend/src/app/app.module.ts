import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './comun/components.module';

import { AppComponent } from './app.component';

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';



import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
// import { ResumidoCvComponent } from './components/resumido-cv/resumido-cv.component';
// import { PersonalizadoCvComponent } from './components/personalizado-cv/personalizado-cv.component';
// import { CompletoCvComponent } from './components/completo-cv/completo-cv.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AdministradorComponent,
    // ResumidoCvComponent,
    // PersonalizadoCvComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
