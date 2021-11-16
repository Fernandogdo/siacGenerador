import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { CompletoCvComponent } from './../../components/completo-cv/completo-cv.component';
import { ResumidoCvComponent } from './../../components/resumido-cv/resumido-cv.component';
import { PersonalizadoCvComponent } from './../../components/personalizado-cv/personalizado-cv.component';
import { AdministradorComponent } from 'app/components/administrador/administrador.component';
import { GuardadosComponent } from 'app/components/guardados/guardados.component';
import { BloqueComponent } from 'app/components/bloque/bloque.component';
import { BloqueResumidoComponent } from 'app/components/bloque-resumido/bloque-resumido.component';
import { EditaPersonalizadoComponent } from 'app/components/edita-personalizado/edita-personalizado.component';
import { EditaPersonalizadoService } from 'app/services/edita-personalizado/edita-personalizado.service';
import { LoginComponent } from 'app/components/login/login.component';
import { CreacvPersonalizadoComponent } from 'app/components/creacv-personalizado/creacv-personalizado.component';
import { CreaFormatosComponent } from 'app/components/crea-formatos/crea-formatos.component';
import { AuthGuard } from 'app/guards/auth.guard';
import { DocenteGuard } from 'app/guards/docente/docente.guard';
import { TestGuard } from 'app/guards/test.guard';


export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard',      component: DashboardComponent, canActivate:[TestGuard] },
    { path: 'cv-completo',   component: CompletoCvComponent, canActivate:[AuthGuard] },
    { path: 'cv-resumido',   component: ResumidoCvComponent, canActivate:[AuthGuard] },
    { path: 'cv-personalizado',   component: PersonalizadoCvComponent, canActivate:[TestGuard] },
    { path: 'administrador',   component: AdministradorComponent, canActivate:[AuthGuard]},
    { path: 'cv-guardado/:id_user',   component: GuardadosComponent, canActivate:[TestGuard]},
    { path: 'bloque-completo/:nombre',   component: BloqueComponent, canActivate:[AuthGuard]},
    { path: 'bloque-resumido/:nombre',   component: BloqueResumidoComponent, canActivate:[AuthGuard]},
    { path: 'edita-personalizado/:nombre/:cv',   component: EditaPersonalizadoComponent ,resolve:{data:EditaPersonalizadoService}, canActivate:[TestGuard]},
    { path: 'crea-personalizado/:nombre/:nombre_cv/:cv', component: CreacvPersonalizadoComponent, canActivate:[TestGuard]},
    { path: 'crea-formatos/:id_user', component: CreaFormatosComponent, canActivate:[TestGuard]}
];


