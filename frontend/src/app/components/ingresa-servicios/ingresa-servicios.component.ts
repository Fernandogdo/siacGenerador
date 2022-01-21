import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { servicioBloques } from '../../models/servicioBloque.model';
import { ConfiguracioncvService } from '../../services/configuracioncv.service';
import * as _ from "lodash";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { BloqueServicioService } from '../../services/servicios-bloque/bloque-servicio.service';
import { Bloque } from '../../models/bloque.model';
import { Configuracioncv } from '../../models/configuracioncv.model';
Configuracioncv

@Component({
  selector: 'app-ingresa-servicios',
  templateUrl: './ingresa-servicios.component.html',
  styleUrls: ['./ingresa-servicios.component.css']
})
export class IngresaServiciosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;


  loginForm: FormGroup;
  displayedColumns: string[] = ['bloqueNombre', 'url', 'accion'];
  dataSource;
  arregloServicios: servicioBloques[] = [];
  arregloServiciosCopia: servicioBloques[] = [];

  arregloBloques: Bloque[] = [];

  arregloConfiguraciones: Configuracioncv[] = [];
  bloquesservicio;
  urlSiac;
  arreglosUrl = [];
  arregloEsquema: any = []
  arregloBaseDatos: any = []

  nombreBloque: boolean;
  submitted = false;
  // prueba: any = [];


  configuracionesBase = []
  bloquesBase = []
  arregloBloquesEsquema = []
  bloquesDataBase = []


  constructor(
    private fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    public bloqueServicioService: BloqueServicioService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    // setTimeout(this.bloquesEsquema, 1000);


    // setTimeout(() => {
    //   this.name = "changed";
    //  }, 30000);
    // this.configuracionesEsquema();


    // repetirCadaSegundo() {
    //   identificadorIntervaloDeTiempo = setInterval(mandarMensaje, 1000);
    // }


    // this.bloqueServicioService.getServicios().subscribe((dataBase) => {
    //   this.bloquesservicio = dataBase
    //   console.log('BLOQUESERVICIO', this.bloquesservicio);
    //   this.bloquesservicio.forEach((atributo) => {
    //     console.log("lalaatributo", atributo)
    //     this.urlSiac = atributo.url;
    //     this.arreglosUrl.push(this.urlSiac);
    //     console.log("URLARREGLOURL", this.arreglosUrl)
    //     this.bloqueServicioService.bloques(this.urlSiac).subscribe((data) => {
    //       let keys = Object.keys(data.results[0]);
    //       // console.log('BLOQUE', atributo.bloqueNombre);
    //       for (let i = 0; i < keys.length; i++) {
    //         let clave = keys[i];
    //         console.log('Bloque - atributo', atributo.bloqueNombre, clave);
    //         // this.postConfiguraciones(atributo.bloqueNombre, clave);
    //         const datos = {
    //           bloque: atributo.bloqueNombre,
    //           atributo: clave
    //         }
    //         // console.log("DATOSCOPIAESQUEMA", datos)
    //         this.arregloEsquema.push(datos)
    //       }
    //       console.log("ARREGLOESQUEMA", this.arregloEsquema)

    //       // this.comparaEsquemaBaseDatosEliminarAtributo(this.arregloEsquema)
    //       // this.compararEsquemaBaseDatosGuardarAtributo(this.arregloEsquema)
    //     });
    //   });
    //   // console.log("ARREGLOESQUEMA", this.arregloEsquema)
    //   this.arregloEsquema = []


    // },
    //   (error) => {
    //     console.log(error);
    //     // this.errorMessage = 
    //   }
    // );


    // this.setIntrvlEsquema()

    // setInterval(() => this.configuracionesEsquema(), 3000);



  }

  ngOnInit(): void {
    this.getServicios()
    // this.getBloques();
    // this.bloquesEsquema()
    // this.configuracion()

    // this.configuracionesEsquema()
    // this.compararArregloAtributos()
    // this.compararArregloBloques()
    this.loginForm = this.fb.group({
      bloqueNombre: ["", Validators.required],
      url: ["", Validators.required],
    });



    this.configuracioncvService.getConfiguraciones().subscribe((res) => {
      this.configuracionesBase = res
      console.log("configuracionesbase", this.configuracionesBase)

    })

    this.configuracioncvService.getBloques().subscribe((res => {
      this.bloquesBase = res;
      console.log("BLOQUESBASE", this.bloquesBase)
    }))


    this.configuracionesEsquema()

  }



  configuracion() {
    // this.mandarMensaje()
    this.bloqueServicioService.copiaEsquemaAtributos();
    this.bloqueServicioService.copiaEsquemaBloques()

    this.setIntrvlEsquema()
    this.setIntrvl()


    // this.compararEsquemaBaseDatosGuardarBloque();
    // this.comparaEsquemaBaseDatosGuardarAtributo();

    this.compararArregloBloques();
    // this.compararArregloAtributos();
    // prueba(arregloEsquema)
  }

  getServicios() {
    this.bloqueServicioService.getServicios()
      .subscribe(res => {
        this.arregloServicios = res
        console.log("ARREGLOSERVICIOS", this.arregloServicios)
        let atributosOrdenados = _.orderBy(this.arregloServicios, ['bloqueNombre'], ['asc']);
        this.arregloServicios = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloServicios);
        this.dataSource.paginator = this.paginator;
      });
  }






  // Compara arreglo bloques de esquema y basedatos, elimina de basedatos los que no estan en esquema SIAC
  compararArregloEliminaBloques() {

    this.bloqueServicioService.getServicios()
      .subscribe(res => {
        this.arregloServicios = res
        // console.log("COmpararARREGLOSERVICIOSESQUEMA", this.arregloServicios)
        this.bloqueServicioService.getBloques().subscribe((res) => {
          this.arregloBloques = res;
          // console.log("CompapararregloBloquesBase", this.arregloBloques)
          const aux = this.arregloBloques.reduce((prev, curr) => {
            const item = this.arregloServicios.find(
              (x) =>
                x.bloqueNombre === curr.nombre
            );

            if (!item) prev = [...prev, curr];

            return prev;
          }, []);

          console.log("eliminararreglo", aux);

          aux.forEach(objeto => {
            console.log('elementoaborrarBloque', objeto.nombre);
            this.bloqueServicioService.eliminaObjetoNoSimilarBloque(objeto.nombre).subscribe((res) => {
              console.log("ELIMINADOBLOQUE", res)
            });
          });
        });
      });
  }


  setIntrvlEsquema() {
    // setTimeout(() => this.compararArregloAtributos(), 6000);
    setInterval(() => this.arregloEsquema, 3000);
    // this.compararArregloAtributos()
  }

  configuracionesEsquema() {
    this.bloqueServicioService.getServicios().subscribe((dataBase) => {
      this.bloquesservicio = dataBase
      console.log('BLOQUESERVICIO', this.bloquesservicio);
      this.bloquesservicio.forEach((atributo) => {
        console.log("lalaatributo", atributo)
        this.urlSiac = atributo.url;
        this.arreglosUrl.push(this.urlSiac);
        console.log("URLARREGLOURL", this.arreglosUrl)
        this.bloqueServicioService.bloques(this.urlSiac).subscribe((data) => {
          let keys = Object.keys(data.results[0]);
          // console.log('BLOQUE', atributo.bloqueNombre);
          for (let i = 0; i < keys.length; i++) {
            let clave = keys[i];
            console.log('Bloque - atributo', atributo.bloqueNombre, clave);
            // this.postConfiguraciones(atributo.bloqueNombre, clave);
            const datos = {
              bloque: atributo.bloqueNombre,
              atributo: clave
            }
            // console.log("DATOSCOPIAESQUEMA", datos)
            this.arregloEsquema.push(datos)
          }
          console.log("ARREGLOESQUEMA", this.arregloEsquema)

          // this.comparaEsquemaBaseDatosEliminarAtributo(this.arregloEsquema)
          // this.compararEsquemaBaseDatosGuardarAtributo(this.arregloEsquema)
        });
      });
      // console.log("ARREGLOESQUEMA", this.arregloEsquema)
      // this.arregloEsquema = []


    },
      (error) => {
        console.log(error);
        // this.errorMessage = 
      }
    );
  }



  // Compara arreglo bloques de esquema y basedatos, elimina de basedatos los que no estan en esquema SIAC
  compararArregloBloques() {
    this.bloqueServicioService.getServicios()
      .subscribe(res => {
        this.arregloServicios = res
        console.log("COmpararARREGLOSERVICIOSESQUEMA", this.arregloServicios)
        this.bloqueServicioService.getBloques().subscribe((res) => {
          this.arregloBloques = res;
          console.log("CompapararregloBloquesBase", this.arregloBloques)
          const aux = this.arregloBloques.reduce((prev, curr) => {
            const item = this.arregloServicios.find(
              (x) =>
                x.bloqueNombre === curr.nombre
            );

            if (!item) prev = [...prev, curr];

            return prev;
          }, []);

          console.log("eliminararreglo", aux);

          aux.forEach(objeto => {
            console.log('elementoaborrarBloque', objeto.id, objeto.nombre);
            this.bloqueServicioService.deleteBloque(objeto.id).subscribe((res) => {
              console.log("ELIMINADOBLOQUE", res)
            });
          });
        });
      });
  }

  comparaEsquemaBaseDatosEliminarAtributo(arregloEsquema) {

    console.log("ARREGLOESQUEMACOMPARPARBASEDATOS", arregloEsquema)

    this.configuracioncvService.getConfiguraciones().subscribe((arregloBaseDatos) => {
      console.log("ARREGLOBASEDEDATOS", arregloBaseDatos)
      const aux = arregloBaseDatos.reduce((prev, curr) => {
        const item = arregloEsquema.find(
          (x) =>
            x.bloque === curr.bloque
            && x.atributo === curr.atributo
        );

        if (!item) prev = [...prev, curr];

        return prev;
      }, []);

      console.log("eliminararreglo", aux);

      aux.forEach(objeto => {
        console.log('tributoelementoaborrarBloqueA', objeto.bloque, objeto.atributo);
        // this.bloqueServicioService.eliminaObjetoNoSimilarConfiguracion(objeto.bloque, objeto.atributo).subscribe((res) => {
        //   console.log("ELIMINADOBLOQUE", res)
        // })
      });

    }, error => {
      // this.errorLogueo()
      console.log(error)

    })

  }

  setIntrvl() {
    // setTimeout(() => this.compararArregloAtributos(), 6000);
    setTimeout(() => this.compararArregloAtributos(), 3000);
  }


  compararArregloAtributos() {

    console.log("FUNCION CON RETRASO")

    console.log("mamaARREGLOESQUEMA", this.arregloEsquema)
    console.log("configuracionesbase", this.configuracionesBase)

    // console.log("ARREGLOSBASE", this.configuracionesBase)


    const objetoConfEliminar = this.configuracionesBase.reduce((prev, curr) => {
      const item = this.arregloEsquema.find(
        (x) =>
          x.bloque === curr.bloque
          && x.atributo === curr.atributo
      );

      if (!item) prev = [...prev, curr];

      return prev;
    }, []);

    console.log("eliminararreglo", objetoConfEliminar);

    objetoConfEliminar.forEach(objeto => {
      console.log('tributoelementoaborrarBloqueA', objeto.id);
      this.bloqueServicioService.deleteConfiguracion(objeto.id).subscribe((res) => {
        console.log("ELIMINADOBLOQUE", res)
      })
    });
  }







  postServicios(form: NgForm) {

    console.log("FORMVALUELALA", form.value)

    this.nombreBloque = form.value.url.includes('https://')

    this.bloqueServicioService.getServicios().subscribe((res) => {
      const bloqueServicio = res.find(objeto =>
        objeto.bloqueNombre === form.value.bloqueNombre || objeto.url === form.value.url
      );

      console.log("res", bloqueServicio)


      // if (bloqueServicio) {
      //   console.log('YAEXISTEN bloque o url');
      //   this._snackBar.open("El Bloque o url ingresados ya existen", "Cerrar", {
      //     duration: 2000,
      //   })
      // } else {
      // console.log('NOEXISTEN');
      // console.log("NOEXISTE", form.value.bloqueNombre)
      if (this.nombreBloque === true) {
        console.log("URLBUENA")
        if (form.value.id) {
          console.log("HAYID", form.value.id)
          this.bloqueServicioService.putServicios(form.value).subscribe((res) => {
            this._snackBar.open("Se editó el servicio correctamente", "Cerrar", {
              duration: 2000,
            })
            this.resetForm(form);
            this.getServicios();
          },
            (err) => {
              this._snackBar.open("Error al editar", "Cerrar", {
                duration: 2000,
              })
            }
          )
        } else {
          console.log("NOHAYID", form.value.id)

          this.bloqueServicioService.postServicios(form.value).subscribe((res) => {
            this._snackBar.open("Se guardó el servicio correctamente", "Cerrar", {
              duration: 2000,
            })
            this.getServicios();
            this.resetForm(form);
          },
            (err) => {
              this._snackBar.open("El bloque o url que se desea guardar ya existen", "Cerrar", {
                duration: 2000,
              })
            }
          );
        }
      } else {
        this._snackBar.open("Ingresa una URL correcta", "Cerrar", {
          duration: 2000,
        });
      }
      // }
    });
  }

  editServicio(servicio: servicioBloques) {
    this.configuracioncvService.selectedServicio = servicio;
  }

  deleteServicio(id: string) {
    // alert("deleting")
    // const res = c
    console.log("IDSERVICIO", id)

    if (confirm('Estás seguro que quieres eliminar este servicio?')) {
      this.bloqueServicioService.deleteServicio(id).subscribe((res) => {
        this.getServicios();
        this._snackBar.open("Servicio eliminado correctamente", "Cerrar", {
          duration: 2000,
        });
      })
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.configuracioncvService.selectedServicio = new servicioBloques();
    }
  }

}
