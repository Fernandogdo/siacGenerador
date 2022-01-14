import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { CompletoCvComponent } from './../../components/completo-cv/completo-cv.component';
import { ResumidoCvComponent } from './../../components/resumido-cv/resumido-cv.component';
import { PersonalizadoCvComponent } from './../../components/personalizado-cv/personalizado-cv.component';
import { AdministradorComponent } from '../../components/administrador/administrador.component';
import { GuardadosComponent } from '../../components/guardados/guardados.component';
import { BloqueComponent } from '../../components/bloque/bloque.component';
import { BloqueResumidoComponent } from '../../components/bloque-resumido/bloque-resumido.component';
import { EditaPersonalizadoComponent } from '../../components/edita-personalizado/edita-personalizado.component';
import { EditaPersonalizadoService } from '../../services/edita-personalizado/edita-personalizado.service';
// import { LoginComponent } from '../../components/login/login.component';
import { CreacvPersonalizadoComponent } from '../../components/creacv-personalizado/creacv-personalizado.component';
// import { DescargaFormatosComponent } from 'app/components/descarga-formatos/descarga-formatos.component';
import { DescargaFormatosComponent } from '../../components/descarga-formatos/descarga-formatos.component';
import { DescargaInformacionComponent } from '../../components/descarga-informacion/descarga-informacion.component';


import { AuthGuard } from '../../guards/auth.guard';
import { DocenteGuard } from '../..//guards/docente/docente.guard';
import { TestGuard } from '../../guards/test.guard';
import { NotFoundComponent } from '../../comun/not-found/not-found.component';
import { IngresaServiciosComponent } from '../../components/ingresa-servicios/ingresa-servicios.component';


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
    { path: 'crea-formatos/:id_user', component: DescargaFormatosComponent, canActivate:[TestGuard]},
    { path: 'descarga-informacion/:id_user', component: DescargaInformacionComponent, canActivate:[TestGuard]},
    { path: 'ingresar-servicio', component: IngresaServiciosComponent, canActivate:[AuthGuard]},


    // { path: '**', component: NotFoundComponent },
    // {path: '**', component: LoginComponent},
];


