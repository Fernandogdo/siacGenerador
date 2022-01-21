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
// import { EditaPersonalizadoService } from '../../services/edita-personalizado/edita-personalizado.service';
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

// canActivate: [TestGuard] -> DOCENTE

export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard', component: DashboardComponent,  },
    { path: 'cv-completo', component: CompletoCvComponent, canActivate: [AuthGuard] },
    { path: 'cv-resumido', component: ResumidoCvComponent, canActivate: [AuthGuard] },
    { path: 'cv-personalizado', component: PersonalizadoCvComponent,},
    { path: 'administrador', component: AdministradorComponent, canActivate: [AuthGuard] },
    { path: 'cv-guardado/:id_user', component: GuardadosComponent,  },
    { path: 'bloque-completo/:nombre', component: BloqueComponent,  },
    { path: 'bloque-resumido/:nombre', component: BloqueResumidoComponent,  },
    { path: 'edita-personalizado/:nombre/:cv', component: EditaPersonalizadoComponent,  },
    { path: 'crea-personalizado/:nombre/:nombre_cv/:cv', component: CreacvPersonalizadoComponent,  },
    { path: 'crea-formatos/:id_user', component: DescargaFormatosComponent,  },
    { path: 'descarga-informacion/:id_user', component: DescargaInformacionComponent,  },
    { path: 'ingresar-servicio', component: IngresaServiciosComponent,  },


    // { path: '**', component: NotFoundComponent },
    // {path: '**', component: LoginComponent},
];


