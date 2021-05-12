import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { CompletoCvComponent } from './../../components/completo-cv/completo-cv.component';
import { ResumidoCvComponent } from './../../components/resumido-cv/resumido-cv.component';
import { PersonalizadoCvComponent } from './../../components/personalizado-cv/personalizado-cv.component';
import { AdministradorComponent } from 'app/components/administrador/administrador.component';
import { GuardadosComponent } from 'app/components/guardados/guardados.component';
import { BloqueComponent } from 'app/components/bloque/bloque.component';


export const AdminLayoutRoutes: Routes = [
    
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'cv-completo',   component: CompletoCvComponent },
    { path: 'cv-resumido',   component: ResumidoCvComponent },
    { path: 'cv-personalizado',   component: PersonalizadoCvComponent },
    { path: 'administrador',   component: AdministradorComponent },
    { path: 'cv-guardado',   component: GuardadosComponent },
    { path: 'bloque/:nombre',   component: BloqueComponent }
];
