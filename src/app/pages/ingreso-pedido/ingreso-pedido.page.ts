import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { PerfilesPage } from '../../modals/perfiles/perfiles.page';
import { PerfilesavaPage } from '../../modals/perfilesava/perfilesava.page';
import { CrearpacientePage } from '../../modals/crearpaciente/crearpaciente.page';
import { ListunidadPage } from '../../modals/listunidad/listunidad.page';

import { TranslateService } from '@ngx-translate/core';

import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';

import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/servicios/base/base.service';

import { AppConfigService } from 'src/app/utils/app-config-service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';

import { IonDatetime } from '@ionic/angular';
import { id } from '@swimlane/ngx-charts';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { BusquedaPacientesPage } from '../busqueda-pacientes/busqueda-pacientes.page';
import { SearchMedicoPage } from 'src/app/modals/orden/search-medico/search-medico.page';
import { SearchPacientePage } from 'src/app/modals/orden/search-paciente/search-paciente.page';
import { ListaPedidosPage } from '../lista-pedidos/lista-pedidos.page';
import { get } from 'http';


@Component({
  selector: 'app-ingreso-pedido',
  templateUrl: './ingreso-pedido.page.html',
  styleUrls: ['./ingreso-pedido.page.scss'],
})



export class IngresoPedidoPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  minDate: any;
  maxDate: any;

  active_lugar_pedido = this.appConfig.active_lugar_pedido;
  observaciones_pedido = this.appConfig.observaciones_pedido;
  refentrega_pedido = this.appConfig.refentrega_pedido;
  mobile: any;
  ListaAnalisis: any = [];
  ListaAnalisisTemp: any = [];

  ListLugar: any;
  // ListEstado: any = [
  //   { descripcion: "RUTINA", codigo: 0 },
  //   { descripcion: "EMERGENCIA", codigo: 1 },
  //   { descripcion: "PRIORIDAD", codigo: 2 },

  // ]
  ListEstado: any = [
    { descripcion: "RUTINA", codigo: 0, icono: "calendar-number", color:"#b8fadd",border:"1px solid #1acd81"},
    { descripcion: "PRIORIDAD", codigo: 2, icono: "warning", color: "#ffdaa8"},
    { descripcion: "EMERGENCIA", codigo: 1, icono: "alarm", color: "#ff9494"}
  ];


  // { descripcion: "RUTINA", codigo: 0, icono: "alarm", color: "#ff9fb1" },
  //     { descripcion: "EMERGENCIA", codigo: 1, icono: "bed", color: "#bfdbbf" },
  //     { descripcion: "PRIORIDAD", codigo: 2, icono: "calendar-number-outline", color: "#eee3f1" },
  lugar: any = {
    descripcion: null, codigo: null, enable: null
  };
  estado: any;

  inputAnalisis: any = '';
  inputCedula: any = '';
  inputDiagnostico: any = '';
  inputDiagnosticoextra: any = '';
  inputHabitacion: any = '';
  inputUnidad: any = '';
  inputObservacion: any = '';
  inputFechaExamen: any;
  lista_resultados_pacientes: any;

  show_listaDiagnostico: boolean = false;
  show_listaDiagnosticoextra: boolean = false;
  show_listaAnalisis: boolean = false;
  show_listaUnidad: boolean = false;
  flag_listado_emergencias = false;
  flag_emergencia = false;
  flag_hospitalizacion = false;

  ListDiagnostico: any = [];
  ListDiagnosticoextra: any = [];

  diagnostico: any = [];
  diagnosticoextra: any = [];

  unidad: any = [];
  listUnidad: any = [];
  flag_variable_turnos_paso: any;
  NuevosAnalisis = [];
  ListAnalisis_tempo_update_pedido = [];

  contador_turno_dia: any = 0;
  cont_rest_tur: any = 0;
  flag_color_rojo_turno: any = false;
  elegir_variable: any;
  id_pedidos_retorno_listado: any = null;
  desactivar_segment_nombre_cedula: boolean = false;
  variable_activar_fecha = false;
  turno_hora_pedido: string;
  vector_analisis_creacion_view: any = [];

  paciente = {
    cod_pac: null,
    id_pac: null,
    nombre_completo: null,
    nom_pac: null,
    ape_pac: null,
    edad: null,
    fec_nac: null,
    mail_pac: null,
    sex_pac: null,
    hidden: true
  };
  dataOrden: any = {
    id_pedido: null,
    cod_pac: null,
    cod_med: null,
    txt_ord: null,
    fec_examen: null,
    fec_ord: null,
    cod_diagnostico: null,
    num_analisis: 0,
    cod_diagnostico2: null,
    cod_unidad: null,
    cod_lugar: null,
    estado_pedido: null,
    nro_habitacion: null,
    ca1_ord: null,
    cod_ref: null,
    hora_turno: null,
    tipo_user: null,
    pre_ord: 0,
    val_ord: 0

  }

  analisis: any;

  disabled_cedula: boolean = false;

  pedido_duplicar: any;

  public des_usr: any = ""
  public tipo_usr: any = ""

  unidad_config: any;
  diagnostico_config: any;
  diagnostico_extra_config: any;

  nro_turnos_pedidos_fecha = 0;
  nro_max_turnos = this.appConfig.max_pedidos_turno;
  flag_variable_feriados: any;

  pac_fec_nac_config: any;
  pac_sex_input_config: any

  feraidosm_list: any;
  list_tunos_hora_ocupados: any = [];

  list_ref: any = [];
  ref_ca1_ord: any = null;

  list_fechas_disponibles: any = [];
  temp_max_turnos: any;

  enable_hora_turno: boolean = false
  hora_turno: any = null;

  check_ped_ord = {
    active: false,
    hora: 0
  };

  list_ordenesxpac = [];
  list_peticionesxorden = []

  id_plan_default_pedido: any = null;
  flag_plan_default: boolean = false;
  planSelected: any;
  flag_active_turno_config_json: any = false;


  ////////////////VARIABLES ANDY - CONTROL DE TURNOS///////
  hoy: string;
  manana: string;
  opcion_fecha_turnos_eme: string;
  ref_tur_externo_ip: any;
  ref_tur_emergencia_ip: any;
  ref_tur_hospitalizacion_ip: any;
  cont_max_turnos_every: any
  cod_referencia: any;
  flag_ocultar_fecha: any = false;
  flag_ocultar_fecha_hoy: any = false;
  flag_ocultar_fecha_manana: any = false;
  placeholderNombre = "";
  placeholderCedula = "";
  bandera_icono_search: boolean = false;
  public nombre_paciente = "";//////////////No Borrar
  public cedula_paciente = "";//////////////No Borrar
  selectedSegment: any;


  constructor(
    private serviciosBase: BaseService,
    private router: Router,
    private modalcontroller: ModalController,
    private queryservice: QueryService,
    private toastservice: ToastService,
    private helperservice: HelperService,
    private loadingservice: LoadingService,
    private varGlobal: VariablesGlobalesService,
    private alertController: AlertController,
    private _translate: TranslateService,
    private appConfig: AppConfigService,
    private serviciosPDF: PdfRenderService,
    private validationService: ValidacionesService,
    private navCtrl: NavController,
    

  ) {

    this.turno_hora_pedido = '';
    this.placeholderNombre = "Buscar...";
    this.placeholderCedula = "Buscar...";
    this.selectedSegment = "cedula"
    ///Calculo de hoy dia
    this.hoy = this.helperservice.soloFecha(new Date());
    ////
    ////Calculo de mañana
    let manana = new Date();
    manana.setDate(manana.getDate() + 1);
    this.manana = this.helperservice.soloFecha(manana);
    ///////
    ////Variables recuperadas desde ingreso config_des
    this.ref_tur_externo_ip = this.appConfig.ref_tur_externo;
    this.ref_tur_emergencia_ip = this.appConfig.ref_tur_emergencia;
    this.ref_tur_hospitalizacion_ip = this.appConfig.ref_tur_hospitalizacion;
    /////////

    if (this.appConfig.active_turno === true) {
      this.flag_active_turno_config_json = true;
    } else {
      this.flag_active_turno_config_json = false;
    }
    console.warn("flag_active_turno_config_json -Mirair", this.flag_active_turno_config_json);

    this.helperservice.checkFecha(6);
    this.inputObservacion = (this.observaciones_pedido.default_msg && this.observaciones_pedido.default_msg != '') ? this.observaciones_pedido.default_msg : ""
    if (this.appConfig.check_ped_ord) {
      this.queryservice.getCsParms({ cs_name: "AVATPED" }).then((r: any) => {
        // console.log('r cs', r);
        let hora = r.data.getCsParms.data_parm;
        if (hora != 0) {
          this.check_ped_ord.active = true
          this.check_ped_ord.hora = hora
        }
        // console.log('this.check_ped_ord', this.check_ped_ord);

      })
    }
    this.id_plan_default_pedido = this.appConfig.id_plan_default_pedido;
    // console.log('this.id_plan_default_pedido',this.id_plan_default_pedido);

    if (this.id_plan_default_pedido != undefined) {
      if (this.id_plan_default_pedido != null || this.id_plan_default_pedido != '') {
        // console.log(" existe plan definido",this.id_plan_default_pedido);
        this.queryservice.getPlanxIdplan({ id_plan: this.id_plan_default_pedido }).then((r: any) => {
          // console.log("plan referencia", r);
          this.planSelected = r.data.PlanxIdplan;
          // console.log('this.planSelected', this.planSelected);
          this.flag_plan_default = true;
        }, error => {
          // console.log(error);

        })

      }

    }

    this.enable_hora_turno = this.appConfig.enabe_hora_turno;
    if (this.enable_hora_turno) {
      this.hora_turno = "00:00";
      // console.log('this.hora_turno', this.hora_turno);

    }
    this.getMaxTurnos();


    this.des_usr = this.varGlobal.getVarUsuarioDes();
    this.tipo_usr = this.varGlobal.getVarUsuarioTipo();
    // console.log('this.des_usr', this.des_usr);
    // console.log('this.tipo_usr', this.tipo_usr);

    this.unidad_config = this.appConfig.unidad_pedido;
    this.diagnostico_config = this.appConfig.diagnostico_pedido;
    this.diagnostico_extra_config = this.appConfig.diagnostico_extra_pedido;
    this.pac_fec_nac_config = this.appConfig.pac_fec_nac;
    this.pac_sex_input_config = this.appConfig.pac_sex;

    this.ListLugar = this.appConfig.listado_lugar_pedido;
    console.log("this.ListLugar verificar por favor: ",this.ListLugar) ;
    // console.log('this.ListLugar', this.ListLugar);
    // console.log('this.lugar', this.lugar);
    if (this.varGlobal.getLugarPedido() != '') {
      this.lugar = this.ListLugar.filter(r => r.codigo == this.varGlobal.getLugarPedido())
      console.log('This.lugar verificar ahora mismo: ', this.lugar);
      this.lugar = this.lugar[0];
      
    }
    console.log("this.lugar codigo ",this.lugar) ;


    // console.log('this.lugar2', this.lugar);
    if (!this.appConfig.lugar_default && this.appConfig.active_lugar_pedido) {
      this.presentAlertLugar();
    }
   console.log('tkkhis.lugar.ListEstadoListEstado', this.ListEstado);

    if (this.lugar.codigo == 2) {
      this.checkTurno_avdg(this.lugar);
      this.estado = this.ListEstado[1]
    } else {
      if (this.lugar.codigo == 3) {
        this.checkTurno_avdg(this.lugar);
        this.estado = this.ListEstado[0]
      } else {
        this.checkTurno_avdg(this.lugar);
        this.estado = this.ListEstado[0]
      }
    }
  }

  async presentAlertLugar() {
    let buttons = []
    this.ListLugar.forEach(element => {
      if (element.enable) {
        buttons.push(
          {
            text: element.descripcion,
            cssClass: "" + element.style,
            handler: () => {
              console.log('Confirm Cancel: blah', element.descripcion);
              this.lugar = element
              if (element.descripcion === "CONSULTA EXTERNA") {
                console.log("Consulta Externaa");
                if (this.lugar.codigo == 2) {
                  this.estado = this.ListEstado[1]
                } else { this.estado = this.ListEstado[0] }
                this.checkTurno_avdg(this.lugar);

              } else {
                console.log("Otro tipo de turno");
                if (this.lugar.codigo == 2) {
                  this.estado = this.ListEstado[1]
                } else { this.estado = this.ListEstado[0] }
              }
            }
          })
      }

    });

    const alert = await this.alertController.create({
      header: 'Seleccione un lugar',
      buttons: buttons,
      backdropDismiss: false
    });

    await alert.present();
  }

  ionViewWillEnter() {
this.LimpiarTodo();
    this.ListAnalisis_tempo_update_pedido = [];
    this.ListaAnalisis = [];

   
      
      

    // this.pedido_duplicar='';
    this.minDate = new Date();
    this.minDate = this.helperservice.soloFecha(this.minDate)
    this.pedido_duplicar = this.varGlobal.getPedido_d();
    if (this.pedido_duplicar) {
      this.lugar = [];
      let data = this.pedido_duplicar;
      this.id_pedidos_retorno_listado = data.id_pedidos;
      if (this.id_pedidos_retorno_listado != null) {
        this.desactivar_segment_nombre_cedula = true;
      }
      console.log("data id_pedidos_retorno_listado duplicar: ", this.id_pedidos_retorno_listado);
      this.inputCedula = data.Paciente.id_pac;
      this.inputObservacion = data.observaciones;
      this.inputHabitacion = data.nro_habitacion;
      this.estado = this.ListEstado.filter(r => r.codigo == data.estado_pedido)[0];
      this.getPaciente();
      console.log('Antes de verificar el diagnóstico');
      if (data.codigo_diagnostico != '' || data.codigo_diagnostico2 != null) {
        this.queryservice.getDiagnosticoById(data.codigo_diagnostico).then((result: any) => {
          console.log('resultd-getDiagnosticoById', result);
          this.diagnostico = result.data.DiagnosticoId
        })
      }
      console.error('data.codigo_diagnostico2', data.codigo_diagnostico2);
      if (data.codigo_diagnostico2 != '' || data.codigo_diagnostico2 != null) {
        this.queryservice.getDiagnosticoById(data.codigo_diagnostico2).then((result: any) => {
          console.log('resultdgetDiagnosticoById', result);
          this.diagnosticoextra = result.data.DiagnosticoId;
        });
      }
      this.queryservice.getUnidadByCod(data.cod_unidad).then((result: any) => {
        console.log('unidad', result);
        if (result.data != null && result.data != undefined && result.data != '') {
          this.unidad = result.data.getUnidadbyCod
        } else {
          this.unidad = [];
        }

      });
      data.Analisis.forEach(element => {
        this.inputAnalisis = element.cod_ana
        //this.searchAnalisis();
        this.searchAnalisisUpdate();
      });
      console.log("entre duplicar en duplicar ultimo: ", this.pedido_duplicar);
      this.lugar.codigo = this.pedido_duplicar.cod_lugar;
      console.log("this.lugar en lugar: ", this.lugar);
      this.turno_hora_pedido = this.pedido_duplicar.fec_examen;
      setTimeout(() => {
        this.varGlobal.setPedido_d(undefined);
      }, 2000)
    }
    let nombre_lugar = '';

    switch (this.lugar.codigo) {
      case 1:
        nombre_lugar = 'HOSPITALIZACION';
        break;
      case 2:
        nombre_lugar = 'EMERGENCIA';
        break;
      case 3:
        nombre_lugar = 'CONSULTA EXTERNA';
        break;
      default:
        break;
    }

    this.lugar.descripcion = nombre_lugar;

    // this.checkTurno();
    this.checkTurno_avdg(this.lugar);
  }
  ngOnInit() {

    let forden = new Date();
    let formatted_date = forden.getFullYear() + "-" + (forden.getMonth() + 1) + "-" + forden.getDate()
    this.dataOrden.fec_ord = this.helperservice.soloFecha(forden);
    this.dataOrden.fec_examen = this.helperservice.soloFecha(forden);
    this.inputFechaExamen = this.helperservice.soloFecha(forden);
    this.minDate = formatted_date;
    this.queryservice.getListUnidad().then((result: any) => {
      console.log('result', result);
      this.listUnidad = result.data.ListUnidad;
    })

    if (this.varGlobal.getVarUsuarioTipo() == 'ref') {
      this.dataOrden.cod_med = 0
      this.dataOrden.cod_ref = this.varGlobal.getVarUsuario()
    } else {
      this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    }

    console.log('this.dataOrden.cod_med', this.dataOrden.cod_med);

    if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };

  }
  async presentModalPerfiles() {
    const modal = await this.modalcontroller.create({
      component: PerfilesPage,
      //componentProps: { value: 123 }
      backdropDismiss: false
    });

    modal.onDidDismiss().then((result: any) => {
      let data = result.data
      let arregloPerfil: any = [];
      if (data.perfil) {
        let detalle = data.perfil.detalle;
        arregloPerfil = detalle.split(' ');
        arregloPerfil.forEach(element => {
          if (element != '') {
            this.inputAnalisis = element;
            this.searchAnalisis();
          }
        });
      }
    })
    return await modal.present();
  }

  async presentModalUnidad() {
    const modal = await this.modalcontroller.create({
      component: ListunidadPage,
      cssClass: "modal_Unidad",
      backdropDismiss: false
    });
    modal.onDidDismiss().then((result: any) => {
      let data = result.data.unidad
      if (data) {
        this.unidad = data;
      }
    })
    return await modal.present();
  }

  async presentModalPerfilesAva() {
    const modal = await this.modalcontroller.create({
      cssClass: 'modal_analisisA',
      component: PerfilesavaPage,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((result: any) => {
      let data = result.data
      if (data.analisis) {

        for (let index = 0; index < data.analisis.length; index++) {
          const element = data.analisis[index];
          if (element != '') {
            this.inputAnalisis = element.cod_ana;
            this.searchAnalisis();
          }
        }

      }
    })
    return await modal.present();
  }

  /*
    buscarAnalisis() {
      if (this.inputAnalisis == '') {
        this.toastservice.presentToast({ message: 'Ingrese el código de Análisis', position: "top", color: "warning" })
        return
      }
      this.queryservice.SearchAnalisxMstrs(this.inputAnalisis).then((result: any) => {
        console.log(result);
        if (result.data.AnalisisMstrsbyCod.length > 0) {
          this.ListaAnalisis.push(result.data.AnalisisMstrsbyCod[0])
          this.inputAnalisis = '';
        } else {
          this.toastservice.presentToast({ message: 'No se encontro el análisis con el codigo ingresado', color: 'warning', position: 'bottom' })
        }
      }, error => {
        if (error.message) {
          this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error.message, color: 'warning', position: 'bottom' })
        }
        else {
          this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error, color: 'warning', position: 'bottom' })
        } console.log('error', error);
  
      })
    }
  */
  async eliminarAnalisis(index, item?) {
    if (this.ListaAnalisis.length == 1) {
      this.presentAlertListaUsuarios();
    } else {
      console.log("this Analisis: ", this.ListaAnalisis[index]);
      const analisis = this.ListaAnalisis[index].des_ana; // Asume que esto es cómo obtienes el análisis
      const alert = await this.alertController.create({
        header: '!Estas Seguro¡',
        message: 'De eliminar el análisis ' + analisis,
        buttons: [{
          text: "Si",
          handler: () => {
            console.log('ListaAnalisis analisis por favor :', this.ListaAnalisis)
            console.log('item item item item :', item);
            console.log('item duplicar :', this.pedido_duplicar);
            if (this.pedido_duplicar != undefined && this.pedido_duplicar != '' && this.pedido_duplicar != null) {
              let uuid_pedido = this.pedido_duplicar.uuid_pedido;
              let id_pedido = this.pedido_duplicar.id_pedidos;
              console.error('item cod_pac :', uuid_pedido);
              this.queryservice.getTurnosbyUidd(uuid_pedido).then((result: any) => {
                console.error('Resultado en id_turno: ', result)
                let data = result.data.getTurnosbyUidd[0].id;
                this.queryservice.DeleteTurxAnaPedido(data, item.cod_ana, id_pedido).then((result: any) => {
                  console.error('DeleteTurxAnaPedido en DeleteTurxAnaPedido: ', result)
                  let mensaje = result.data.DeleteTurxAnaPedido.mensaje;
                  if (mensaje === '0') {
                    this.toastservice.presentToast({ message: "Eliminado correctamente", position: "buttom", color: "warning" });
                    this.ListaAnalisis.splice(index, 1);
                  } else if (mensaje === '-1') {
                    this.toastservice.presentToast({ message: "Eliminado correctamente", position: "buttom", color: "danger" });
                    this.ListaAnalisis.splice(index, 1);
                  }
                });
              });
            } else {
              this.ListaAnalisis.splice(index, 1);
            }
          }
        },
        {
          text: "No",
          handler: () => {
            // No hacer nada
          }
        }
        ],
        backdropDismiss: false
      });
      await alert.present();
    }
  }


  async presentAlertConirmacionEliminar(analisis) {

    const alert = await this.alertController.create({
      header: '!Estas Seguro¡',
      message: 'De eliminar el análisis ' + analisis,
      buttons: [{
        text: "Si",
        handler: () => {
          console.log("Continuoooooo");
        }
      },
      {
        text: "No",
        handler: () => {
          // this.LimpiarTodo()
        }
      }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  async presentAlertListaUsuarios() {

    const alert = await this.alertController.create({
      header: '!Alerta¡',
      message: 'El pedido debe tener al menos un análisis',
      buttons: [{
        text: "Continuar",
        handler: () => {
          console.log("Continuoooooo");
        }
      },
      {
        text: "Cancelar",
        handler: () => {
          // this.LimpiarTodo()
        }
      }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  async presentAlertPacienteCheck() {

    if (!this.paciente.cod_pac) {
      return
    }

    const alert = await this.alertController.create({
      header: 'Cuidado',
      message: 'El paciente ya cuenta con una orden ingresada.\n Desea continuar ingresando el pedido',
      buttons: [{
        text: "Continuar",
        handler: () => {
          console.log("Continuoooooo");

        }
      },
      {
        text: "Cancelar",
        handler: () => {
          this.LimpiarTodo()

        }
      }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }


  getPacienteByCod(cod_pac) {
    console.log("cod_pac getPaciente: ", cod_pac);
    this.loadingservice.present('Cargar Paciente');
    this.queryservice.getPacientesbyCod(cod_pac).then((result: any) => {
      let data;
      data = result.data;
      console.log('11: ', data);
      if (data.getPacientebyCod != null) {
        if (data.getPacientebyCod.cod_pac != null) {
          this.paciente = data.getPacientebyCod;
          console.log("paciente - paciente get Paciente: ", this.paciente);
          if (this.check_ped_ord.active) {
            console.log("CHECKEO ORDEn");
            let fechas_check = this.helperservice.checkFecha(this.check_ped_ord.hora)
            console.log('fechas_check', fechas_check);
            this.queryservice.checkordbyfecha({
              fecha_i: fechas_check.fecha_i,
              fecha_h: fechas_check.fecha_h,
              cod_pac: this.paciente.cod_pac
            }).then((r: any) => {
              console.log("resss", r);
              if (r.data.checkordbyfecha.length > 0) {
                let data = r.data.checkordbyfecha;
                this.presentAlertPacienteCheck()
                console.log(' this.list_ordenesxpac', this.list_ordenesxpac);
                let ordenes_list = ""
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
                  ordenes_list += element.nro_ord;
                  if (index < (data.length - 1))
                    ordenes_list += ",";
                }
                this.queryservice.getPetxOrdenes({ nro_ord_list: ordenes_list }).then((r: any) => {
                  this.list_peticionesxorden = [];
                  console.log("r", r);
                  let data_analisis = r.data.getPetxOrd

                  data_analisis.forEach(element => {
                    this.list_peticionesxorden.push(element.cod_ana)
                  });
                })
                console.log('ordenes_list', ordenes_list);
              }
            })
          }
          this.loadingservice.dismiss();
        }
        else {
          let toastconf =
          {
            'message': 'No se encontro el paciente',
            'style': 'warning',
            'position': 'top'
          };
          this.toastservice.presentToast((toastconf));
          this.loadingservice.dismiss();
          return
        }
      } else {
        this.paciente.hidden = true
        let toastconf =
        {
          'message': 'No se encontro una persona con ese número de cédula',
          'style': 'warning',
          'position': 'top'
        };
        this.toastservice.presentToast((toastconf));
        this.loadingservice.dismiss();
        return
      }
    },
      (error) => {
        let toastconf =
        {
          'message': "Ocurrio un error: " + error,
          'style': 'warning',
          'position': 'top'
        };
        this.loadingservice.dismiss();
        this.toastservice.presentToast((toastconf));
        return

      });
  }





  getPaciente() {
    if (this.inputCedula === '') {
      this.resetpaciente();
      let toastconf =
      {
        'message': 'Ingrese la cédula del paciente',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast((toastconf));
      return
    }
    this.loadingservice.present('Cargar Paciente');
    // let data = this.queryservice.getPacientesbyId(this.inputCedula);

    let cedula = "0401696034";
    let data = this.queryservice.getPacientesbyId(this.inputCedula);
    console.log('getPacientesbyId  - result: ', data);

    data.then(result => {
      console.log('getPacientesbyId - result: ', result);
      let data;
      data = result.data;
      console.log('data - datos resulta:', data);
      if (data.getPaciente != null) {
        if (data.getPaciente.id_pac != null) {
          this.paciente = data.getPaciente;
          console.log('this.paciente - verificar asi : ', this.paciente);
          if (this.check_ped_ord.active) {
            console.log("CHECKEO ORDEn");
            let fechas_check = this.helperservice.checkFecha(this.check_ped_ord.hora)
            console.log('fechas_check', fechas_check);
            this.queryservice.checkordbyfecha({
              fecha_i: fechas_check.fecha_i,
              fecha_h: fechas_check.fecha_h,
              cod_pac: this.paciente.cod_pac
            }).then((r: any) => {
              console.log("resss", r);
              if (r.data.checkordbyfecha.length > 0) {
                let data = r.data.checkordbyfecha;
                this.presentAlertPacienteCheck()
                console.log(' this.list_ordenesxpac', this.list_ordenesxpac);
                let ordenes_list = ""
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
                  ordenes_list += element.nro_ord;
                  if (index < (data.length - 1))
                    ordenes_list += ",";
                }
                this.queryservice.getPetxOrdenes({ nro_ord_list: ordenes_list }).then((r: any) => {
                  this.list_peticionesxorden = [];
                  console.log("r", r);
                  let data_analisis = r.data.getPetxOrd

                  data_analisis.forEach(element => {
                    this.list_peticionesxorden.push(element.cod_ana)
                  });
                })
                console.log('ordenes_list', ordenes_list);
              }
            })
          }
          console.log("Else de elseeeeeee");
          this.loadingservice.dismiss();
          console.log("Iffffssss");
        } else {
          let toastconf =
          {
            'message': 'No se encontro el paciente',
            'style': 'warning',
            'position': 'top'
          };
          this.toastservice.presentToast((toastconf));
          this.loadingservice.dismiss();
          return
        }
      } else {
        this.paciente.hidden = true
        let toastconf =
        {
          'message': 'No se encontro una persona con ese número de cédula',
          'style': 'warning',
          'position': 'top'
        };
        this.toastservice.presentToast((toastconf));
        this.loadingservice.dismiss();
        return
      }
    },
      (error) => {
        console.log('error - verificar en Verificar', error);
        let toastconf =
        {
          'message': "Ocurrio un error: " + error,
          'style': 'warning',
          'position': 'top'
        };
        this.loadingservice.dismiss();
        this.toastservice.presentToast((toastconf));
        return
      })
  }





  resetpaciente() {
    this.paciente.cod_pac = null
    this.paciente.id_pac = null,
      this.paciente.nombre_completo = null,
      this.paciente.nom_pac = null,
      this.paciente.ape_pac = null,
      this.paciente.edad = null,
      this.paciente.fec_nac = null,
      this.paciente.mail_pac = null,
      this.paciente.sex_pac = null,
      this.paciente.hidden = true
  }

  /////Search update de vuelta//

  searchAnalisisUpdate() {
    let data = this.queryservice.SearchAnalisxMstrs(this.inputAnalisis);
    data.then(
      (result: any) => {
        let data = result.data.AnalisisMstrsbyCod
        if (data.length > 0) {
          this.analisis = data[0];
          this.analisis.dcto_val = 0.00;
          this.analisis.dcto_pet = 0.00;


          console.error('this.analisis - error', this.analisis);
          this.addAnalisis(this.analisis)
        }
      },
      (error) => { }).finally(() => {
        this.updatePreciosbyPlan('uno', this.analisis)
        setTimeout(() => { }, 1000);
      })

  }




  /////////////////////////////////


  searchAnalisis() {

    if (this.inputAnalisis == '' || this.inputAnalisis == null) {
      let toastconf =
      {
        'message': 'Ingrese el código de Análisis',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast(toastconf);
      return
    }
    let cod_ana = this.inputAnalisis;
    let repetido = false

    this.ListaAnalisis.forEach(element => {

      if (element.cod_ana == cod_ana) {
        repetido = true
      }
    });
    if (repetido) {
      let toastconf =
      {
        'message': 'Analisis Repetido',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast(toastconf);
      return
    }

    let data = this.queryservice.SearchAnalisxMstrs(this.inputAnalisis);
    data.then(
      (result: any) => {
        let data = result.data.AnalisisMstrsbyCod
        if (data.length > 0) {

          this.analisis = data[0];
          this.analisis.dcto_val = 0.00;
          this.analisis.dcto_pet = 0.00;




          //this.analisis = JSON.parse(JSON.stringify(data[0]));
          this.addAnalisis(this.analisis)
          /*
          
                    let flag = false
                    this.ListaAnalisis.forEach(element => {
                      if (element.cod_ana == this.analisis.cod_ana) { flag = true }
                    });
                    if (!flag) {
                      this.ListaAnalisis.push(this.analisis);
                    }
                    this.inputAnalisis = ""
                    */
        }
        else {
          let toastconf =
          {
            'message': 'No se encontro la peticion',
            'style': 'warning',
            'position': 'top'
          };
          this.toastservice.presentToast((toastconf));
          return
        }
      },
      (error) => {
        let toastconf =
        {
          'message': error,
          'style': 'warning',
          'position': 'top'
        };
        this.toastservice.presentToast((toastconf));
        return

      }
    ).finally(() => {
      //this.calcTotal()
      this.updatePreciosbyPlan('uno', this.analisis)
      setTimeout(() => {
        // this.calcTotal()


      }, 1000);
    })

  }

  saveComplete() {
    this.dataOrden.ca1_ord = this.ref_ca1_ord
    let fecha = new Date();
    this.dataOrden.cod_diagnostico = (this.diagnostico.codigo) ? this.diagnostico.codigo : null;
    this.dataOrden.fec_ord = this.helperservice.soloFecha(fecha);
    this.dataOrden.fec_examen = this.inputFechaExamen;
    this.dataOrden.cod_pac = this.paciente.cod_pac;
    this.dataOrden.txt_ord = this.inputObservacion;
    this.dataOrden.id_pedido = uuidv4();
    this.dataOrden.cod_diagnostico2 = (this.diagnosticoextra.codigo) ? this.diagnosticoextra.codigo : null;
    this.dataOrden.cod_unidad = (this.unidad.cod_uni) ? this.unidad.cod_uni : null;
    this.dataOrden.cod_lugar = (!this.active_lugar_pedido) ? '' : this.lugar.codigo
    this.dataOrden.estado_pedido = this.estado.codigo
    this.dataOrden.nro_habitacion = this.inputHabitacion;
    let Analisis_final = this.saveAnalisis();
    this.dataOrden.num_analisis = Analisis_final.length;
    this.dataOrden.hora_turno = this.hora_turno
    this.dataOrden.tipo_user = this.tipo_usr
    let json_data = {
      orden: this.dataOrden,
      analisis: Analisis_final
    }
    console.log("json_data", json_data);

    this.saveTurno(json_data);

  }

  savePedido(orden, analisis) {
    console.log(JSON.stringify(orden));
    console.log(JSON.stringify(analisis));


    this.queryservice.insertPedido(JSON.stringify(orden), JSON.stringify(analisis)).then((result: any) => {
      let data = result.data.insertPedido
      console.log('result mutation', result);
      this.desactivar_segment_nombre_cedula = true;
      if (data.resultado == 'error') {
        this.toastservice.presentToast({ message: data.mensaje, position: 'top', color: 'warning' })
        this.loadingservice.dismiss();
        return
      } else {
        console.log("Elegir variable", this.elegir_variable);
        this.checkTurno_avdg(this.lugar, this.inputFechaExamen, this.elegir_variable);


        console.log("this.inputFechaExamenr - this.inputFechaExamen", this.inputFechaExamen);

      }
      let nro_pedido_temp = data.data;
      this.queryservice.getPedidosbyId(nro_pedido_temp).then((result: any) => {
        console.log("result temp", result);
        let data_temp = result.data.PedidobyId;
        this.openPDF(data_temp);
      })
      this.toastservice.presentToast({ message: data.mensaje, position: 'top', color: 'success' })
      this.LimpiarTodo();
      this.loadingservice.dismiss();
    }, error => {
      console.log(error);
      this.toastservice.presentToast({ message: error.mensaje, position: 'top', color: 'warning' })
      this.loadingservice.dismiss()
    })
  }
  saveTurno(datos) {
    let nombre_error = "setTurno";
    let respuesta;
    this.serviciosBase.setTurnoPedido(datos).toPromise().then(resp => {
      respuesta = resp;
      if (respuesta && respuesta.response) {
        if (respuesta.response.code > 0) {
          this.savePedido(datos.orden, datos.analisis);
        } else {
          this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>Codigo error web service: SendTURNO/" + respuesta.response.code + "<small>")
        }
      } else {
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema en ENVIO</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>" + nombre_error + "/" + "NO RESPONSE" + "<small>")
      }
    }, error => {
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login"], { replaceUrl: true });
      } else {
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
      }
    });

  }

  alert_fecha_present: boolean = false;
  async presentAlertFecha() {
    this.alertController.dismiss();

    this.alert_fecha_present = true;
    const alert = await this.alertController.create({
      cssClass: "mensajes-pdf ",
      message: "<ion-icon name='alert-circle' class='warning' size='large'></ion-icon><h2><b>Límite de turnos excedido</b></h2>" +
        //   "<br><strong><small>Fecha: "+this.inputFechaExamen+"</small></strong>"+
        "<br><strong><small>La fecha se cambiara al día siguiente</small></strong>" +
        "<br><strong><small>Solo se permite el ingreso por Hospitalización o Emergencia</small></strong>",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.alert_fecha_present = false;
            this.inputFechaExament = this.inputFechaExamen
            this.list_fechas_disponibles = [];
            this.checkTurnod()
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(titulo, mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'mensajes-pdf',
      header: titulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }
  /////////////////////////////////////////////////////////////////
  saveAnalisis() {
    let peticionCompleta = [];
    if (this.ListaAnalisis.length == 0) {
      return null
    } else {
      this.ListaAnalisis.forEach(element => {

        let peticion = {
          "cod_ana": element.cod_ana,
          "tip_ser": element.tip_ser,
        }
        peticionCompleta.push(peticion);
      }
      );
      return peticionCompleta
    }
  }

  searchDiagnostico() {
    if (this.inputDiagnostico == '') {
      return
    }
    
    this.queryservice.searchDiagnostico(this.inputDiagnostico).then((result: any) => {
      console.log('result', result);
      let data = result.data.searchDiagnostico;
      this.show_listaDiagnostico = true
      this.ListDiagnostico = data;
      this.desactivar_segment_nombre_cedula = false;
    })
  }

  selectDiagnostico(data) {
    this.diagnostico = data
    this.inputDiagnostico = ''
    setTimeout(() => {
      this.show_listaDiagnostico = false;
    }, 500);
  }

  searchDiagnosticoextra() {
    if (this.inputDiagnosticoextra == '') {
      return
    }
    this.queryservice.searchDiagnostico(this.inputDiagnosticoextra).then((result: any) => {
      this.show_listaDiagnosticoextra = true
      let data = result.data.searchDiagnostico;
      this.ListDiagnosticoextra = data;
    })
  }

  selectDiagnosticoextra(data) {
    this.diagnosticoextra = data
    this.inputDiagnosticoextra = ''
    setTimeout(() => {
      this.show_listaDiagnosticoextra = false;
    }, 500);
  }

  searchUnidad() {
    if (this.inputUnidad == '') {
      return
    }
    this.queryservice.searchUnidad(this.inputUnidad).then((result: any) => {
      let data = result.data.searchUnidad;
      this.listUnidad = data;
      this.show_listaUnidad = true

    });
    console.log('this.listUnidad de datos: ', this.listUnidad);
  }

  selectUnidad(data) {
    this.unidad = data
    this.inputUnidad = ''
    setTimeout(() => {
      this.show_listaUnidad = false;
    }, 500);
  }




  checkListaDesplegable(event) {
    if (event.target.className.includes("here") || event.target.parentElement.className.includes("here")) {
      this.show_listaDiagnostico = true
    } else {
      this.show_listaDiagnostico = false
    }

    if (event.target.className.includes("analisislist") || event.target.parentElement.className.includes("analisislist")) {
      this.show_listaAnalisis = true
    } else {
      this.show_listaAnalisis = false
    }

    if (event.target.className.includes("diagnostico") || event.target.parentElement.className.includes("diagnostico")) {
      this.show_listaDiagnosticoextra = true
    } else {
      this.show_listaDiagnosticoextra = false
    }

    if (event.target.className.includes("unidadlist") || event.target.parentElement.className.includes("unidadlist")) {
      this.show_listaUnidad = true
    } else {
      this.show_listaUnidad = false
    }
  }

  buscarAnalisis2() {
    if (this.inputAnalisis == '') {
      return
    }
    this.queryservice.SearchAnalisxMstrs2(this.inputAnalisis).then((result: any) => {
      let data = result.data.searchAnalisisMstrs2;
      this.show_listaAnalisis = true;
      this.ListaAnalisisTemp = []
      if (this.ListaAnalisis.length > 0) {
        data.forEach((element, index) => {
          let flag_repetido: boolean = false
          this.ListaAnalisis.forEach(element_lista => {
            if (element.cod_ana == element_lista.cod_ana) {
              flag_repetido = true
              return
            }
          });
          if (!flag_repetido) {
            element.dcto_val = 0.00;
            element.dcto_pet = 0.00;



            this.ListaAnalisisTemp.push(element)




          } else {
            console.log('no deberia ingresar', element);
          }
        });
      } else {
        this.ListaAnalisisTemp = data
      }
      console.log('ListaAnalisisTemp - revisar:', this.ListaAnalisisTemp);
    }, error => {
      if (error.message) {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error.message, color: 'warning', position: 'bottom' })
      }
      else {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error, color: 'warning', position: 'bottom' })
      } console.log('error', error);

    })
  }


  flag_pass_repeat_analisis: boolean = false;



  // async ViewAnalisisByPedidoTur(cod_pac, fecha_inicial, fecha_final, data) {
  //   let cod_ana_data = data.cod_ana;
  //   this.vector_analisis_creacion_view = [];
  //   let vector_pedidos = [];
  //   let nombre_medico = '';
  //   // this.queryservice.getTurnoByDateById(cod_pac,fecha_inicial,fecha_inicial).then((result: any) => { 
  //     console.log("amtede del query");
  //   this.queryservice.getTurnoByDateById(cod_pac, '2024/06/12 14:00', '2024/06/12 18:00').then((result: any) => {
  //     console.log("resultado query");
  //     vector_pedidos = result.data.getTurnoByDateById;
  //     console.log("Vector pedidos: ", vector_pedidos);
  //     vector_pedidos.forEach((pedido) => {
  //       pedido.Analisis.forEach((cod_ana) => { 
  //           if (cod_ana.cod_ana == cod_ana_data) {
  //             console.log("medico ssss : ", pedido.cod_med);
  //             this.queryservice.getMedicosbyCod(pedido.cod_med).then((result: any) => {
  //               console.log("RESULTADO: ", result);
  //               nombre_medico=result.data.getMedicobyCod.nom_med;
  //               console.log("medico dentro del nombre_medico: ", nombre_medico);
  //                this.vector_analisis_creacion_view.push({"Cod_Analisis": cod_ana.cod_ana, "Nombre Analisis": cod_ana.des_ana,"Nombre medico":nombre_medico});
  //           });
  //           console.log("afuera: ", nombre_medico);
  //         }
  //       });
  //     });

  //   });
  //   console.log("afuera: ",await this.vector_analisis_creacion_view);
  //   console.log("length -: ",await this.vector_analisis_creacion_view.length);
  //   if (await this.vector_analisis_creacion_view.length > 0) {
  //   this.presentAlertExistAna(await this.vector_analisis_creacion_view);
  // } 
  // }

  async ViewAnalisisByPedidoTur(cod_pac, fecha_inicial, fecha_final, data) {
    let cod_ana_data = data.cod_ana;
    this.vector_analisis_creacion_view = [];
    //const vector_pedidos = [];
   // const nombre_medico = '';
  
    console.log("antes del query");
    const result = await this.queryservice.getTurnoByDateById(cod_pac, '2024/06/12 14:00', '2024/06/12 18:00') as any;;
    console.log("resultado query");
   const vector_pedidos = result.data.getTurnoByDateById;
    console.log("Vector pedidos: ", vector_pedidos);
  
    for (let pedido of vector_pedidos) {
      for (let cod_ana of pedido.Analisis) {
        if (cod_ana.cod_ana == cod_ana_data) {
          console.log("medico ssss : ", pedido.cod_med);
          let resultMedico = await this.queryservice.getMedicosbyCod(pedido.cod_med)as any;
          console.log("RESULTADO: ", resultMedico);
          const nombre_medico = resultMedico.data.getMedicobyCod.nom_med;
          console.log("medico dentro del nombre_medico: ", nombre_medico);
          this.vector_analisis_creacion_view.push({"Cod_Analisis": cod_ana.cod_ana, "Nombre Analisis": cod_ana.des_ana, "Nombre medico": nombre_medico});
        }
      }
    }
  
    console.log("afuera: ", this.vector_analisis_creacion_view);
    console.log("length -: ", this.vector_analisis_creacion_view.length);
    if (this.vector_analisis_creacion_view.length > 0) {
      this.presentAlertExistAna(this.vector_analisis_creacion_view);
    }
  }

  async presentAlertExistAna(vector_analisis_creacion_view) {
    let message = 'Este Paciente ya tiene este(s) Análisis Creado(s):<br><br>';
    vector_analisis_creacion_view.forEach((analisis) => {
      message += `Código de Análisis: <span style="background: aquamarine;">${analisis.Cod_Analisis}</span><br>`;
            // message += `Código de Análisis: <span style="background: darkturquoise">${analisis.Cod_Analisis}</span><br>`;
     // message += `Código de Análisis: ${analisis.Cod_Analisis}<br>`;
      message += `Nombre de Análisis: ${analisis["Nombre Analisis"]}<br>`;
      message += `Nombre del Médico: ${analisis["Nombre medico"]}<br><br>`;
    });
  
    console.log('vector_analisis_creacion_view - vector_analisis_creacion_view: ', vector_analisis_creacion_view);
    const alert = await this.alertController.create({
      header: '! Información !',
      message: message,
      buttons: ['Cerrar']
    });
  
    await alert.present();
  }


formatDateConsultaDatos(dateObject: Date): string {
  let year = dateObject.getFullYear();
  let month = dateObject.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que debes sumar 1
  let day = dateObject.getDate();
  let hours = dateObject.getHours();
  let minutes = dateObject.getMinutes();

  // Asegurándose de que el mes, el día, las horas y los minutos tengan dos dígitos
  let formattedMonth = month < 10 ? '0' + month : month.toString();
  let formattedDay = day < 10 ? '0' + day : day.toString();
  let formattedHours = hours < 10 ? '0' + hours : hours.toString();
  let formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

  return `${year}/${formattedMonth}/${formattedDay} ${formattedHours}:${formattedMinutes}`;
}

  addAnalisis(data) {
    let date_hoy= new Date();
    console.log('date_hoy - Hoy en Dia: ', date_hoy);
    if(this.pedido_duplicar != undefined && this.pedido_duplicar != '' && this.pedido_duplicar != null){      
      console.log('Paciente UNDEFINIDO ');
    }else{
      console.log('Paciente id_nombre - cod_pac: ', this.paciente.cod_pac);
      let dateObject = new Date(date_hoy);
      let fecha_inicial = this.formatDateConsultaDatos(dateObject);
      let dateObjectModified = new Date(dateObject.getTime());
      dateObjectModified.setHours(dateObjectModified.getHours() - 8);
      let fecha_final = this.formatDateConsultaDatos(dateObjectModified);
      // console.error('dateObjectModified - dateObjectModified de fecha_formato_modificada: ',fecha_inicial);
      // console.error('fecha_formato - fecha_formato de fecha_formato_modificada: ',fecha_final);
     this.ViewAnalisisByPedidoTur(this.paciente.cod_pac,fecha_inicial,fecha_final,data);
    }
    
    
  

    let data_temp = []
    if (this.list_peticionesxorden.length > 0) {
      data_temp = this.list_peticionesxorden.filter(peticion => peticion == data.cod_ana)
      if (data_temp.length > 0 && !this.flag_pass_repeat_analisis) {
        console.log("es un analisis repetido");
        let temp = this.presentAlertAnaRepeat(data);
        console.log("tempppp", temp);
        return
      } else {
        console.log("ListaAnalisis verificar antes12: ", this.ListaAnalisis);
        this.ListaAnalisis.push(data);



        this.toastservice.presentToast({ message: "Analisis añadido al listado", position: "top", color: "success" })
        this.flag_pass_repeat_analisis = false;
        //this.calcTotal()
        this.updatePreciosbyPlan('uno', this.analisis)
        setTimeout(() => {
          this.calcTotal()
        }, 1000)
      }
    }
    else {
      console.log("ListaAnalisis verificar antes: ", this.ListaAnalisis);
      this.ListaAnalisis.push(data);
      console.log("ListaAnalisis verificar final: ", this.ListaAnalisis);
      this.updatePreciosbyPlan('uno', this.analisis)
      setTimeout(() => {
        this.calcTotal()
      }, 1000)

      //   this.toastservice.presentToast({ message: "Analisis añadido al listado", position: "top", color: "success" })    
    }
    this.inputAnalisis = ""
    setTimeout(() => {
      this.show_listaAnalisis = false;
    }, 500);
  }

  async presentAlertAnaRepeat(data) {
    const alert = await this.alertController.create({
      header: 'Cuidado',
      subHeader: data.des_ana,
      message: 'Ya existe esta petición ingresada para este paciente,\n Ingresar de todos modos.',
      backdropDismiss: false,
      buttons: [
        {
          text: "Continuar",
          handler: () => {
            this.flag_pass_repeat_analisis = true;
            this.addAnalisis(data)
          }
        }, {
          text: "Cancelar",
          handler: () => {
          }
        }]
    });

    await alert.present();
  }




  async getIdturnoPedidos(uuid_pedido) {
    let data;
    try {
      const result: any = await this.queryservice.getTurnosbyUidd(uuid_pedido);
      console.error('Resultado en id_turno: ', result);
      data = result.data.getTurnosbyUidd[0].id;
    } catch (error) {
      console.error('Error: ', error);
    }
    return data;
  }

  


  async presentAlertUpdate() {
    this.ListAnalisis_tempo_update_pedido = [];
    // formatTime
    const fechaUTC = new Date(this.pedido_duplicar.fec_examen + "T00:00:00Z");
    let fecha_update:string = this.formatTime(fechaUTC);
    
    
    
    if (fecha_update === this.inputFechaExamen) {
 let array_turno_array = [];
 let id_turno = await this.getIdturnoPedidos(this.pedido_duplicar.uuid_pedido);
 for (const element of this.ListaAnalisis) {
   console.log('element cod Ana: ', element.cod_ana);
   const result: any = await this.queryservice.getAnalisisPedidosTurno(this.pedido_duplicar.id_pedidos, element.cod_ana);
   console.error("Resultado de getAnalisisPedidosTurno: ", result);
   if (result.data.getAnalisisPedidosTurno.mensaje === '-1') {
     this.ListAnalisis_tempo_update_pedido.push(element);
     console.log("id_turno presentAlertUpdate: ", id_turno);
   }
 }

 array_turno_array.push({ id_pedidos: this.pedido_duplicar.id_pedidos, id_turno: id_turno, num_ana: this.ListAnalisis_tempo_update_pedido.length });
 this.presentAddAnalisisPedido(JSON.stringify(array_turno_array), JSON.stringify(this.ListAnalisis_tempo_update_pedido), this.ListAnalisis_tempo_update_pedido,this.inputObservacion,this.inputFechaExamen);
    } else {
        this.presentAlertChangeDate(this.inputFechaExamen);
    }
  }

  async presentAlertChangeDate(fecha_modificar) {

    const alert = await this.alertController.create({
      header: '! Esta Seguro !',
      message: '<div style="text-align:center">! De Cambiar la fecha de este pedido !</div>',
      backdropDismiss: false,
      buttons: [
        {
          text: "Si",
          handler: async () => {
            // Asegúrate de que la función que contiene este código sea async
let array_turno_array = [];
let id_turno = await this.getIdturnoPedidos(this.pedido_duplicar.uuid_pedido); // Asumiendo que getIdturnoPedidos devuelve una promesa
for (const element of this.ListaAnalisis) {
  console.log('element cod Ana: ', element.cod_ana);
  try {
    const result: any = await this.queryservice.getAnalisisPedidosTurno(this.pedido_duplicar.id_pedidos, element.cod_ana);
    console.error("Resultado de getAnalisisPedidosTurno: ", result);
    if (result && result.data && result.data.getAnalisisPedidosTurno.mensaje === '-1') {
      this.ListAnalisis_tempo_update_pedido.push(element);
      console.log("id_turno presentAlertUpdate: ", id_turno);
    }
  } catch (error) {
    console.error("Error al obtener datos de getAnalisisPedidosTurno: ", error);
  }
}

array_turno_array.push({ id_pedidos: this.pedido_duplicar.id_pedidos, id_turno: id_turno, num_ana: this.ListAnalisis_tempo_update_pedido.length });
this.presentAddAnalisisPedido(JSON.stringify(array_turno_array), JSON.stringify(this.ListAnalisis_tempo_update_pedido), this.ListAnalisis_tempo_update_pedido, this.inputObservacion, fecha_modificar);
        }
        }, {
          text: "No",
          handler: () => {
            
          }
        }]
    });
    await alert.present();
  }

  async presentAddAnalisisPedido(json_datos, json_ana, lista,inputObservacion?,fecha_examen?) {

    const alert = await this.alertController.create({
      header: '! Esta Seguro !',
      message: '<div style="text-align:center">! De Modificar este pedido !</div>',
      backdropDismiss: false,
      buttons: [
        {
          text: "Si",
          handler: () => {
            this.queryservice.insertPedAnaxTur(json_datos, json_ana,inputObservacion,fecha_examen).then((result: any) => {
              console.log("result insertPedAnaxTur en verificacion: ", result);
              if(result.data.insertPedAnaxTur.data === "0"){
                this.toastservice.presentToast({ message: result.data.insertPedAnaxTur.mensaje, position: "buttom", color: "success" })
                this.presentViewUpdatePedido(this.pedido_duplicar);
                this.LimpiarTodo();
              }else if(result.data.insertPedAnaxTur.data === "-1"){
                this.toastservice.presentToast({ message: result.data.insertPedAnaxTur.mensaje, position: "buttom", color: "danger" })
                this.LimpiarTodo();
              }              
            });
        }
        }, {
          text: "No",
          handler: () => {
            
          }
        }]
    });
    await alert.present();
  }

  async presentViewUpdatePedido(lista_pedidos) {
console.log("pedidos -+----: ", lista_pedidos);
this.router.navigate(['/home-medico/lista-pedidos'], { state: { lista_pedidos: lista_pedidos } });
}

  async presentAlertGuardar() {
    if (this.paciente.id_pac == null) {
      this.toastservice.presentToast({ message: 'Ingresar un paciente', position: "top", color: "warning" })
      return
    }
    if (this.pac_fec_nac_config.required && this.pac_fec_nac_config.enable) {
      if (this.paciente.fec_nac == null || this.paciente.fec_nac == '') {
        this.toastservice.presentToast({ message: 'Ingresar fecha de nacimiento del paciente', position: "top", color: "warning" })
        return
      }
    }
    if (this.pac_sex_input_config.required && this.pac_sex_input_config.enable) {
      if (this.paciente.sex_pac == null || this.paciente.sex_pac == '') {
        this.toastservice.presentToast({ message: 'Seleccionar genero del paciente', position: "top", color: "warning" })
        return
      }
    }
    if (this.unidad_config.enable && this.unidad_config.required) {
      if (this.unidad.length == 0 && this.active_lugar_pedido) {
        this.toastservice.presentToast({ message: 'Escoger una Unidad', position: "top", color: "warning" })
        return
      }
    }
    if (this.diagnostico_config.enable && this.diagnostico_config.required) {
      if (this.diagnostico.length == 0) {
        this.toastservice.presentToast({ message: 'Ingresar un diagnóstico', position: "top", color: "warning" })
        return
      }
    }
    if (this.diagnostico_extra_config.enable && this.diagnostico_extra_config.required) {
      if (this.diagnosticoextra.length == 0) {
        this.toastservice.presentToast({ message: 'Ingresar un diagnóstico extra', position: "top", color: "warning" })
        return
      }
    }
    if (this.ListaAnalisis.length == 0) {
      this.toastservice.presentToast({ message: 'Ingresar al menos un análisis', position: "top", color: "warning" })
      return
    }

    if (this.observaciones_pedido.required && this.observaciones_pedido.enable) {
      if (this.inputObservacion == null || this.inputObservacion == '') {
        this.toastservice.presentToast({ message: 'Debe llenar el campo de observación', position: "top", color: "warning" })
        return
      }
    }

    console.error("this.flag_listado_emergencias", this.flag_listado_emergencias);
    if (this.flag_active_turno_config_json === true) {
      if (this.flag_listado_emergencias === true) {
        if (this.nro_max_turnos <= 0 || this.cont_rest_tur < 0) {
          this.toastservice.presentToast({ message: 'No existe turnos en el día, Cambie de dia', position: "bottom", color: "danger" })
          return
        } else if (this.cont_rest_tur >= this.nro_max_turnos) {
          this.toastservice.presentToast({ message: 'No existe turnos en el día, Cambie de dia', position: "bottom", color: "danger" })
          return
        }
      }
    }




    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Esta seguro de ingresar este Pedido',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.saveComplete();
          }
        }
      ]
    });

    await alert.present();
  }


  async presentModalNuevoPaciente(cod_pac?) {

    console.log("Codigo de paciente verificar por favor: ", cod_pac);
    if (cod_pac != null && cod_pac != undefined && cod_pac != '') {
      const modal = await this.modalcontroller.create({
        component: CrearpacientePage,
        componentProps: {
          'cod_pac_temp': cod_pac
        }
      });
      await modal.present();
      modal.onDidDismiss().then((result: any) => {
        console.log("result - regreso: ", result);
        // data.data_pac.id_pac
        this.queryservice.getPacientesbyCod(result.data.data_pac.cod_pac).then((result: any) => {
          console.log('result pac', result);
          let data = result.data.getPacientebyCod;
          if (data) {
            this.paciente = data;
            this.inputCedula = this.paciente.id_pac;
            this.disabled_cedula = true;
          }
        });

      });
    } else {
      const modal = await this.modalcontroller.create({
        component: CrearpacientePage,
      });
      await modal.present();
      modal.onDidDismiss().then((result: any) => {
        console.log('result - data P', result);
        if (result.role == 'data') {
          switch (result.data.tipo) {
            case "insert":
              let dat_pac = result.data.data_pac[0];
              if (dat_pac) {
                this.queryservice.getPacientesbyCod(dat_pac.cod_pac).then((result: any) => {
                  console.log('result pac', result);
                  let data = result.data.getPacientebyCod;
                  if (data) {
                    this.paciente = data;
                    this.inputCedula = this.paciente.id_pac;
                    this.disabled_cedula = true;
                  }
                })
              }
              break;
            case "check":
              this.queryservice.getPacientesbyId(result.data.data_pac.id_pac).then((result: any) => {
                console.log("result pac modal", result);
                let data = result.data.getPaciente;
                if (data) {
                  this.paciente = data;
                  this.inputCedula = this.paciente.id_pac;
                  this.disabled_cedula = true;
                }
              })
              break;
            default: return;
          }
        }
      });
    }
  }

  eliminarDiagnostico() {
    this.diagnostico = [];
  }

  eliminarUnidad() {
    this.unidad = [];
  }

  eliminarDiagnosticoextra() {
    console.log('Elminar de elimijar diagnostico extra');
    this.diagnosticoextra = [];
  }

  changeEstado(event) {
    this.ListEstado.forEach(element => {
      if (element.codigo == event.detail.value) {
        console.log("element - change Event: ", element)
        this.estado = element
        return
      }
    });
  }

  changeUnidad(event) {
    this.listUnidad.forEach(element => {
      if (element.cod_uni == event.detail.value) {
        this.unidad = element
        return
      }
    });
  }

  changelugar(event) {

    console.log("Entro en donde yo decidi enviar");
    this.ListLugar.forEach(element => {
      if (element.codigo == event.detail.value) {
        this.lugar = element
        console.log("this.lugar  verificar-: ", this.lugar);
        this.checkTurno_avdg(this.lugar);
        return
      }
    });

  }

  LimpiarTodo() {
    let forden = new Date();
    this.variable_activar_fecha
    this.resetpaciente();
    this.desactivar_segment_nombre_cedula = false;
    this.ListaAnalisis = [];
    this.ListaAnalisisTemp = [];
    this.diagnostico = [];
    this.inputObservacion = "Sin Observaciones";
    //this.inputFechaExamen = '';
    this.inputCedula = '';
    this.diagnosticoextra = [];
    this.unidad = [];
    this.inputHabitacion = '';
    // this.inputFechaExamen = this.helperservice.soloFecha(forden);
    this.disabled_cedula = false;
    this.total_ord = '';
    console.log("this.elegir_variable:  elegigir Variab=" + this.elegir_variable);

    if (this.elegir_variable === undefined || this.elegir_variable === '' || this.elegir_variable === null) {
      console.log("this.inputFechaExamen antes" + this.inputFechaExamen);
      console.log("helper" + this.helperservice.soloFecha(forden));      
      this.inputFechaExamen = this.helperservice.soloFecha(forden);
      this.pedido_duplicar=null;
    }
    console.log("this.despues" + this.inputFechaExamen);
    this.checkTurno_avdg(this.lugar, this.inputFechaExamen, this.elegir_variable);

    if (!this.appConfig.lugar_default && this.appConfig.active_lugar_pedido) {
      this.presentAlertLugar();
    }

  }



  openPDF(orden) {
    this.loadingservice.present("Generando Pdf")
    // PREPARO LOS VALORES
    let valores_enviar = {
      "orden": orden
    }
    //ENVIO AL SERVICIO
    let respuesta;
    this.serviciosPDF.getPDFPedido(valores_enviar).subscribe(resp => {
      //CIERRO EL LOADING
      setTimeout(() => {
        this.loadingservice.dismiss();
      }, 500);
      console.log(resp);
      respuesta = resp;
      if (respuesta.estado == 0) {
        //CREO EL PDF
        let pdfWindow = window.open("");
        pdfWindow.document.write(
          "<iframe title='Resultados PDF' width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(respuesta.data) + "'></iframe>"
        );
        pdfWindow.document.title = 'Resultados PDF';
      } else {
        this.toastservice.presentToast({ position: "top", color: "dark", message: respuesta.description })
      }

    }, error => {
      setTimeout(() => {
        this.loadingservice.dismiss();
      }, 500);
      console.error(error);
      this.toastservice.presentToast({ position: "top", color: "dark", message: "Problema datos " + error.status })
    });
    //  window.open("https://resultados.gamma.com.ec:8443/gamma/webresources/eReport/pdf?orden=712418&paciente=227064&token=2048", "_blank")
  }

  inputFechaExament: any;
  flag_consulta_externa: boolean = false;

  formatTime(date: Date): string {
    let year = date.getUTCFullYear(); // Usa getUTCFullYear() para obtener el año en UTC
    let month = date.getUTCMonth() + 1; // getUTCMonth() devuelve el mes en UTC (0-indexado)
    let day = date.getUTCDate(); // Usa getUTCDate() para obtener el día del mes en UTC
    let monthString = month < 10 ? '0' + month : '' + month;
    let dayString = day < 10 ? '0' + day : '' + day;
    return `${year}-${monthString}-${dayString}`;
  }

  checkTurno_avdg(lugar, fecha?, variable?) {
    console.log('Entro a turnos verificar ahora Lugar', lugar);
    console.log('Entro a turnos verificar ahora Fecha', fecha);
    if (lugar.descripcion === "CONSULTA EXTERNA") {
      console.warn('inputdate:::::::::::', this.inputFechaExamen);

      //////
      if (this.inputFechaExamen === undefined || this.inputFechaExamen === null || this.inputFechaExamen === '') {
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();
        let monthString = month < 10 ? '0' + month : '' + month;
        let dayString = day < 10 ? '0' + day : '' + day;
        this.inputFechaExamen = `${year}-${monthString}-${dayString}`;
      }

      ///////////
      this.flag_consulta_externa = true;
      this.flag_listado_emergencias = true;
      this.flag_hospitalizacion = false;
      this.flag_emergencia = true;
      this.flag_ocultar_fecha = false;
      if (this.pedido_duplicar !== null && this.pedido_duplicar !== undefined) {
        console.log('pedido duplicar fec_examen: ', this.pedido_duplicar.fec_examen);
        const fechaUTC = new Date(this.pedido_duplicar.fec_examen + "T00:00:00Z");
        this.inputFechaExamen = this.formatTime(fechaUTC);
        console.log('pedido duplicar mod: ', this.inputFechaExamen);

      }

      this.checkTurno();
    } else if (lugar.descripcion === "EMERGENCIA") {
      console.log('FALSE DE EMERGENCIA');
     
      if (this.desactivar_segment_nombre_cedula) {
        this.variable_activar_fecha = true;
      }


      this.flag_consulta_externa = false;
      this.flag_listado_emergencias = false;
      this.flag_emergencia = true;
      this.flag_hospitalizacion = false;
      this.flag_ocultar_fecha = true;
      if (fecha === undefined) {
        this.inputFechaExamen = this.metodoTransformarDate(this.inputFechaExamen);
      } else {
        this.inputFechaExamen = fecha;
      }
      switch (variable) {
        case undefined:
        case null:
        case '':
        case 'h':
          this.opcion_fecha_turnos_eme = 'hoy';
          console.warn('inputa de fecha hoy::: ', this.inputFechaExamen);

          this.checkTurno(this.inputFechaExamen);
          break;
        case 'm':
          this.opcion_fecha_turnos_eme = 'manana';
          console.warn('inputa de fecha manana::: ', this.inputFechaExamen);
          this.checkTurno(this.inputFechaExamen);
          break;
        default:
          // manejar cualquier otro caso aquí si es necesario
          break;
      }
    } else if (lugar.descripcion === "HOSPITALIZACION") {
      //this.opcion_fecha_turnos_eme = 'hoy';
      console.log('FALSE DE VARIABLE DE VARIABLE * fdsf: ' + variable);


      console.log('FECHA EN FECHA - HOSPITALIZACION:::::::::::', fecha);
      if (fecha === undefined) {
        this.inputFechaExamen = this.metodoTransformarDate(this.inputFechaExamen);
      } else {
        this.inputFechaExamen = fecha;
      }
      console.log('inputdate - HOSPITALIZACION1995:::::::::::', this.inputFechaExamen);
      this.flag_listado_emergencias = false;
      this.flag_consulta_externa = false;
      this.flag_hospitalizacion = true;
      this.flag_ocultar_fecha = true;
      switch (variable) {
        case undefined:
        case null:
        case '':
        case 'h':
          this.opcion_fecha_turnos_eme = 'hoy';
          console.warn('inputa de fecha hoy::: ', this.inputFechaExamen);

          this.checkTurno(this.inputFechaExamen);
          break;
        case 'm':
          this.opcion_fecha_turnos_eme = 'manana';
          console.warn('inputa de fecha manana::: ', this.inputFechaExamen);
          this.checkTurno(this.inputFechaExamen);
          break;
        default:
          // manejar cualquier otro caso aquí si es necesario
          break;
      }
    }

  }


  metodoTransformarDate(fecha): string {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let monthString = month < 10 ? '0' + month : '' + month;
    let dayString = day < 10 ? '0' + day : '' + day;
    return `${year}-${monthString}-${dayString}`;
  }

  async checkTurno(fecha_date?) {

    // console.log("Ingreso al momento indicado para verificar"+fecha_date);
    this.flag_listado_emergencias = true;
    this.list_tunos_hora_ocupados = null;

    if (this.inputFechaExamen === undefined || this.inputFechaExamen === null || this.inputFechaExamen === '') {
      this.inputFechaExamen = this.metodoTransformarDate(this.inputFechaExamen);
    }
    // console.log('inputdate::::::::::: - checkTurno',this.inputFechaExamen);
    this.queryservice.getFeriadobyFechabyEvery(this.inputFechaExamen).then
      ((result_fer: any) => {
        if (result_fer) {
          console.error('resultado de feraido------', result_fer);


          this.flag_variable_feriados = result_fer.data.getFeriadobyFechabyEvery.fec_fer;
          console.error('this.flag_variable_feriados------', this.flag_variable_feriados);

          if (this.flag_variable_feriados !== null) {
            console.error('Entra a consulta feriados if ver------: ', result_fer.data.getFeriadobyFechabyEvery);
            console.error('this.Plan------', this.lugar);
            if (this.lugar.descripcion === "CONSULTA EXTERNA") {
              this.cont_max_turnos_every = result_fer.data.getFeriadobyFechabyEvery.max_turnos;
              this.cod_referencia = this.ref_tur_externo_ip;
            } else if (this.lugar.descripcion === "EMERGENCIA") {
              this.cont_max_turnos_every = result_fer.data.getFeriadobyFechabyEvery.max_emer;
              this.cod_referencia = this.ref_tur_emergencia_ip;
            } if (this.lugar.descripcion === "HOSPITALIZACION") {
              this.cont_max_turnos_every = result_fer.data.getFeriadobyFechabyEvery.max_hosp;
              this.cod_referencia = this.ref_tur_hospitalizacion_ip;
            }
            // console.log("this.cont_max_turnos_every: ",this.cont_max_turnos_every);        
            // console.log("this.this.cod_referencia: ",this.cod_referencia);        
            //this.nro_max_turnos = this.flag_variable_feriados;
            this.nro_max_turnos = this.cont_max_turnos_every;
            this.queryservice.getMobFechasTurnos(this.inputFechaExamen, this.cod_referencia).then((result: any) => {
              this.contador_turno_dia = result.data.getMobFechasTurnos.data;
              let resultado = result.data.getMobFechasTurnos.resultado;
              if (resultado === 0) {
                this.nro_max_turnos = 0;
              }
              this.cont_rest_tur = this.contador_turno_dia;
              if (this.cont_rest_tur >= this.nro_max_turnos) {
                this.cont_rest_tur = this.cont_rest_tur;
                this.flag_color_rojo_turno = true;
              } else {
                this.flag_color_rojo_turno = false;
                this.getHourxTurno(this.inputFechaExamen);
              }
            });
          } else {

            if (this.lugar.descripcion === "CONSULTA EXTERNA") {
              this.cod_referencia = this.ref_tur_externo_ip;
            } else if (this.lugar.descripcion === "EMERGENCIA") {
              this.cod_referencia = this.ref_tur_emergencia_ip;
            } if (this.lugar.descripcion === "HOSPITALIZACION") {
              this.cod_referencia = this.ref_tur_hospitalizacion_ip;
            }
            // console.error('Entra a consulta feriados else------',this.cod_referencia);
            // console.error('Entra Examen else------',this.inputFechaExamen);
            // this.queryservice.getMobFechasTurnos(this.inputFechaExamen,this.cod_referencia).then((result: any) => {
            this.queryservice.getMobFechasTurnos(this.inputFechaExamen, this.cod_referencia).then(async (result: any) => {
              // console.log("Resultado para getMobFechasTurnos: ", result);
              this.contador_turno_dia = result.data.getMobFechasTurnos.data;
              let resultado = result.data.getMobFechasTurnos.resultado;
              if (resultado === "0") {
                this.nro_max_turnos = 0;
              } else {
                await this.getMaxTurnos();
                // console.log('Verificando 11: ',this.nro_max_turnos);                                                     
              }
              // console.log('Verificando 2: ',this.nro_max_turnos);                                                     

              this.cont_rest_tur = this.contador_turno_dia;

              // console.log("cont_rest_tur - VERIFCANDO", this.cont_rest_tur);
              // console.log("nro_max_turnos - VERIFCANDO", this.nro_max_turnos);
              if (typeof this.cont_rest_tur === 'string') {
                this.cont_rest_tur = parseInt(this.cont_rest_tur, 10);
                if (isNaN(this.cont_rest_tur)) {
                  // console.error('Error converting cont_rest_tur to integer');
                }
              }
              // console.log("nro_max_turnos - VERIFCANDO22", this.nro_max_turnos);  
              // console.log("cont_rest_tur - VERIFCANDO22", this.cont_rest_tur);
              // console.log('flag_variable_turnos_paso - flag_variable_turnos_paso: '+this.flag_variable_turnos_paso);                                                               
              if (this.cont_rest_tur >= this.nro_max_turnos) {
                this.cont_rest_tur = this.cont_rest_tur;
                // console.error("cont_rest_tur - cont_rest_tur 1", this.cont_rest_tur);
                this.flag_color_rojo_turno = true;

              } else {
                this.flag_color_rojo_turno = false;
                this.getHourxTurno(this.inputFechaExamen);

              }
              if (this.nro_max_turnos > this.flag_variable_turnos_paso + 1) {
                // console.log('Entroo nro maximoturnos  : '+this.nro_max_turnos);                                                     

                this.flag_color_rojo_turno = true;
              }
            });
          }
        } else {
          console.warn("No hay resultados de feriados: ");
        }
      });

  }






  getHourxTurno(fec_tur) {
    this.queryservice.getTurnosbyDate(fec_tur, 1).then((result: any) => {
      // console.log('Resultados de get Hour x Turno',result);
      if (result) {
        this.list_tunos_hora_ocupados = result.data.getTurnosbyDate;
      } else {
        this.list_tunos_hora_ocupados = null;
      }
      // console.log('this.list_tunos_hora_ocupados estar ___+_)(*&',this.list_tunos_hora_ocupados);
    });

  }
  checkFecha_avaliable() {
    let d = new Date(this.inputFechaExamen)

    let f2 = this.helperservice.soloFechaaddDay(d)
    let d2 = new Date(f2)

    //se le añade un dia porq la fecha con el input me devuelve la anterior

    if (d2.getDay() == 6) {
      this.inputFechaExamen = this.helperservice.soloFechaaddDay(d);
      this.checkTurno()
      return
    } else
      if (d2.getDay() == 0) {
        this.inputFechaExamen = this.helperservice.soloFechaaddDay(d);
        this.checkTurno()
        return
      }
    if (this.nro_turnos_pedidos_fecha >= this.nro_max_turnos) {
      this.presentAlertFecha();
      this.inputFechaExamen = this.helperservice.soloFechaaddDay(d);
      this.checkTurno()
    }

  }
  /*
    formatDate(data) {
      this.inputFechaExamen = data;
      this.checkTurno()
    }
    */

  updatePaciente() {
    this.queryservice.insertPacientelite(JSON.stringify(this.paciente)).then((result: any) => {
    })
  }

  updateRef(ev) {
    this.ref_ca1_ord = ev.detail.value
  }

  getRefList() {
    this.list_ref.push({ value: null, des: "Ninguno" })
    /*
        this.queryservice.getCsParms({ cs_name: "AVAREL" }).then((r: any) => {
          let data = r.data.getCsParms;
          console.log("r avarel",r);
          if(data==null){
            return
          }
          if (data.cod_parm && data.cod_parm != null) {
            let list = data.data_parm.split("/");
            list.forEach(element => {
              if (element.length > 0) {
                this.list_ref.push({ value: element, des: element })
              }
            });
          }
        }, error => {
            console.error("este es el error", error)
        })
        */
  }

  async getMaxTurnos() {
    await this.queryservice.getCsParms({ cs_name: "AVATXD" }).then((r: any) => {
      let data = r.data.getCsParms;
      // console.log('dataaaas: ',data);
      if (data == null) {
        return
      }
      if (data.cod_parm && data.cod_parm != null) {

        this.nro_max_turnos = data.data_parm;
        this.flag_variable_turnos_paso = data.data_parm;
        // console.log('Entro al dataParam: ', this.nro_max_turnos);

      } else {
        this.nro_max_turnos = this.appConfig.max_pedidos_turno;
      }
    }, error => {
      console.error(error)
    })
  }

  async getMaxTurnost() {
    try {
      const r: any = await this.queryservice.getCsParms({ cs_name: "AVATXD" });
      let data = r.data.getCsParms;
      if (data == null) {
        return;
      }
      if (data.cod_parm && data.cod_parm != null) {
        this.temp_max_turnos = data.data_parm;
      } else {
        this.temp_max_turnos = this.appConfig.max_pedidos_turno;
      }
      // console.log('this.temp_max_turnos en getT',this.temp_max_turnos);
    } catch (error) {
      console.error(error);
    }
  }

  nro_turnos_pedidos_fechat: any = 0

  checkTurnod() {
    if (this.list_fechas_disponibles.length >= 5) {
      return
    }
    this.getMaxTurnost()
    // console.log('this.temp_max_turnos',this.temp_max_turnos);

    this.nro_turnos_pedidos_fechat = 0;
    //cuento los pedidos realizados en la fecha 
    this.queryservice.countPedidosbyFecha({ fecha: this.inputFechaExament, }).then((result: any) => {
      // console.log("check", result);
      let data = result.data.CountPedidobyFecha;
      if (data.data_total == 0 || data.data_total == null) {
        return
      }
      this.nro_turnos_pedidos_fechat = data.data_total
    }).finally(() => {
      //cuento los turnos permitidos en esa fecha si es feriado
      this.queryservice.getFeriadobyFecha({ fecha: this.inputFechaExament }).then
        ((result_fer: any) => {
          let data_fer = result_fer.data.getFeriadobyFecha;
          if (data_fer.fec_fer != null) {
            this.temp_max_turnos = data_fer.max_turnos
          }
        }).finally(() => {
          this.checkFecha_avaliabled()
        })
    })
  }

  checkFecha_avaliabled() {
    let d = new Date(this.inputFechaExament);
    let f1 = this.inputFechaExament;
    this.inputFechaExament = this.helperservice.soloFechaaddDay(d);
    let d2 = new Date(this.inputFechaExament);
    let f2 = this.helperservice.soloFechaaddDay(d2);
    //se le añade un dia porq la fecha con el input me devuelve la anterior
    this.inputFechaExament = this.helperservice.soloFechaaddDay(d);

    if (d2.getDay() == 6) {
      this.checkTurnod()
      return
    }
    if (d2.getDay() == 0) {
      //   this.toastservice.presentToast({message:"La fecha seleccionada es de fin de semana",position:"top",time:"1500",color:"warning"})
      this.checkTurnod()
      return
    }
    // console.log("entre check temp avaliable");
    // console.log("this.nro_turnos_pedidos_fechat",this.nro_turnos_pedidos_fechat);
    // console.log("this.temp_max_turnos",this.temp_max_turnos);

    if (this.nro_turnos_pedidos_fechat < this.temp_max_turnos) {
      if (this.list_fechas_disponibles.length >= 5) {
        // console.log("entre en mayor q 5", this.list_fechas_disponibles);
        return
      }
      else {
        // console.log("entre en menor  q 5", this.list_fechas_disponibles);
        this.list_fechas_disponibles.push({ fecha: d2, inputFechaExamen: f1, selected: false })

      }

    }
    this.checkTurnod()

  }

  changeFechaManual(data) {
    // console.error('Data changeFechaManual', data);
    this.inputFechaExamen = data.inputFechaExamen;
    data.selected = true;
    for (let index = 0; index < this.list_fechas_disponibles.length; index++) {
      if (this.list_fechas_disponibles[index].inputFechaExamen == data.inputFechaExamen) {
        this.list_fechas_disponibles[index].selected = true
      }
      else {
        this.list_fechas_disponibles[index].selected = false
      }
    }
    this.checkTurno()
  }

  setTurnoHora() {
    // console.log("hora", this.hora_turno);

  }


  updatePreciosbyPlan(tipo, data) {
    // console.log('updateplan', this.planSelected);

    let plan = this.planSelected;

    // console.log('precios plan todo');
    // console.log('this.ListaAnalisis',this.ListaAnalisis);

    for (let index = 0; index < this.ListaAnalisis.length; index++) {
      const element = this.ListaAnalisis[index];
      // console.log("element preciooos", element);

      let flag_no_precio = false;
      let data_p = this.queryservice.getPrecios(element.cod_ana, plan.cod_lpr);
      data_p.then((result: any) => {
        // console.log("result asdadasdadas", result);
        if (result.data.PreciosbySeguro == null) {
          if (!element.flag_no_precio) {
            this.toastservice.presentToast({ message: element.des_ana + " no tiene asignado un precio", duration: 2000, color: "warning", position: "center" });
          }
          flag_no_precio = true;
          element.flag_no_precio = flag_no_precio
          element.paso = true
          element.subtotal = 0;
          element.totalPac = 0;
          element.total_vista = "0.00";
          element.pospago = 0;
          return
        }
        let data = result.data.PreciosbySeguro;
        // console.log(data);
        if (data.pre_ana == null || data.pre_ana == '') {
          data.pre_ana = 0;
          flag_no_precio = true;
        }
        let porcentaje = 0.00;
        if (plan.por_seg == 0 && data.por_seg == '0.00') {
          porcentaje = 0;
        }
        else if (plan.por_seg > 0) {
          porcentaje = plan.por_seg
        } else {
          porcentaje = data.por_seg
        }
        let pre_analisis = data.pre_ana * plan.fac_plan
        let pospago: any = this.helperservice.toFixed((pre_analisis * porcentaje), 2)
        //let pospago: any = this.helper.toFixed((data.pre_ana * porcentaje), 2)

        /* 
        element.subtotal = (data.pre_ana - pospago);
         element.totalPac = (data.pre_ana - pospago);
         */
        element.flag_no_precio = flag_no_precio
        element.subtotal = (pre_analisis - pospago);
        element.totalPac = (pre_analisis - pospago);
        element.total_vista = (pre_analisis - pospago).toFixed(2);
        element.pospago = pospago;
      }, error => {
        // console.log("entre al error", error);

      });
      setTimeout(() => { this.calcTotal() }, 1000);
    }
    return
  }




  calcTotal() {
    let total: number = 0.00;
    let pospago: number = 0.00
    let subtotal: number = 0.00
    let flag_aumento: boolean = false;
    /*
        if (this.ListaAnalisis.length > 0) {
          for (let i = 0; i < this.ListaAnalisis.length; i++) {
            console.log('this.listAnalisis[i]', this.ListaAnalisis[i]);
    
    
    
            if (this.ListaAnalisis[i].aumento) {
              flag_aumento = true;
              // this.listAnalisis.dcto_val=this.dataOrden.dcto_val
              if (this.dataOrden.dcto_val == 0) {
                this.ListaAnalisis[i].dcto_val = this.dataOrden.dcto_val;
                this.ListaAnalisis[i].aumento = false;
              } else {
                this.ListaAnalisis[i].dcto_val = this.dataOrden.dcto_val;
              }
            }
    
          }
    
          if (!flag_aumento && this.dataOrden.dcto_val != 0) {
            this.ListaAnalisis[this.ListaAnalisis.length - 1].dcto_val = this.dataOrden.dcto_val;
            this.ListaAnalisis[this.ListaAnalisis.length - 1].aumento = true;
          }
    
        }
        */
    this.ListaAnalisis.forEach((element, index) => {
      // element.dcto_pet = this.dataOrden.dcto_ord;
      subtotal = subtotal + parseFloat(element.subtotal);



      /*
            if (this.dataOrden.dcto_ord != 0) {
      
              let totalTemp = (((element.subtotal * element.dcto_pet) / 100) + parseFloat(element.subtotal) + element.dcto_val);
              element.totalPac = this.helperservice.toFixed(totalTemp, 2);
      
            }
            */
      total = total + parseFloat(element.totalPac);
      pospago = pospago + parseFloat(element.pospago);

    });
    //  total=total+this.dataOrden.dcto_val;
    this.precioFinal = { total: total, pospago: pospago, subtotal: subtotal }



    this.dataOrden.pre_ord = Math.ceil(subtotal);
    this.dataOrden.val_ord = Math.ceil(total);
    this.total_ord = Math.ceil(total).toFixed(2);

  }

  total_ord = "";
  precioFinal: any = null;


  ////Andy metodos verificar 
  //Metodo de escoger Radio Buttom
  Escoger_Radio_Button_dia(fecha, variable) {
    this.elegir_variable = variable;
    console.warn("en varibale " + this.elegir_variable);

    this.checkTurno_avdg(this.lugar, fecha, this.elegir_variable);
    this.opcion_fecha_turnos_eme = '';
    // console.warn("Lugarrrrrrr",this.lugar);
    // console.warn("Entro en escoger radio buttom fecha escogida: "+fecha);

  }
  ///Limpiando Datos Totalmente

  //Metodo de validaciones ::
  validateOnlyNumbers(event: any) {
    return this.validationService.validateOnlyNumbers(event)
  }
  validateOnlyLetters(event: any) {
    return this.validationService.validateOnlyLetters(event)
  }


  //Metodo de cambio de Tamaños ::
  Test1(datos) {
    if (datos === 'nombre') {
      this.size_nombre = 8;
      this.size_cedula = 4;
      this.size_nombre_tablet = 9;
      this.size_cedula_tablet = 3;
      this.bandera_icono_search = false;
      this.cedula_paciente = '';
      this.placeholderNombre = "Buscar ..."
      this.placeholderCedula = "Buscar..."

    }
    if (datos === 'cedula') {
      this.size_nombre = 4;
      this.size_cedula = 8;
      this.size_nombre_tablet = 3;
      this.size_cedula_tablet = 9;
      this.bandera_icono_search = true;
      this.nombre_paciente = '';
      this.placeholderCedula = "Buscar..."
      this.placeholderNombre = "Buscar..."
    }
    if (datos === 'reset') {
      this.size_nombre = 6;
      this.size_cedula = 4;
      this.size_nombre_tablet = 6;
      this.size_cedula_tablet = 6;
    }
  }



  ///Variables para el cambio de tamaño de de los input de nombre y cedula
  size_nombre = 8;
  size_cedula = 4;
  size_reset_total = 2;
  size_nombre_tablet = 6;
  size_cedula_tablet = 6;

  ///Buscar Paciente
  async buscarPaciente() {
    // console.log("Entro en buscar paciente ahora mismo: ");
    // let comparacion = '';
    // let porcentaje = '%';
    // let nombre_paciente_enviar_base;
    // this.choosedUser = false
    // this.nombre_paciente = this.nombre_paciente.toLowerCase();
    // nombre_paciente_enviar_base = this.nombre_paciente.replace(/ /g, porcentaje);
    // if (this.cedula_paciente == '' && nombre_paciente_enviar_base == '') {
    //   this.resultadosFiltrados.length = 0;
    //   this.foundpacient = false
    //   this.toastservice.presentToast({ message: "Ingrese al menos un campo de busqueda", position: "top", color: "warning", duration: 1500 })
    //   return
    // }
    // this.lista_resultados_pacientes = [];
    // if (this.cedula_paciente.length >= 10 || nombre_paciente_enviar_base.length) {
    //   this.loadingservice.presentLoading("Buscando paciente....")
    //   this.queryservice.SearchPacienteDynamic(
    //     { cedula: this.cedula_paciente, codigo: this.codigo_paciente, nombre: this.nombre_paciente, apellido: this.apellido_paciente, nombre_completo: nombre_paciente_enviar_base }
    //   ).then((r: any) => {
    //     let data = r.data.searchPacienteDynamic
    //     if (data.length > 0 && nombre_paciente_enviar_base.length) {
    //       this.lista_resultados_pacientes = data;
    //       this.loaded = false;
    //       this.resultadosFiltrados = this.lista_resultados_pacientes;
    //       this.loaded = true;
    //       this.flag_show_listado = false;
    //       this.filtrarResultados();
    //       this.foundpacient = true
    //       this.loadingservice.dismiss()
    //     } else if (data.length > 0 && this.cedula_paciente.length) {
    //       this.lista_resultados_pacientes = data;
    //       this.loaded = false;
    //       this.resultadosFiltrados = this.lista_resultados_pacientes;
    //       this.loaded = true;
    //       this.flag_show_listado = false;
    //       this.filterByIdPac()
    //       this.loadingservice.dismiss()
    //       this.foundpacient = true

    //     } else {
    //       this.resultadosFiltrados.length = 0;
    //       this.toastservice.presentToast({ message: "No se encuentran resultados", position: "middle", color: "warning", duration: 1500 });
    //       this.loadingservice.dismiss()
    //       this.foundpacient = false
    //     }
    //   });

    // }

  }

  ////Segment para escoger entre la busqueda de Cedulas o Nombres
  segmentChanged(event) {
    this.selectedSegment = event.detail.value;
    if (this.selectedSegment === 'cedula') {
      this.LimpiarTodo();
    }
  }

  abrirModalGetPaciente() {
    this.LimpiarTodo();
    this.get_Modal_Paciente();
  }



  //Metodo llamada de busqueda de pacientes ::
  async get_Modal_Paciente() {
    const modal = await this.modalcontroller.create({
      component: SearchPacientePage,
      // componentProps: { value: 123 },
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const paciente = data.paciente;
      this.inputCedula = paciente.id_pac;
      // console.log("Entro al if de this.inputCedula: ",this.inputCedula)

      if (!this.inputCedula) {
        // console.log("Entro al if de paciente: ",paciente)
        this.getPacienteByCod(paciente.cod_pac);
      } else {
        this.getPaciente();
      }
    }
  }

  segmentChanged1(event) {
    switch (event.detail.value) {
      case 'profiles':
        this.presentModalPerfiles();
        break;
      case 'profilesGeneral':
        this.presentModalPerfilesAva();
        break;

    }
  }

  getRowColor(index: number): string {

    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }





}